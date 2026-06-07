import { v4 as uuidv4 } from "uuid";
import { query, queryOne } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

export async function listUserTasks(userId: string, limit: number, statusFilter?: string) {
  const params: unknown[] = [userId, limit];
  let where = "ut.user_id = $1";
  if (statusFilter) {
    params.push(statusFilter);
    where += ` AND ut.status = $${params.length}`;
  }
  return query(`
    SELECT
      t.*,
      ut.status,
      ut.progress,
      ut.assigned_at,
      c.title AS course_title
    FROM user_tasks ut
    JOIN tasks t ON t.id = ut.task_id
    LEFT JOIN courses c ON c.id = t.course_id
    WHERE ${where}
    ORDER BY t.due_date ASC NULLS LAST, t.created_at DESC
    LIMIT $2
  `, params);
}

export async function getUserStats(userId: string) {
  const [stats] = await query(`
    SELECT
      COUNT(*)::int AS tasks_total,
      COUNT(CASE WHEN ut.status = 'done' THEN 1 END)::int AS tasks_completed,
      COUNT(CASE WHEN ut.status = 'in-progress' THEN 1 END)::int AS tasks_in_progress,
      (SELECT COUNT(*)::int FROM user_course_progress WHERE user_id = $1) AS courses_enrolled,
      COALESCE(
        (SELECT ROUND(AVG(
          100.0 * (
            SELECT COUNT(*) FROM user_lesson_progress ulp
            WHERE ulp.user_id = $1 AND ulp.completed = true
              AND ulp.lesson_id IN (SELECT id FROM lessons WHERE course_id = ucp2.course_id)
          )::numeric / NULLIF(
            (SELECT COUNT(*) FROM lessons WHERE course_id = ucp2.course_id), 0
          )
        ))::int
        FROM user_course_progress ucp2 WHERE ucp2.user_id = $1),
        0
      ) AS overall_progress
    FROM user_tasks ut
    WHERE ut.user_id = $1
  `, [userId]);
  return stats ?? { tasks_total: 0, tasks_completed: 0, tasks_in_progress: 0, courses_enrolled: 0, overall_progress: 0 };
}

export async function getTask(taskId: string, userId: string) {
  const task = await queryOne(`
    SELECT t.*, ut.status, ut.progress, c.title AS course_title
    FROM tasks t
    LEFT JOIN user_tasks ut ON ut.task_id = t.id AND ut.user_id = $2
    LEFT JOIN courses c ON c.id = t.course_id
    WHERE t.id = $1
  `, [taskId, userId]);
  if (!task) throw new AppError(404, "Task not found");
  return task;
}

export async function createTask(data: Record<string, unknown>, createdBy: string) {
  const [task] = await query(`
    INSERT INTO tasks (id, title, description, course_id, due_date, priority, created_by)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `, [uuidv4(), data["title"], data["description"] ?? null, data["course_id"] ?? null, data["due_date"] ?? null, data["priority"], createdBy]);
  return task;
}

export async function updateTask(taskId: string, data: Record<string, unknown>, userId: string, isAdmin: boolean) {
  if (isAdmin) {
    const allowed = ["title", "description", "course_id", "due_date", "priority"];
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${idx++}`);
        values.push(data[key]);
      }
    }
    if (fields.length === 0) throw new AppError(400, "Nothing to update");
    values.push(taskId);
    const [task] = await query(`UPDATE tasks SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`, values);
    if (!task) throw new AppError(404, "Task not found");
    return task;
  }
  // user may only update status/progress on their assignment
  const update: Record<string, unknown> = {};
  if (data["status"]) update["status"] = data["status"];
  if (data["progress"] !== undefined) update["progress"] = data["progress"];
  if (Object.keys(update).length === 0) throw new AppError(403, "Forbidden");
  await updateUserTaskStatus(taskId, userId, update);
  return getTask(taskId, userId);
}

export async function deleteTask(taskId: string) {
  const result = await query("DELETE FROM tasks WHERE id = $1 RETURNING id", [taskId]);
  if (result.length === 0) throw new AppError(404, "Task not found");
}

export async function assignTask(taskId: string, userId: string) {
  const task = await queryOne("SELECT id FROM tasks WHERE id = $1", [taskId]);
  if (!task) throw new AppError(404, "Task not found");
  await query(`
    INSERT INTO user_tasks (user_id, task_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `, [userId, taskId]);
}

export async function updateUserTaskStatus(taskId: string, userId: string, data: Record<string, unknown>) {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  if (data["status"]) { fields.push(`status = $${idx++}`); values.push(data["status"]); }
  if (data["progress"] !== undefined) { fields.push(`progress = $${idx++}`); values.push(data["progress"]); }
  if (fields.length === 0) return;
  values.push(userId, taskId);
  await query(
    `UPDATE user_tasks SET ${fields.join(", ")} WHERE user_id = $${idx++} AND task_id = $${idx} `,
    values
  );
}
