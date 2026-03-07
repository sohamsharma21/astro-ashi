
CREATE TABLE IF NOT EXISTS public.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own audit events" ON public.audit_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own audit events" ON public.audit_events FOR INSERT WITH CHECK (auth.uid() = user_id);
