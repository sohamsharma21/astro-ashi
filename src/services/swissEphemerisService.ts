import { supabase } from '@/integrations/supabase/client';
import { ZodiacSign } from '@/lib/constants';

export interface SwissEphemerisHoroscope {
  id: string;
  zodiac_sign: ZodiacSign;
  date: string;
  content_en: string;
  content_hi: string;
}

export const swissEphemerisService = {
  // Get horoscope data using Swiss Ephemeris calculations
  async getDailyHoroscope(sign: ZodiacSign, date?: string): Promise<SwissEphemerisHoroscope | null> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    try {
      // First check if it exists in our database
      const { data: existingHoroscope, error } = await supabase
        .from('daily_horoscopes')
        .select('*')
        .eq('zodiac_sign', sign)
        .eq('date', targetDate)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching horoscope from database:', error);
        throw error;
      }
      
      if (existingHoroscope) {
        return existingHoroscope as SwissEphemerisHoroscope;
      }
      
      // If not found in database, generate a new one using the edge function
      const response = await supabase.functions.invoke('generate-horoscope', {
        body: { zodiacSign: sign, date: targetDate }
      });
      
      if (response.error) {
        console.error('Error generating horoscope:', response.error);
        throw new Error(response.error.message);
      }
      
      return response.data.horoscope as SwissEphemerisHoroscope;
    } catch (error) {
      console.error('Error in swissEphemerisService:', error);
      return null;
    }
  },
  
  // Generate full Kundli data using Swiss Ephemeris
  async generateKundli(name: string, birthDate: string, birthTime: string, birthPlace: string, latitude?: number, longitude?: number) {
    // In a production implementation, we would call an edge function that uses Swiss Ephemeris
    // For now we'll return mock data as we're focusing on the structure
    return {
      name,
      birthDate,
      birthTime,
      birthPlace,
      ascendant: 'Aries', // This would be calculated by Swiss Ephemeris
      houses: [
        { house: 1, sign: 'Aries', planets: ['Sun'] },
        { house: 2, sign: 'Taurus', planets: ['Venus'] },
        // ... other houses
      ]
    };
  }
};
