
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/lib/auth';

export async function getAstrologicalInsight(
  query: string, 
  language: 'en' | 'hi' = 'en',
  userProfile?: UserProfile | null
): Promise<string> {
  try {
    // Call our edge function
    const { data, error } = await supabase.functions.invoke('get-astro-insight', {
      body: { 
        query,
        language,
        userProfile: userProfile ? {
          full_name: userProfile.full_name,
          birth_date: userProfile.birth_date,
          birth_place: userProfile.birth_place,
          primary_zodiac_sign: userProfile.primary_zodiac_sign
        } : undefined
      }
    });

    if (error) throw new Error(error.message);
    
    return data.response;
  } catch (error) {
    console.error('Error getting astrological insight:', error);
    
    // Return fallback response
    if (language === 'en') {
      return "I apologize, but I'm having trouble accessing the astrological data at the moment. Please try again in a few moments.";
    } else {
      return "मुझे क्षमा करें, लेकिन मुझे इस समय ज्योतिषीय डेटा तक पहुंचने में परेशानी हो रही है। कृपया कुछ क्षणों में पुन: प्रयास करें।";
    }
  }
}
