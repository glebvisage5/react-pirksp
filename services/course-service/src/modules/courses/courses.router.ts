import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as svc from "./courses.service";
import { requireAuth, requireRole, AppError } from "@ecosystem/shared";

const router = Router();

const courseSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  is_ai_powered: z.boolean().default(false),
  thumbnail_emoji: z.string().max(10).default("📚"),
});

router.get("/", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await svc.listCourses(req.user!.userId);
    res.json(courses);
  } catch (err) { next(err); }
});

router.get("/enrolled", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Number(req.query["limit"]) || 10;
    const courses = await svc.enrolledCourses(req.user!.userId, limit);
    res.json(courses);
  } catch (err) { next(err); }
});

router.get("/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await svc.getCourse(req.params["id"]!, req.user!.userId);
    res.json(course);
  } catch (err) { next(err); }
});

router.post("/", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  const parsed = courseSchema.safeParse(req.body);
  if (!parsed.success) return next(new AppError(422, parsed.error.issues.map(i => i.message).join(", ")));
  try {
    const course = await svc.createCourse(parsed.data, req.user!.userId);
    res.status(201).json(course);
  } catch (err) { next(err); }
});

router.put("/:id", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  const parsed = courseSchema.partial().safeParse(req.body);
  if (!parsed.success) return next(new AppError(422, parsed.error.issues.map(i => i.message).join(", ")));
  try {
    const course = await svc.updateCourse(req.params["id"]!, parsed.data);
    res.json(course);
  } catch (err) { next(err); }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await svc.deleteCourse(req.params["id"]!);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.post("/:id/enroll", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await svc.enrollCourse(req.params["id"]!, req.user!.userId);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.get("/:id/lessons", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lessons = await svc.getLessons(req.params["id"]!, req.user!.userId);
    res.json(lessons);
  } catch (err) { next(err); }
});

router.post("/:id/lessons", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lesson = await svc.createLesson(req.params["id"]!, req.body);
    res.status(201).json(lesson);
  } catch (err) { next(err); }
});

router.put("/lessons/:lessonId", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lesson = await svc.updateLesson(req.params["lessonId"]!, req.body);
    res.json(lesson);
  } catch (err) { next(err); }
});

router.delete("/lessons/:lessonId", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await svc.deleteLesson(req.params["lessonId"]!);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.post("/lessons/:lessonId/complete", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await svc.completeLesson(req.params["lessonId"]!, req.user!.userId);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
