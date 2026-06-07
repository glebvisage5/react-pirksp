import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as authService from "./auth.service";
import { requireAuth } from "../../middleware/auth";
import { AppError } from "../../middleware/errorHandler";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new AppError(422, parsed.error.issues.map((i) => i.message).join(", ")));
  }
  try {
    const { name, email, password } = parsed.data;
    const result = await authService.register(name, email, password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new AppError(422, parsed.error.issues.map((i) => i.message).join(", ")));
  }
  try {
    const { email, password } = parsed.data;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/refresh", async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(new AppError(400, "refreshToken required"));
  try {
    const result = await authService.refresh(refreshToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(new AppError(400, "refreshToken required"));
  try {
    await authService.logout(refreshToken);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/users/search", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = String(req.query["q"] ?? "").trim();
    if (q.length < 2) { res.json([]); return; }
    const { query } = await import("../../config/database");
    const users = await query<{ id: string; name: string; email: string }>(
      `SELECT id, name, email FROM users WHERE name ILIKE $1 OR email ILIKE $1 ORDER BY name LIMIT 10`,
      [`%${q}%`]
    );
    res.json(users);
  } catch (err) {
    next(err);
  }
});

export default router;
