import { supabase } from '@/integrations/supabase/client';
import { ZodiacSign } from '@/lib/constants';

export interface HoroscopeData {
  id: string;
  zodiac_sign: ZodiacSign;
  date: string;
  content_en: string;
  content_hi: string;
}

export const horoscopeService = {
  async getDailyHoroscope(sign: ZodiacSign, date?: string): Promise<HoroscopeData | null> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    try {
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
        return existingHoroscope as HoroscopeData;
      }
      
      const response = await supabase.functions.invoke('generate-horoscope', {
        body: { zodiacSign: sign, date: targetDate }
      });
      
      if (response.error) {
        console.error('Error generating horoscope:', response.error);
        throw new Error(response.error.message);
      }
      
      return response.data.horoscope as HoroscopeData;
    } catch (error) {
      console.error('Error in horoscopeService:', error);
      return null;
    }
  },
  
  async generateKundli(name: string, birthDate: string, birthTime: string, birthPlace: string, latitude?: number, longitude?: number) {
    return {
      name,
      birthDate,
      birthTime,
      birthPlace,
      ascendant: 'Aries',
      houses: [
        { house: 1, sign: 'Aries', planets: ['Sun'] },
        { house: 2, sign: 'Taurus', planets: ['Venus'] },
      ]
    };
  }
};
