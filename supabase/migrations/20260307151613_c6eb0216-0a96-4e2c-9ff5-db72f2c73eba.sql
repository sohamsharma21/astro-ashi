
CREATE TABLE IF NOT EXISTS public.live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  astrologer_id uuid,
  status text NOT NULL DEFAULT 'pending',
  room_metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own live sessions" ON public.live_sessions FOR SELECT USING (auth.uid() = user_id OR auth.uid() = astrologer_id);
CREATE POLICY "Users can create live sessions" ON public.live_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own live sessions" ON public.live_sessions FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = astrologer_id);
