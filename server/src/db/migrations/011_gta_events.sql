-- GTA RolePlay: change events feed (Phase 5.3)
--
-- server_id/org_id use ON DELETE SET NULL (not CASCADE, unlike the other gta_*
-- child tables): a "server deleted"/"org deleted" event is logged right before the
-- row itself is deleted, so CASCADE would erase that very event in the same request.
-- owner_id is denormalized (captured at insert time) so the feed can still be
-- filtered by owner after server_id/org_id go NULL.
CREATE TABLE IF NOT EXISTS gta_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  server_id UUID REFERENCES gta_servers(id) ON DELETE SET NULL,
  org_id UUID REFERENCES gta_organizations(id) ON DELETE SET NULL,
  summary TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  delivered_discord BOOLEAN NOT NULL DEFAULT false,
  delivered_telegram BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gta_events_owner_created ON gta_events(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gta_events_org ON gta_events(org_id);
CREATE INDEX IF NOT EXISTS idx_gta_events_server ON gta_events(server_id);
