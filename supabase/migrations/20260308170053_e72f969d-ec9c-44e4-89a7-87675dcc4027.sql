
CREATE TABLE public.ai_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  question text NOT NULL,
  ai_response jsonb NOT NULL DEFAULT '{}'::jsonb,
  language text NOT NULL DEFAULT 'en',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own ai questions"
  ON public.ai_questions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own ai questions"
  ON public.ai_questions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ai questions"
  ON public.ai_questions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_ai_questions_user_id ON public.ai_questions(user_id);
CREATE INDEX idx_ai_questions_created_at ON public.ai_questions(created_at DESC);
