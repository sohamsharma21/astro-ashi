
import { supabase } from '@/integrations/supabase/client';
import { ZodiacSign } from '@/lib/constants';
import { UserProfile } from '@/lib/auth';

// User Profile API
export const userProfileApi = {
  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data as UserProfile;
  },
  
  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
    
    return data as UserProfile;
  },
  
  // Update user zodiac preference
  async updateZodiacPreference(userId: string, sign: ZodiacSign): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_zodiac_preferences')
        .upsert(
          { user_id: userId, primary_sign: sign },
          { onConflict: 'user_id', ignoreDuplicates: false }
        );
        
      if (error) {
        console.error('Error updating zodiac preference:', error);
        throw error;
      }
    } catch (error) {
      console.error('Caught exception updating zodiac preference:', error);
      throw error;
    }
  }
};

// Horoscope API
export const horoscopeApi = {
  // Get daily horoscope
  async getDailyHoroscope(sign: ZodiacSign, date: string): Promise<any> {
    const { data, error } = await supabase
      .from('daily_horoscopes')
      .select('*')
      .eq('zodiac_sign', sign)
      .eq('date', date)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching horoscope:', error);
      throw error;
    }
    
    return data;
  },
  
  // Record reading history
  async recordReading(userId: string, contentType: string, contentId: string, contentTitle?: string, contentSummary?: string): Promise<void> {
    if (!userId) return; // Don't record if not logged in
    
    const { error } = await supabase
      .from('reading_history')
      .insert({
        user_id: userId,
        content_type: contentType,
        content_id: contentId,
        content_title: contentTitle,
        content_summary: contentSummary
      });
      
    if (error) {
      console.error('Error recording reading history:', error);
      // Don't throw here to prevent disrupting user experience
    }
  },
  
  // Get reading history
  async getReadingHistory(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('reading_history')
      .select('*')
      .eq('user_id', userId)
      .order('read_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching reading history:', error);
      throw error;
    }
    
    return data || [];
  }
};

// Astrological Events API
export const astroEventsApi = {
  // Get upcoming events
  async getUpcomingEvents(): Promise<any[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('astrological_events')
      .select('*')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(10);
      
    if (error) {
      console.error('Error fetching astrological events:', error);
      throw error;
    }
    
    return data || [];
  }
};
