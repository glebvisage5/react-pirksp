import { Router, Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { z } from "zod";
import * as svc from "./gta.service";
import { requireAuth, requireOwner } from "../../middleware/auth";
import { AppError } from "../../middleware/errorHandler";
import { env } from "../../config/env";

const router = Router();

// ─── Icon upload ────────────────────────────────────────────────────────────────
const uploadDir = path.resolve(env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const iconUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => cb(null, `icon-${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new AppError(400, "Only image files are allowed"));
    cb(null, true);
  },
});

function validate<T>(schema: z.ZodSchema<T>, body: unknown, next: NextFunction): T | null {
  const r = schema.safeParse(body);
  if (!r.success) { next(new AppError(422, r.error.issues.map(i => i.message).join(", "))); return null; }
  return r.data;
}

const serverSchema = z.object({
  name: z.string().min(1).max(200),
  project_name: z.string().max(200).optional(),
  icon: z.string().max(500).optional(),
});

const orgSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  full_description: z.string().optional(),
  icon: z.string().max(500).optional(),
});

const tabSchema = z.object({
  name: z.string().min(1).max(100),
});

const sectionSchema = z.object({
  type: z.enum(["members", "text", "form", "document"]),
  title: z.string().max(200).optional(),
  config: z.record(z.unknown()).optional(),
});

const reorderSchema = z.object({
  section_ids: z.array(z.string().uuid()),
});

router.post("/upload-icon", requireAuth, requireOwner, iconUpload.single("file"), (req: Request & { file?: Express.Multer.File }, res: Response, next: NextFunction) => {
  if (!req.file) { next(new AppError(400, "No file uploaded")); return; }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

// ─── Dashboard ───────────────────────────────────────────────────────────────

router.get("/dashboard/stats", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.getDashboardStats(req.user!.userId)); } catch (e) { next(e); }
});

// ─── Servers ──────────────────────────────────────────────────────────────────

router.get("/servers", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.listServers(req.user!.userId)); } catch (e) { next(e); }
});

router.get("/servers/:id", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.getServer(req.params["id"]!, req.user!.userId)); } catch (e) { next(e); }
});

router.post("/servers", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(serverSchema, req.body, next); if (!d) return;
  try { res.status(201).json(await svc.createServer(d, req.user!.userId)); } catch (e) { next(e); }
});

router.put("/servers/:id", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(serverSchema.partial(), req.body, next); if (!d) return;
  try { res.json(await svc.updateServer(req.params["id"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.delete("/servers/:id", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.deleteServer(req.params["id"]!, req.user!.userId)); } catch (e) { next(e); }
});

// ─── Organizations ────────────────────────────────────────────────────────────

router.get("/servers/:sid/orgs", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.listOrgs(req.params["sid"]!, req.user!.userId)); } catch (e) { next(e); }
});

router.post("/servers/:sid/orgs", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(orgSchema, req.body, next); if (!d) return;
  try { res.status(201).json(await svc.createOrg(req.params["sid"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.get("/orgs/:id", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.getOrg(req.params["id"]!, req.user!.userId)); } catch (e) { next(e); }
});

router.put("/orgs/:id", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(orgSchema.partial(), req.body, next); if (!d) return;
  try { res.json(await svc.updateOrg(req.params["id"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.delete("/orgs/:id", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.deleteOrg(req.params["id"]!, req.user!.userId)); } catch (e) { next(e); }
});

// ─── Tabs ─────────────────────────────────────────────────────────────────────

router.get("/orgs/:oid/tabs", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.listTabs(req.params["oid"]!, req.user!.userId)); } catch (e) { next(e); }
});

router.post("/orgs/:oid/tabs", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(tabSchema, req.body, next); if (!d) return;
  try { res.status(201).json(await svc.createTab(req.params["oid"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.put("/tabs/:id", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(tabSchema.partial().extend({ sort_order: z.number().optional() }), req.body, next); if (!d) return;
  try { res.json(await svc.updateTab(req.params["id"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.delete("/tabs/:id", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.deleteTab(req.params["id"]!, req.user!.userId)); } catch (e) { next(e); }
});

// ─── Sections ─────────────────────────────────────────────────────────────────

router.get("/tabs/:tid/sections", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.listSections(req.params["tid"]!, req.user!.userId)); } catch (e) { next(e); }
});

router.post("/tabs/:tid/sections", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(sectionSchema, req.body, next); if (!d) return;
  try { res.status(201).json(await svc.createSection(req.params["tid"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.put("/sections/:id", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(sectionSchema.partial().extend({ sort_order: z.number().optional() }), req.body, next); if (!d) return;
  try { res.json(await svc.updateSection(req.params["id"]!, d, req.user!.userId)); } catch (e) { next(e); }
});

router.delete("/sections/:id", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.deleteSection(req.params["id"]!, req.user!.userId)); } catch (e) { next(e); }
});

router.patch("/tabs/:tid/sections/reorder", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(reorderSchema, req.body, next); if (!d) return;
  try { res.json(await svc.reorderSections(req.params["tid"]!, d.section_ids, req.user!.userId)); } catch (e) { next(e); }
});

export default router;
