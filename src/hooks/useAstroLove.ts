import { useState } from 'react';
import { toast } from 'sonner';
import { ZodiacSign } from '@/lib/constants';
import { useAuth } from '@/lib/auth';
import { useReadingHistory } from '@/hooks/useReadingHistory';

export interface AstroLoveFormData {
  person1: { name: string; birthDate: string };
  person2: { name: string; birthDate: string };
}

export interface LoveDimension {
  name: string;
  nameHi: string;
  score: number;
  icon: string;
  color: string;
}

export interface AstroLoveResult {
  person1: { name: string; sign: ZodiacSign; lifePathNumber: number; element: string; rulingPlanet: string };
  person2: { name: string; sign: ZodiacSign; lifePathNumber: number; element: string; rulingPlanet: string };
  loveScore: number;
  dimensions: LoveDimension[];
  compatibility: string;
  compatibilityHi: string;
  loveStory: { en: string; hi: string };
  tips: { en: string; hi: string }[];
}

const ELEMENTS: Record<ZodiacSign, string> = {
  aries: 'Fire', leo: 'Fire', sagittarius: 'Fire',
  taurus: 'Earth', virgo: 'Earth', capricorn: 'Earth',
  gemini: 'Air', libra: 'Air', aquarius: 'Air',
  cancer: 'Water', scorpio: 'Water', pisces: 'Water'
};

const RULING_PLANETS: Record<ZodiacSign, string> = {
  aries: 'Mars', taurus: 'Venus', gemini: 'Mercury', cancer: 'Moon',
  leo: 'Sun', virgo: 'Mercury', libra: 'Venus', scorpio: 'Mars',
  sagittarius: 'Jupiter', capricorn: 'Saturn', aquarius: 'Saturn', pisces: 'Jupiter'
};

// Element harmony scoring
const ELEMENT_HARMONY: Record<string, Record<string, number>> = {
  Fire: { Fire: 85, Air: 90, Earth: 45, Water: 40 },
  Earth: { Fire: 45, Air: 55, Earth: 88, Water: 92 },
  Air: { Fire: 90, Air: 82, Earth: 55, Water: 50 },
  Water: { Fire: 40, Air: 50, Earth: 92, Water: 85 }
};

// Refined compatibility matrix using Vedic + Western blended approach
const ZODIAC_MATRIX: Record<ZodiacSign, Record<ZodiacSign, number>> = {
  aries: { aries: 72, taurus: 38, gemini: 83, cancer: 47, leo: 93, virgo: 42, libra: 68, scorpio: 55, sagittarius: 88, capricorn: 33, aquarius: 78, pisces: 52 },
  taurus: { aries: 38, taurus: 88, gemini: 48, cancer: 87, leo: 58, virgo: 95, libra: 73, scorpio: 92, sagittarius: 38, capricorn: 96, aquarius: 42, pisces: 86 },
  gemini: { aries: 83, taurus: 48, gemini: 74, cancer: 42, leo: 82, virgo: 63, libra: 94, scorpio: 38, sagittarius: 87, capricorn: 43, aquarius: 96, pisces: 48 },
  cancer: { aries: 47, taurus: 87, gemini: 42, cancer: 93, leo: 58, virgo: 82, libra: 48, scorpio: 96, sagittarius: 38, capricorn: 72, aquarius: 37, pisces: 97 },
  leo: { aries: 93, taurus: 58, gemini: 82, cancer: 58, leo: 83, virgo: 48, libra: 78, scorpio: 62, sagittarius: 96, capricorn: 43, aquarius: 67, pisces: 57 },
  virgo: { aries: 42, taurus: 95, gemini: 63, cancer: 82, leo: 48, virgo: 84, libra: 58, scorpio: 87, sagittarius: 43, capricorn: 96, aquarius: 48, pisces: 72 },
  libra: { aries: 68, taurus: 73, gemini: 94, cancer: 48, leo: 78, virgo: 58, libra: 82, scorpio: 43, sagittarius: 73, capricorn: 53, aquarius: 92, pisces: 58 },
  scorpio: { aries: 55, taurus: 92, gemini: 38, cancer: 96, leo: 62, virgo: 87, libra: 43, scorpio: 88, sagittarius: 58, capricorn: 82, aquarius: 38, pisces: 97 },
  sagittarius: { aries: 88, taurus: 38, gemini: 87, cancer: 38, leo: 96, virgo: 43, libra: 73, scorpio: 58, sagittarius: 82, capricorn: 53, aquarius: 87, pisces: 48 },
  capricorn: { aries: 33, taurus: 96, gemini: 43, cancer: 72, leo: 43, virgo: 96, libra: 53, scorpio: 82, sagittarius: 53, capricorn: 87, aquarius: 58, pisces: 77 },
  aquarius: { aries: 78, taurus: 42, gemini: 96, cancer: 37, leo: 67, virgo: 48, libra: 92, scorpio: 38, sagittarius: 87, capricorn: 58, aquarius: 82, pisces: 53 },
  pisces: { aries: 52, taurus: 86, gemini: 48, cancer: 97, leo: 57, virgo: 72, libra: 58, scorpio: 97, sagittarius: 48, capricorn: 77, aquarius: 53, pisces: 88 }
};

// Numerology master number aware compatibility
const NUMEROLOGY_COMPAT: Record<string, number> = {
  '0': 100, '1': 88, '2': 82, '3': 72, '4': 65, '5': 58, '6': 52, '7': 45, '8': 40,
  '11': 95, '22': 95, '33': 95
};

// Planet friendship for love
const VENUS_FRIENDLY = ['Moon', 'Mercury', 'Saturn', 'Jupiter'];
const MARS_FRIENDLY = ['Sun', 'Moon', 'Jupiter'];

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
    const dateStr = new Date(birthDate).toISOString().split('T')[0].replace(/-/g, '');
    let sum = dateStr.split('').reduce((acc, d) => acc + parseInt(d), 0);
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
    }
    return sum;
  };

  const calculateCompatibility = async (formData: AstroLoveFormData) => {
    setLoading(true);
    try {
      const contentId = crypto.randomUUID();
      if (user) await recordReading('astro-love', contentId);

      const sign1 = getZodiacSign(formData.person1.birthDate);
      const sign2 = getZodiacSign(formData.person2.birthDate);
      const lp1 = calculateLifePathNumber(formData.person1.birthDate);
      const lp2 = calculateLifePathNumber(formData.person2.birthDate);
      const elem1 = ELEMENTS[sign1];
      const elem2 = ELEMENTS[sign2];
      const planet1 = RULING_PLANETS[sign1];
      const planet2 = RULING_PLANETS[sign2];

      // 1. Zodiac Chemistry (30%)
      const zodiacScore = ZODIAC_MATRIX[sign1][sign2];

      // 2. Element Harmony (20%)
      const elementScore = ELEMENT_HARMONY[elem1][elem2];

      // 3. Numerology Resonance (15%)
      const lpDiff = Math.abs(lp1 - lp2);
      const isMaster = [11, 22, 33].includes(lp1) || [11, 22, 33].includes(lp2);
      const numerologyScore = isMaster ? 95 : (NUMEROLOGY_COMPAT[lpDiff.toString()] ?? 40);

      // 4. Planetary Love Alignment (15%)  
      const venusAffinity = (VENUS_FRIENDLY.includes(planet1) ? 15 : 0) + (VENUS_FRIENDLY.includes(planet2) ? 15 : 0);
      const marsAffinity = (MARS_FRIENDLY.includes(planet1) ? 10 : 0) + (MARS_FRIENDLY.includes(planet2) ? 10 : 0);
      const samePlanet = planet1 === planet2 ? 20 : 0;
      const planetaryScore = Math.min(100, 30 + venusAffinity + marsAffinity + samePlanet);

      // 5. Emotional Depth (10%)
      const waterSigns: ZodiacSign[] = ['cancer', 'scorpio', 'pisces'];
      const emotionalBonus = (waterSigns.includes(sign1) ? 15 : 0) + (waterSigns.includes(sign2) ? 15 : 0);
      const emotionalScore = Math.min(100, elementScore * 0.5 + zodiacScore * 0.3 + emotionalBonus);

      // 6. Communication & Intellect (10%)
      const airSigns: ZodiacSign[] = ['gemini', 'libra', 'aquarius'];
      const mercurySigns: ZodiacSign[] = ['gemini', 'virgo'];
      const commBonus = (airSigns.includes(sign1) ? 12 : 0) + (airSigns.includes(sign2) ? 12 : 0) +
                        (mercurySigns.includes(sign1) ? 8 : 0) + (mercurySigns.includes(sign2) ? 8 : 0);
      const communicationScore = Math.min(100, 40 + commBonus + (elem1 === elem2 ? 15 : 0));

      // Weighted love score
      const loveScore = Math.round(
        zodiacScore * 0.30 +
        elementScore * 0.20 +
        numerologyScore * 0.15 +
        planetaryScore * 0.15 +
        emotionalScore * 0.10 +
        communicationScore * 0.10
      );

      const dimensions: LoveDimension[] = [
        { name: 'Zodiac Chemistry', nameHi: 'राशि केमिस्ट्री', score: zodiacScore, icon: '🌟', color: 'from-amber-400 to-orange-500' },
        { name: 'Element Harmony', nameHi: 'तत्व सामंजस्य', score: elementScore, icon: '🔥', color: 'from-red-400 to-pink-500' },
        { name: 'Numerology Bond', nameHi: 'अंकशास्त्र बंधन', score: numerologyScore, icon: '🔢', color: 'from-purple-400 to-indigo-500' },
        { name: 'Planetary Love', nameHi: 'ग्रहीय प्रेम', score: planetaryScore, icon: '🪐', color: 'from-blue-400 to-cyan-500' },
        { name: 'Emotional Depth', nameHi: 'भावनात्मक गहराई', score: Math.round(emotionalScore), icon: '💎', color: 'from-teal-400 to-emerald-500' },
        { name: 'Communication', nameHi: 'संवाद', score: Math.round(communicationScore), icon: '💬', color: 'from-rose-400 to-fuchsia-500' }
      ];

      let compatibility = '';
      let compatibilityHi = '';
      if (loveScore >= 85) { compatibility = 'Twin Flames 🔥'; compatibilityHi = 'जुड़वां लपटें 🔥'; }
      else if (loveScore >= 72) { compatibility = 'Soulmates 💕'; compatibilityHi = 'आत्मीय साथी 💕'; }
      else if (loveScore >= 58) { compatibility = 'Strong Connection 💖'; compatibilityHi = 'मजबूत जुड़ाव 💖'; }
      else if (loveScore >= 45) { compatibility = 'Growing Love 🌱'; compatibilityHi = 'बढ़ता प्यार 🌱'; }
      else { compatibility = 'Opposites Attract ⚡'; compatibilityHi = 'विपरीत आकर्षण ⚡'; }

      // Generate love story based on elements
      const loveStory = generateLoveStory(elem1, elem2, loveScore);

      // Generate actionable tips
      const tips = generateTips(sign1, sign2, elem1, elem2, loveScore);

      setResult({
        person1: { name: formData.person1.name, sign: sign1, lifePathNumber: lp1, element: elem1, rulingPlanet: planet1 },
        person2: { name: formData.person2.name, sign: sign2, lifePathNumber: lp2, element: elem2, rulingPlanet: planet2 },
        loveScore,
        dimensions,
        compatibility,
        compatibilityHi,
        loveStory,
        tips
      });

      toast.success(language === 'en' ? '💕 Love analysis complete!' : '💕 प्रेम विश्लेषण पूर्ण!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateLoveStory = (e1: string, e2: string, score: number): { en: string; hi: string } => {
    const key = [e1, e2].sort().join('-');
    const stories: Record<string, { en: string; hi: string }> = {
      'Air-Air': { en: 'Two brilliant minds creating endless conversations and shared dreams. Your intellectual bond is your superpower — you inspire each other to think bigger and love deeper.', hi: 'दो प्रतिभाशाली दिमाग अंतहीन बातचीत और साझा सपने बना रहे हैं। आपका बौद्धिक बंधन आपकी महाशक्ति है।' },
      'Air-Fire': { en: 'Air fans the flames of Fire — together you create a passionate, adventurous love that lights up every room. Your energy is contagious and your love story is legendary.', hi: 'वायु अग्नि की लपटों को हवा देती है — साथ मिलकर आप एक भावुक, साहसिक प्रेम बनाते हैं जो हर कमरे को रोशन करता है।' },
      'Air-Earth': { en: 'Earth grounds Air\'s soaring ideas while Air lifts Earth from routine. Together you find balance between dreams and reality — a love built on growth.', hi: 'पृथ्वी वायु के उड़ते विचारों को जमीन देती है जबकि वायु पृथ्वी को दिनचर्या से ऊपर उठाती है।' },
      'Air-Water': { en: 'Air creates gentle waves on Water\'s surface — sometimes stormy, sometimes magical. Your love teaches both partners to feel deeply and think clearly.', hi: 'वायु पानी की सतह पर कोमल लहरें बनाती है — कभी तूफानी, कभी जादुई।' },
      'Earth-Earth': { en: 'Two souls building a fortress of love — stable, reliable, and deeply committed. Your love grows like an ancient tree, stronger with each passing season.', hi: 'दो आत्माएं प्रेम का किला बना रही हैं — स्थिर, विश्वसनीय और गहरी प्रतिबद्ध।' },
      'Earth-Fire': { en: 'Fire warms Earth\'s heart while Earth gives Fire a home. Your love is the perfect dance between passion and stability.', hi: 'अग्नि पृथ्वी के हृदय को गर्म करती है जबकि पृथ्वी अग्नि को एक घर देती है।' },
      'Earth-Water': { en: 'Water nourishes Earth, creating a garden of love that blooms endlessly. Yours is the most nurturing and naturally harmonious combination.', hi: 'पानी पृथ्वी को पोषित करता है, एक प्रेम का बगीचा बनाता है जो अनंत रूप से खिलता है।' },
      'Fire-Fire': { en: 'Two flames merging into a blazing love — passionate, dramatic, and unforgettable. Your love burns bright and inspires everyone around you.', hi: 'दो लपटें एक धधकते प्रेम में विलीन — भावुक, नाटकीय और अविस्मरणीय।' },
      'Fire-Water': { en: 'Steam rises when Fire meets Water — intense, transformative love that changes both partners forever. Your contrasts create magic.', hi: 'जब अग्नि पानी से मिलती है तो भाप उठती है — तीव्र, परिवर्तनकारी प्रेम।' },
      'Water-Water': { en: 'Two oceans merging — the deepest, most emotionally profound love. You understand each other without words, connected at a soul level.', hi: 'दो महासागर एक हो रहे हैं — सबसे गहरा, सबसे भावनात्मक रूप से गहन प्रेम।' }
    };
    return stories[key] || stories['Air-Fire']!;
  };

  const generateTips = (s1: ZodiacSign, s2: ZodiacSign, e1: string, e2: string, score: number): { en: string; hi: string }[] => {
    const tips: { en: string; hi: string }[] = [];

    if (e1 !== e2) {
      tips.push({ en: `Embrace your differences — ${e1} and ${e2} complement each other beautifully when balanced`, hi: `अपनी भिन्नताओं को अपनाएं — ${e1} और ${e2} संतुलित होने पर एक-दूसरे के पूरक हैं` });
    }

    if (score >= 70) {
      tips.push({ en: 'Your natural chemistry is strong — nurture it with quality time together', hi: 'आपकी प्राकृतिक केमिस्ट्री मजबूत है — साथ में गुणवत्तापूर्ण समय बिताकर इसे पोषित करें' });
    } else {
      tips.push({ en: 'Focus on open communication and patience — great love is built over time', hi: 'खुले संवाद और धैर्य पर ध्यान दें — महान प्रेम समय के साथ बनता है' });
    }

    tips.push({ en: 'Plan activities that honor both your energies — adventure AND comfort', hi: 'ऐसी गतिविधियाँ करें जो दोनों की ऊर्जाओं का सम्मान करें — साहस और आराम दोनों' });

    if (['cancer', 'scorpio', 'pisces'].includes(s1) || ['cancer', 'scorpio', 'pisces'].includes(s2)) {
      tips.push({ en: 'Honor emotional vulnerability — it\'s your relationship\'s greatest strength', hi: 'भावनात्मक संवेदनशीलता का सम्मान करें — यह आपके रिश्ते की सबसे बड़ी ताकत है' });
    }

    return tips;
  };

  const resetResult = () => setResult(null);

  return { loading, result, calculateCompatibility, resetResult };
};
