
-- Fix 1: Restrict community_posts SELECT to owner-only (force use of safe views for community reads)
DROP POLICY IF EXISTS "Authenticated users can view all posts" ON public.community_posts;
CREATE POLICY "Users can view own posts" ON public.community_posts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Fix 2: Restrict community_comments SELECT to owner-only
DROP POLICY IF EXISTS "Authenticated users can view all comments" ON public.community_comments;
CREATE POLICY "Users can view own comments" ON public.community_comments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Fix 3: Add auth.uid() check to record_karma_deed
CREATE OR REPLACE FUNCTION public.record_karma_deed(_user_id uuid, _deed_key text, _points integer DEFAULT 10)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Verify caller is acting on their own behalf
  IF _user_id <> auth.uid() THEN
    RAISE EXCEPTION 'Permission denied: cannot act on behalf of another user';
  END IF;

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
$function$;

-- Fix 4: Add auth.uid() check to award_spiritual_badge
CREATE OR REPLACE FUNCTION public.award_spiritual_badge(_user_id uuid, _badge_key text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Verify caller is acting on their own behalf
  IF _user_id <> auth.uid() THEN
    RAISE EXCEPTION 'Permission denied: cannot act on behalf of another user';
  END IF;

  -- Check if badge already earned
  IF EXISTS (SELECT 1 FROM spiritual_badges WHERE user_id = _user_id AND badge_key = _badge_key) THEN
    RETURN false;
  END IF;
  
  INSERT INTO spiritual_badges (user_id, badge_key)
  VALUES (_user_id, _badge_key);
  
  RETURN true;
END;
$function$;
