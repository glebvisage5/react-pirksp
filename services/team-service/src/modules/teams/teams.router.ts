import { Router, Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { z } from "zod";
import * as svc from "./teams.service";
import { requireAuth, requireRole, AppError } from "@ecosystem/shared";
import { env } from "../../config/env";

const router = Router();

const uploadDir = path.resolve(env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const teamSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().optional(),
});

const memberSchema = z.object({
  user_id: z.string().uuid(),
  role: z.enum(["Team Leader", "Moderator", "Member", "Viewer"]).default("Member"),
});

const projectSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().optional(),
  status: z.enum(["active", "planned", "completed", "on-hold"]).default("planned"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

const taskSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "review", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  assignee_id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
  due_date: z.string().optional(),
});

const specSchema = z.object({
  title: z.string().min(2).max(255),
  project_id: z.string().uuid().optional(),
  blocks: z.array(z.unknown()).default([]),
});

const roleSchema = z.object({
  name: z.string().min(2).max(100),
  permissions: z.array(z.string()).default([]),
});

function validate<T>(schema: z.ZodSchema<T>, body: unknown, next: NextFunction): T | null {
  const r = schema.safeParse(body);
  if (!r.success) { next(new AppError(422, r.error.issues.map(i => i.message).join(", "))); return null; }
  return r.data;
}

// ─── Teams ────────────────────────────────────────────────────────────────────
router.get("/", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { const isAdmin = req.user!.role === "admin" || req.user!.role === "owner"; res.json(await svc.listTeams(req.user!.userId, isAdmin)); } catch (e) { next(e); }
});

router.post("/", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(teamSchema, req.body, next); if (!d) return;
  try { res.status(201).json(await svc.createTeam(d.name, d.description, req.user!.userId)); } catch (e) { next(e); }
});

router.get("/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { const isAdmin = req.user!.role === "admin" || req.user!.role === "owner"; res.json(await svc.getTeam(req.params["id"]!, req.user!.userId, isAdmin)); } catch (e) { next(e); }
});

router.put("/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(teamSchema.partial(), req.body, next); if (!d) return;
  try { res.json(await svc.updateTeam(req.params["id"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try { await svc.deleteTeam(req.params["id"]!); res.json({ ok: true }); } catch (e) { next(e); }
});

// ─── Members ──────────────────────────────────────────────────────────────────
router.get("/:id/members", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.listMembers(req.params["id"]!)); } catch (e) { next(e); }
});

router.post("/:id/members", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(memberSchema, req.body, next); if (!d) return;
  try { await svc.addMember(req.params["id"]!, d.user_id as string, d.role as string); res.json({ ok: true }); } catch (e) { next(e); }
});

router.put("/:id/members/:userId", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(z.object({ role: z.enum(["Team Leader", "Moderator", "Member", "Viewer"]) }), req.body, next);
  if (!d) return;
  try {
    await svc.updateMemberRole(req.params["id"]!, req.params["userId"]!, d.role, req.user!.userId);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.delete("/:id/members/:userId", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await svc.removeMember(req.params["id"]!, req.params["userId"]!, req.user!.userId);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ─── Projects ─────────────────────────────────────────────────────────────────
router.get("/:id/projects", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.listProjects(req.params["id"]!)); } catch (e) { next(e); }
});

router.post("/:id/projects", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(projectSchema, req.body, next); if (!d) return;
  try { res.status(201).json(await svc.createProject(req.params["id"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.put("/projects/:projectId", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(projectSchema.partial(), req.body, next); if (!d) return;
  try { res.json(await svc.updateProject(req.params["projectId"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.delete("/projects/:projectId", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { await svc.deleteProject(req.params["projectId"]!, req.user!.userId); res.json({ ok: true }); } catch (e) { next(e); }
});

// ─── Team Tasks ───────────────────────────────────────────────────────────────
router.get("/:id/tasks", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: Record<string, string> = {};
    if (req.query["project_id"]) filters["project_id"] = req.query["project_id"] as string;
    if (req.query["status"]) filters["status"] = req.query["status"] as string;
    if (req.query["assignee_id"]) filters["assignee_id"] = req.query["assignee_id"] as string;
    res.json(await svc.listTeamTasks(req.params["id"]!, filters));
  } catch (e) { next(e); }
});

router.post("/:id/tasks", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(taskSchema, req.body, next); if (!d) return;
  try { res.status(201).json(await svc.createTeamTask(req.params["id"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.put("/tasks/:taskId", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(taskSchema.partial(), req.body, next); if (!d) return;
  try { res.json(await svc.updateTeamTask(req.params["taskId"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.delete("/tasks/:taskId", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { await svc.deleteTeamTask(req.params["taskId"]!, req.user!.userId); res.json({ ok: true }); } catch (e) { next(e); }
});

// ─── Specs ────────────────────────────────────────────────────────────────────
router.get("/:id/specs", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.listSpecs(req.params["id"]!)); } catch (e) { next(e); }
});

router.post("/:id/specs", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(specSchema, req.body, next); if (!d) return;
  try { res.status(201).json(await svc.createSpec(req.params["id"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.get("/specs/:specId", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.getSpec(req.params["specId"]!)); } catch (e) { next(e); }
});

router.put("/specs/:specId", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(specSchema.partial(), req.body, next); if (!d) return;
  try { res.json(await svc.updateSpec(req.params["specId"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.delete("/specs/:specId", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { await svc.deleteSpec(req.params["specId"]!, req.user!.userId); res.json({ ok: true }); } catch (e) { next(e); }
});

router.get("/specs/:specId/versions", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.listSpecVersions(req.params["specId"]!)); } catch (e) { next(e); }
});

// ─── Files ────────────────────────────────────────────────────────────────────
router.get("/:id/files", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.listFiles(req.params["id"]!)); } catch (e) { next(e); }
});

router.post("/:id/files", requireAuth, upload.single("file"), async (req: Request & { file?: Express.Multer.File }, res: Response, next: NextFunction) => {
  if (!req.file) return next(new AppError(400, "No file uploaded"));
  try {
    const f = await svc.saveFile(req.params["id"]!, {
      name: req.file.originalname,
      size: req.file.size,
      mime_type: req.file.mimetype,
      storage_path: req.file.path,
    }, req.user!.userId);
    res.status(201).json(f);
  } catch (e) { next(e); }
});

router.delete("/files/:fileId", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { await svc.deleteFile(req.params["fileId"]!, req.user!.userId); res.json({ ok: true }); } catch (e) { next(e); }
});

// ─── Team Roles ───────────────────────────────────────────────────────────────
router.get("/:id/roles", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.listTeamRoles(req.params["id"]!)); } catch (e) { next(e); }
});

router.post("/:id/roles", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(roleSchema, req.body, next); if (!d) return;
  try { res.status(201).json(await svc.createTeamRole(req.params["id"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.put("/roles/:roleId", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(roleSchema, req.body, next); if (!d) return;
  try { res.json(await svc.updateTeamRole(req.params["roleId"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.delete("/roles/:roleId", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try { await svc.deleteTeamRole(req.params["roleId"]!, req.user!.userId); res.json({ ok: true }); } catch (e) { next(e); }
});

export default router;
