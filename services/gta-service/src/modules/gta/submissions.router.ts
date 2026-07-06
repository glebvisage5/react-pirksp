import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import * as svc from "./submissions.service";
import { requireAuth, requireOwner, AppError } from "@ecosystem/shared";
import type { JwtPayload } from "@ecosystem/shared";

const router = Router();

function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) { next(); return; }
  const secret = process.env["JWT_SECRET"];
  if (secret) {
    try {
      req.user = jwt.verify(header.slice(7), secret) as JwtPayload;
    } catch {
      // invalid/expired token on a public endpoint — just treat as anonymous
    }
  }
  next();
}

function validate<T>(schema: z.ZodSchema<T>, body: unknown, next: NextFunction): T | null {
  const r = schema.safeParse(body);
  if (!r.success) { next(new AppError(422, r.error.issues.map((i) => i.message).join(", "))); return null; }
  return r.data;
}

const submissionSchema = z.object({
  answers: z.record(z.string()),
});

const reviewSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

const tokenSchema = z.object({
  sectionId: z.string().uuid(),
});

// ─── Public ─────────────────────────────────────────────────────────────────────

router.get("/public/forms/:token", async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.getPublicForm(req.params["token"]!)); } catch (e) { next(e); }
});

router.post("/public/forms/:token/submissions", optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(submissionSchema, req.body, next); if (!d) return;
  try {
    const bypassRateLimit = req.user?.role === "owner";
    const ip = req.ip ?? "unknown";
    res.status(201).json(await svc.createPublicSubmission(req.params["token"]!, d.answers, ip, bypassRateLimit));
  } catch (e) { next(e); }
});

// ─── Owner ──────────────────────────────────────────────────────────────────────

router.get("/orgs/:orgId/submissions", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.listSubmissions(req.params["orgId"]!, req.user!.userId)); } catch (e) { next(e); }
});

router.get("/orgs/:orgId/submissions/archive", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.listArchivedSubmissions(req.params["orgId"]!, req.user!.userId)); } catch (e) { next(e); }
});

router.patch("/submissions/:id", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(reviewSchema, req.body, next); if (!d) return;
  try { res.json(await svc.reviewSubmission(req.params["id"]!, d.status, req.user!.userId)); } catch (e) { next(e); }
});

router.get("/orgs/:orgId/form-sections", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await svc.listFormSections(req.params["orgId"]!, req.user!.userId)); } catch (e) { next(e); }
});

router.post("/orgs/:orgId/public-form-token", requireAuth, requireOwner, async (req: Request, res: Response, next: NextFunction) => {
  const d = validate(tokenSchema, req.body, next); if (!d) return;
  try { res.json(await svc.createOrRegenerateToken(req.params["orgId"]!, d.sectionId, req.user!.userId)); } catch (e) { next(e); }
});

export default router;
