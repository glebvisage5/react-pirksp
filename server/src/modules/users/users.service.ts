import { query, queryOne } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

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
  social_links: SocialLink[];
  role: string;
  created_at: string;
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

  return { ...user, projects };
}

export async function updateProfile(
  userId: string,
  data: { name?: string; bio?: string; social_links?: SocialLink[] }
) {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name); }
  if (data.bio !== undefined) { fields.push(`bio = $${idx++}`); values.push(data.bio); }
  if (data.social_links !== undefined) { fields.push(`social_links = $${idx++}`); values.push(JSON.stringify(data.social_links)); }

  if (!fields.length) throw new AppError(400, "Nothing to update");

  fields.push(`updated_at = NOW()`);
  values.push(userId);
  await query(`UPDATE users SET ${fields.join(", ")} WHERE id = $${idx}`, values);

  return getProfile(userId);
}
