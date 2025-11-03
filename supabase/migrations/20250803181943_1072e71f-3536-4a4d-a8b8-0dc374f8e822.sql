-- Create email verification tokens table
CREATE TABLE IF NOT EXISTS public.booking_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES consultation_bookings(id) ON DELETE CASCADE,
  verification_token UUID NOT NULL DEFAULT gen_random_uuid(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.booking_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create verification tokens for their bookings" 
ON public.booking_verifications 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM consultation_bookings cb 
    WHERE cb.id = booking_id AND cb.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their verification tokens" 
ON public.booking_verifications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM consultation_bookings cb 
    WHERE cb.id = booking_id AND cb.user_id = auth.uid()
  )
);

-- Update consultation_bookings to allow status updates
CREATE POLICY "Allow status updates for verified bookings" 
ON public.consultation_bookings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX idx_booking_verifications_token ON booking_verifications(verification_token);
CREATE INDEX idx_booking_verifications_booking_id ON booking_verifications(booking_id);