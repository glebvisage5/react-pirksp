import { v4 as uuidv4 } from "uuid";
import { query, queryOne } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

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

// Проверяет, что пользователь состоит в той же группе, что и учебная команда
// (или является системным админом). Бросает 404, если команда не найдена.
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
    return query(`
      SELECT st.*,
        (SELECT COUNT(*)::int FROM study_team_members WHERE team_id = st.id) AS member_count,
        (SELECT COUNT(*)::int FROM study_team_tasks WHERE team_id = st.id) AS task_count,
        (SELECT COUNT(*)::int FROM study_team_tasks WHERE team_id = st.id AND status = 'done') AS completed_task_count
      FROM study_teams st
      ORDER BY st.created_at DESC
    `, []);
  }
  const groupId = await getMyGroupId(userId);
  if (!groupId) return [];
  return query(`
    SELECT st.*,
      (SELECT COUNT(*)::int FROM study_team_members WHERE team_id = st.id) AS member_count,
      (SELECT COUNT(*)::int FROM study_team_tasks WHERE team_id = st.id) AS task_count,
      (SELECT COUNT(*)::int FROM study_team_tasks WHERE team_id = st.id AND status = 'done') AS completed_task_count
    FROM study_teams st
    WHERE st.group_id = $1
    ORDER BY st.created_at DESC
  `, [groupId]);
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
  const members = await listMembers(teamId);
  return { ...team, members };
}

export async function createStudyTeam(userId: string, name: string, description: string | undefined) {
  const groupId = await getMyGroupId(userId);
  if (!groupId) throw new AppError(400, "You are not a member of any group");
  const teamId = uuidv4();
  await query(
    "INSERT INTO study_teams (id, group_id, name, description, created_by) VALUES ($1,$2,$3,$4,$5)",
    [teamId, groupId, name, description ?? null, userId]
  );
  await query(
    "INSERT INTO study_team_members (team_id, user_id) VALUES ($1,$2)",
    [teamId, userId]
  );
  return getStudyTeam(teamId, userId);
}

// ─── Members ──────────────────────────────────────────────────────────────────

export async function listMembers(teamId: string) {
  return query(`
    SELECT u.id, u.name, u.email, u.avatar_url, stm.joined_at
    FROM study_team_members stm
    JOIN users u ON u.id = stm.user_id
    WHERE stm.team_id = $1
    ORDER BY u.name ASC
  `, [teamId]);
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
  return query(`
    SELECT stt.*, u.name AS assignee_name
    FROM study_team_tasks stt
    LEFT JOIN users u ON u.id = stt.assignee_id
    WHERE stt.team_id = $1
    ORDER BY stt.due_date ASC NULLS LAST, stt.created_at DESC
  `, [teamId]);
}

export async function createTask(teamId: string, data: Record<string, unknown>, userId: string) {
  await assertGroupAccess(teamId, userId);
  const [task] = await query(
    "INSERT INTO study_team_tasks (id, team_id, title, description, status, assignee_id, due_date) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
    [uuidv4(), teamId, data["title"], data["description"] ?? null, data["status"] ?? "todo", data["assignee_id"] ?? null, data["due_date"] ?? null]
  );
  return task;
}

export async function updateTask(taskId: string, data: Record<string, unknown>, userId: string) {
  const task = await queryOne<{ team_id: string }>("SELECT team_id FROM study_team_tasks WHERE id = $1", [taskId]);
  if (!task) throw new AppError(404, "Task not found");
  await assertGroupAccess(task.team_id, userId);
  const allowed = ["title", "description", "status", "assignee_id", "due_date"];
  const fields: string[] = []; const values: unknown[] = []; let idx = 1;
  for (const k of allowed) { if (data[k] !== undefined) { fields.push(`${k} = $${idx++}`); values.push(data[k]); } }
  if (!fields.length) throw new AppError(400, "Nothing to update");
  values.push(taskId);
  const [updated] = await query(`UPDATE study_team_tasks SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`, values);
  return updated;
}
