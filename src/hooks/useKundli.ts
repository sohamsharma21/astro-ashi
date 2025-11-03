
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { swissEphemerisService } from '@/services/swissEphemerisService';
import { KundliFormData } from '@/components/kundli/KundliForm';

export interface KundliData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  ascendant: string;
  ascendantDegree?: number;
  houses: any[];
  planetPositions: {
    planet: string;
    sign: string;
    degree: number;
  }[];
  insights?: string;
}

export const useKundli = () => {
  const { user, language } = useAuth();
  const { recordReading } = useReadingHistory();
  const [loading, setLoading] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [kundliData, setKundliData] = useState<KundliData | null>(null);

  const generateKundli = async (formData: KundliFormData) => {
    setLoading(true);

    try {
      if (!user) {
        throw new Error('User must be logged in to generate kundli');
      }

      const latitude = formData.latitude ? parseFloat(formData.latitude) : 28.6139; // Default to Delhi
      const longitude = formData.longitude ? parseFloat(formData.longitude) : 77.2090;
      
      // Save the kundli data to Supabase
      const { data, error } = await supabase
        .from('kundli_data')
        .insert({
          user_id: user.id,
          name: formData.name,
          birth_date: new Date(formData.birthDate).toISOString(),
          birth_time: formData.birthTime,
          birth_place: formData.birthPlace,
          latitude: latitude,
          longitude: longitude
        })
        .select()
        .single();

      if (error) throw error;

      // Record the reading in history
      await recordReading('kundli', data.id);

      // Calculate planetary positions using the edge function
      const { data: calculationData, error: calcError } = await supabase.functions.invoke('calculate-kundli', {
        body: {
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          latitude: latitude,
          longitude: longitude
        }
      });

      if (calcError) {
        console.error('Error calculating kundli:', calcError);
        throw new Error('Failed to calculate planetary positions');
      }

      const kundliResult: KundliData = {
        name: formData.name,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        ascendant: calculationData.ascendant,
        ascendantDegree: calculationData.ascendantDegree,
        planetPositions: calculationData.planetPositions,
        houses: calculationData.houses
      };

      setKundliData(kundliResult);

      // Generate AI insights asynchronously
      setLoadingInsights(true);
      try {
        const { data: insightsData, error: insightsError } = await supabase.functions.invoke('generate-kundli-insights', {
          body: {
            name: formData.name,
            ascendant: calculationData.ascendant,
            planetPositions: calculationData.planetPositions,
            houses: calculationData.houses,
            language: language
          }
        });

        if (!insightsError && insightsData?.insights) {
          setKundliData(prev => prev ? { ...prev, insights: insightsData.insights } : null);
        }
      } catch (insightsError) {
        console.error('Error generating insights:', insightsError);
        // Non-critical error, don't fail the whole process
      } finally {
        setLoadingInsights(false);
      }

    } catch (error: any) {
      toast.error(error.message);
      console.error('Error generating kundli:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetKundli = () => {
    setKundliData(null);
  };

  return {
    loading,
    loadingInsights,
    kundliData,
    generateKundli,
    resetKundli
  };
};
