import { v4 as uuidv4 } from "uuid";
import { query, queryOne } from "../../config/database";
import { decrypt } from "@ecosystem/shared";

export async function logEvent(opts: {
  ownerId: string;
  type: string;
  serverId?: string | null;
  orgId?: string | null;
  summary: string;
  payload?: object;
}): Promise<void> {
  const id = uuidv4();
  await query(`
    INSERT INTO gta_events (id, owner_id, type, server_id, org_id, summary, payload)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `, [id, opts.ownerId, opts.type, opts.serverId ?? null, opts.orgId ?? null, opts.summary, JSON.stringify(opts.payload ?? {})]);
}

export async function listEvents(ownerId: string, filters: { serverId?: string; orgId?: string; limit?: number }) {
  const conditions: string[] = ["owner_id = $1"];
  const vals: unknown[] = [ownerId];
  let idx = 2;

  if (filters.serverId) { conditions.push(`server_id = $${idx++}`); vals.push(filters.serverId); }
  if (filters.orgId) { conditions.push(`org_id = $${idx++}`); vals.push(filters.orgId); }

  const limit = Math.min(Math.max(filters.limit ?? 30, 1), 100);
  vals.push(limit);

  return query(`
    SELECT id, type, server_id, org_id, summary, created_at
    FROM gta_events
    WHERE ${conditions.join(" AND ")}
    ORDER BY created_at DESC
    LIMIT $${idx}
  `, vals);
}

// Shared by gta.service.ts (tab/section events) and submissions.service.ts (submission events),
// both of which only hold an org_id and need the org's decrypted name + owning server/owner for the summary/event row.
// ownerId is included because submissions.service's public (unauthenticated) endpoint has no
// req.user to source it from otherwise.
export async function getOrgEventContext(orgId: string): Promise<{ name: string; serverId: string; ownerId: string } | null> {
  const row = await queryOne<{ name: string; server_id: string; owner_id: string }>(`
    SELECT o.name, o.server_id, s.owner_id
    FROM gta_organizations o
    JOIN gta_servers s ON s.id = o.server_id
    WHERE o.id = $1
  `, [orgId]);
  if (!row) return null;
  return { name: decrypt(row.name), serverId: row.server_id, ownerId: row.owner_id };
}
