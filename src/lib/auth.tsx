
import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  full_name: string | null;
  birth_date: string | null;
  birth_place: string | null;
  preferred_language: 'en' | 'hi';
  primary_zodiac_sign?: string;
  avatar_url?: string | null;
  created_at: string;
};

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  userProfile: UserProfile | null;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
