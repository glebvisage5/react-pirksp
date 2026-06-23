import { v4 as uuidv4 } from "uuid";
import { query, queryOne } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";
import { encrypt, decryptFields } from "../../utils/crypto";

const COURSE_FIELDS = ["title", "description"];
const LESSON_FIELDS = ["title", "duration"];

export async function listCourses(userId: string) {
  const rows = await query(`
    SELECT
      c.*,
      u.name AS instructor_name,
      COALESCE(ucp.enrolled_at IS NOT NULL, false) AS enrolled,
      COALESCE(
        ROUND(
          100.0 * COUNT(CASE WHEN ulp.completed THEN 1 END)::numeric
          / NULLIF(COUNT(l.id), 0)
        )::int,
        0
      ) AS progress,
      COUNT(l.id)::int AS total_lessons,
      COUNT(CASE WHEN ulp.completed THEN 1 END)::int AS completed_lessons
    FROM courses c
    LEFT JOIN users u ON u.id = c.instructor_id
    LEFT JOIN lessons l ON l.course_id = c.id
    LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = l.id AND ulp.user_id = $1
    LEFT JOIN user_course_progress ucp ON ucp.course_id = c.id AND ucp.user_id = $1
    GROUP BY c.id, u.name, ucp.enrolled_at
    ORDER BY c.created_at DESC
  `, [userId]);
  return rows.map(r => decryptFields(r, [...COURSE_FIELDS, "instructor_name"]));
}

export async function enrolledCourses(userId: string, limit: number) {
  const rows = await query(`
    SELECT
      c.*,
      u.name AS instructor_name,
      true AS enrolled,
      COALESCE(
        ROUND(
          100.0 * COUNT(CASE WHEN ulp.completed THEN 1 END)::numeric
          / NULLIF(COUNT(l.id), 0)
        )::int,
        0
      ) AS progress,
      COUNT(l.id)::int AS total_lessons,
      COUNT(CASE WHEN ulp.completed THEN 1 END)::int AS completed_lessons
    FROM user_course_progress ucp
    JOIN courses c ON c.id = ucp.course_id
    LEFT JOIN users u ON u.id = c.instructor_id
    LEFT JOIN lessons l ON l.course_id = c.id
    LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = l.id AND ulp.user_id = $1
    WHERE ucp.user_id = $1
    GROUP BY c.id, u.name, ucp.enrolled_at
    ORDER BY ucp.enrolled_at DESC
    LIMIT $2
  `, [userId, limit]);
  return rows.map(r => decryptFields(r, [...COURSE_FIELDS, "instructor_name"]));
}

export async function getCourse(courseId: string, userId: string) {
  const course = await queryOne(`
    SELECT c.*, u.name AS instructor_name,
      COALESCE(ucp.enrolled_at IS NOT NULL, false) AS enrolled
    FROM courses c
    LEFT JOIN users u ON u.id = c.instructor_id
    LEFT JOIN user_course_progress ucp ON ucp.course_id = c.id AND ucp.user_id = $2
    WHERE c.id = $1
  `, [courseId, userId]);
  if (!course) throw new AppError(404, "Course not found");
  return decryptFields(course, [...COURSE_FIELDS, "instructor_name"]);
}

export async function createCourse(data: Record<string, unknown>, instructorId: string) {
  const encTitle = data["title"] != null ? encrypt(data["title"] as string) : null;
  const encDesc = data["description"] != null ? encrypt(data["description"] as string) : null;
  const [course] = await query(`
    INSERT INTO courses (id, title, description, instructor_id, difficulty, is_ai_powered, thumbnail_emoji)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `, [uuidv4(), encTitle, encDesc, instructorId, data["difficulty"], data["is_ai_powered"], data["thumbnail_emoji"]]);
  return decryptFields(course, COURSE_FIELDS);
}

export async function updateCourse(courseId: string, data: Record<string, unknown>) {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      let actual = val;
      if ((key === "title" || key === "description") && actual != null) {
        actual = encrypt(actual as string);
      }
      fields.push(`${key} = $${idx++}`);
      values.push(actual);
    }
  }
  if (fields.length === 0) throw new AppError(400, "Nothing to update");
  values.push(courseId);
  const [course] = await query(
    `UPDATE courses SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    values
  );
  if (!course) throw new AppError(404, "Course not found");
  return decryptFields(course, COURSE_FIELDS);
}

export async function deleteCourse(courseId: string) {
  const result = await query("DELETE FROM courses WHERE id = $1 RETURNING id", [courseId]);
  if (result.length === 0) throw new AppError(404, "Course not found");
}

export async function enrollCourse(courseId: string, userId: string) {
  const course = await queryOne("SELECT id FROM courses WHERE id = $1", [courseId]);
  if (!course) throw new AppError(404, "Course not found");
  await query(`
    INSERT INTO user_course_progress (user_id, course_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `, [userId, courseId]);
}

export async function getLessons(courseId: string, userId: string) {
  const rows = await query(`
    SELECT l.*,
      COALESCE(ulp.completed, false) AS completed
    FROM lessons l
    LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = l.id AND ulp.user_id = $2
    WHERE l.course_id = $1
    ORDER BY l.order_index ASC
  `, [courseId, userId]);
  return rows.map(r => decryptFields(r, LESSON_FIELDS));
}

export async function createLesson(courseId: string, data: Record<string, unknown>) {
  const encTitle = data["title"] != null ? encrypt(data["title"] as string) : null;
  const encDuration = data["duration"] != null ? encrypt(data["duration"] as string) : null;
  const [lesson] = await query(`
    INSERT INTO lessons (id, course_id, title, type, duration, order_index, content, is_locked)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
  `, [
    uuidv4(), courseId,
    encTitle, data["type"] ?? "video",
    encDuration,
    data["order_index"] ?? 0,
    JSON.stringify(data["content"] ?? {}),
    data["is_locked"] ?? false,
  ]);
  return decryptFields(lesson, LESSON_FIELDS);
}

export async function updateLesson(lessonId: string, data: Record<string, unknown>) {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      let actual = key === "content" ? JSON.stringify(val) : val;
      if ((key === "title" || key === "duration") && actual != null) {
        actual = encrypt(actual as string);
      }
      fields.push(`${key} = $${idx++}`);
      values.push(actual);
    }
  }
  if (fields.length === 0) throw new AppError(400, "Nothing to update");
  values.push(lessonId);
  const [lesson] = await query(
    `UPDATE lessons SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    values
  );
  if (!lesson) throw new AppError(404, "Lesson not found");
  return decryptFields(lesson, LESSON_FIELDS);
}

export async function deleteLesson(lessonId: string) {
  const result = await query("DELETE FROM lessons WHERE id = $1 RETURNING id", [lessonId]);
  if (result.length === 0) throw new AppError(404, "Lesson not found");
}

export async function completeLesson(lessonId: string, userId: string) {
  await query(`
    INSERT INTO user_lesson_progress (user_id, lesson_id, completed, completed_at)
    VALUES ($1, $2, true, NOW())
    ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed = true, completed_at = NOW()
  `, [userId, lessonId]);
}
