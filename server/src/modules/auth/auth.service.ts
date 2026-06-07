import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { query, queryOne } from "../../config/database";
import { env } from "../../config/env";
import { AppError } from "../../middleware/errorHandler";
import type { JwtPayload } from "../../middleware/auth";

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  avatar_url: string | null;
  is_active: boolean;
}

function signAccess(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

function signRefresh(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export async function register(name: string, email: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const existing = await queryOne("SELECT id FROM users WHERE email = $1", [email]);
  if (existing) throw new AppError(409, "Email already registered");

  const hash = await bcrypt.hash(password, 12);
  const [user] = await query<User>(
    "INSERT INTO users (id, name, email, password_hash) VALUES ($1,$2,$3,$4) RETURNING id, email, name, role, avatar_url, is_active",
    [uuidv4(), name, email, hash]
  );

  const payload: JwtPayload = { userId: user.id, role: user.role };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);
  await storeRefreshToken(user.id, refreshToken);

  return { user, accessToken, refreshToken };
}

export async function login(email: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const user = await queryOne<User & { password_hash: string }>(
    "SELECT id, email, name, role, avatar_url, is_active, password_hash FROM users WHERE email = $1",
    [email]
  );
  if (!user || !user.is_active) throw new AppError(401, "Invalid credentials");

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new AppError(401, "Invalid credentials");

  const payload: JwtPayload = { userId: user.id, role: user.role };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);
  await storeRefreshToken(user.id, refreshToken);

  const { password_hash: _, ...safeUser } = user;
  return { user: safeUser as User, accessToken, refreshToken };
}

export async function refresh(token: string): Promise<{ accessToken: string; refreshToken: string }> {
  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    throw new AppError(401, "Invalid refresh token");
  }

  const hash = hashToken(token);
  const stored = await queryOne(
    "SELECT id FROM refresh_tokens WHERE token_hash = $1 AND user_id = $2 AND expires_at > NOW()",
    [hash, payload.userId]
  );
  if (!stored) throw new AppError(401, "Refresh token revoked or expired");

  await query("DELETE FROM refresh_tokens WHERE token_hash = $1", [hash]);

  const cleanPayload: JwtPayload = { userId: payload.userId, role: payload.role };
  const newAccess = signAccess(cleanPayload);
  const newRefresh = signRefresh(cleanPayload);
  await storeRefreshToken(payload.userId, newRefresh);

  return { accessToken: newAccess, refreshToken: newRefresh };
}

export async function logout(token: string): Promise<void> {
  const hash = hashToken(token);
  await query("DELETE FROM refresh_tokens WHERE token_hash = $1", [hash]);
}

export async function getMe(userId: string): Promise<User> {
  const user = await queryOne<User>(
    "SELECT id, email, name, role, avatar_url FROM users WHERE id = $1",
    [userId]
  );
  if (!user) throw new AppError(404, "User not found");
  return user;
}

async function storeRefreshToken(userId: string, token: string): Promise<void> {
  const hash = hashToken(token);
  const decoded = jwt.decode(token) as { exp?: number };
  const expiresAt = decoded.exp
    ? new Date(decoded.exp * 1000).toISOString()
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await query(
    "INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES ($1,$2,$3,$4)",
    [uuidv4(), userId, hash, expiresAt]
  );
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
