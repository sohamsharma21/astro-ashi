
import { useState } from 'react';
import { toast } from 'sonner';
import { ZodiacSign } from '@/lib/constants'; 
import { useAuth } from '@/lib/auth';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { CompatibilityFormData } from '@/components/compatibility/CompatibilityForm';

export interface CompatibilityResult {
  person1: { name: string; sign: ZodiacSign };
  person2: { name: string; sign: ZodiacSign };
  overallScore: number;
  compatibility: string;
  aspects: { name: string; score: number }[];
}

export const useCompatibility = () => {
  const { language, user } = useAuth();
  const { recordReading } = useReadingHistory();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const calculateCompatibility = async (formData: CompatibilityFormData) => {
    setLoading(true);

    try {
      // Generate a random ID for the compatibility reading
      const contentId = crypto.randomUUID();
      
      // Record the reading in history if user is logged in
      if (user) {
        await recordReading('compatibility', contentId);
      }

      // Generate compatibility result
      const compatibilityResult = generateCompatibility(
        formData.person1.name, 
        formData.person1.sign, 
        formData.person2.name,
        formData.person2.sign
      );
      
      setResult(compatibilityResult);
      
      toast.success(
        language === 'en'
          ? 'Compatibility analysis complete!'
          : 'संगतता विश्लेषण पूर्ण!'
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetResult = () => {
    setResult(null);
  };

  const generateCompatibility = (name1: string, sign1: ZodiacSign, name2: string, sign2: ZodiacSign): CompatibilityResult => {
    // This would be calculated using proper astrological algorithms in a real app
    const compatibilityMatrix: Record<string, Record<string, number>> = {
      aries: { aries: 70, taurus: 40, gemini: 85, cancer: 50, leo: 90, virgo: 45, libra: 65, scorpio: 50, sagittarius: 85, capricorn: 35, aquarius: 75, pisces: 50 },
      taurus: { aries: 40, taurus: 90, gemini: 50, cancer: 85, leo: 60, virgo: 95, libra: 75, scorpio: 90, sagittarius: 40, capricorn: 95, aquarius: 45, pisces: 85 },
      gemini: { aries: 85, taurus: 50, gemini: 75, cancer: 45, leo: 80, virgo: 65, libra: 95, scorpio: 40, sagittarius: 85, capricorn: 45, aquarius: 95, pisces: 50 },
      cancer: { aries: 50, taurus: 85, gemini: 45, cancer: 95, leo: 60, virgo: 80, libra: 50, scorpio: 95, sagittarius: 40, capricorn: 70, aquarius: 40, pisces: 95 },
      leo: { aries: 90, taurus: 60, gemini: 80, cancer: 60, leo: 85, virgo: 50, libra: 75, scorpio: 60, sagittarius: 95, capricorn: 45, aquarius: 65, pisces: 60 },
      virgo: { aries: 45, taurus: 95, gemini: 65, cancer: 80, leo: 50, virgo: 85, libra: 60, scorpio: 85, sagittarius: 45, capricorn: 95, aquarius: 50, pisces: 70 },
      libra: { aries: 65, taurus: 75, gemini: 95, cancer: 50, leo: 75, virgo: 60, libra: 80, scorpio: 45, sagittarius: 70, capricorn: 55, aquarius: 90, pisces: 60 },
      scorpio: { aries: 50, taurus: 90, gemini: 40, cancer: 95, leo: 60, virgo: 85, libra: 45, scorpio: 90, sagittarius: 60, capricorn: 80, aquarius: 40, pisces: 95 },
      sagittarius: { aries: 85, taurus: 40, gemini: 85, cancer: 40, leo: 95, virgo: 45, libra: 70, scorpio: 60, sagittarius: 80, capricorn: 55, aquarius: 85, pisces: 50 },
      capricorn: { aries: 35, taurus: 95, gemini: 45, cancer: 70, leo: 45, virgo: 95, libra: 55, scorpio: 80, sagittarius: 55, capricorn: 85, aquarius: 60, pisces: 75 },
      aquarius: { aries: 75, taurus: 45, gemini: 95, cancer: 40, leo: 65, virgo: 50, libra: 90, scorpio: 40, sagittarius: 85, capricorn: 60, aquarius: 80, pisces: 55 },
      pisces: { aries: 50, taurus: 85, gemini: 50, cancer: 95, leo: 60, virgo: 70, libra: 60, scorpio: 95, sagittarius: 50, capricorn: 75, aquarius: 55, pisces: 90 }
    };
    
    const score = compatibilityMatrix[sign1][sign2];
    let compatibility;
    
    if (score >= 90) compatibility = language === 'en' ? 'Exceptional' : 'असाधारण';
    else if (score >= 75) compatibility = language === 'en' ? 'Excellent' : 'उत्कृष्ट';
    else if (score >= 60) compatibility = language === 'en' ? 'Good' : 'अच्छा';
    else if (score >= 45) compatibility = language === 'en' ? 'Average' : 'औसत';
    else compatibility = language === 'en' ? 'Challenging' : 'चुनौतीपूर्ण';

    const aspects = [
      {
        name: language === 'en' ? 'Romance' : 'रोमांस',
        score: Math.min(100, Math.max(0, score + Math.floor(Math.random() * 11) - 5))
      },
      {
        name: language === 'en' ? 'Communication' : 'संचार',
        score: Math.min(100, Math.max(0, score + Math.floor(Math.random() * 11) - 5))
      },
      {
        name: language === 'en' ? 'Trust' : 'विश्वास',
        score: Math.min(100, Math.max(0, score + Math.floor(Math.random() * 11) - 5))
      },
      {
        name: language === 'en' ? 'Emotional Connection' : 'भावनात्मक जुड़ाव',
        score: Math.min(100, Math.max(0, score + Math.floor(Math.random() * 11) - 5))
      }
    ];
    
    return {
      person1: { name: name1, sign: sign1 },
      person2: { name: name2, sign: sign2 },
      overallScore: score,
      compatibility,
      aspects
    };
  };

  return {
    loading,
    result,
    calculateCompatibility,
    resetResult
  };
};
