
-- Add unique constraint on community_likes to prevent duplicate likes
ALTER TABLE public.community_likes 
  ADD CONSTRAINT community_likes_post_user_unique UNIQUE (post_id, user_id);
