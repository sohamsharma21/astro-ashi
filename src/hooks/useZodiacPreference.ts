
import { useState } from 'react';
import { ZodiacSign } from '@/lib/constants';
import { userProfileApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useZodiacPreference = (userId: string | undefined, language: 'en' | 'hi') => {
  const [savingPreference, setSavingPreference] = useState(false);
  const { toast } = useToast();

  const savePreference = async (selectedSign: ZodiacSign) => {
    if (!userId) {
      toast({
        title: language === 'en' ? 'Sign in required' : 'साइन इन आवश्यक है',
        description: language === 'en' 
          ? 'Please sign in to save your preferences' 
          : 'अपनी पसंद सहेजने के लिए साइन इन करें',
      });
      return;
    }

    setSavingPreference(true);
    
    try {
      // Use the API service to update preference
      await userProfileApi.updateZodiacPreference(userId, selectedSign);

      toast({
        title: language === 'en' ? 'Success' : 'सफलता',
        description: language === 'en' 
          ? 'Preference saved successfully' 
          : 'पसंद सफलतापूर्वक सहेजी गई',
      });
    } catch (error) {
      console.error('Error saving preference:', error);
      toast({
        title: language === 'en' ? 'Error' : 'त्रुटि',
        description: language === 'en' 
          ? 'Failed to save preference' 
          : 'पसंद सहेजने में विफल',
        variant: 'destructive'
      });
    } finally {
      setSavingPreference(false);
    }
  };

  return { savingPreference, savePreference };
};
