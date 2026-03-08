
-- Gratitude journal entries
CREATE TABLE public.gratitude_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  content TEXT NOT NULL DEFAULT '',
  mood TEXT NOT NULL DEFAULT 'neutral',
  prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, entry_date)
);

ALTER TABLE public.gratitude_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gratitude entries" ON public.gratitude_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gratitude entries" ON public.gratitude_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own gratitude entries" ON public.gratitude_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own gratitude entries" ON public.gratitude_entries FOR DELETE USING (auth.uid() = user_id);

-- Spiritual routine logs
CREATE TABLE public.spiritual_routine_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  routine_key TEXT NOT NULL,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, routine_key, completed_date)
);

ALTER TABLE public.spiritual_routine_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own routine logs" ON public.spiritual_routine_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own routine logs" ON public.spiritual_routine_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own routine logs" ON public.spiritual_routine_logs FOR DELETE USING (auth.uid() = user_id);

-- Saved inspirations
CREATE TABLE public.saved_inspirations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quote_text TEXT NOT NULL,
  source TEXT NOT NULL,
  religion TEXT NOT NULL DEFAULT 'other',
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_inspirations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved inspirations" ON public.saved_inspirations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved inspirations" ON public.saved_inspirations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved inspirations" ON public.saved_inspirations FOR DELETE USING (auth.uid() = user_id);
