-- Allow storing uploaded image URLs (not just emoji) as server/org icons
ALTER TABLE gta_servers ALTER COLUMN icon TYPE TEXT;
ALTER TABLE gta_organizations ALTER COLUMN icon TYPE TEXT;
