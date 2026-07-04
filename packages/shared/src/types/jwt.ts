export type PlatformRole = "user" | "admin" | "owner";

export interface JwtPayload {
  userId: string;
  role: PlatformRole;
}
