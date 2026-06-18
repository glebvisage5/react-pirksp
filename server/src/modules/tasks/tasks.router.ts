import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as svc from "./tasks.service";
import { requireAuth, requireRole } from "../../middleware/auth";
import { AppError } from "../../middleware/errorHandler";

const router = Router();

const taskSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().optional(),
  course_id: z.string().uuid().optional(),
  due_date: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

const assignSchema = z.object({
  user_id: z.string().uuid(),
});

const statusSchema = z.object({
  status: z.enum(["todo", "in-progress", "review", "done"]).optional(),
  progress: z.number().min(0).max(100).optional(),
});

// GET /api/tasks — задания текущего пользователя
router.get("/", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Number(req.query["limit"]) || 50;
    const statusFilter = req.query["status"] as string | undefined;
    const tasks = await svc.listUserTasks(req.user!.userId, limit, statusFilter);
    res.json(tasks);
  } catch (err) { next(err); }
});

// GET /api/tasks/stats — статистика
router.get("/stats", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await svc.getUserStats(req.user!.userId);
    res.json(stats);
  } catch (err) { next(err); }
});

// GET /api/tasks/:id
router.get("/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await svc.getTask(req.params["id"]!, req.user!.userId);
    res.json(task);
  } catch (err) { next(err); }
});

// POST /api/tasks — создать задачу (для себя или, если admin, для назначения позже)
router.post("/", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) return next(new AppError(422, parsed.error.issues.map(i => i.message).join(", ")));
  try {
    const task = await svc.createTask(parsed.data, req.user!.userId);
    res.status(201).json(task);
  } catch (err) { next(err); }
});

// PUT /api/tasks/:id — admin или назначенный user (только status/progress)
router.put("/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user!.role === "admin";
    const task = await svc.updateTask(req.params["id"]!, req.body, req.user!.userId, isAdmin);
    res.json(task);
  } catch (err) { next(err); }
});

// DELETE /api/tasks/:id — только admin
router.delete("/:id", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await svc.deleteTask(req.params["id"]!);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// POST /api/tasks/:id/assign — назначить задание пользователю (admin)
router.post("/:id/assign", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  const parsed = assignSchema.safeParse(req.body);
  if (!parsed.success) return next(new AppError(422, parsed.error.issues.map(i => i.message).join(", ")));
  try {
    await svc.assignTask(req.params["id"]!, parsed.data.user_id);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// PATCH /api/tasks/:id/status — пользователь обновляет свой статус
router.patch("/:id/status", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return next(new AppError(422, parsed.error.issues.map(i => i.message).join(", ")));
  try {
    await svc.updateUserTaskStatus(req.params["id"]!, req.user!.userId, parsed.data);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
