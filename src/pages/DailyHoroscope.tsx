
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { ZodiacSign } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { getZodiacSignName } from '@/lib/translations';

// Import our new components and hooks
import ZodiacSignSelector from '@/components/horoscope/ZodiacSignSelector';
import HoroscopeDisplay from '@/components/horoscope/HoroscopeDisplay';
import SavePreferenceButton from '@/components/horoscope/SavePreferenceButton';
import { useHoroscope } from '@/hooks/useHoroscope';
import { useZodiacPreference } from '@/hooks/useZodiacPreference';

const DailyHoroscope = () => {
  const { user, language, userProfile } = useAuth();
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>('aries');

  // Use our custom hooks
  const { data: horoscope, isLoading } = useHoroscope(selectedSign, language, user?.id);
  const { savingPreference, savePreference } = useZodiacPreference(user?.id, language);

  // Set the selected sign from user preferences when component loads
  useEffect(() => {
    if (userProfile?.primary_zodiac_sign) {
      setSelectedSign(userProfile.primary_zodiac_sign as ZodiacSign);
    }
  }, [userProfile]);

  const handleSavePreference = () => {
    savePreference(selectedSign);
  };

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={150} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className={`text-4xl md:text-6xl font-bold mb-12 text-center text-gradient-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' ? 'Daily Horoscope' : 'दैनिक राशिफल'}
        </h1>

        <ZodiacSignSelector selectedSign={selectedSign} onSelectSign={setSelectedSign} language={language} />

        <Card className="max-w-3xl mx-auto bg-cosmic-deep-space bg-opacity-90 border-cosmic-gold">
          <CardHeader>
            <CardTitle className={`text-2xl text-cosmic-gold text-center ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
              {language === 'en' ? `${getZodiacSignName(selectedSign, 'en')}'s Horoscope` : `${getZodiacSignName(selectedSign, 'hi')} राशिफल`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HoroscopeDisplay horoscope={horoscope} loading={isLoading} language={language} />
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <SavePreferenceButton onClick={handleSavePreference} isLoading={savingPreference} language={language} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DailyHoroscope;
