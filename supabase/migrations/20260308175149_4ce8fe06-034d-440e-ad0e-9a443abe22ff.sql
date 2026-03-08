
-- Drop booking_verifications first (has FK to consultation_bookings)
DROP TABLE IF EXISTS public.booking_verifications CASCADE;

-- Drop consultation_bookings
DROP TABLE IF EXISTS public.consultation_bookings CASCADE;

-- Drop chat_messages (depends on live_sessions via RLS)
DROP TABLE IF EXISTS public.chat_messages CASCADE;

-- Drop live_sessions
DROP TABLE IF EXISTS public.live_sessions CASCADE;
