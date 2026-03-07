
CREATE TABLE IF NOT EXISTS public.kundli_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  birth_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  chart_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_insights jsonb,
  dasha_data jsonb,
  generated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.kundli_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own kundli reports" ON public.kundli_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own kundli reports" ON public.kundli_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own kundli reports" ON public.kundli_reports FOR UPDATE USING (auth.uid() = user_id);
