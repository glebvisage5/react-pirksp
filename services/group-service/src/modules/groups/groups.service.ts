import { v4 as uuidv4 } from "uuid";
import { query, queryOne } from "../../config/database";
import { AppError } from "@ecosystem/shared";

export async function listGroups() {
  return query(`
    SELECT g.*, COUNT(gm.user_id)::int AS member_count
    FROM groups g
    LEFT JOIN group_members gm ON gm.group_id = g.id
    GROUP BY g.id
    ORDER BY g.created_at DESC
  `);
}

export async function getGroup(groupId: string) {
  const group = await queryOne("SELECT * FROM groups WHERE id = $1", [groupId]);
  if (!group) throw new AppError(404, "Group not found");
  return group;
}

export async function getGroupMembers(groupId: string) {
  return query(`
    SELECT u.id, u.name, u.email, u.avatar_url, gm.role, gm.group_id
    FROM group_members gm
    JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = $1
    ORDER BY gm.role DESC, u.name ASC
  `, [groupId]);
}

export async function getMyGroup(userId: string) {
  const group = await queryOne(`
    SELECT g.* FROM groups g
    JOIN group_members gm ON gm.group_id = g.id
    WHERE gm.user_id = $1
  `, [userId]);
  if (!group) return null;
  const members = await getGroupMembers(group["id"] as string);
  return { ...group, members };
}

export async function createGroup(name: string) {
  const [group] = await query(
    "INSERT INTO groups (id, name) VALUES ($1, $2) RETURNING *",
    [uuidv4(), name]
  );
  return group;
}

export async function addGroupMember(groupId: string, userId: string, role: string) {
  const group = await queryOne("SELECT id FROM groups WHERE id = $1", [groupId]);
  if (!group) throw new AppError(404, "Group not found");
  await query(`
    INSERT INTO group_members (group_id, user_id, role)
    VALUES ($1, $2, $3)
    ON CONFLICT (group_id, user_id) DO UPDATE SET role = $3
  `, [groupId, userId, role]);
}

export async function removeGroupMember(groupId: string, userId: string) {
  await query("DELETE FROM group_members WHERE group_id = $1 AND user_id = $2", [groupId, userId]);
}

export async function deleteGroup(groupId: string) {
  const result = await query("DELETE FROM groups WHERE id = $1 RETURNING id", [groupId]);
  if (result.length === 0) throw new AppError(404, "Group not found");
}
