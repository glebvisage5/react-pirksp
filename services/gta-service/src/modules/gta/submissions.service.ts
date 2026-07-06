import crypto from "crypto";
import type { PoolClient } from "pg";
import { v4 as uuidv4 } from "uuid";
import { pool, query, queryOne } from "../../config/database";
import { AppError, encrypt, decrypt } from "@ecosystem/shared";
import { assertOrgOwner } from "./ownership";
import { logEvent, getOrgEventContext } from "./events.service";

interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  required: boolean;
}

interface SubmissionRow {
  id: string;
  section_id: string | null;
  org_id: string | null;
  answers: string;
  ip_address: string;
  status: "pending" | "approved" | "rejected";
  reviewed_via: string | null;
  reviewed_at: string | null;
  created_at: string;
}

function encryptAnswers(answers: Record<string, string>): string {
  return encrypt(JSON.stringify(answers));
}

function decryptAnswers(cipher: string): Record<string, string> {
  return JSON.parse(decrypt(cipher)) as Record<string, string>;
}

function toPublicSubmission(row: SubmissionRow) {
  return { ...row, answers: decryptAnswers(row.answers) };
}

// ─── Public: form config + submission ─────────────────────────────────────────

export async function getPublicForm(token: string) {
  const org = await queryOne<{ id: string; name: string; public_form_section_id: string | null }>(
    "SELECT id, name, public_form_section_id FROM gta_organizations WHERE public_form_token = $1",
    [token]
  );
  if (!org || !org.public_form_section_id) throw new AppError(404, "Form not found");

  const section = await queryOne<{ id: string; config: { fields?: FormField[] } }>(
    "SELECT id, config FROM gta_org_sections WHERE id = $1 AND type = 'form'",
    [org.public_form_section_id]
  );
  if (!section) throw new AppError(404, "Form not found");

  return {
    orgId: org.id,
    orgName: decrypt(org.name),
    sectionId: section.id,
    fields: section.config.fields || [],
  };
}

// Form-type sections across an org's tabs, for the owner to pick which one the public link points to.
export async function listFormSections(orgId: string, ownerId: string) {
  await assertOrgOwner(orgId, ownerId);
  const rows = await query<{ id: string; tab_id: string; tab_name: string; title: string | null }>(`
    SELECT sec.id, sec.tab_id, t.name AS tab_name, sec.title
    FROM gta_org_sections sec
    JOIN gta_org_tabs t ON t.id = sec.tab_id
    WHERE t.org_id = $1 AND sec.type = 'form'
    ORDER BY t.sort_order, sec.sort_order
  `, [orgId]);
  return rows.map((r) => ({ ...r, tab_name: decrypt(r.tab_name), title: r.title ? decrypt(r.title) : null }));
}

export async function createPublicSubmission(
  token: string,
  answers: Record<string, string>,
  ip: string,
  bypassRateLimit: boolean
) {
  const form = await getPublicForm(token);

  const missing = form.fields.filter((f) => f.required && !(answers[f.id] ?? "").trim());
  if (missing.length > 0) throw new AppError(422, "Fill in all required fields");

  if (!bypassRateLimit) {
    const recent = await queryOne(`
      SELECT 1 FROM gta_form_submissions
      WHERE org_id = $1 AND ip_address = $2
        AND delivered_discord AND delivered_telegram
        AND created_at > NOW() - INTERVAL '30 minutes'
      LIMIT 1
    `, [form.orgId, ip]);
    if (recent) throw new AppError(429, "Please wait before submitting again");
  }

  const id = uuidv4();
  await queryOne(`
    INSERT INTO gta_form_submissions (id, section_id, org_id, answers, ip_address)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `, [id, form.sectionId, form.orgId, encryptAnswers(answers), ip]);

  const orgCtx = await getOrgEventContext(form.orgId);
  if (orgCtx) {
    await logEvent({ ownerId: orgCtx.ownerId, type: "submission.created", serverId: orgCtx.serverId, orgId: form.orgId, summary: `Новая заявка в «${orgCtx.name}»` });
  }

  return { id, status: "pending" as const };
}

// ─── Owner: list / review ──────────────────────────────────────────────────────

export async function listSubmissions(orgId: string, ownerId: string) {
  await assertOrgOwner(orgId, ownerId);
  const rows = await query<SubmissionRow>(
    "SELECT * FROM gta_form_submissions WHERE org_id = $1 ORDER BY created_at DESC",
    [orgId]
  );
  return rows.map(toPublicSubmission);
}

export async function listArchivedSubmissions(orgId: string, ownerId: string) {
  await assertOrgOwner(orgId, ownerId);
  const rows = await query<SubmissionRow & { archived_at: string; org_name: string | null }>(
    "SELECT * FROM gta_form_submissions_archive WHERE org_id = $1 ORDER BY archived_at DESC",
    [orgId]
  );
  return rows.map((r) => ({
    ...toPublicSubmission(r),
    org_name: r.org_name ? decrypt(r.org_name) : null,
  }));
}

export async function reviewSubmission(id: string, status: "approved" | "rejected", ownerId: string) {
  const owned = await queryOne<{ id: string; org_id: string | null }>(`
    SELECT sub.id, sub.org_id
    FROM gta_form_submissions sub
    JOIN gta_organizations o ON o.id = sub.org_id
    JOIN gta_servers s ON s.id = o.server_id
    WHERE sub.id = $1 AND s.owner_id = $2
  `, [id, ownerId]);
  if (!owned) throw new AppError(404, "Submission not found");

  const row = await queryOne<SubmissionRow>(`
    UPDATE gta_form_submissions
    SET status = $1, reviewed_via = 'web', reviewed_at = NOW()
    WHERE id = $2
    RETURNING *
  `, [status, id]);

  if (owned.org_id) {
    const orgCtx = await getOrgEventContext(owned.org_id);
    if (orgCtx) {
      const verdict = status === "approved" ? "одобрена" : "отклонена";
      await logEvent({ ownerId, type: "submission.reviewed", serverId: orgCtx.serverId, orgId: owned.org_id, summary: `Заявка в «${orgCtx.name}» ${verdict}` });
    }
  }

  return toPublicSubmission(row!);
}

export async function createOrRegenerateToken(orgId: string, sectionId: string, ownerId: string) {
  await assertOrgOwner(orgId, ownerId);
  const section = await queryOne(`
    SELECT sec.id FROM gta_org_sections sec
    JOIN gta_org_tabs t ON t.id = sec.tab_id
    WHERE sec.id = $1 AND t.org_id = $2 AND sec.type = 'form'
  `, [sectionId, orgId]);
  if (!section) throw new AppError(404, "Form block not found");

  const token = crypto.randomBytes(24).toString("base64url");
  await query(
    "UPDATE gta_organizations SET public_form_token = $1, public_form_section_id = $2 WHERE id = $3",
    [token, sectionId, orgId]
  );
  return { token };
}

// ─── Archiving on delete ────────────────────────────────────────────────────────

async function copyToArchive(client: PoolClient, rows: SubmissionRow[], orgNameCipher: string | null) {
  for (const r of rows) {
    await client.query(`
      INSERT INTO gta_form_submissions_archive (id, org_id, org_name, answers, status, reviewed_via, reviewed_at, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [r.id, r.org_id, orgNameCipher, r.answers, r.status, r.reviewed_via, r.reviewed_at, r.created_at]);
  }
}

export async function archiveSubmissionsForOrg(orgId: string): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const org = await client.query("SELECT name FROM gta_organizations WHERE id = $1", [orgId]);
    const orgNameCipher = (org.rows[0]?.name as string | undefined) ?? null;
    const rows = await client.query<SubmissionRow>("SELECT * FROM gta_form_submissions WHERE org_id = $1", [orgId]);
    await copyToArchive(client, rows.rows, orgNameCipher);
    await client.query("DELETE FROM gta_form_submissions WHERE org_id = $1", [orgId]);
    await client.query("COMMIT");
    return rows.rows.length;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function archiveSubmissionsForSection(sectionId: string): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const org = await client.query(`
      SELECT o.name FROM gta_organizations o
      JOIN gta_org_tabs t ON t.org_id = o.id
      JOIN gta_org_sections sec ON sec.tab_id = t.id
      WHERE sec.id = $1
    `, [sectionId]);
    const orgNameCipher = (org.rows[0]?.name as string | undefined) ?? null;
    const rows = await client.query<SubmissionRow>("SELECT * FROM gta_form_submissions WHERE section_id = $1", [sectionId]);
    await copyToArchive(client, rows.rows, orgNameCipher);
    await client.query("DELETE FROM gta_form_submissions WHERE section_id = $1", [sectionId]);
    await client.query("COMMIT");
    return rows.rows.length;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function purgeExpiredArchive(): Promise<number> {
  const rows = await query("DELETE FROM gta_form_submissions_archive WHERE archived_at < NOW() - INTERVAL '30 days' RETURNING id");
  return rows.length;
}
