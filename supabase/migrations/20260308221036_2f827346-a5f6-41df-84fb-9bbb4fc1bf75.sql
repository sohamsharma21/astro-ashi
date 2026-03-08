
-- Fix security definer views by using security_invoker
ALTER VIEW public.community_posts_safe SET (security_invoker = true);
ALTER VIEW public.community_comments_safe SET (security_invoker = true);
