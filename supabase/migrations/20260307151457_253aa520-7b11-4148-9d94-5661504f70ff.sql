
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS religion text DEFAULT 'hindu',
  ADD COLUMN IF NOT EXISTS caste text,
  ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS birth_time_known boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS avatar_url text;

ALTER TABLE public.consultation_bookings 
  ADD COLUMN IF NOT EXISTS confirmed_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS confirmed_via text;
