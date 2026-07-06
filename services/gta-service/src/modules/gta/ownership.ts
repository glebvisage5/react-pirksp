import { queryOne } from "../../config/database";
import { AppError } from "@ecosystem/shared";

export async function assertOrgOwner(orgId: string, ownerId: string) {
  const row = await queryOne(`
    SELECT o.id FROM gta_organizations o
    JOIN gta_servers s ON s.id = o.server_id
    WHERE o.id = $1 AND s.owner_id = $2
  `, [orgId, ownerId]);
  if (!row) throw new AppError(404, "Organization not found");
}
