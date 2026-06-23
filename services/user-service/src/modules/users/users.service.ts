import { query, queryOne } from "../../config/database";
import { AppError, encrypt, decrypt, decryptFields } from "@ecosystem/shared";

const ENCRYPTED_FIELDS = ["name", "email", "bio", "avatar_url"];

export interface SocialLink {
  platform: string;
  url: string;
}

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  social_links: string | null;
  role: string;
  created_at: string;
}

function decryptUser(row: ProfileUser): Omit<ProfileUser, "social_links"> & { social_links: SocialLink[] } {
  const decrypted = decryptFields(row, ENCRYPTED_FIELDS);
  let links: SocialLink[] = [];
  if (decrypted.social_links) {
    try {
      const raw = decrypt(decrypted.social_links);
      links = JSON.parse(raw);
    } catch {
      try { links = JSON.parse(decrypted.social_links); } catch { /* empty */ }
    }
  }
  return { ...decrypted, social_links: links };
}

export async function getProfile(userId: string) {
  const user = await queryOne<ProfileUser>(
    `SELECT id, name, email, avatar_url, bio, social_links, role, created_at FROM users WHERE id = $1`,
    [userId]
  );
  if (!user) throw new AppError(404, "User not found");

  const projects = await query(`
    SELECT st.id, st.name, st.description, st.created_at, g.name AS group_name
    FROM study_team_members stm
    JOIN study_teams st ON st.id = stm.team_id
    JOIN groups g ON g.id = st.group_id
    WHERE stm.user_id = $1
    ORDER BY st.created_at DESC
  `, [userId]);

  return { ...decryptUser(user), projects };
}

export async function updateProfile(
  userId: string,
  data: { name?: string; bio?: string; social_links?: SocialLink[] }
) {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(encrypt(data.name)); }
  if (data.bio !== undefined) { fields.push(`bio = $${idx++}`); values.push(data.bio ? encrypt(data.bio) : null); }
  if (data.social_links !== undefined) {
    fields.push(`social_links = $${idx++}`);
    values.push(encrypt(JSON.stringify(data.social_links)));
  }

  if (!fields.length) throw new AppError(400, "Nothing to update");

  fields.push(`updated_at = NOW()`);
  values.push(userId);
  await query(`UPDATE users SET ${fields.join(", ")} WHERE id = $${idx}`, values);

  return getProfile(userId);
}
