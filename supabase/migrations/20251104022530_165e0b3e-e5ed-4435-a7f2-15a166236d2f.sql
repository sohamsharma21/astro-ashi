-- Add nav_icon_style to profiles for navigation icon theme
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS nav_icon_style TEXT NOT NULL DEFAULT 'default';

-- Optional: constrain values via trigger (simple check at app level, keep DB flexible)
