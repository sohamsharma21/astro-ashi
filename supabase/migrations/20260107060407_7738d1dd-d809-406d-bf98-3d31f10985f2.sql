-- Add required Kundli fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS birth_time time without time zone,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS moon_sign text,
ADD COLUMN IF NOT EXISTS lagna text,
ADD COLUMN IF NOT EXISTS nakshatra text,
ADD COLUMN IF NOT EXISTS kundli_generated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS kundli_data jsonb;

-- Create panchang_cache table for storing daily panchang data
CREATE TABLE IF NOT EXISTS public.panchang_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL,
  latitude numeric NOT NULL DEFAULT 28.6139,
  longitude numeric NOT NULL DEFAULT 77.2090,
  location_name text DEFAULT 'Delhi',
  tithi jsonb NOT NULL,
  nakshatra jsonb NOT NULL,
  yoga jsonb NOT NULL,
  karana jsonb NOT NULL,
  vaar text NOT NULL,
  sunrise time without time zone NOT NULL,
  sunset time without time zone NOT NULL,
  rahu_kaal jsonb NOT NULL,
  abhijit_muhurat jsonb,
  shubh_muhurat jsonb,
  ashubh_muhurat jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(date, latitude, longitude)
);

-- Enable RLS on panchang_cache
ALTER TABLE public.panchang_cache ENABLE ROW LEVEL SECURITY;

-- Panchang is publicly readable
CREATE POLICY "Panchang is publicly readable" 
ON public.panchang_cache 
FOR SELECT 
USING (true);

-- Create user_predictions table for storing personalized predictions
CREATE TABLE IF NOT EXISTS public.user_predictions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prediction_type text NOT NULL, -- 'daily', 'weekly', 'monthly', 'yearly'
  prediction_date date NOT NULL,
  content_en text NOT NULL,
  content_hi text NOT NULL,
  focus_areas jsonb, -- career, health, finance, relationships
  kundli_factors jsonb, -- factors used from kundli
  transit_factors jsonb, -- current planetary transits
  panchang_factors jsonb, -- panchang elements used
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, prediction_type, prediction_date)
);

-- Enable RLS on user_predictions
ALTER TABLE public.user_predictions ENABLE ROW LEVEL SECURITY;

-- Users can view their own predictions
CREATE POLICY "Users can view own predictions" 
ON public.user_predictions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own predictions
CREATE POLICY "Users can insert own predictions" 
ON public.user_predictions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create mahadasha table for storing user's dasha periods
CREATE TABLE IF NOT EXISTS public.user_mahadasha (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_mahadasha text NOT NULL,
  current_antardasha text NOT NULL,
  mahadasha_start date NOT NULL,
  mahadasha_end date NOT NULL,
  antardasha_start date NOT NULL,
  antardasha_end date NOT NULL,
  all_periods jsonb, -- Complete Vimshottari Dasha
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_mahadasha
ALTER TABLE public.user_mahadasha ENABLE ROW LEVEL SECURITY;

-- Users can view their own mahadasha
CREATE POLICY "Users can view own mahadasha" 
ON public.user_mahadasha 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own mahadasha
CREATE POLICY "Users can insert own mahadasha" 
ON public.user_mahadasha 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own mahadasha
CREATE POLICY "Users can update own mahadasha" 
ON public.user_mahadasha 
FOR UPDATE 
USING (auth.uid() = user_id);