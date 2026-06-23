import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as svc from "./study-teams.service";
import { requireAuth, AppError } from "@ecosystem/shared";

const router = Router();

const teamSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().optional(),
});

const memberSchema = z.object({
  user_id: z.string().uuid(),
});

const taskSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "review", "done"]).default("todo"),
  assignee_id: z.string().uuid().optional(),
  due_date: z.string().optional(),
});

function validate<T>(schema: z.ZodSchema<T>, body: unknown, next: NextFunction): T | null {
  const r = schema.safeParse(body);
  if (!r.success) { next(new AppError(422, r.error.issues.map(i => i.message).join(", "))); return null; }
  return r.data;
}

router.get("/", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.listMyStudyTeams(req.user!.userId)); } catch (err) { next(err); }
});

router.post("/", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(teamSchema, req.body, next); if (!d) return;
  try { res.status(201).json(await svc.createStudyTeam(req.user!.userId, d.name, d.description)); } catch (err) { next(err); }
});

router.get("/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.getStudyTeam(req.params["id"]!, req.user!.userId)); } catch (err) { next(err); }
});

router.post("/:id/members", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(memberSchema, req.body, next); if (!d) return;
  try {
    await svc.addMember(req.params["id"]!, d.user_id, req.user!.userId);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete("/:id/members/:userId", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await svc.removeMember(req.params["id"]!, req.params["userId"]!, req.user!.userId);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.get("/:id/tasks", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.listTasks(req.params["id"]!, req.user!.userId)); } catch (err) { next(err); }
});

router.post("/:id/tasks", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(taskSchema, req.body, next); if (!d) return;
  try { res.status(201).json(await svc.createTask(req.params["id"]!, d, req.user!.userId)); } catch (err) { next(err); }
});

router.patch("/:id/tasks/:taskId", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(taskSchema.partial(), req.body, next); if (!d) return;
  try { res.json(await svc.updateTask(req.params["taskId"]!, d, req.user!.userId)); } catch (err) { next(err); }
});

export default router;
