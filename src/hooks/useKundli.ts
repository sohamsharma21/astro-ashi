import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { KundliFormData } from '@/components/kundli/KundliForm';

export interface StructuredInsights {
  summary: {
    zodiacSign: string;
    zodiacDescription: string;
    moonSign: string;
    moonSignDescription: string;
    risingSign: string;
    risingSignDescription: string;
    element: string;
    rulingPlanet: string;
  };
  personality: { title: string; emoji: string; traits: string[]; description: string };
  career: { title: string; emoji: string; strengths: string[]; bestFields: string[]; description: string };
  relationships: { title: string; emoji: string; loveStyle: string; compatibleSigns: string[]; description: string };
  challenges: { title: string; emoji: string; areas: string[]; remedies: string[]; description: string };
  spiritual: { title: string; emoji: string; path: string; practices: string[]; description: string };
  luckyFactors: { number: string; color: string; day: string; gemstone: string; mantra: string };
}

export interface KundliData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender?: string;
  ascendant: string;
  ascendantDegree?: number;
  houses: any[];
  planetPositions: { planet: string; sign: string; degree: number }[];
  insights?: string;
  structured?: StructuredInsights | null;
}

export const useKundli = () => {
  const { user, language } = useAuth();
  const { recordReading } = useReadingHistory();
  const [loading, setLoading] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [kundliData, setKundliData] = useState<KundliData | null>(null);
  const [savedToProfile, setSavedToProfile] = useState(false);

  const generateKundli = async (formData: KundliFormData) => {
    setLoading(true);
    try {
      if (!user) throw new Error('User must be logged in');

      const latitude = formData.latitude ? parseFloat(formData.latitude) : 28.6139;
      const longitude = formData.longitude ? parseFloat(formData.longitude) : 77.2090;

      const { data, error } = await supabase
        .from('kundli_data')
        .insert({
          user_id: user.id,
          name: formData.name,
          birth_date: new Date(formData.birthDate).toISOString(),
          birth_time: formData.birthTime,
          birth_place: formData.birthPlace,
          latitude, longitude,
        })
        .select()
        .single();
      if (error) throw error;

      await recordReading('kundli', data.id);

      const { data: calculationData, error: calcError } = await supabase.functions.invoke('calculate-kundli', {
        body: { birthDate: formData.birthDate, birthTime: formData.birthTime, latitude, longitude },
      });
      if (calcError) throw new Error('Failed to calculate planetary positions');

      const kundliResult: KundliData = {
        name: formData.name,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        gender: formData.gender,
        ascendant: calculationData.ascendant,
        ascendantDegree: calculationData.ascendantDegree,
        planetPositions: calculationData.planetPositions,
        houses: calculationData.houses,
      };
      setKundliData(kundliResult);

      // Generate structured AI insights
      setLoadingInsights(true);
      try {
        const { data: insightsData, error: insightsError } = await supabase.functions.invoke('generate-kundli-insights', {
          body: {
            name: formData.name,
            gender: formData.gender,
            ascendant: calculationData.ascendant,
            planetPositions: calculationData.planetPositions,
            houses: calculationData.houses,
            language,
          },
        });
        if (!insightsError && insightsData) {
          setKundliData(prev => prev ? {
            ...prev,
            insights: insightsData.insights,
            structured: insightsData.structured || null,
          } : null);
        }
      } catch (e) {
        console.error('Insights error:', e);
      } finally {
        setLoadingInsights(false);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveToProfile = async () => {
    if (!user || !kundliData) return;
    try {
      const moonSign = kundliData.structured?.summary?.moonSign || kundliData.planetPositions.find(p => p.planet === 'Moon')?.sign || null;
      await supabase.from('profiles').update({
        kundli_generated: true,
        lagna: kundliData.ascendant,
        moon_sign: moonSign,
        kundli_data: {
          planetPositions: kundliData.planetPositions,
          houses: kundliData.houses,
          ascendant: kundliData.ascendant,
          structured: kundliData.structured,
        } as any,
      }).eq('id', user.id);
      setSavedToProfile(true);
      toast.success(language === 'hi' ? 'कुंडली प्रोफ़ाइल में सहेजी गई!' : 'Kundli saved to your profile!');
    } catch (e) {
      toast.error('Failed to save');
    }
  };

  const resetKundli = () => {
    setKundliData(null);
    setSavedToProfile(false);
  };

  return { loading, loadingInsights, kundliData, savedToProfile, generateKundli, resetKundli, saveToProfile };
};
