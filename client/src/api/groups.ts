import { api } from "./client";

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: "student" | "elder";
  group_id: string;
}

export interface MyGroup {
  id: string;
  name: string;
  created_at: string;
  members: GroupMember[];
}

export const apiGroups = {
  my: () => api.get<MyGroup | null>("/api/groups/my"),
};
