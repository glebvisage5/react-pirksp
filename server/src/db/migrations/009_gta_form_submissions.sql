-- GTA RolePlay: public application forms (Phase 5.4)

ALTER TABLE gta_organizations ADD COLUMN IF NOT EXISTS public_form_token TEXT UNIQUE;

CREATE TABLE IF NOT EXISTS gta_form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES gta_org_sections(id) ON DELETE SET NULL,
  org_id UUID REFERENCES gta_organizations(id) ON DELETE SET NULL,
  answers TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_via TEXT,
  reviewed_at TIMESTAMPTZ,
  delivered_discord BOOLEAN NOT NULL DEFAULT false,
  delivered_telegram BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gta_submissions_org ON gta_form_submissions(org_id);
CREATE INDEX IF NOT EXISTS idx_gta_submissions_status ON gta_form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_gta_submissions_ip_created ON gta_form_submissions(org_id, ip_address, created_at);

CREATE TABLE IF NOT EXISTS gta_form_submissions_archive (
  id UUID PRIMARY KEY,
  org_id UUID,
  org_name TEXT,
  answers TEXT NOT NULL,
  status TEXT NOT NULL,
  reviewed_via TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gta_submissions_archive_purge ON gta_form_submissions_archive(archived_at);
