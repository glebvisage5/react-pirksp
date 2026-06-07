import { api } from "./client";

export interface Team {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  owner_name: string | null;
  user_role: "Team Leader" | "Moderator" | "Member" | "Viewer";
  member_count: number;
  project_count: number;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: "Team Leader" | "Moderator" | "Member" | "Viewer";
  joined_at: string;
  tasks_assigned: number;
  tasks_completed: number;
}

export interface Project {
  id: string;
  team_id: string;
  title: string;
  description: string | null;
  status: "active" | "planned" | "completed" | "on-hold";
  start_date: string | null;
  end_date: string | null;
  task_count: number;
  completed_task_count: number;
  created_at: string;
}

export interface TeamTask {
  id: string;
  team_id: string;
  project_id: string | null;
  project_title: string | null;
  title: string;
  description: string | null;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee_id: string | null;
  assignee_name: string | null;
  due_date: string | null;
  created_at: string;
}

export interface Spec {
  id: string;
  team_id: string;
  project_id: string | null;
  project_title: string | null;
  title: string;
  version: number;
  blocks: unknown[];
  author_name: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SpecVersion {
  id: string;
  spec_id: string;
  version: number;
  blocks: unknown[];
  saved_by: string | null;
  saved_by_name: string | null;
  saved_at: string;
}

export interface TeamFile {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  storage_path: string;
  uploaded_by: string | null;
  uploader_name: string | null;
  context_type: string;
  context_id: string;
  created_at: string;
}

export interface TeamRole {
  id: string;
  team_id: string;
  name: string;
  permissions: string[];
  created_at: string;
}

export const apiTeams = {
  // Teams
  list: () => api.get<Team[]>("/api/teams"),
  get: (id: string) => api.get<Team>(`/api/teams/${id}`),
  create: (data: { name: string; description?: string }) => api.post<Team>("/api/teams", data),
  update: (id: string, data: Partial<Pick<Team, "name" | "description">>) => api.put<Team>(`/api/teams/${id}`, data),
  delete: (id: string) => api.delete(`/api/teams/${id}`),

  // Members
  members: (teamId: string) => api.get<TeamMember[]>(`/api/teams/${teamId}/members`),
  addMember: (teamId: string, userId: string, role: TeamMember["role"]) =>
    api.post(`/api/teams/${teamId}/members`, { user_id: userId, role }),
  updateMemberRole: (teamId: string, userId: string, role: TeamMember["role"]) =>
    api.put(`/api/teams/${teamId}/members/${userId}`, { role }),
  removeMember: (teamId: string, userId: string) =>
    api.delete(`/api/teams/${teamId}/members/${userId}`),

  // Projects
  projects: (teamId: string) => api.get<Project[]>(`/api/teams/${teamId}/projects`),
  createProject: (teamId: string, data: Partial<Project>) =>
    api.post<Project>(`/api/teams/${teamId}/projects`, data),
  updateProject: (projectId: string, data: Partial<Project>) =>
    api.put<Project>(`/api/teams/projects/${projectId}`, data),
  deleteProject: (projectId: string) => api.delete(`/api/teams/projects/${projectId}`),

  // Tasks
  tasks: (teamId: string, filters?: { project_id?: string; status?: string; assignee_id?: string }) => {
    const qs = new URLSearchParams(
      Object.entries(filters ?? {}).filter(([, v]) => v) as [string, string][]
    );
    return api.get<TeamTask[]>(`/api/teams/${teamId}/tasks?${qs}`);
  },
  createTask: (teamId: string, data: Partial<TeamTask>) =>
    api.post<TeamTask>(`/api/teams/${teamId}/tasks`, data),
  updateTask: (taskId: string, data: Partial<TeamTask>) =>
    api.put<TeamTask>(`/api/teams/tasks/${taskId}`, data),
  deleteTask: (taskId: string) => api.delete(`/api/teams/tasks/${taskId}`),

  // Specs
  specs: (teamId: string) => api.get<Spec[]>(`/api/teams/${teamId}/specs`),
  getSpec: (specId: string) => api.get<Spec>(`/api/teams/specs/${specId}`),
  createSpec: (teamId: string, data: { title: string; project_id?: string; blocks?: unknown[] }) =>
    api.post<Spec>(`/api/teams/${teamId}/specs`, data),
  updateSpec: (specId: string, data: { title?: string; blocks?: unknown[] }) =>
    api.put<Spec>(`/api/teams/specs/${specId}`, data),
  deleteSpec: (specId: string) => api.delete(`/api/teams/specs/${specId}`),
  specVersions: (specId: string) => api.get<SpecVersion[]>(`/api/teams/specs/${specId}/versions`),

  // Files
  files: (teamId: string) => api.get<TeamFile[]>(`/api/teams/${teamId}/files`),
  deleteFile: (fileId: string) => api.delete(`/api/teams/files/${fileId}`),
  getFileUrl: (file: TeamFile): string => {
    const filename = file.storage_path.split(/[/\\]/).pop() ?? file.name;
    const base = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";
    return `${base}/uploads/${encodeURIComponent(filename)}`;
  },
  uploadFile: (teamId: string, file: File): Promise<TeamFile> => {
    const token = localStorage.getItem("access_token");
    const form = new FormData();
    form.append("file", file);
    return fetch(`/api/teams/${teamId}/files`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then(async (r) => {
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    });
  },

  // Roles
  roles: (teamId: string) => api.get<TeamRole[]>(`/api/teams/${teamId}/roles`),
  createRole: (teamId: string, data: { name: string; permissions: string[] }) =>
    api.post<TeamRole>(`/api/teams/${teamId}/roles`, data),
  updateRole: (roleId: string, data: { name: string; permissions: string[] }) =>
    api.put<TeamRole>(`/api/teams/roles/${roleId}`, data),
  deleteRole: (roleId: string) => api.delete(`/api/teams/roles/${roleId}`),
};
