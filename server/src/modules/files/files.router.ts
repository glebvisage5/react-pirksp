import { Router, Request, NextFunction } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { z } from "zod";
import * as svc from "./files.service";
import { requireAuth } from "../../middleware/auth";
import { AppError } from "../../middleware/errorHandler";
import { env } from "../../config/env";

const router = Router();

// ─── Multer setup ─────────────────────────────────────────────────────────────
const uploadDir = path.resolve(env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ─── Validation schemas ────────────────────────────────────────────────────────
const folderSchema = z.object({ name: z.string().min(1).max(255) });
const moveSchema = z.object({ folder: z.string().min(1).max(255).nullable() });

function validate<T>(schema: z.ZodSchema<T>, body: unknown, next: NextFunction): T | null {
  const r = schema.safeParse(body);
  if (!r.success) { next(new AppError(422, r.error.issues.map(i => i.message).join(", "))); return null; }
  return r.data;
}

// ─── Personal files (context_type='user') ─────────────────────────────────────
router.get("/", requireAuth, async (req, res, next) => {
  try { res.json(await svc.listMyFiles(req.user!.userId)); } catch (e) { next(e); }
});

router.post("/folders", requireAuth, async (req, res, next) => {
  const d = validate(folderSchema, req.body, next); if (!d) return;
  try { res.status(201).json(await svc.createFolder(req.user!.userId, d.name)); } catch (e) { next(e); }
});

router.post("/", requireAuth, upload.single("file"), async (req: Request & { file?: Express.Multer.File }, res, next) => {
  if (!req.file) return next(new AppError(400, "No file uploaded"));
  const folder = typeof req.body?.folder === "string" && req.body.folder.length > 0 ? req.body.folder : null;
  try {
    const f = await svc.saveFile(req.user!.userId, folder, {
      name: Buffer.from(req.file.originalname, "latin1").toString("utf8"),
      size: req.file.size,
      mime_type: req.file.mimetype,
      storage_path: req.file.path,
    });
    res.status(201).json(f);
  } catch (e) { next(e); }
});

router.patch("/:id", requireAuth, async (req, res, next) => {
  const d = validate(moveSchema, req.body, next); if (!d) return;
  try { res.json(await svc.moveFile(req.params["id"]!, req.user!.userId, d.folder)); } catch (e) { next(e); }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try { await svc.deleteItem(req.params["id"]!, req.user!.userId); res.json({ ok: true }); } catch (e) { next(e); }
});

export default router;
