-- Feature 18: Spiritual Challenges & Streaks
CREATE TABLE spiritual_challenges_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  challenge_key TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_days JSONB NOT NULL DEFAULT '[]'::jsonb,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_key)
);

-- Feature 19: Spiritual Personality Test Results
CREATE TABLE spiritual_personality_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  personality_type TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  taken_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS Policies for spiritual_challenges_progress
ALTER TABLE spiritual_challenges_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenges" ON spiritual_challenges_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges" ON spiritual_challenges_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges" ON spiritual_challenges_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own challenges" ON spiritual_challenges_progress
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for spiritual_personality_results
ALTER TABLE spiritual_personality_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own personality results" ON spiritual_personality_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personality results" ON spiritual_personality_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own personality results" ON spiritual_personality_results
  FOR DELETE USING (auth.uid() = user_id);