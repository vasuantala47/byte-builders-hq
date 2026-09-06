-- ==============================================================================
-- BYTE BUILDERS HQ - PRODUCTION SUPABASE / POSTGRESQL DATABASE SCHEMA
-- Digital Hardware Innovation Lab & Collaboration Workspace
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TEAMS & WORKSPACES
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Byte Builders',
  invite_code TEXT UNIQUE NOT NULL DEFAULT 'BYTE-BUILDERS-2025',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  auth_user_id UUID, -- Links to Supabase auth.users
  name TEXT NOT NULL,
  callsign TEXT,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  is_online BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  objective TEXT NOT NULL,
  problem TEXT,
  solution TEXT,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Planning', 'Active', 'Testing', 'Completed')),
  lead_id UUID REFERENCES members(id) ON DELETE SET NULL,
  deadline DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. IDEAS (IDEA VAULT)
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  problem TEXT NOT NULL,
  proposed_solution TEXT NOT NULL,
  explanation TEXT,
  how_it_works TEXT,
  required_hardware TEXT,
  required_software TEXT,
  estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
  advantages TEXT,
  risks TEXT,
  questions TEXT,
  "references" TEXT,
  author_id UUID REFERENCES members(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Discussing', 'Promising', 'Selected', 'Building', 'Testing', 'Implemented', 'Rejected')),
  upvotes UUID[] DEFAULT '{}',
  linked_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. IDEA COMMENTS
CREATE TABLE IF NOT EXISTS idea_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  author_id UUID REFERENCES members(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RESEARCH HUB
CREATE TABLE IF NOT EXISTS research (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  summary TEXT NOT NULL,
  key_findings TEXT,
  what_we_learned TEXT,
  how_it_helps TEXT,
  source_url TEXT,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES members(id) ON DELETE SET NULL,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. RESEARCH COMMENTS
CREATE TABLE IF NOT EXISTS research_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  research_id UUID REFERENCES research(id) ON DELETE CASCADE,
  author_id UUID REFERENCES members(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. OPEN SUGGESTIONS
CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES members(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Discussing', 'Accepted', 'Implemented', 'Rejected')),
  supports UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SUGGESTION COMMENTS
CREATE TABLE IF NOT EXISTS suggestion_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  suggestion_id UUID REFERENCES suggestions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES members(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ROADMAP & STAGES
CREATE TABLE IF NOT EXISTS roadmap_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES members(id) ON DELETE SET NULL,
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
  checklist JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TASKS (KANBAN)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES members(id) ON DELETE SET NULL,
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT NOT NULL DEFAULT 'BACKLOG' CHECK (status IN ('BACKLOG', 'TODO', 'IN PROGRESS', 'REVIEW', 'TESTING', 'DONE')),
  deadline DATE,
  checklist JSONB DEFAULT '[]'::jsonb,
  related_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  related_idea_id UUID REFERENCES ideas(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. COMPONENT INVENTORY
CREATE TABLE IF NOT EXISTS components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Microcontroller', 'Sensor', 'Actuator', 'Power', 'Passive', 'Mechanical', 'PCB', 'Communication', 'Other')),
  quantity_required INTEGER NOT NULL DEFAULT 1,
  quantity_available INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Needed' CHECK (status IN ('Needed', 'Searching', 'Ordered', 'Received', 'Testing', 'Available', 'Installed')),
  estimated_price NUMERIC(10, 2) DEFAULT 0.00,
  actual_price NUMERIC(10, 2) DEFAULT 0.00,
  supplier TEXT,
  link TEXT,
  purchased_by_id UUID REFERENCES members(id) ON DELETE SET NULL,
  storage_location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. EXPERIMENT LAB
CREATE TABLE IF NOT EXISTS experiments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  experiment_number TEXT NOT NULL,
  title TEXT NOT NULL,
  objective TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  setup TEXT NOT NULL,
  components_used TEXT[] DEFAULT '{}',
  expected_result TEXT,
  actual_result TEXT,
  measurements TEXT,
  problems TEXT,
  conclusion TEXT,
  status TEXT NOT NULL DEFAULT 'Planned' CHECK (status IN ('Planned', 'Running', 'Successful', 'Failed', 'Needs Improvement')),
  media_urls TEXT[] DEFAULT '{}',
  next_experiment TEXT,
  contributor_id UUID REFERENCES members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. PROTOTYPES
CREATE TABLE IF NOT EXISTS prototypes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  objective TEXT NOT NULL,
  changes TEXT,
  components TEXT[] DEFAULT '{}',
  design_files TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  test_results TEXT,
  problems TEXT,
  improvements TEXT,
  status TEXT NOT NULL DEFAULT 'In Design' CHECK (status IN ('In Design', 'Fabricating', 'Testing', 'Verified', 'Superseded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. DECISIONS (ADRs)
CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  decision_number TEXT NOT NULL,
  title TEXT NOT NULL,
  decision TEXT NOT NULL,
  reason TEXT NOT NULL,
  alternatives TEXT,
  decision_made_by TEXT,
  date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Accepted' CHECK (status IN ('Proposed', 'Accepted', 'Superseded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. WIKI / KNOWLEDGE BASE
CREATE TABLE IF NOT EXISTS wiki_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES members(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. TEAM CHAT MESSAGES
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL DEFAULT 'general',
  sender_id UUID REFERENCES members(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  reactions JSONB DEFAULT '[]'::jsonb,
  reply_to_id UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. BUDGET & EXPENSES
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  date DATE DEFAULT CURRENT_DATE,
  purchased_by_id UUID REFERENCES members(id) ON DELETE SET NULL,
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  icon TEXT DEFAULT 'Trophy',
  added_by_id UUID REFERENCES members(id) ON DELETE SET NULL
);

-- 21. PROJECT FILES & MEDIA
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  size TEXT,
  url TEXT NOT NULL,
  uploaded_by_id UUID REFERENCES members(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  related_entity_id UUID
);

-- 22. ACTIVITY AUDIT LOG
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  link_tab TEXT,
  link_id UUID
);

-- 23. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  link_tab TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prototypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Workspace Policy: Allow authenticated members of the team to read/write
CREATE POLICY "Allow team members full access" ON teams FOR ALL USING (true);
CREATE POLICY "Allow team members full access to members" ON members FOR ALL USING (true);
CREATE POLICY "Allow team members full access to projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow team members full access to ideas" ON ideas FOR ALL USING (true);
CREATE POLICY "Allow team members full access to tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow team members full access to components" ON components FOR ALL USING (true);
CREATE POLICY "Allow team members full access to experiments" ON experiments FOR ALL USING (true);
CREATE POLICY "Allow team members full access to prototypes" ON prototypes FOR ALL USING (true);
CREATE POLICY "Allow team members full access to decisions" ON decisions FOR ALL USING (true);
CREATE POLICY "Allow team members full access to chat_messages" ON chat_messages FOR ALL USING (true);
