import { useState } from 'react';
import { toast } from 'sonner';
import { ZodiacSign } from '@/lib/constants';
import { useAuth } from '@/lib/auth';
import { useReadingHistory } from '@/hooks/useReadingHistory';

export interface CompatibilityFormData {
  person1: { name: string; sign: ZodiacSign; birthDate: string };
  person2: { name: string; sign: ZodiacSign; birthDate: string };
}

export interface AspectDetail {
  name: string;
  nameHi: string;
  score: number;
  maxScore: number;
  description: string;
  descriptionHi: string;
  icon: string;
}

export interface CompatibilityResult {
  person1: { name: string; sign: ZodiacSign; element: string; modality: string; rulingPlanet: string; nakshatra: string };
  person2: { name: string; sign: ZodiacSign; element: string; modality: string; rulingPlanet: string; nakshatra: string };
  overallScore: number;
  maxScore: number;
  percentage: number;
  compatibility: string;
  compatibilityHi: string;
  aspects: AspectDetail[];
  strengths: { en: string; hi: string }[];
  challenges: { en: string; hi: string }[];
  advice: { en: string; hi: string };
}

// Vedic Astrology: Nakshatra mapping from zodiac sign (simplified - each sign spans ~2.25 nakshatras)
const SIGN_NAKSHATRAS: Record<ZodiacSign, string[]> = {
  aries: ['Ashwini', 'Bharani', 'Krittika'],
  taurus: ['Krittika', 'Rohini', 'Mrigashira'],
  gemini: ['Mrigashira', 'Ardra', 'Punarvasu'],
  cancer: ['Punarvasu', 'Pushya', 'Ashlesha'],
  leo: ['Magha', 'PurvaPhalguni', 'UttaraPhalguni'],
  virgo: ['UttaraPhalguni', 'Hasta', 'Chitra'],
  libra: ['Chitra', 'Swati', 'Vishakha'],
  scorpio: ['Vishakha', 'Anuradha', 'Jyeshtha'],
  sagittarius: ['Moola', 'PurvaAshadha', 'UttaraAshadha'],
  capricorn: ['UttaraAshadha', 'Shravana', 'Dhanishta'],
  aquarius: ['Dhanishta', 'Shatabhisha', 'PurvaBhadrapada'],
  pisces: ['PurvaBhadrapada', 'UttaraBhadrapada', 'Revati']
};

// Nadi (Health compatibility) - 8 points max
const NADI_MAP: Record<string, string> = {
  Ashwini: 'Aadi', Bharani: 'Madhya', Krittika: 'Antya',
  Rohini: 'Aadi', Mrigashira: 'Madhya', Ardra: 'Antya',
  Punarvasu: 'Aadi', Pushya: 'Madhya', Ashlesha: 'Antya',
  Magha: 'Aadi', PurvaPhalguni: 'Madhya', UttaraPhalguni: 'Antya',
  Hasta: 'Aadi', Chitra: 'Madhya', Swati: 'Antya',
  Vishakha: 'Aadi', Anuradha: 'Madhya', Jyeshtha: 'Antya',
  Moola: 'Aadi', PurvaAshadha: 'Madhya', UttaraAshadha: 'Antya',
  Shravana: 'Aadi', Dhanishta: 'Madhya', Shatabhisha: 'Antya',
  PurvaBhadrapada: 'Aadi', UttaraBhadrapada: 'Madhya', Revati: 'Antya'
};

// Gana (Temperament) - 6 points max
const GANA_MAP: Record<string, string> = {
  Ashwini: 'Deva', Bharani: 'Manushya', Krittika: 'Rakshasa',
  Rohini: 'Manushya', Mrigashira: 'Deva', Ardra: 'Manushya',
  Punarvasu: 'Deva', Pushya: 'Deva', Ashlesha: 'Rakshasa',
  Magha: 'Rakshasa', PurvaPhalguni: 'Manushya', UttaraPhalguni: 'Manushya',
  Hasta: 'Deva', Chitra: 'Rakshasa', Swati: 'Deva',
  Vishakha: 'Rakshasa', Anuradha: 'Deva', Jyeshtha: 'Rakshasa',
  Moola: 'Rakshasa', PurvaAshadha: 'Manushya', UttaraAshadha: 'Manushya',
  Shravana: 'Deva', Dhanishta: 'Rakshasa', Shatabhisha: 'Rakshasa',
  PurvaBhadrapada: 'Manushya', UttaraBhadrapada: 'Manushya', Revati: 'Deva'
};

// Yoni (Physical/Sexual) - 4 points max  
const YONI_MAP: Record<string, string> = {
  Ashwini: 'Horse', Bharani: 'Elephant', Krittika: 'Sheep',
  Rohini: 'Serpent', Mrigashira: 'Serpent', Ardra: 'Dog',
  Punarvasu: 'Cat', Pushya: 'Sheep', Ashlesha: 'Cat',
  Magha: 'Rat', PurvaPhalguni: 'Rat', UttaraPhalguni: 'Cow',
  Hasta: 'Buffalo', Chitra: 'Tiger', Swati: 'Buffalo',
  Vishakha: 'Tiger', Anuradha: 'Deer', Jyeshtha: 'Deer',
  Moola: 'Dog', PurvaAshadha: 'Monkey', UttaraAshadha: 'Mongoose',
  Shravana: 'Monkey', Dhanishta: 'Lion', Shatabhisha: 'Horse',
  PurvaBhadrapada: 'Lion', UttaraBhadrapada: 'Cow', Revati: 'Elephant'
};

const ELEMENTS: Record<ZodiacSign, string> = {
  aries: 'Fire', leo: 'Fire', sagittarius: 'Fire',
  taurus: 'Earth', virgo: 'Earth', capricorn: 'Earth',
  gemini: 'Air', libra: 'Air', aquarius: 'Air',
  cancer: 'Water', scorpio: 'Water', pisces: 'Water'
};

const MODALITIES: Record<ZodiacSign, string> = {
  aries: 'Cardinal', cancer: 'Cardinal', libra: 'Cardinal', capricorn: 'Cardinal',
  taurus: 'Fixed', leo: 'Fixed', scorpio: 'Fixed', aquarius: 'Fixed',
  gemini: 'Mutable', virgo: 'Mutable', sagittarius: 'Mutable', pisces: 'Mutable'
};

const RULING_PLANETS: Record<ZodiacSign, string> = {
  aries: 'Mars', taurus: 'Venus', gemini: 'Mercury', cancer: 'Moon',
  leo: 'Sun', virgo: 'Mercury', libra: 'Venus', scorpio: 'Mars',
  sagittarius: 'Jupiter', capricorn: 'Saturn', aquarius: 'Saturn', pisces: 'Jupiter'
};

// Bhakoot (Sign-lord relationship) - 7 points max
const BHAKOOT_MATRIX: Record<number, number> = {
  1: 7, 2: 0, 3: 5, 4: 5, 5: 7, 6: 0, 7: 7, 8: 0, 9: 5, 10: 5, 11: 7, 12: 0, 0: 7
};

// Tara (Birth star compatibility) - 3 points max
function calcTara(n1Index: number, n2Index: number): number {
  const diff = ((n2Index - n1Index) % 9 + 9) % 9;
  const auspicious = [1, 2, 4, 6, 8, 0];
  return auspicious.includes(diff) ? 3 : 0;
}

// Vashya (Dominance) - 2 points max
const VASHYA_GROUPS: Record<ZodiacSign, string> = {
  aries: 'Chatushpada', taurus: 'Chatushpada', leo: 'Vanachara', sagittarius: 'Chatushpada',
  cancer: 'Jalachara', scorpio: 'Keeta', pisces: 'Jalachara',
  gemini: 'Dvipaada', virgo: 'Dvipaada', libra: 'Dvipaada', aquarius: 'Dvipaada',
  capricorn: 'Chatushpada'
};

function calcVashya(s1: ZodiacSign, s2: ZodiacSign): number {
  if (VASHYA_GROUPS[s1] === VASHYA_GROUPS[s2]) return 2;
  return 1;
}

// Maitri (Friendship of sign-lords) - 5 points max
const PLANET_FRIENDS: Record<string, string[]> = {
  Sun: ['Moon', 'Mars', 'Jupiter'],
  Moon: ['Sun', 'Mercury'],
  Mars: ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Venus'],
  Jupiter: ['Sun', 'Moon', 'Mars'],
  Venus: ['Mercury', 'Saturn'],
  Saturn: ['Mercury', 'Venus']
};

function calcMaitri(s1: ZodiacSign, s2: ZodiacSign): number {
  const p1 = RULING_PLANETS[s1];
  const p2 = RULING_PLANETS[s2];
  if (p1 === p2) return 5;
  const p1FriendsP2 = PLANET_FRIENDS[p1]?.includes(p2);
  const p2FriendsP1 = PLANET_FRIENDS[p2]?.includes(p1);
  if (p1FriendsP2 && p2FriendsP1) return 5;
  if (p1FriendsP2 || p2FriendsP1) return 3;
  return 0;
}

const ALL_NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'PurvaPhalguni', 'UttaraPhalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Moola', 'PurvaAshadha', 'UttaraAshadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'PurvaBhadrapada', 'UttaraBhadrapada', 'Revati'
];

function getPrimaryNakshatra(sign: ZodiacSign): string {
  return SIGN_NAKSHATRAS[sign][0];
}

export const useCompatibility = () => {
  const { language, user } = useAuth();
  const { recordReading } = useReadingHistory();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const calculateCompatibility = async (formData: CompatibilityFormData) => {
    setLoading(true);
    try {
      const contentId = crypto.randomUUID();
      if (user) await recordReading('compatibility', contentId);

      const s1 = formData.person1.sign;
      const s2 = formData.person2.sign;
      const nak1 = getPrimaryNakshatra(s1);
      const nak2 = getPrimaryNakshatra(s2);
      const nak1Idx = ALL_NAKSHATRAS.indexOf(nak1);
      const nak2Idx = ALL_NAKSHATRAS.indexOf(nak2);

      // 1. Nadi (8 points)
      const nadi1 = NADI_MAP[nak1];
      const nadi2 = NADI_MAP[nak2];
      const nadiScore = nadi1 !== nadi2 ? 8 : 0;

      // 2. Bhakoot (7 points)
      const signIdx = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
      const bhakootDiff = ((signIdx.indexOf(s2) - signIdx.indexOf(s1)) % 12 + 12) % 12;
      const bhakootScore = BHAKOOT_MATRIX[bhakootDiff] ?? 0;

      // 3. Gana (6 points)
      const gana1 = GANA_MAP[nak1];
      const gana2 = GANA_MAP[nak2];
      let ganaScore = 0;
      if (gana1 === gana2) ganaScore = 6;
      else if ((gana1 === 'Deva' && gana2 === 'Manushya') || (gana1 === 'Manushya' && gana2 === 'Deva')) ganaScore = 5;
      else if ((gana1 === 'Manushya' && gana2 === 'Rakshasa') || (gana1 === 'Rakshasa' && gana2 === 'Manushya')) ganaScore = 1;
      else ganaScore = 0;

      // 4. Maitri (5 points)
      const maitriScore = calcMaitri(s1, s2);

      // 5. Yoni (4 points)
      const yoni1 = YONI_MAP[nak1];
      const yoni2 = YONI_MAP[nak2];
      let yoniScore = yoni1 === yoni2 ? 4 : 2;

      // 6. Tara (3 points)
      const taraScore = calcTara(nak1Idx, nak2Idx);

      // 7. Vashya (2 points)
      const vashyaScore = calcVashya(s1, s2);

      // 8. Varna (1 point)
      const varnaOrder = ['pisces','cancer','scorpio','aries','leo','sagittarius','gemini','libra','aquarius','taurus','virgo','capricorn'];
      const v1 = Math.floor(varnaOrder.indexOf(s1) / 3);
      const v2 = Math.floor(varnaOrder.indexOf(s2) / 3);
      const varnaScore = v1 >= v2 ? 1 : 0;

      const totalScore = nadiScore + bhakootScore + ganaScore + maitriScore + yoniScore + taraScore + vashyaScore + varnaScore;
      const maxScore = 36;
      const percentage = Math.round((totalScore / maxScore) * 100);

      let compatibility = '';
      let compatibilityHi = '';
      if (percentage >= 80) { compatibility = 'Exceptional Match ✨'; compatibilityHi = 'असाधारण जोड़ी ✨'; }
      else if (percentage >= 65) { compatibility = 'Excellent Match 💫'; compatibilityHi = 'उत्कृष्ट जोड़ी 💫'; }
      else if (percentage >= 50) { compatibility = 'Good Match 🌟'; compatibilityHi = 'अच्छी जोड़ी 🌟'; }
      else if (percentage >= 35) { compatibility = 'Average Match 🌙'; compatibilityHi = 'औसत जोड़ी 🌙'; }
      else { compatibility = 'Challenging Match ⚡'; compatibilityHi = 'चुनौतीपूर्ण जोड़ी ⚡'; }

      const aspects: AspectDetail[] = [
        { name: 'Nadi', nameHi: 'नाड़ी', score: nadiScore, maxScore: 8, description: nadiScore > 0 ? 'Health & genetic compatibility is strong' : 'Same Nadi — remedies recommended', descriptionHi: nadiScore > 0 ? 'स्वास्थ्य और आनुवंशिक अनुकूलता मजबूत है' : 'एक ही नाड़ी — उपाय सुझाए जाते हैं', icon: '🧬' },
        { name: 'Bhakoot', nameHi: 'भकूट', score: bhakootScore, maxScore: 7, description: bhakootScore >= 5 ? 'Financial & family harmony is favorable' : 'Potential friction in family matters', descriptionHi: bhakootScore >= 5 ? 'आर्थिक और पारिवारिक सामंजस्य अनुकूल' : 'पारिवारिक मामलों में संभावित तनाव', icon: '🏠' },
        { name: 'Gana', nameHi: 'गण', score: ganaScore, maxScore: 6, description: ganaScore >= 4 ? 'Temperaments are naturally aligned' : 'Different temperaments need understanding', descriptionHi: ganaScore >= 4 ? 'स्वभाव प्राकृतिक रूप से मेल खाते हैं' : 'अलग स्वभाव में समझ की जरूरत', icon: '🧘' },
        { name: 'Maitri', nameHi: 'मैत्री', score: maitriScore, maxScore: 5, description: maitriScore >= 3 ? 'Planetary lords share friendship' : 'Ruling planets are not aligned', descriptionHi: maitriScore >= 3 ? 'ग्रह स्वामी मित्रवत हैं' : 'शासक ग्रह अनुकूल नहीं', icon: '🤝' },
        { name: 'Yoni', nameHi: 'योनि', score: yoniScore, maxScore: 4, description: yoniScore >= 3 ? 'Strong physical & intimate harmony' : 'Physical compatibility needs attention', descriptionHi: yoniScore >= 3 ? 'शारीरिक सामंजस्य मजबूत' : 'शारीरिक अनुकूलता पर ध्यान दें', icon: '💞' },
        { name: 'Tara', nameHi: 'तारा', score: taraScore, maxScore: 3, description: taraScore > 0 ? 'Birth stars are auspiciously placed' : 'Birth stars need remedial measures', descriptionHi: taraScore > 0 ? 'जन्म नक्षत्र शुभ स्थिति में' : 'जन्म नक्षत्र में उपाय आवश्यक', icon: '⭐' },
        { name: 'Vashya', nameHi: 'वश्य', score: vashyaScore, maxScore: 2, description: vashyaScore >= 2 ? 'Mutual attraction & influence is strong' : 'Moderate mutual attraction', descriptionHi: vashyaScore >= 2 ? 'आपसी आकर्षण मजबूत' : 'मध्यम आपसी आकर्षण', icon: '🧲' },
        { name: 'Varna', nameHi: 'वर्ण', score: varnaScore, maxScore: 1, description: varnaScore > 0 ? 'Spiritual compatibility present' : 'Different spiritual orientations', descriptionHi: varnaScore > 0 ? 'आध्यात्मिक अनुकूलता है' : 'भिन्न आध्यात्मिक दृष्टिकोण', icon: '🕉️' }
      ];

      // Generate strengths and challenges
      const strengths: { en: string; hi: string }[] = [];
      const challenges: { en: string; hi: string }[] = [];

      if (nadiScore === 8) strengths.push({ en: 'Excellent health & genetic compatibility', hi: 'उत्कृष्ट स्वास्थ्य और आनुवंशिक अनुकूलता' });
      else challenges.push({ en: 'Nadi Dosha present — consult for remedies', hi: 'नाड़ी दोष — उपाय हेतु परामर्श लें' });

      if (bhakootScore >= 5) strengths.push({ en: 'Strong financial & family harmony', hi: 'मजबूत आर्थिक और पारिवारिक सामंजस्य' });
      else challenges.push({ en: 'Bhakoot Dosha may cause family tensions', hi: 'भकूट दोष से पारिवारिक तनाव संभव' });

      if (ganaScore >= 4) strengths.push({ en: 'Natural temperament alignment', hi: 'स्वाभाविक स्वभाव में सामंजस्य' });
      if (maitriScore >= 3) strengths.push({ en: 'Ruling planets support mutual growth', hi: 'शासक ग्रह पारस्परिक विकास का समर्थन करते हैं' });

      const sameElement = ELEMENTS[s1] === ELEMENTS[s2];
      if (sameElement) strengths.push({ en: `Both share ${ELEMENTS[s1]} element — deep understanding`, hi: `दोनों ${ELEMENTS[s1]} तत्व साझा करते हैं — गहरी समझ` });

      if (strengths.length === 0) strengths.push({ en: 'Growth through understanding differences', hi: 'भिन्नताओं को समझकर विकास' });
      if (challenges.length === 0) challenges.push({ en: 'No major doshas detected', hi: 'कोई बड़ा दोष नहीं पाया गया' });

      const advice = percentage >= 60
        ? { en: 'This is a favorable match. Focus on mutual respect and communication to strengthen the bond.', hi: 'यह अनुकूल जोड़ी है। बंधन मजबूत करने के लिए आपसी सम्मान और संवाद पर ध्यान दें।' }
        : { en: 'Consider performing recommended remedies and focus on building understanding. With effort, challenges can be overcome.', hi: 'अनुशंसित उपाय करें और समझ बनाने पर ध्यान दें। प्रयास से चुनौतियों पर विजय पाई जा सकती है।' };

      setResult({
        person1: { name: formData.person1.name, sign: s1, element: ELEMENTS[s1], modality: MODALITIES[s1], rulingPlanet: RULING_PLANETS[s1], nakshatra: nak1 },
        person2: { name: formData.person2.name, sign: s2, element: ELEMENTS[s2], modality: MODALITIES[s2], rulingPlanet: RULING_PLANETS[s2], nakshatra: nak2 },
        overallScore: totalScore,
        maxScore,
        percentage,
        compatibility,
        compatibilityHi,
        aspects,
        strengths,
        challenges,
        advice
      });

      toast.success(language === 'en' ? '🔮 Ashtakoot analysis complete!' : '🔮 अष्टकूट विश्लेषण पूर्ण!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetResult = () => setResult(null);

  return { loading, result, calculateCompatibility, resetResult };
};
