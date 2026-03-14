
-- Fix community_posts: allow all authenticated users to READ all posts
DROP POLICY IF EXISTS "Users can view own posts" ON public.community_posts;
CREATE POLICY "All authenticated users can view posts"
  ON public.community_posts FOR SELECT
  TO authenticated
  USING (true);

-- Fix community_comments: allow all authenticated users to READ all comments
DROP POLICY IF EXISTS "Users can view own comments" ON public.community_comments;
CREATE POLICY "All authenticated users can view comments"
  ON public.community_comments FOR SELECT
  TO authenticated
  USING (true);
