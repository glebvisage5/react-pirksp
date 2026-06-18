import { api, ApiError } from "./client";

export interface UserFile {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  storage_path: string;
  uploaded_by: string | null;
  uploader_name: string | null;
  folder: string | null;
  created_at: string;
}

export interface UserFolder {
  id: string;
  name: string;
  created_at: string;
}

export interface FilesResponse {
  folders: UserFolder[];
  files: UserFile[];
}

export const apiFiles = {
  list: () => api.get<FilesResponse>("/api/files"),
  createFolder: (name: string) => api.post<UserFolder>("/api/files/folders", { name }),
  move: (id: string, folder: string | null) => api.patch<UserFile>(`/api/files/${id}`, { folder }),
  delete: (id: string) => api.delete<{ ok: true }>(`/api/files/${id}`),
  getFileUrl: (file: UserFile): string => {
    const filename = file.storage_path.split(/[/\\]/).pop() ?? file.name;
    const base = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";
    return `${base}/uploads/${encodeURIComponent(filename)}`;
  },
  upload: (file: File, folder: string | null): Promise<UserFile> => {
    const token = localStorage.getItem("access_token");
    const form = new FormData();
    form.append("file", file);
    if (folder) form.append("folder", folder);
    const base = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";
    return fetch(`${base}/api/files`, {
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
  },
};
