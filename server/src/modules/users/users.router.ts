import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as svc from "./users.service";
import { requireAuth } from "../../middleware/auth";
import { AppError } from "../../middleware/errorHandler";

const router = Router();

const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(2000).optional(),
  social_links: z.array(z.object({
    platform: z.string().min(1).max(50),
    url: z.string().min(1).max(512),
  })).optional(),
});

router.get("/me/profile", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await svc.getProfile(req.user!.userId));
  } catch (err) { next(err); }
});

router.put("/me/profile", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new AppError(422, parsed.error.issues.map((i) => i.message).join(", ")));
  }
  try {
    res.json(await svc.updateProfile(req.user!.userId, parsed.data));
  } catch (err) { next(err); }
});

export default router;
