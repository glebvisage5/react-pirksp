import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

interface PgError extends Error {
  code?: string;
  routine?: string;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // PostgreSQL "invalid input syntax for type uuid"
  const pgErr = err as PgError;
  if (pgErr.code === "22P02" || pgErr.routine === "string_to_uuid") {
    res.status(400).json({ error: "Invalid ID format" });
    return;
  }

  // Malformed JSON (express.json() parse error)
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
