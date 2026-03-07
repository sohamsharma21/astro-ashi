
CREATE POLICY "Session participants can view messages" ON public.chat_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.live_sessions ls WHERE ls.id = chat_messages.session_id AND (ls.user_id = auth.uid() OR ls.astrologer_id = auth.uid()))
);
CREATE POLICY "Session participants can send messages" ON public.chat_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (SELECT 1 FROM public.live_sessions ls WHERE ls.id = chat_messages.session_id AND (ls.user_id = auth.uid() OR ls.astrologer_id = auth.uid()))
);
