import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as svc from "./groups.service";
import { requireAuth, requireRole, AppError } from "@ecosystem/shared";

const router = Router();

const groupSchema = z.object({
  name: z.string().min(2).max(255),
});

const memberSchema = z.object({
  user_id: z.string().uuid(),
  role: z.enum(["student", "elder"]).default("student"),
});

router.get("/my", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await svc.getMyGroup(req.user!.userId);
    res.json(group);
  } catch (err) { next(err); }
});

router.get("/", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await svc.listGroups();
    res.json(groups);
  } catch (err) { next(err); }
});

router.get("/:id", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await svc.getGroup(req.params["id"]!);
    res.json(group);
  } catch (err) { next(err); }
});

router.get("/:id/members", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const members = await svc.getGroupMembers(req.params["id"]!);
    res.json(members);
  } catch (err) { next(err); }
});

router.post("/", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  const parsed = groupSchema.safeParse(req.body);
  if (!parsed.success) return next(new AppError(422, parsed.error.issues.map(i => i.message).join(", ")));
  try {
    const group = await svc.createGroup(parsed.data.name);
    res.status(201).json(group);
  } catch (err) { next(err); }
});

router.post("/:id/members", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  const parsed = memberSchema.safeParse(req.body);
  if (!parsed.success) return next(new AppError(422, parsed.error.issues.map(i => i.message).join(", ")));
  try {
    await svc.addGroupMember(req.params["id"]!, parsed.data.user_id, parsed.data.role);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete("/:id/members/:userId", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await svc.removeGroupMember(req.params["id"]!, req.params["userId"]!);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await svc.deleteGroup(req.params["id"]!);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
