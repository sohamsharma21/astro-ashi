
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const { user, userProfile, language } = useAuth();
  const navigate = useNavigate();

  const getWelcomeMessage = () => {
    const name = userProfile?.full_name || '';
    const timeOfDay = new Date().getHours();
    
    let greeting = '';
    if (timeOfDay < 12) {
      greeting = language === 'en' ? 'Good morning' : 'सुप्रभात';
    } else if (timeOfDay < 18) {
      greeting = language === 'en' ? 'Good afternoon' : 'शुभ अपराह्न';
    } else {
      greeting = language === 'en' ? 'Good evening' : 'शुभ संध्या';
    }
    
    return name ? `${greeting}, ${name}` : greeting;
  };

  const handleFeatureClick = (path: string) => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate(path);
    }
  };

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {user && userProfile && (
            <p className={`text-cosmic-gold text-xl mb-4 font-medium animate-fade-in ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
              {getWelcomeMessage()}
            </p>
          )}
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 text-gradient-gold leading-normal animate-fade-in ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en' 
              ? 'Decode Your Destiny Through the Stars'
              : 'तारों के माध्यम से अपनी नियति को समझें'}
          </h1>
          <p className={`text-lg md:text-xl text-white mb-10 opacity-90 animate-fade-in ${language === 'hi' ? 'font-noto-devanagari' : ''}`} style={{ animationDelay: '0.3s' }}>
            {language === 'en'
              ? 'Daily horoscopes, birth charts & divine guidance for your cosmic journey'
              : 'आपकी ब्रह्मांडीय यात्रा के लिए दैनिक राशिफल, जन्म कुंडली और दिव्य मार्गदर्शन'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button 
              className={`cosmic-button ${language === 'hi' ? 'font-noto-devanagari' : ''}`}
              onClick={() => handleFeatureClick('/daily-horoscope')}
            >
              {language === 'en' ? 'Get Your Horoscope' : 'अपना राशिफल प्राप्त करें'}
            </Button>
            <Button 
              className={`cosmic-button-outline ${language === 'hi' ? 'font-noto-devanagari' : ''}`}
              onClick={() => handleFeatureClick('/kundli-generator')}
            >
              {language === 'en' ? 'Generate Your Kundli' : 'अपनी कुंडली बनाएं'}
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-cosmic-gold to-transparent opacity-30"></div>
    </section>
  );
};
