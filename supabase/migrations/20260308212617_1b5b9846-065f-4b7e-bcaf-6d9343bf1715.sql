
-- Spiritual Growth Logs
CREATE TABLE public.spiritual_growth_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  activity_type text NOT NULL,
  completed_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.spiritual_growth_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own growth logs" ON public.spiritual_growth_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own growth logs" ON public.spiritual_growth_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own growth logs" ON public.spiritual_growth_logs FOR DELETE USING (auth.uid() = user_id);

-- Spiritual Badges
CREATE TABLE public.spiritual_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_key text NOT NULL,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_key)
);
ALTER TABLE public.spiritual_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own badges" ON public.spiritual_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON public.spiritual_badges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own badges" ON public.spiritual_badges FOR DELETE USING (auth.uid() = user_id);

-- Life Goals
CREATE TABLE public.life_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  religion_guidance text,
  milestones jsonb NOT NULL DEFAULT '[]'::jsonb,
  progress integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.life_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own goals" ON public.life_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.life_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.life_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.life_goals FOR DELETE USING (auth.uid() = user_id);
