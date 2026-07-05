import { ApiError } from "./client";

export function uploadGtaIcon(file: File): Promise<{ url: string }> {
  const token = localStorage.getItem("access_token");
  const form = new FormData();
  form.append("file", file);
  const base = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";
  return fetch(`${base}/api/gta/upload-icon`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  }).then(async (r) => {
    if (!r.ok) {
      const body = await r.json().catch(() => ({ error: r.statusText }));
      throw new ApiError(r.status, body.error ?? "Upload failed");
    }
    return r.json();
  });
}

export function gtaIconUrl(icon: string): string {
  if (icon.startsWith("http")) return icon;
  const base = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";
  return `${base}${icon}`;
}

export function isGtaIconImage(icon: string): boolean {
  return icon.startsWith("/uploads/") || icon.startsWith("http");
}
