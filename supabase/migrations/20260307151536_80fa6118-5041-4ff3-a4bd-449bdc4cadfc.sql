
CREATE TABLE IF NOT EXISTS public.email_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  token uuid NOT NULL DEFAULT gen_random_uuid(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '24 hours'),
  used boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own email verifications" ON public.email_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own email verifications" ON public.email_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
