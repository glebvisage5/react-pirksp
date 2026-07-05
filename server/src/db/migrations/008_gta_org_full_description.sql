-- Separate short (list/preview) description from a longer, detailed one shown in Overview
ALTER TABLE gta_organizations ADD COLUMN full_description TEXT;
