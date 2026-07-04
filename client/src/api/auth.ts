import { api } from "./client";

export type PlatformRole = "user" | "admin" | "owner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: PlatformRole;
  avatar_url: string | null;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function apiRegister(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>("/api/auth/register", { name, email, password });
  storeTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>("/api/auth/login", { email, password });
  storeTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function apiLogout(): Promise<void> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (refreshToken) {
    await api.post("/api/auth/logout", { refreshToken }).catch(() => {});
  }
  clearTokens();
}

export async function apiGetMe(): Promise<User> {
  return api.get<User>("/api/auth/me");
}

export async function apiSearchUsers(q: string): Promise<{ id: string; name: string; email: string }[]> {
  if (q.trim().length < 2) return [];
  return api.get(`/api/auth/users/search?q=${encodeURIComponent(q)}`);
}

function storeTokens(access: string, refresh: string): void {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

function clearTokens(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}
