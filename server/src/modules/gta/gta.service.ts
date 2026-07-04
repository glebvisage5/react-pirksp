import { v4 as uuidv4 } from "uuid";
import { query, queryOne } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";
import { encrypt, decryptFields } from "../../utils/crypto";

const SERVER_FIELDS = ["name", "project_name"];
const ORG_FIELDS = ["name", "description"];
const TAB_FIELDS = ["name"];
const SECTION_FIELDS = ["title"];

// ─── Servers ──────────────────────────────────────────────────────────────────

export async function listServers(ownerId: string) {
  const rows = await query(`
    SELECT s.*,
      (SELECT COUNT(*)::int FROM gta_organizations WHERE server_id = s.id) AS org_count
    FROM gta_servers s
    WHERE s.owner_id = $1
    ORDER BY s.created_at DESC
  `, [ownerId]);
  return rows.map(r => decryptFields(r, SERVER_FIELDS));
}

export async function getServer(id: string, ownerId: string) {
  const row = await queryOne(`
    SELECT s.*,
      (SELECT COUNT(*)::int FROM gta_organizations WHERE server_id = s.id) AS org_count
    FROM gta_servers s
    WHERE s.id = $1 AND s.owner_id = $2
  `, [id, ownerId]);
  if (!row) throw new AppError(404, "Server not found");
  return decryptFields(row, SERVER_FIELDS);
}

export async function createServer(data: { name: string; project_name?: string; icon?: string }, ownerId: string) {
  const id = uuidv4();
  const row = await queryOne(`
    INSERT INTO gta_servers (id, owner_id, name, project_name, icon)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [id, ownerId, encrypt(data.name), data.project_name ? encrypt(data.project_name) : null, data.icon || "🎮"]);
  return decryptFields(row, SERVER_FIELDS);
}

export async function updateServer(id: string, data: { name?: string; project_name?: string; icon?: string }, ownerId: string) {
  const existing = await queryOne("SELECT id FROM gta_servers WHERE id = $1 AND owner_id = $2", [id, ownerId]);
  if (!existing) throw new AppError(404, "Server not found");

  const sets: string[] = [];
  const vals: unknown[] = [];
  let idx = 1;

  if (data.name !== undefined) { sets.push(`name = $${idx++}`); vals.push(encrypt(data.name)); }
  if (data.project_name !== undefined) { sets.push(`project_name = $${idx++}`); vals.push(data.project_name ? encrypt(data.project_name) : null); }
  if (data.icon !== undefined) { sets.push(`icon = $${idx++}`); vals.push(data.icon); }
  sets.push(`updated_at = NOW()`);

  vals.push(id);
  const row = await queryOne(`UPDATE gta_servers SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`, vals);
  return decryptFields(row, SERVER_FIELDS);
}

export async function deleteServer(id: string, ownerId: string) {
  const res = await query("DELETE FROM gta_servers WHERE id = $1 AND owner_id = $2", [id, ownerId]);
  if (res.length === 0 && !(await queryOne("SELECT 1", []))) {
    // delete returns nothing, just check it existed
  }
  return { ok: true };
}

// ─── Organizations ────────────────────────────────────────────────────────────

export async function listOrgs(serverId: string, ownerId: string) {
  await assertServerOwner(serverId, ownerId);
  const rows = await query(`
    SELECT o.*,
      (SELECT COUNT(*)::int FROM gta_org_tabs WHERE org_id = o.id) AS tab_count
    FROM gta_organizations o
    WHERE o.server_id = $1
    ORDER BY o.sort_order, o.created_at
  `, [serverId]);
  return rows.map(r => decryptFields(r, ORG_FIELDS));
}

export async function getOrg(orgId: string, ownerId: string) {
  const row = await queryOne(`
    SELECT o.*, s.owner_id
    FROM gta_organizations o
    JOIN gta_servers s ON s.id = o.server_id
    WHERE o.id = $1 AND s.owner_id = $2
  `, [orgId, ownerId]);
  if (!row) throw new AppError(404, "Organization not found");
  return decryptFields(row, ORG_FIELDS);
}

export async function createOrg(serverId: string, data: { name: string; description?: string; icon?: string }, ownerId: string) {
  await assertServerOwner(serverId, ownerId);
  const maxOrder = await queryOne<{ max: number }>("SELECT COALESCE(MAX(sort_order), -1) AS max FROM gta_organizations WHERE server_id = $1", [serverId]);
  const id = uuidv4();
  const row = await queryOne(`
    INSERT INTO gta_organizations (id, server_id, name, description, icon, sort_order)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [id, serverId, encrypt(data.name), data.description ? encrypt(data.description) : null, data.icon || "🏢", (maxOrder?.max ?? -1) + 1]);
  return decryptFields(row, ORG_FIELDS);
}

export async function updateOrg(orgId: string, data: { name?: string; description?: string; icon?: string }, ownerId: string) {
  await assertOrgOwner(orgId, ownerId);
  const sets: string[] = [];
  const vals: unknown[] = [];
  let idx = 1;

  if (data.name !== undefined) { sets.push(`name = $${idx++}`); vals.push(encrypt(data.name)); }
  if (data.description !== undefined) { sets.push(`description = $${idx++}`); vals.push(data.description ? encrypt(data.description) : null); }
  if (data.icon !== undefined) { sets.push(`icon = $${idx++}`); vals.push(data.icon); }

  if (sets.length === 0) throw new AppError(422, "Nothing to update");
  vals.push(orgId);
  const row = await queryOne(`UPDATE gta_organizations SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`, vals);
  return decryptFields(row, ORG_FIELDS);
}

export async function deleteOrg(orgId: string, ownerId: string) {
  await assertOrgOwner(orgId, ownerId);
  await query("DELETE FROM gta_organizations WHERE id = $1", [orgId]);
  return { ok: true };
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export async function listTabs(orgId: string, ownerId: string) {
  await assertOrgOwner(orgId, ownerId);
  const rows = await query("SELECT * FROM gta_org_tabs WHERE org_id = $1 ORDER BY sort_order", [orgId]);
  return rows.map(r => decryptFields(r, TAB_FIELDS));
}

export async function createTab(orgId: string, data: { name: string }, ownerId: string) {
  await assertOrgOwner(orgId, ownerId);
  const count = await queryOne<{ cnt: number }>("SELECT COUNT(*)::int AS cnt FROM gta_org_tabs WHERE org_id = $1", [orgId]);
  if ((count?.cnt ?? 0) >= 3) throw new AppError(422, "Maximum 3 custom tabs per organization");

  const id = uuidv4();
  const row = await queryOne(`
    INSERT INTO gta_org_tabs (id, org_id, name, sort_order)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [id, orgId, encrypt(data.name), count?.cnt ?? 0]);
  return decryptFields(row, TAB_FIELDS);
}

export async function updateTab(tabId: string, data: { name?: string; sort_order?: number }, ownerId: string) {
  await assertTabOwner(tabId, ownerId);
  const sets: string[] = [];
  const vals: unknown[] = [];
  let idx = 1;

  if (data.name !== undefined) { sets.push(`name = $${idx++}`); vals.push(encrypt(data.name)); }
  if (data.sort_order !== undefined) { sets.push(`sort_order = $${idx++}`); vals.push(data.sort_order); }

  if (sets.length === 0) throw new AppError(422, "Nothing to update");
  vals.push(tabId);
  const row = await queryOne(`UPDATE gta_org_tabs SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`, vals);
  return decryptFields(row, TAB_FIELDS);
}

export async function deleteTab(tabId: string, ownerId: string) {
  await assertTabOwner(tabId, ownerId);
  await query("DELETE FROM gta_org_tabs WHERE id = $1", [tabId]);
  return { ok: true };
}

// ─── Sections ─────────────────────────────────────────────────────────────────

export async function listSections(tabId: string, ownerId: string) {
  await assertTabOwner(tabId, ownerId);
  const rows = await query("SELECT * FROM gta_org_sections WHERE tab_id = $1 ORDER BY sort_order", [tabId]);
  return rows.map(r => decryptFields(r, SECTION_FIELDS));
}

export async function createSection(tabId: string, data: { type: string; title?: string; config?: Record<string, unknown> }, ownerId: string) {
  await assertTabOwner(tabId, ownerId);
  const maxOrder = await queryOne<{ max: number }>("SELECT COALESCE(MAX(sort_order), -1) AS max FROM gta_org_sections WHERE tab_id = $1", [tabId]);
  const id = uuidv4();
  const row = await queryOne(`
    INSERT INTO gta_org_sections (id, tab_id, type, title, config, sort_order)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [id, tabId, data.type, data.title ? encrypt(data.title) : null, JSON.stringify(data.config || {}), (maxOrder?.max ?? -1) + 1]);
  return decryptFields(row, SECTION_FIELDS);
}

export async function updateSection(sectionId: string, data: { title?: string; config?: Record<string, unknown>; sort_order?: number }, ownerId: string) {
  await assertSectionOwner(sectionId, ownerId);
  const sets: string[] = [];
  const vals: unknown[] = [];
  let idx = 1;

  if (data.title !== undefined) { sets.push(`title = $${idx++}`); vals.push(data.title ? encrypt(data.title) : null); }
  if (data.config !== undefined) { sets.push(`config = $${idx++}`); vals.push(JSON.stringify(data.config)); }
  if (data.sort_order !== undefined) { sets.push(`sort_order = $${idx++}`); vals.push(data.sort_order); }

  if (sets.length === 0) throw new AppError(422, "Nothing to update");
  vals.push(sectionId);
  const row = await queryOne(`UPDATE gta_org_sections SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`, vals);
  return decryptFields(row, SECTION_FIELDS);
}

export async function deleteSection(sectionId: string, ownerId: string) {
  await assertSectionOwner(sectionId, ownerId);
  await query("DELETE FROM gta_org_sections WHERE id = $1", [sectionId]);
  return { ok: true };
}

export async function reorderSections(tabId: string, sectionIds: string[], ownerId: string) {
  await assertTabOwner(tabId, ownerId);
  for (let i = 0; i < sectionIds.length; i++) {
    await query("UPDATE gta_org_sections SET sort_order = $1 WHERE id = $2 AND tab_id = $3", [i, sectionIds[i], tabId]);
  }
  return listSections(tabId, ownerId);
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export async function getDashboardStats(ownerId: string) {
  const stats = await queryOne<{ servers: number; orgs: number; tabs: number }>(`
    SELECT
      (SELECT COUNT(*)::int FROM gta_servers WHERE owner_id = $1) AS servers,
      (SELECT COUNT(*)::int FROM gta_organizations o JOIN gta_servers s ON s.id = o.server_id WHERE s.owner_id = $1) AS orgs,
      (SELECT COUNT(*)::int FROM gta_org_tabs t JOIN gta_organizations o ON o.id = t.org_id JOIN gta_servers s ON s.id = o.server_id WHERE s.owner_id = $1) AS tabs
  `, [ownerId]);

  const recentServers = await query(`
    SELECT s.id, s.name, s.icon, s.created_at,
      (SELECT COUNT(*)::int FROM gta_organizations WHERE server_id = s.id) AS org_count
    FROM gta_servers s
    WHERE s.owner_id = $1
    ORDER BY s.created_at DESC LIMIT 5
  `, [ownerId]);

  const recentOrgs = await query(`
    SELECT o.id, o.name, o.icon, o.created_at, o.server_id, s.name AS server_name
    FROM gta_organizations o
    JOIN gta_servers s ON s.id = o.server_id
    WHERE s.owner_id = $1
    ORDER BY o.created_at DESC LIMIT 5
  `, [ownerId]);

  return {
    servers: stats?.servers ?? 0,
    orgs: stats?.orgs ?? 0,
    tabs: stats?.tabs ?? 0,
    recentServers: recentServers.map(r => decryptFields(r, SERVER_FIELDS)),
    recentOrgs: recentOrgs.map(r => decryptFields(r, [...ORG_FIELDS, "server_name"])),
  };
}

// ─── Ownership helpers ────────────────────────────────────────────────────────

async function assertServerOwner(serverId: string, ownerId: string) {
  const row = await queryOne("SELECT id FROM gta_servers WHERE id = $1 AND owner_id = $2", [serverId, ownerId]);
  if (!row) throw new AppError(404, "Server not found");
}

async function assertOrgOwner(orgId: string, ownerId: string) {
  const row = await queryOne(`
    SELECT o.id FROM gta_organizations o
    JOIN gta_servers s ON s.id = o.server_id
    WHERE o.id = $1 AND s.owner_id = $2
  `, [orgId, ownerId]);
  if (!row) throw new AppError(404, "Organization not found");
}

async function assertTabOwner(tabId: string, ownerId: string) {
  const row = await queryOne(`
    SELECT t.id FROM gta_org_tabs t
    JOIN gta_organizations o ON o.id = t.org_id
    JOIN gta_servers s ON s.id = o.server_id
    WHERE t.id = $1 AND s.owner_id = $2
  `, [tabId, ownerId]);
  if (!row) throw new AppError(404, "Tab not found");
}

async function assertSectionOwner(sectionId: string, ownerId: string) {
  const row = await queryOne(`
    SELECT sec.id FROM gta_org_sections sec
    JOIN gta_org_tabs t ON t.id = sec.tab_id
    JOIN gta_organizations o ON o.id = t.org_id
    JOIN gta_servers s ON s.id = o.server_id
    WHERE sec.id = $1 AND s.owner_id = $2
  `, [sectionId, ownerId]);
  if (!row) throw new AppError(404, "Section not found");
}
