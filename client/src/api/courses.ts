import { api } from "./client";

export interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor_id: string | null;
  instructor_name: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  is_ai_powered: boolean;
  thumbnail_emoji: string;
  enrolled: boolean;
  progress: number;
  total_lessons: number;
  completed_lessons: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  type: "video" | "interactive" | "quiz" | "project";
  duration: string | null;
  order_index: number;
  content: Record<string, unknown>;
  is_locked: boolean;
  completed: boolean;
}

export const apiCourses = {
  list: () => api.get<Course[]>("/api/courses"),
  enrolled: (limit = 4) => api.get<Course[]>(`/api/courses/enrolled?limit=${limit}`),
  get: (id: string) => api.get<Course>(`/api/courses/${id}`),
  create: (data: Partial<Course>) => api.post<Course>("/api/courses", data),
  update: (id: string, data: Partial<Course>) => api.put<Course>(`/api/courses/${id}`, data),
  delete: (id: string) => api.delete(`/api/courses/${id}`),
  enroll: (id: string) => api.post(`/api/courses/${id}/enroll`, {}),
  lessons: (id: string) => api.get<Lesson[]>(`/api/courses/${id}/lessons`),
  createLesson: (courseId: string, data: Partial<Lesson>) => api.post<Lesson>(`/api/courses/${courseId}/lessons`, data),
  updateLesson: (lessonId: string, data: Partial<Lesson>) => api.put<Lesson>(`/api/courses/lessons/${lessonId}`, data),
  deleteLesson: (lessonId: string) => api.delete(`/api/courses/lessons/${lessonId}`),
  completeLesson: (lessonId: string) => api.post(`/api/courses/lessons/${lessonId}/complete`, {}),
};
