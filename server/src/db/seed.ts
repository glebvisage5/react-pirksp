import "../config/env";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../config/database";

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // ─── Users ────────────────────────────────────────────────────────────────
    const adminId = uuidv4();
    const user1Id = uuidv4();
    const user2Id = uuidv4();
    const user3Id = uuidv4();

    const adminHash = await bcrypt.hash("Admin123!", 12);
    const userHash = await bcrypt.hash("User123!", 12);

    const users = [
      { id: adminId,  email: "admin@example.com",  name: "Admin User",   role: "admin",  hash: adminHash },
      { id: user1Id,  email: "alice@example.com",   name: "Alice Johnson", role: "user",  hash: userHash },
      { id: user2Id,  email: "bob@example.com",     name: "Bob Smith",    role: "user",  hash: userHash },
      { id: user3Id,  email: "carol@example.com",   name: "Carol White",  role: "user",  hash: userHash },
    ];

    const idMap: Record<string, string> = {};
    for (const u of users) {
      await client.query(`
        INSERT INTO users (id, email, password_hash, name, role)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role
      `, [u.id, u.email, u.hash, u.name, u.role]);
      // read back actual id (may differ if row already existed)
      const row = await client.query<{ id: string }>(`SELECT id FROM users WHERE email = $1`, [u.email]);
      idMap[u.email] = row.rows[0]!.id;
    }
    const actualAdminId = idMap["admin@example.com"]!;
    const actualUser1Id = idMap["alice@example.com"]!;
    const actualUser2Id = idMap["bob@example.com"]!;
    const actualUser3Id = idMap["carol@example.com"]!;
    console.log("✓ Users seeded");

    // ─── Teams ────────────────────────────────────────────────────────────────
    const team1Id = uuidv4();
    const team2Id = uuidv4();

    const teams = [
      { id: team1Id, name: "Frontend Dev",   desc: "Frontend React development team", ownerId: actualUser1Id },
      { id: team2Id, name: "Backend Dev",    desc: "Node.js backend & API team",       ownerId: actualUser2Id },
    ];

    for (const t of teams) {
      await client.query(`
        INSERT INTO teams (id, name, description, owner_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [t.id, t.name, t.desc, t.ownerId]);
      // owner as Team Leader
      await client.query(`
        INSERT INTO team_members (team_id, user_id, role)
        VALUES ($1, $2, 'Team Leader')
        ON CONFLICT DO NOTHING
      `, [t.id, t.ownerId]);
    }

    // Add members to teams
    const members = [
      { teamId: team1Id, userId: actualUser2Id, role: "Moderator" },
      { teamId: team1Id, userId: actualUser3Id, role: "Member" },
      { teamId: team2Id, userId: actualUser1Id, role: "Member" },
      { teamId: team2Id, userId: actualUser3Id, role: "Viewer" },
    ];
    for (const m of members) {
      await client.query(`
        INSERT INTO team_members (team_id, user_id, role)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
      `, [m.teamId, m.userId, m.role]);
    }
    console.log("✓ Teams and members seeded");

    // ─── Projects ─────────────────────────────────────────────────────────────
    const proj1Id = uuidv4();
    const proj2Id = uuidv4();
    const proj3Id = uuidv4();

    const projects = [
      { id: proj1Id, teamId: team1Id, title: "Landing Page Redesign", desc: "Complete UI overhaul of the main landing page", status: "active",    start: "2025-01-15", end: "2025-03-31" },
      { id: proj2Id, teamId: team1Id, title: "Mobile App v2",         desc: "React Native mobile application second version",  status: "planned",  start: "2025-04-01", end: "2025-08-01" },
      { id: proj3Id, teamId: team2Id, title: "API Gateway",            desc: "Centralized API gateway with rate limiting",      status: "active",    start: "2025-02-01", end: "2025-06-30" },
    ];

    for (const p of projects) {
      await client.query(`
        INSERT INTO projects (id, team_id, title, description, status, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [p.id, p.teamId, p.title, p.desc, p.status, p.start, p.end]);
    }
    console.log("✓ Projects seeded");

    // ─── Team Tasks ───────────────────────────────────────────────────────────
    const tasks = [
      { id: uuidv4(), teamId: team1Id, projectId: proj1Id, title: "Design new header component",  priority: "high",   status: "in-progress", assigneeId: actualUser1Id, due: "2025-02-28" },
      { id: uuidv4(), teamId: team1Id, projectId: proj1Id, title: "Implement dark mode toggle",    priority: "medium", status: "todo",        assigneeId: actualUser2Id, due: "2025-03-10" },
      { id: uuidv4(), teamId: team1Id, projectId: proj1Id, title: "Write component tests",         priority: "low",    status: "todo",        assigneeId: null,           due: null },
      { id: uuidv4(), teamId: team1Id, projectId: proj2Id, title: "Create wireframes",             priority: "high",   status: "done",        assigneeId: actualUser1Id, due: "2025-03-20" },
      { id: uuidv4(), teamId: team2Id, projectId: proj3Id, title: "Setup rate limiting middleware", priority: "urgent", status: "in-progress", assigneeId: actualUser2Id, due: "2025-03-15" },
      { id: uuidv4(), teamId: team2Id, projectId: proj3Id, title: "Write API documentation",       priority: "medium", status: "todo",        assigneeId: actualUser3Id, due: "2025-04-01" },
    ];

    for (const t of tasks) {
      await client.query(`
        INSERT INTO team_tasks (id, team_id, project_id, title, status, priority, assignee_id, due_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT DO NOTHING
      `, [t.id, t.teamId, t.projectId, t.title, t.status, t.priority, t.assigneeId, t.due]);
    }
    console.log("✓ Team tasks seeded");

    // ─── Specifications ───────────────────────────────────────────────────────
    const spec1Id = uuidv4();
    const blocks = [
      { id: "1", type: "heading", content: "Project Overview" },
      { id: "2", type: "text",    content: "This specification describes the landing page redesign requirements." },
      { id: "3", type: "heading", content: "Requirements" },
      { id: "4", type: "list",    content: "Responsive design\nDark mode support\nAccessibility (WCAG 2.1)" },
    ];

    await client.query(`
      INSERT INTO specifications (id, team_id, project_id, title, blocks, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING
    `, [spec1Id, team1Id, proj1Id, "Landing Page Requirements v1.0", JSON.stringify(blocks), actualUser1Id]);
    console.log("✓ Specifications seeded");

    // ─── Courses (EduCRM) ─────────────────────────────────────────────────────
    const course1Id = uuidv4();
    const course2Id = uuidv4();

    await client.query(`
      INSERT INTO courses (id, title, description, instructor_id, difficulty, thumbnail_emoji)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING
    `, [course1Id, "Introduction to React", "Learn React fundamentals from scratch", actualAdminId, "beginner", "⚛️"]);

    await client.query(`
      INSERT INTO courses (id, title, description, instructor_id, difficulty, thumbnail_emoji)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING
    `, [course2Id, "Node.js Backend Development", "Build REST APIs with Express and PostgreSQL", actualAdminId, "intermediate", "🟢"]);

    // Enroll users in courses
    for (const userId of [actualUser1Id, actualUser2Id, actualUser3Id]) {
      await client.query(`
        INSERT INTO user_course_progress (user_id, course_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
      `, [userId, course1Id]);
    }
    console.log("✓ Courses seeded");

    await client.query("COMMIT");

    console.log("\n✅ Seed complete!");
    console.log("\nTest accounts:");
    console.log("  admin@example.com  / Admin123!  (admin)");
    console.log("  alice@example.com  / User123!   (user — Team Leader in Frontend Dev)");
    console.log("  bob@example.com    / User123!   (user — Moderator in Frontend Dev)");
    console.log("  carol@example.com  / User123!   (user — Member in Frontend Dev)");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
