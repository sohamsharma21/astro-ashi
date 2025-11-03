import { useState } from 'react';
import { toast } from 'sonner';
import { ZodiacSign } from '@/lib/constants';
import { useAuth } from '@/lib/auth';
import { useReadingHistory } from '@/hooks/useReadingHistory';

export interface AstroLoveFormData {
  person1: { name: string; birthDate: string };
  person2: { name: string; birthDate: string };
}

export interface AstroLoveResult {
  person1: { name: string; sign: ZodiacSign; lifePathNumber: number };
  person2: { name: string; sign: ZodiacSign; lifePathNumber: number };
  loveScore: number;
  zodiacScore: number;
  numerologyScore: number;
  planetaryScore: number;
  compatibility: string;
  insights: string[];
}

export const useAstroLove = () => {
  const { language, user } = useAuth();
  const { recordReading } = useReadingHistory();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AstroLoveResult | null>(null);

  const getZodiacSign = (birthDate: string): ZodiacSign => {
    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
    return 'pisces';
  };

  const calculateLifePathNumber = (birthDate: string): number => {
    const date = new Date(birthDate);
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    
    let sum = dateStr.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    
    return sum;
  };

  const calculateCompatibility = async (formData: AstroLoveFormData) => {
    setLoading(true);

    try {
      const contentId = crypto.randomUUID();
      
      if (user) {
        await recordReading('astro-love', contentId);
      }

      const sign1 = getZodiacSign(formData.person1.birthDate);
      const sign2 = getZodiacSign(formData.person2.birthDate);
      const lifePathNumber1 = calculateLifePathNumber(formData.person1.birthDate);
      const lifePathNumber2 = calculateLifePathNumber(formData.person2.birthDate);

      // Zodiac compatibility matrix
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

      const zodiacScore = compatibilityMatrix[sign1][sign2];

      // Numerology compatibility
      const numerologyDiff = Math.abs(lifePathNumber1 - lifePathNumber2);
      const numerologyScore = numerologyDiff === 0 ? 100 : 
                             numerologyDiff === 1 || numerologyDiff === 2 ? 85 :
                             numerologyDiff === 3 || numerologyDiff === 4 ? 70 :
                             numerologyDiff === 5 || numerologyDiff === 6 ? 55 : 40;

      // Planetary influence (simulated based on zodiac elements)
      const elements: Record<string, string> = {
        aries: 'fire', leo: 'fire', sagittarius: 'fire',
        taurus: 'earth', virgo: 'earth', capricorn: 'earth',
        gemini: 'air', libra: 'air', aquarius: 'air',
        cancer: 'water', scorpio: 'water', pisces: 'water'
      };
      
      const sameElement = elements[sign1] === elements[sign2];
      const planetaryScore = sameElement ? 90 : zodiacScore;

      // Overall love score
      const loveScore = Math.round((zodiacScore * 0.4 + numerologyScore * 0.35 + planetaryScore * 0.25));

      let compatibility;
      if (loveScore >= 90) compatibility = language === 'en' ? 'Soulmates ❤️' : 'आत्मीय साथी ❤️';
      else if (loveScore >= 75) compatibility = language === 'en' ? 'Perfect Match 💕' : 'सर्वोत्तम जोड़ी 💕';
      else if (loveScore >= 60) compatibility = language === 'en' ? 'Great Connection 💖' : 'महान संबंध 💖';
      else if (loveScore >= 45) compatibility = language === 'en' ? 'Potential Romance 💗' : 'संभावित प्रेम 💗';
      else compatibility = language === 'en' ? 'Needs Work 💔' : 'प्रयास की आवश्यकता 💔';

      const insights = language === 'en' ? [
        `Your zodiac signs create a ${zodiacScore >= 70 ? 'harmonious' : 'challenging'} cosmic energy`,
        `Life path numbers ${lifePathNumber1} and ${lifePathNumber2} ${numerologyScore >= 70 ? 'resonate beautifully' : 'offer growth opportunities'}`,
        `Planetary alignment suggests ${planetaryScore >= 70 ? 'strong romantic potential' : 'building emotional bonds over time'}`
      ] : [
        `आपके राशि चिह्न ${zodiacScore >= 70 ? 'सामंजस्यपूर्ण' : 'चुनौतीपूर्ण'} ब्रह्मांडीय ऊर्जा बनाते हैं`,
        `जीवन पथ संख्या ${lifePathNumber1} और ${lifePathNumber2} ${numerologyScore >= 70 ? 'सुंदर प्रतिध्वनि करते हैं' : 'विकास के अवसर प्रदान करते हैं'}`,
        `ग्रहों की स्थिति ${planetaryScore >= 70 ? 'मजबूत रोमांटिक संभावना' : 'समय के साथ भावनात्मक बंधन बनाने'} का सुझाव देती है`
      ];

      const loveResult: AstroLoveResult = {
        person1: { name: formData.person1.name, sign: sign1, lifePathNumber: lifePathNumber1 },
        person2: { name: formData.person2.name, sign: sign2, lifePathNumber: lifePathNumber2 },
        loveScore,
        zodiacScore,
        numerologyScore,
        planetaryScore,
        compatibility,
        insights
      };

      setResult(loveResult);
      
      toast.success(
        language === 'en'
          ? '💕 Love compatibility calculated!'
          : '💕 प्रेम संगतता की गणना की गई!'
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

  return {
    loading,
    result,
    calculateCompatibility,
    resetResult
  };
};
