import { api } from "./client";

export interface UserTask {
  id: string;
  title: string;
  description: string | null;
  course_id: string | null;
  course_title: string | null;
  due_date: string | null;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "review" | "done";
  progress: number;
  assigned_at: string;
  created_at: string;
}

export interface UserStats {
  tasks_total: number;
  tasks_completed: number;
  tasks_in_progress: number;
  courses_enrolled: number;
  overall_progress: number;
}

export const apiTasks = {
  list: (params?: { limit?: number; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.status) qs.set("status", params.status);
    return api.get<UserTask[]>(`/api/tasks?${qs}`);
  },
  stats: () => api.get<UserStats>("/api/tasks/stats"),
  get: (id: string) => api.get<UserTask>(`/api/tasks/${id}`),
  create: (data: Partial<UserTask>) => api.post<UserTask>("/api/tasks", data),
  update: (id: string, data: Partial<UserTask>) => api.put<UserTask>(`/api/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/api/tasks/${id}`),
  updateStatus: (id: string, status: UserTask["status"], progress?: number) =>
    api.patch(`/api/tasks/${id}/status`, { status, progress }),
};
