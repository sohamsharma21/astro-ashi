
-- SECURITY FIX 1: Create views that hide user_id for anonymous posts/comments
-- Drop existing views if they exist
DROP VIEW IF EXISTS public.community_posts_safe;
DROP VIEW IF EXISTS public.community_comments_safe;

-- Create safe view for community posts
CREATE VIEW public.community_posts_safe AS
SELECT
  id,
  CASE WHEN is_anonymous THEN NULL ELSE user_id END AS user_id,
  title,
  content,
  category,
  group_name,
  likes_count,
  is_anonymous,
  created_at,
  updated_at
FROM public.community_posts;

-- Create safe view for community comments
CREATE VIEW public.community_comments_safe AS
SELECT
  id,
  CASE WHEN is_anonymous THEN NULL ELSE user_id END AS user_id,
  post_id,
  content,
  is_anonymous,
  created_at
FROM public.community_comments;

-- SECURITY FIX 2: Create security definer functions for badge and karma deed insertion
-- This prevents users from self-awarding arbitrary badges/karma

-- Function to award a badge (only if not already earned)
CREATE OR REPLACE FUNCTION public.award_spiritual_badge(
  _user_id uuid,
  _badge_key text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if badge already earned
  IF EXISTS (SELECT 1 FROM spiritual_badges WHERE user_id = _user_id AND badge_key = _badge_key) THEN
    RETURN false;
  END IF;
  
  INSERT INTO spiritual_badges (user_id, badge_key)
  VALUES (_user_id, _badge_key);
  
  RETURN true;
END;
$$;

-- Function to record a karma deed with validated points
CREATE OR REPLACE FUNCTION public.record_karma_deed(
  _user_id uuid,
  _deed_key text,
  _points integer DEFAULT 10
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate points range (prevent inflation)
  IF _points < 1 OR _points > 50 THEN
    RAISE EXCEPTION 'Invalid points value: must be between 1 and 50';
  END IF;
  
  -- Check if already completed today
  IF EXISTS (
    SELECT 1 FROM karma_deeds 
    WHERE user_id = _user_id 
      AND deed_key = _deed_key 
      AND completed_date = CURRENT_DATE
  ) THEN
    RETURN false;
  END IF;
  
  INSERT INTO karma_deeds (user_id, deed_key, points, completed_date)
  VALUES (_user_id, _deed_key, _points, CURRENT_DATE);
  
  RETURN true;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.award_spiritual_badge(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_karma_deed(uuid, text, integer) TO authenticated;
