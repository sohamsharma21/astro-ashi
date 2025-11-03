
import { useQuery } from '@tanstack/react-query';
import { ZodiacSign } from '@/lib/constants';
import { swissEphemerisService } from '@/services/swissEphemerisService';
import { useToast } from '@/hooks/use-toast';
import { useReadingHistory } from '@/hooks/useReadingHistory';

export const useHoroscope = (
  selectedSign: ZodiacSign,
  language: 'en' | 'hi',
  userId?: string
) => {
  const { toast } = useToast();
  const { recordReading } = useReadingHistory();

  return useQuery({
    queryKey: ['swiss-ephemeris-horoscope', selectedSign],
    queryFn: async () => {
      try {
        const data = await swissEphemerisService.getDailyHoroscope(selectedSign);
        
        if (!data) {
          toast({
            title: language === 'en' ? 'Error' : 'त्रुटि',
            description: language === 'en' 
              ? 'Failed to load horoscope' 
              : 'राशिफल लोड करने में विफल',
            variant: 'destructive'
          });
          return null;
        }

        // Record reading history when horoscope is successfully loaded
        if (userId) {
          await recordReading('horoscope', data.id);
        }
        return data;
      } catch (error) {
        toast({
          title: language === 'en' ? 'Error' : 'त्रुटि',
          description: language === 'en' 
            ? 'Failed to load horoscope' 
            : 'राशिफल लोड करने में विफल',
          variant: 'destructive'
        });
        return null;
      }
    }
  });
};
