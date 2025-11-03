
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/lib/auth';
import { ZodiacSign } from '@/lib/constants';

export const useUserProfile = (userId: string | undefined, language: 'en' | 'hi') => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch the user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch primary zodiac sign preference if available
      const { data: zodiacPref, error: zodiacError } = await supabase
        .from('user_zodiac_preferences')
        .select('primary_sign')
        .eq('user_id', userId)
        .maybeSingle();

      if (zodiacError) throw zodiacError;

      const fullProfile = {
        ...profileData,
        primary_zodiac_sign: zodiacPref?.primary_sign || undefined
      };

      setProfile(fullProfile as UserProfile);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(err);
      toast.error(
        language === 'en'
          ? `Failed to load profile: ${err.message}`
          : `प्रोफ़ाइल लोड करने में विफल: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  }, [userId, language]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return;

    try {
      // Update the profiles table
      const profileUpdates = {
        full_name: updates.full_name,
        birth_date: updates.birth_date,
        birth_place: updates.birth_place,
        preferred_language: updates.preferred_language,
      };
      
      // Filter out undefined values
      const filteredUpdates = Object.fromEntries(
        Object.entries(profileUpdates).filter(([_, v]) => v !== undefined)
      );

      const { error: profileError } = await supabase
        .from('profiles')
        .update(filteredUpdates)
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update zodiac preference if provided
      if (updates.primary_zodiac_sign) {
        const { error: zodiacError } = await supabase
          .from('user_zodiac_preferences')
          .upsert({
            user_id: userId,
            primary_sign: updates.primary_zodiac_sign as ZodiacSign
          }, { onConflict: 'user_id' });

        if (zodiacError) throw zodiacError;
      }

      // Refresh profile data
      await fetchProfile();
      
      // Success toast
      toast.success(
        language === 'en'
          ? 'Profile updated successfully'
          : 'प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया'
      );

    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error(
        language === 'en'
          ? `Failed to update profile: ${err.message}`
          : `प्रोफ़ाइल अपडेट करने में विफल: ${err.message}`
      );
      throw err;
    }
  };

  const refetchProfile = async () => {
    await fetchProfile();
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetchProfile
  };
};
