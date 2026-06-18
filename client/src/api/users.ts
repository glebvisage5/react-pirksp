import { api } from "./client";
import type { UserStats } from "./tasks";

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ProfileProject {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  group_name: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  social_links: SocialLink[];
  role: "user" | "admin";
  created_at: string;
  projects: ProfileProject[];
}

export const apiUsers = {
  stats: () => api.get<UserStats>("/api/tasks/stats"),
  getProfile: () => api.get<UserProfile>("/api/users/me/profile"),
  updateProfile: (data: Partial<{ name: string; bio: string; social_links: SocialLink[] }>) =>
    api.put<UserProfile>("/api/users/me/profile", data),
};
