
// Zodiac signs
export type ZodiacSign = 
  | 'aries' 
  | 'taurus' 
  | 'gemini' 
  | 'cancer' 
  | 'leo' 
  | 'virgo' 
  | 'libra' 
  | 'scorpio' 
  | 'sagittarius' 
  | 'capricorn' 
  | 'aquarius' 
  | 'pisces';

// User profile type
export interface UserProfile {
  id: string;
  full_name?: string;
  birth_date?: string;
  birth_place?: string;
  preferred_language?: 'en' | 'hi';
  primary_zodiac_sign?: ZodiacSign;
}

// Horoscope type
export interface Horoscope {
  id: string;
  zodiac_sign: ZodiacSign;
  date: string;
  content_en: string;
  content_hi: string;
  created_at?: string;
  updated_at?: string;
}

// Kundli data type
export interface KundliData {
  id?: string;
  user_id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}
