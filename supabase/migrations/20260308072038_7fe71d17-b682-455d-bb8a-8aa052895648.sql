-- Allow users to delete their own profile (for GDPR account deletion)
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Allow service role to update email_verifications (mark as used)
-- The edge function uses service_role key so this isn't strictly needed,
-- but adding for completeness
ALTER POLICY "Users can view own email verifications" ON public.email_verifications
USING (auth.uid() = user_id);

-- Allow users to delete their own reading history
CREATE POLICY "Users can delete own reading history"
ON public.reading_history
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to delete their own predictions
CREATE POLICY "Users can delete own predictions"
ON public.user_predictions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to delete their own notifications
CREATE POLICY "Users can delete own notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to delete their own conversations
CREATE POLICY "Users can delete own conversations"
ON public.astro_conversations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to delete their own email verifications
CREATE POLICY "Users can delete own email verifications"
ON public.email_verifications
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to delete own mahadasha
CREATE POLICY "Users can delete own mahadasha"
ON public.user_mahadasha
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to delete own kundli reports
CREATE POLICY "Users can delete own kundli reports"
ON public.kundli_reports
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to delete own zodiac preferences
CREATE POLICY "Users can delete own zodiac preferences"
ON public.user_zodiac_preferences
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to delete own bookings
CREATE POLICY "Users can delete own bookings"
ON public.consultation_bookings
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to delete own live sessions
CREATE POLICY "Users can delete own live sessions"
ON public.live_sessions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);