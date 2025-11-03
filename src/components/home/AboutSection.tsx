
import { useAuth } from '@/lib/auth';

export const AboutSection = () => {
  const { language } = useAuth();

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6 text-cosmic-gold">
            {language === 'en' ? 'About AstroAshi' : 'एस्ट्रोआशी के बारे में'}
          </h2>
          <p className="text-lg text-white opacity-90">
            {language === 'en'
              ? 'We are a digital temple of ancient astrology. AstroAshi provides personalized Vedic readings, cosmic compatibility, and emotional alignment — all in one sacred space.'
              : 'हम प्राचीन ज्योतिष का एक डिजिटल मंदिर हैं। एस्ट्रोआशी व्यक्तिगत वैदिक पठन, ब्रह्मांडीय संगतता और भावनात्मक संरेखण प्रदान करता है — सभी एक पवित्र स्थान पर।'}
          </p>
        </div>
      </div>
    </section>
  );
};
