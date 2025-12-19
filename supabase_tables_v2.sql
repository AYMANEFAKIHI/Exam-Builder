-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  header_component JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Question Bank table
CREATE TABLE IF NOT EXISTS question_bank (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  component JSONB NOT NULL,
  tags TEXT[] DEFAULT '{}',
  difficulty VARCHAR(50),
  subject VARCHAR(255),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_question_bank_user_id ON question_bank(user_id);
CREATE INDEX IF NOT EXISTS idx_question_bank_subject ON question_bank(subject);
CREATE INDEX IF NOT EXISTS idx_question_bank_difficulty ON question_bank(difficulty);

-- Disable RLS for now (you can enable it later with proper policies)
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank DISABLE ROW LEVEL SECURITY;
