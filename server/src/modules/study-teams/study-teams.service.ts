import { v4 as uuidv4 } from "uuid";
import { query, queryOne } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";
import { encrypt, decryptFields } from "../../utils/crypto";

const TEAM_FIELDS = ["name", "description"];
const TASK_FIELDS = ["title", "description"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function isSystemAdmin(userId: string): Promise<boolean> {
  const row = await queryOne<{ role: string }>("SELECT role FROM users WHERE id = $1", [userId]);
  return row?.role === "admin";
}

async function getMyGroupId(userId: string): Promise<string | null> {
  const row = await queryOne<{ group_id: string }>(
    "SELECT group_id FROM group_members WHERE user_id = $1", [userId]
  );
  return row?.group_id ?? null;
}

async function assertGroupAccess(teamId: string, userId: string): Promise<{ group_id: string }> {
  const team = await queryOne<{ group_id: string }>("SELECT group_id FROM study_teams WHERE id = $1", [teamId]);
  if (!team) throw new AppError(404, "Study team not found");
  if (await isSystemAdmin(userId)) return team;
  const groupId = await getMyGroupId(userId);
  if (!groupId || groupId !== team.group_id) throw new AppError(403, "Forbidden");
  return team;
}

// ─── Study teams ──────────────────────────────────────────────────────────────

export async function listMyStudyTeams(userId: string) {
  if (await isSystemAdmin(userId)) {
    const rows = await query(`
      SELECT st.*,
        (SELECT COUNT(*)::int FROM study_team_members WHERE team_id = st.id) AS member_count,
        (SELECT COUNT(*)::int FROM study_team_tasks WHERE team_id = st.id) AS task_count,
        (SELECT COUNT(*)::int FROM study_team_tasks WHERE team_id = st.id AND status = 'done') AS completed_task_count
      FROM study_teams st
      ORDER BY st.created_at DESC
    `, []);
    return rows.map(r => decryptFields(r, TEAM_FIELDS));
  }
  const groupId = await getMyGroupId(userId);
  if (!groupId) return [];
  const rows = await query(`
    SELECT st.*,
      (SELECT COUNT(*)::int FROM study_team_members WHERE team_id = st.id) AS member_count,
      (SELECT COUNT(*)::int FROM study_team_tasks WHERE team_id = st.id) AS task_count,
      (SELECT COUNT(*)::int FROM study_team_tasks WHERE team_id = st.id AND status = 'done') AS completed_task_count
    FROM study_teams st
    WHERE st.group_id = $1
    ORDER BY st.created_at DESC
  `, [groupId]);
  return rows.map(r => decryptFields(r, TEAM_FIELDS));
}

export async function getStudyTeam(teamId: string, userId: string) {
  await assertGroupAccess(teamId, userId);
  const team = await queryOne(`
    SELECT st.*,
      (SELECT COUNT(*)::int FROM study_team_tasks WHERE team_id = st.id) AS task_count,
      (SELECT COUNT(*)::int FROM study_team_tasks WHERE team_id = st.id AND status = 'done') AS completed_task_count
    FROM study_teams st
    WHERE st.id = $1
  `, [teamId]);
  if (!team) throw new AppError(404, "Study team not found");
  const decrypted = decryptFields(team, TEAM_FIELDS);
  const members = await listMembers(teamId);
  return { ...decrypted, members };
}

export async function createStudyTeam(userId: string, name: string, description: string | undefined) {
  const groupId = await getMyGroupId(userId);
  if (!groupId) throw new AppError(400, "You are not a member of any group");
  const teamId = uuidv4();
  const encName = encrypt(name);
  const encDesc = description != null ? encrypt(description) : null;
  await query(
    "INSERT INTO study_teams (id, group_id, name, description, created_by) VALUES ($1,$2,$3,$4,$5)",
    [teamId, groupId, encName, encDesc, userId]
  );
  await query(
    "INSERT INTO study_team_members (team_id, user_id) VALUES ($1,$2)",
    [teamId, userId]
  );
  return getStudyTeam(teamId, userId);
}

// ─── Members ──────────────────────────────────────────────────────────────────

export async function listMembers(teamId: string) {
  const rows = await query(`
    SELECT u.id, u.name, u.email, u.avatar_url, stm.joined_at
    FROM study_team_members stm
    JOIN users u ON u.id = stm.user_id
    WHERE stm.team_id = $1
    ORDER BY u.name ASC
  `, [teamId]);
  return rows.map(r => decryptFields(r, ["name", "email"]));
}

export async function addMember(teamId: string, memberId: string, requesterId: string) {
  const team = await assertGroupAccess(teamId, requesterId);
  const memberGroupId = await getMyGroupId(memberId);
  if (memberGroupId !== team.group_id) throw new AppError(422, "User is not a member of this group");
  await query(
    "INSERT INTO study_team_members (team_id, user_id) VALUES ($1,$2) ON CONFLICT (team_id, user_id) DO NOTHING",
    [teamId, memberId]
  );
}

export async function removeMember(teamId: string, memberId: string, requesterId: string) {
  await assertGroupAccess(teamId, requesterId);
  await query("DELETE FROM study_team_members WHERE team_id = $1 AND user_id = $2", [teamId, memberId]);
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export async function listTasks(teamId: string, userId: string) {
  await assertGroupAccess(teamId, userId);
  const rows = await query(`
    SELECT stt.*, u.name AS assignee_name
    FROM study_team_tasks stt
    LEFT JOIN users u ON u.id = stt.assignee_id
    WHERE stt.team_id = $1
    ORDER BY stt.due_date ASC NULLS LAST, stt.created_at DESC
  `, [teamId]);
  return rows.map(r => decryptFields(r, [...TASK_FIELDS, "assignee_name"]));
}

export async function createTask(teamId: string, data: Record<string, unknown>, userId: string) {
  await assertGroupAccess(teamId, userId);
  const encTitle = encrypt(data["title"] as string);
  const encDesc = data["description"] != null ? encrypt(data["description"] as string) : null;
  const [task] = await query(
    "INSERT INTO study_team_tasks (id, team_id, title, description, status, assignee_id, due_date) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
    [uuidv4(), teamId, encTitle, encDesc, data["status"] ?? "todo", data["assignee_id"] ?? null, data["due_date"] ?? null]
  );
  return decryptFields(task, TASK_FIELDS);
}

export async function updateTask(taskId: string, data: Record<string, unknown>, userId: string) {
  const task = await queryOne<{ team_id: string }>("SELECT team_id FROM study_team_tasks WHERE id = $1", [taskId]);
  if (!task) throw new AppError(404, "Task not found");
  await assertGroupAccess(task.team_id, userId);
  const allowed = ["title", "description", "status", "assignee_id", "due_date"];
  const fields: string[] = []; const values: unknown[] = []; let idx = 1;
  for (const k of allowed) {
    if (data[k] !== undefined) {
      let value = data[k];
      if ((k === "title" || k === "description") && value != null) {
        value = encrypt(value as string);
      }
      fields.push(`${k} = $${idx++}`);
      values.push(value);
    }
  }
  if (!fields.length) throw new AppError(400, "Nothing to update");
  values.push(taskId);
  const [updated] = await query(`UPDATE study_team_tasks SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`, values);
  return decryptFields(updated, TASK_FIELDS);
}
