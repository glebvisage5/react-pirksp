import { api } from "./client";
import type { UserStats } from "./tasks";

export const apiUsers = {
  stats: () => api.get<UserStats>("/api/tasks/stats"),
};
