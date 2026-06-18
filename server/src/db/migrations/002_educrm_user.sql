-- EduCRM: user profile fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]';

-- EduCRM: file folders (personal storage)
ALTER TABLE files ADD COLUMN IF NOT EXISTS folder VARCHAR(255);

-- EduCRM: Study teams (учебные команды внутри группы)
CREATE TABLE IF NOT EXISTS study_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EduCRM: Study team members
CREATE TABLE IF NOT EXISTS study_team_members (
  team_id UUID NOT NULL REFERENCES study_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

-- EduCRM: Study team tasks (простой канбан внутри учебной команды)
CREATE TABLE IF NOT EXISTS study_team_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES study_teams(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'review', 'done')),
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_study_teams_group ON study_teams(group_id);
CREATE INDEX IF NOT EXISTS idx_study_team_members_user ON study_team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_study_team_tasks_team ON study_team_tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_study_team_tasks_assignee ON study_team_tasks(assignee_id);
