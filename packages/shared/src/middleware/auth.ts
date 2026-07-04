import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";
import type { JwtPayload } from "../types/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "No token provided"));
  }
  const token = header.slice(7);
  const secret = process.env["JWT_SECRET"];
  if (!secret) {
    return next(new AppError(500, "JWT_SECRET not configured"));
  }
  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}

export function requireRole(...roles: Array<"user" | "admin" | "owner">) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new AppError(403, "Forbidden"));
    if (req.user.role === "owner" || roles.includes(req.user.role)) return next();
    return next(new AppError(403, "Forbidden"));
  };
}

export function requireOwner(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== "owner") {
    return next(new AppError(403, "Forbidden"));
  }
  next();
}
