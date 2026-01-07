
import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  full_name: string | null;
  birth_date: string | null;
  birth_time?: string | null;
  birth_place: string | null;
  preferred_language: 'en' | 'hi';
  primary_zodiac_sign?: string;
  avatar_url?: string | null;
  created_at: string;
  // Kundli fields
  gender?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  lagna?: string | null;
  moon_sign?: string | null;
  nakshatra?: string | null;
  kundli_generated?: boolean;
  kundli_data?: any;
};

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  userProfile: UserProfile | null;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  refetchProfile: () => Promise<void>;
  loading: boolean;
  needsKundliOnboarding: boolean;
};

// Create context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
