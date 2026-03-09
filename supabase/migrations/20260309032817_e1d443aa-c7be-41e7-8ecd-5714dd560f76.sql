-- Drop existing unsafe views
DROP VIEW IF EXISTS public.community_posts_safe;
DROP VIEW IF EXISTS public.community_comments_safe;

-- Recreate community_posts_safe view that hides user_id for anonymous posts
CREATE VIEW public.community_posts_safe WITH (security_invoker = true) AS
SELECT
  id,
  CASE WHEN is_anonymous = true THEN NULL ELSE user_id END AS user_id,
  title,
  content,
  category,
  group_name,
  likes_count,
  is_anonymous,
  created_at,
  updated_at
FROM public.community_posts;

-- Recreate community_comments_safe view that hides user_id for anonymous comments
CREATE VIEW public.community_comments_safe WITH (security_invoker = true) AS
SELECT
  id,
  CASE WHEN is_anonymous = true THEN NULL ELSE user_id END AS user_id,
  post_id,
  content,
  is_anonymous,
  created_at
FROM public.community_comments;