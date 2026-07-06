-- GTA RolePlay: pin the public application link to one explicit form section,
-- instead of guessing "the first form block found" across the org's tabs.

ALTER TABLE gta_organizations
  ADD COLUMN IF NOT EXISTS public_form_section_id UUID REFERENCES gta_org_sections(id) ON DELETE SET NULL;
