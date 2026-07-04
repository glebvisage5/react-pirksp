import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./errorHandler";

export type PlatformRole = "user" | "admin" | "owner";

export interface JwtPayload {
  userId: string;
  role: PlatformRole;
}

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
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}

export function requireRole(...roles: PlatformRole[]) {
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
