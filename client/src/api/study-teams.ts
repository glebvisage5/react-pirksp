import { api } from "./client";

export interface StudyTeam {
  id: string;
  group_id: string;
  name: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
  member_count: number;
  task_count: number;
  completed_task_count: number;
}

export interface StudyTeamMember {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  joined_at: string;
}

export interface StudyTeamDetail extends StudyTeam {
  members: StudyTeamMember[];
}

export interface StudyTeamTask {
  id: string;
  team_id: string;
  title: string;
  description: string | null;
  status: "todo" | "in-progress" | "review" | "done";
  assignee_id: string | null;
  assignee_name: string | null;
  due_date: string | null;
  created_at: string;
}

export const apiStudyTeams = {
  list: () => api.get<StudyTeam[]>("/api/study-teams"),
  get: (id: string) => api.get<StudyTeamDetail>(`/api/study-teams/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post<StudyTeamDetail>("/api/study-teams", data),
  addMember: (id: string, userId: string) =>
    api.post<{ ok: true }>(`/api/study-teams/${id}/members`, { user_id: userId }),
  removeMember: (id: string, userId: string) =>
    api.delete<{ ok: true }>(`/api/study-teams/${id}/members/${userId}`),
  listTasks: (id: string) => api.get<StudyTeamTask[]>(`/api/study-teams/${id}/tasks`),
  createTask: (id: string, data: {
    title: string; description?: string; status?: StudyTeamTask["status"];
    assignee_id?: string; due_date?: string;
  }) => api.post<StudyTeamTask>(`/api/study-teams/${id}/tasks`, data),
  updateTask: (id: string, taskId: string, data: Partial<{
    title: string; description: string; status: StudyTeamTask["status"];
    assignee_id: string; due_date: string;
  }>) => api.patch<StudyTeamTask>(`/api/study-teams/${id}/tasks/${taskId}`, data),
};
