
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

export const CTASection = () => {
  const { user, language } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center bg-cosmic-deep-space bg-opacity-70 p-10 rounded-xl backdrop-blur-md border border-cosmic-gold border-opacity-20">
          <h2 className="text-3xl font-bold mb-6 text-cosmic-gold">
            {language === 'en' ? 'Begin Your Cosmic Journey Today' : 'आज अपनी ब्रह्मांडीय यात्रा शुरू करें'}
          </h2>
          <p className="text-lg text-white mb-8 opacity-90">
            {language === 'en'
              ? 'Unlock the secrets of the stars and discover what the cosmos has planned for you.'
              : 'तारों के रहस्यों को अनलॉक करें और जानें कि ब्रह्मांड ने आपके लिए क्या योजना बनाई है।'}
          </p>
          <Button 
            className="cosmic-button"
            onClick={() => user ? navigate('/daily-horoscope') : navigate('/auth')}
          >
            {language === 'en' ? 'Explore Your Destiny' : 'अपनी नियति का अन्वेषण करें'}
          </Button>
        </div>
      </div>
    </section>
  );
};
