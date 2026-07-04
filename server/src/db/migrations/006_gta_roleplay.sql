-- GTA RolePlay tables

CREATE TABLE IF NOT EXISTS gta_servers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  project_name TEXT,
  icon VARCHAR(50) NOT NULL DEFAULT '🎮',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gta_organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES gta_servers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon VARCHAR(50) NOT NULL DEFAULT '🏢',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gta_org_tabs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES gta_organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gta_org_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tab_id UUID NOT NULL REFERENCES gta_org_tabs(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL CHECK (type IN ('members', 'text', 'form', 'document')),
  title TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gta_servers_owner ON gta_servers(owner_id);
CREATE INDEX idx_gta_orgs_server ON gta_organizations(server_id);
CREATE INDEX idx_gta_tabs_org ON gta_org_tabs(org_id);
CREATE INDEX idx_gta_sections_tab ON gta_org_sections(tab_id);
