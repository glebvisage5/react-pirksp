import { v4 as uuidv4 } from "uuid";
import { query, queryOne } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

// ─── Teams ────────────────────────────────────────────────────────────────────

export async function listTeams(userId: string, isAdmin = false) {
  if (isAdmin) {
    return query(`
      SELECT t.*, u.name AS owner_name, 'Team Leader' AS user_role,
        (SELECT COUNT(*)::int FROM team_members WHERE team_id = t.id) AS member_count,
        (SELECT COUNT(*)::int FROM projects WHERE team_id = t.id) AS project_count
      FROM teams t
      LEFT JOIN users u ON u.id = t.owner_id
      ORDER BY t.created_at DESC
    `, []);
  }
  return query(`
    SELECT t.*, u.name AS owner_name, tm.role AS user_role,
      (SELECT COUNT(*)::int FROM team_members WHERE team_id = t.id) AS member_count,
      (SELECT COUNT(*)::int FROM projects WHERE team_id = t.id) AS project_count
    FROM teams t
    JOIN team_members tm ON tm.team_id = t.id AND tm.user_id = $1
    LEFT JOIN users u ON u.id = t.owner_id
    ORDER BY t.created_at DESC
  `, [userId]);
}

export async function getTeam(teamId: string, userId: string, isAdmin = false) {
  if (isAdmin) {
    const team = await queryOne(`
      SELECT t.*, u.name AS owner_name, 'Team Leader' AS user_role,
        (SELECT COUNT(*)::int FROM team_members WHERE team_id = t.id) AS member_count,
        (SELECT COUNT(*)::int FROM projects WHERE team_id = t.id) AS project_count
      FROM teams t
      LEFT JOIN users u ON u.id = t.owner_id
      WHERE t.id = $1
    `, [teamId]);
    if (!team) throw new AppError(404, "Team not found");
    return team;
  }
  const team = await queryOne(`
    SELECT t.*, u.name AS owner_name, tm.role AS user_role,
      (SELECT COUNT(*)::int FROM team_members WHERE team_id = t.id) AS member_count,
      (SELECT COUNT(*)::int FROM projects WHERE team_id = t.id) AS project_count
    FROM teams t
    JOIN team_members tm ON tm.team_id = t.id AND tm.user_id = $2
    LEFT JOIN users u ON u.id = t.owner_id
    WHERE t.id = $1
  `, [teamId, userId]);
  if (!team) throw new AppError(404, "Team not found or access denied");
  return team;
}

export async function createTeam(name: string, description: string | undefined, ownerId: string) {
  const teamId = uuidv4();
  await query(
    "INSERT INTO teams (id, name, description, owner_id) VALUES ($1,$2,$3,$4)",
    [teamId, name, description ?? null, ownerId]
  );
  await query(
    "INSERT INTO team_members (team_id, user_id, role) VALUES ($1,$2,'Team Leader')",
    [teamId, ownerId]
  );
  return getTeam(teamId, ownerId);
}

export async function updateTeam(teamId: string, data: Record<string, unknown>, userId: string) {
  await assertRole(teamId, userId, ["Team Leader"]);
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  for (const key of ["name", "description"]) {
    if (data[key] !== undefined) { fields.push(`${key} = $${idx++}`); values.push(data[key]); }
  }
  if (!fields.length) throw new AppError(400, "Nothing to update");
  values.push(teamId);
  const [team] = await query(`UPDATE teams SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`, values);
  return team;
}

export async function deleteTeam(teamId: string) {
  const r = await query("DELETE FROM teams WHERE id = $1 RETURNING id", [teamId]);
  if (!r.length) throw new AppError(404, "Team not found");
}

// ─── Members ──────────────────────────────────────────────────────────────────

export async function listMembers(teamId: string) {
  return query(`
    SELECT u.id, u.name, u.email, u.avatar_url, tm.role, tm.joined_at,
      (SELECT COUNT(*)::int FROM team_tasks WHERE team_id = $1 AND assignee_id = u.id) AS tasks_assigned,
      (SELECT COUNT(*)::int FROM team_tasks WHERE team_id = $1 AND assignee_id = u.id AND status = 'done') AS tasks_completed
    FROM team_members tm
    JOIN users u ON u.id = tm.user_id
    WHERE tm.team_id = $1
    ORDER BY
      CASE tm.role WHEN 'Team Leader' THEN 1 WHEN 'Moderator' THEN 2 WHEN 'Member' THEN 3 ELSE 4 END,
      u.name
  `, [teamId]);
}

export async function addMember(teamId: string, userId: string, role: string) {
  await query(`
    INSERT INTO team_members (team_id, user_id, role) VALUES ($1,$2,$3)
    ON CONFLICT (team_id, user_id) DO UPDATE SET role = $3
  `, [teamId, userId, role]);
}

export async function updateMemberRole(teamId: string, memberId: string, role: string, requesterId: string) {
  await assertRole(teamId, requesterId, ["Team Leader"]);
  await query(
    "UPDATE team_members SET role = $1 WHERE team_id = $2 AND user_id = $3",
    [role, teamId, memberId]
  );
}

export async function removeMember(teamId: string, memberId: string, requesterId: string) {
  await assertRole(teamId, requesterId, ["Team Leader", "Moderator"]);
  await query("DELETE FROM team_members WHERE team_id = $1 AND user_id = $2", [teamId, memberId]);
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function listProjects(teamId: string) {
  return query(`
    SELECT p.*,
      (SELECT COUNT(*)::int FROM team_tasks WHERE project_id = p.id) AS task_count,
      (SELECT COUNT(*)::int FROM team_tasks WHERE project_id = p.id AND status = 'done') AS completed_task_count
    FROM projects p
    WHERE p.team_id = $1
    ORDER BY p.created_at DESC
  `, [teamId]);
}

export async function createProject(teamId: string, data: Record<string, unknown>, userId: string) {
  await assertRole(teamId, userId, ["Team Leader", "Moderator"]);
  const [p] = await query(
    "INSERT INTO projects (id,team_id,title,description,status,start_date,end_date) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
    [uuidv4(), teamId, data["title"], data["description"] ?? null, data["status"] ?? "planned", data["start_date"] ?? null, data["end_date"] ?? null]
  );
  return p;
}

export async function updateProject(projectId: string, data: Record<string, unknown>, userId: string) {
  const proj = await queryOne<{ team_id: string }>("SELECT team_id FROM projects WHERE id = $1", [projectId]);
  if (!proj) throw new AppError(404, "Project not found");
  await assertRole(proj.team_id, userId, ["Team Leader", "Moderator"]);
  const allowed = ["title", "description", "status", "start_date", "end_date"];
  const fields: string[] = []; const values: unknown[] = []; let idx = 1;
  for (const k of allowed) { if (data[k] !== undefined) { fields.push(`${k} = $${idx++}`); values.push(data[k]); } }
  if (!fields.length) throw new AppError(400, "Nothing to update");
  values.push(projectId);
  const [p] = await query(`UPDATE projects SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`, values);
  return p;
}

export async function deleteProject(projectId: string, userId: string) {
  const proj = await queryOne<{ team_id: string }>("SELECT team_id FROM projects WHERE id = $1", [projectId]);
  if (!proj) throw new AppError(404, "Project not found");
  await assertRole(proj.team_id, userId, ["Team Leader"]);
  await query("DELETE FROM projects WHERE id = $1", [projectId]);
}

// ─── Team Tasks ───────────────────────────────────────────────────────────────

export async function listTeamTasks(teamId: string, filters: Record<string, string>) {
  const params: unknown[] = [teamId];
  let where = "tt.team_id = $1";
  if (filters["project_id"]) { params.push(filters["project_id"]); where += ` AND tt.project_id = $${params.length}`; }
  if (filters["status"]) { params.push(filters["status"]); where += ` AND tt.status = $${params.length}`; }
  if (filters["assignee_id"]) { params.push(filters["assignee_id"]); where += ` AND tt.assignee_id = $${params.length}`; }
  return query(`
    SELECT tt.*, u.name AS assignee_name, p.title AS project_title
    FROM team_tasks tt
    LEFT JOIN users u ON u.id = tt.assignee_id
    LEFT JOIN projects p ON p.id = tt.project_id
    WHERE ${where}
    ORDER BY
      CASE tt.priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END,
      tt.due_date ASC NULLS LAST
  `, params);
}

export async function createTeamTask(teamId: string, data: Record<string, unknown>, userId: string) {
  await assertRole(teamId, userId, ["Team Leader", "Moderator", "Member"]);
  const [t] = await query(
    "INSERT INTO team_tasks (id,team_id,project_id,title,description,status,priority,assignee_id,due_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
    [uuidv4(), teamId, data["project_id"] ?? null, data["title"], data["description"] ?? null,
     data["status"] ?? "todo", data["priority"] ?? "medium", data["assignee_id"] ?? null, data["due_date"] ?? null]
  );
  return t;
}

export async function updateTeamTask(taskId: string, data: Record<string, unknown>, userId: string) {
  const task = await queryOne<{ team_id: string; assignee_id: string }>(
    "SELECT team_id, assignee_id FROM team_tasks WHERE id = $1", [taskId]
  );
  if (!task) throw new AppError(404, "Task not found");
  const role = await getMemberRole(task.team_id, userId);
  const isAssignee = task.assignee_id === userId;
  if (!role && !isAssignee) throw new AppError(403, "Forbidden");
  const allowed = ["title", "description", "status", "priority", "assignee_id", "due_date", "project_id"];
  const fields: string[] = []; const values: unknown[] = []; let idx = 1;
  for (const k of allowed) { if (data[k] !== undefined) { fields.push(`${k} = $${idx++}`); values.push(data[k]); } }
  if (!fields.length) throw new AppError(400, "Nothing to update");
  values.push(taskId);
  const [t] = await query(`UPDATE team_tasks SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`, values);
  return t;
}

export async function deleteTeamTask(taskId: string, userId: string) {
  const task = await queryOne<{ team_id: string }>("SELECT team_id FROM team_tasks WHERE id = $1", [taskId]);
  if (!task) throw new AppError(404, "Task not found");
  await assertRole(task.team_id, userId, ["Team Leader", "Moderator"]);
  await query("DELETE FROM team_tasks WHERE id = $1", [taskId]);
}

// ─── Specs ────────────────────────────────────────────────────────────────────

export async function listSpecs(teamId: string) {
  return query(`
    SELECT s.*, u.name AS author_name, p.title AS project_title
    FROM specifications s
    LEFT JOIN users u ON u.id = s.created_by
    LEFT JOIN projects p ON p.id = s.project_id
    WHERE s.team_id = $1
    ORDER BY s.updated_at DESC
  `, [teamId]);
}

export async function getSpec(specId: string) {
  const s = await queryOne(`
    SELECT s.*, u.name AS author_name, p.title AS project_title
    FROM specifications s
    LEFT JOIN users u ON u.id = s.created_by
    LEFT JOIN projects p ON p.id = s.project_id
    WHERE s.id = $1
  `, [specId]);
  if (!s) throw new AppError(404, "Spec not found");
  return s;
}

export async function createSpec(teamId: string, data: Record<string, unknown>, userId: string) {
  await assertRole(teamId, userId, ["Team Leader", "Moderator"]);
  const [s] = await query(
    "INSERT INTO specifications (id,team_id,project_id,title,blocks,created_by) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [uuidv4(), teamId, data["project_id"] ?? null, data["title"], JSON.stringify(data["blocks"] ?? []), userId]
  );
  return s;
}

export async function updateSpec(specId: string, data: Record<string, unknown>, userId: string) {
  const spec = await queryOne<{ team_id: string; version: number }>(
    "SELECT team_id, version FROM specifications WHERE id = $1", [specId]
  );
  if (!spec) throw new AppError(404, "Spec not found");
  await assertRole(spec.team_id, userId, ["Team Leader", "Moderator"]);
  // save version snapshot before update
  await query(
    "INSERT INTO spec_versions (id,spec_id,version,blocks,saved_by) VALUES ($1,$2,$3,$4,$5)",
    [uuidv4(), specId, spec.version, data["blocks"] ? JSON.stringify(data["blocks"]) : "[]", userId]
  );
  const newVersion = spec.version + 1;
  const [s] = await query(
    "UPDATE specifications SET title=$1, blocks=$2, version=$3, updated_at=NOW() WHERE id=$4 RETURNING *",
    [data["title"] ?? null, JSON.stringify(data["blocks"] ?? []), newVersion, specId]
  );
  return s;
}

export async function deleteSpec(specId: string, userId: string) {
  const spec = await queryOne<{ team_id: string }>("SELECT team_id FROM specifications WHERE id = $1", [specId]);
  if (!spec) throw new AppError(404, "Spec not found");
  await assertRole(spec.team_id, userId, ["Team Leader"]);
  await query("DELETE FROM specifications WHERE id = $1", [specId]);
}

export async function listSpecVersions(specId: string) {
  return query(
    "SELECT sv.*, u.name AS saved_by_name FROM spec_versions sv LEFT JOIN users u ON u.id = sv.saved_by WHERE sv.spec_id = $1 ORDER BY sv.version DESC",
    [specId]
  );
}

// ─── Files ────────────────────────────────────────────────────────────────────

export async function listFiles(teamId: string) {
  return query(`
    SELECT f.*, u.name AS uploader_name
    FROM files f
    LEFT JOIN users u ON u.id = f.uploaded_by
    WHERE f.context_type = 'team' AND f.context_id = $1
    ORDER BY f.created_at DESC
  `, [teamId]);
}

export async function saveFile(teamId: string, fileData: {
  name: string; size: number; mime_type: string; storage_path: string;
}, userId: string) {
  const [f] = await query(
    "INSERT INTO files (id,name,size,mime_type,storage_path,uploaded_by,context_type,context_id) VALUES ($1,$2,$3,$4,$5,$6,'team',$7) RETURNING *",
    [uuidv4(), fileData.name, fileData.size, fileData.mime_type, fileData.storage_path, userId, teamId]
  );
  return f;
}

export async function deleteFile(fileId: string, userId: string) {
  const file = await queryOne<{ uploaded_by: string; context_id: string }>(
    "SELECT uploaded_by, context_id FROM files WHERE id = $1", [fileId]
  );
  if (!file) throw new AppError(404, "File not found");
  const role = await getMemberRole(file.context_id, userId);
  const isUploader = file.uploaded_by === userId;
  if (!isUploader && !["Team Leader", "Moderator"].includes(role ?? "")) {
    throw new AppError(403, "Forbidden");
  }
  await query("DELETE FROM files WHERE id = $1", [fileId]);
}

// ─── Team Roles ───────────────────────────────────────────────────────────────

export async function listTeamRoles(teamId: string) {
  return query("SELECT * FROM team_roles WHERE team_id = $1 ORDER BY created_at ASC", [teamId]);
}

export async function createTeamRole(teamId: string, data: Record<string, unknown>, userId: string) {
  await assertRole(teamId, userId, ["Team Leader"]);
  const [r] = await query(
    "INSERT INTO team_roles (id,team_id,name,permissions) VALUES ($1,$2,$3,$4) RETURNING *",
    [uuidv4(), teamId, data["name"], JSON.stringify(data["permissions"] ?? [])]
  );
  return r;
}

export async function updateTeamRole(roleId: string, data: Record<string, unknown>, userId: string) {
  const role = await queryOne<{ team_id: string }>("SELECT team_id FROM team_roles WHERE id = $1", [roleId]);
  if (!role) throw new AppError(404, "Role not found");
  await assertRole(role.team_id, userId, ["Team Leader"]);
  const [r] = await query(
    "UPDATE team_roles SET name=$1, permissions=$2 WHERE id=$3 RETURNING *",
    [data["name"], JSON.stringify(data["permissions"] ?? []), roleId]
  );
  return r;
}

export async function deleteTeamRole(roleId: string, userId: string) {
  const role = await queryOne<{ team_id: string }>("SELECT team_id FROM team_roles WHERE id = $1", [roleId]);
  if (!role) throw new AppError(404, "Role not found");
  await assertRole(role.team_id, userId, ["Team Leader"]);
  await query("DELETE FROM team_roles WHERE id = $1", [roleId]);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getMemberRole(teamId: string, userId: string): Promise<string | null> {
  const row = await queryOne<{ role: string }>(
    "SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2", [teamId, userId]
  );
  return row?.role ?? null;
}

async function isSystemAdmin(userId: string): Promise<boolean> {
  const row = await queryOne<{ role: string }>("SELECT role FROM users WHERE id = $1", [userId]);
  return row?.role === "admin";
}

async function assertRole(teamId: string, userId: string, allowed: string[]) {
  if (await isSystemAdmin(userId)) return;
  const role = await getMemberRole(teamId, userId);
  if (!role || !allowed.includes(role)) throw new AppError(403, "Forbidden");
}
