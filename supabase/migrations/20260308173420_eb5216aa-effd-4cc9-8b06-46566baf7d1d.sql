
-- Fix ALL RLS policies: Change from RESTRICTIVE to PERMISSIVE
-- Drop and recreate each policy as PERMISSIVE

-- ========== user_zodiac_preferences ==========
DROP POLICY IF EXISTS "Users can delete own zodiac preferences" ON public.user_zodiac_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON public.user_zodiac_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_zodiac_preferences;
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_zodiac_preferences;

CREATE POLICY "Users can delete own zodiac preferences" ON public.user_zodiac_preferences FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON public.user_zodiac_preferences FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.user_zodiac_preferences FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own preferences" ON public.user_zodiac_preferences FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== consultation_bookings ==========
DROP POLICY IF EXISTS "Allow status updates for verified bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Users can delete own bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.consultation_bookings;

CREATE POLICY "Allow status updates for verified bookings" ON public.consultation_bookings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON public.consultation_bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookings" ON public.consultation_bookings FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own bookings" ON public.consultation_bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== audit_events ==========
DROP POLICY IF EXISTS "Users can insert own audit events" ON public.audit_events;
DROP POLICY IF EXISTS "Users can view own audit events" ON public.audit_events;

CREATE POLICY "Users can insert own audit events" ON public.audit_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own audit events" ON public.audit_events FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== user_predictions ==========
DROP POLICY IF EXISTS "Users can delete own predictions" ON public.user_predictions;
DROP POLICY IF EXISTS "Users can insert own predictions" ON public.user_predictions;
DROP POLICY IF EXISTS "Users can view own predictions" ON public.user_predictions;

CREATE POLICY "Users can delete own predictions" ON public.user_predictions FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own predictions" ON public.user_predictions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own predictions" ON public.user_predictions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== live_sessions ==========
DROP POLICY IF EXISTS "Users can create live sessions" ON public.live_sessions;
DROP POLICY IF EXISTS "Users can delete own live sessions" ON public.live_sessions;
DROP POLICY IF EXISTS "Users can update own live sessions" ON public.live_sessions;
DROP POLICY IF EXISTS "Users can view own live sessions" ON public.live_sessions;

CREATE POLICY "Users can create live sessions" ON public.live_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own live sessions" ON public.live_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own live sessions" ON public.live_sessions FOR UPDATE TO authenticated USING ((auth.uid() = user_id) OR (auth.uid() = astrologer_id));
CREATE POLICY "Users can view own live sessions" ON public.live_sessions FOR SELECT TO authenticated USING ((auth.uid() = user_id) OR (auth.uid() = astrologer_id));

-- ========== articles (public) ==========
DROP POLICY IF EXISTS "Articles are publicly readable" ON public.articles;
CREATE POLICY "Articles are publicly readable" ON public.articles FOR SELECT USING (true);

-- ========== kundli_data ==========
DROP POLICY IF EXISTS "Users can create own kundli data" ON public.kundli_data;
DROP POLICY IF EXISTS "Users can delete own kundli data" ON public.kundli_data;
DROP POLICY IF EXISTS "Users can update own kundli data" ON public.kundli_data;
DROP POLICY IF EXISTS "Users can view own kundli data" ON public.kundli_data;

CREATE POLICY "Users can create own kundli data" ON public.kundli_data FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own kundli data" ON public.kundli_data FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own kundli data" ON public.kundli_data FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own kundli data" ON public.kundli_data FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== astrological_events (public) ==========
DROP POLICY IF EXISTS "Astrological events are publicly readable" ON public.astrological_events;
CREATE POLICY "Astrological events are publicly readable" ON public.astrological_events FOR SELECT USING (true);

-- ========== astro_conversations ==========
DROP POLICY IF EXISTS "Users can create their own conversations" ON public.astro_conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON public.astro_conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON public.astro_conversations;
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.astro_conversations;

CREATE POLICY "Users can create their own conversations" ON public.astro_conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.astro_conversations FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own conversations" ON public.astro_conversations FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own conversations" ON public.astro_conversations FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== email_verifications ==========
DROP POLICY IF EXISTS "Users can delete own email verifications" ON public.email_verifications;
DROP POLICY IF EXISTS "Users can insert own email verifications" ON public.email_verifications;
DROP POLICY IF EXISTS "Users can view own email verifications" ON public.email_verifications;

CREATE POLICY "Users can delete own email verifications" ON public.email_verifications FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own email verifications" ON public.email_verifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own email verifications" ON public.email_verifications FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== chat_messages ==========
DROP POLICY IF EXISTS "Session participants can send messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Session participants can view messages" ON public.chat_messages;

CREATE POLICY "Session participants can send messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK ((auth.uid() = sender_id) AND (EXISTS (SELECT 1 FROM live_sessions ls WHERE ls.id = chat_messages.session_id AND (ls.user_id = auth.uid() OR ls.astrologer_id = auth.uid()))));
CREATE POLICY "Session participants can view messages" ON public.chat_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM live_sessions ls WHERE ls.id = chat_messages.session_id AND (ls.user_id = auth.uid() OR ls.astrologer_id = auth.uid())));

-- ========== user_mahadasha ==========
DROP POLICY IF EXISTS "Users can delete own mahadasha" ON public.user_mahadasha;
DROP POLICY IF EXISTS "Users can insert own mahadasha" ON public.user_mahadasha;
DROP POLICY IF EXISTS "Users can update own mahadasha" ON public.user_mahadasha;
DROP POLICY IF EXISTS "Users can view own mahadasha" ON public.user_mahadasha;

CREATE POLICY "Users can delete own mahadasha" ON public.user_mahadasha FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mahadasha" ON public.user_mahadasha FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mahadasha" ON public.user_mahadasha FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own mahadasha" ON public.user_mahadasha FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== reading_history ==========
DROP POLICY IF EXISTS "Users can delete own reading history" ON public.reading_history;
DROP POLICY IF EXISTS "Users can insert their own reading history" ON public.reading_history;
DROP POLICY IF EXISTS "Users can view their own reading history" ON public.reading_history;

CREATE POLICY "Users can delete own reading history" ON public.reading_history FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reading history" ON public.reading_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own reading history" ON public.reading_history FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== booking_verifications ==========
DROP POLICY IF EXISTS "Users can create verification tokens for their bookings" ON public.booking_verifications;
DROP POLICY IF EXISTS "Users can view their verification tokens" ON public.booking_verifications;

CREATE POLICY "Users can create verification tokens for their bookings" ON public.booking_verifications FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM consultation_bookings cb WHERE cb.id = booking_verifications.booking_id AND cb.user_id = auth.uid()));
CREATE POLICY "Users can view their verification tokens" ON public.booking_verifications FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM consultation_bookings cb WHERE cb.id = booking_verifications.booking_id AND cb.user_id = auth.uid()));

-- ========== notifications ==========
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;

CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== push_subscriptions ==========
DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.push_subscriptions;

CREATE POLICY "Users can delete their own subscriptions" ON public.push_subscriptions FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own subscriptions" ON public.push_subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscriptions" ON public.push_subscriptions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own subscriptions" ON public.push_subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== panchang_cache (public) ==========
DROP POLICY IF EXISTS "Panchang is publicly readable" ON public.panchang_cache;
CREATE POLICY "Panchang is publicly readable" ON public.panchang_cache FOR SELECT USING (true);

-- ========== profiles ==========
DROP POLICY IF EXISTS "Public profiles are viewable by owner." ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

CREATE POLICY "Public profiles are viewable by owner." ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ========== kundli_reports ==========
DROP POLICY IF EXISTS "Users can delete own kundli reports" ON public.kundli_reports;
DROP POLICY IF EXISTS "Users can insert own kundli reports" ON public.kundli_reports;
DROP POLICY IF EXISTS "Users can update own kundli reports" ON public.kundli_reports;
DROP POLICY IF EXISTS "Users can view own kundli reports" ON public.kundli_reports;

CREATE POLICY "Users can delete own kundli reports" ON public.kundli_reports FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own kundli reports" ON public.kundli_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own kundli reports" ON public.kundli_reports FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own kundli reports" ON public.kundli_reports FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== ai_questions ==========
DROP POLICY IF EXISTS "Users can delete own ai questions" ON public.ai_questions;
DROP POLICY IF EXISTS "Users can insert own ai questions" ON public.ai_questions;
DROP POLICY IF EXISTS "Users can view own ai questions" ON public.ai_questions;

CREATE POLICY "Users can delete own ai questions" ON public.ai_questions FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ai questions" ON public.ai_questions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own ai questions" ON public.ai_questions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== daily_horoscopes (public) ==========
DROP POLICY IF EXISTS "Daily horoscopes are publicly readable" ON public.daily_horoscopes;
CREATE POLICY "Daily horoscopes are publicly readable" ON public.daily_horoscopes FOR SELECT USING (true);
