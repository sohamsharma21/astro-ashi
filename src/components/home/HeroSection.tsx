
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  const { user, userProfile, language } = useAuth();
  const navigate = useNavigate();

  const getWelcomeMessage = () => {
    const name = userProfile?.full_name?.split(' ')[0] || '';
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
    <section className="pt-28 pb-24 md:pt-36 md:pb-32 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {user && userProfile && (
            <motion.p 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-primary/80 text-base mb-6 font-medium tracking-wide ${language === 'hi' ? 'font-hindi' : ''}`}
            >
              {getWelcomeMessage()} ✨
            </motion.p>
          )}
          
          <motion.h1 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gradient-gold leading-[1.1] tracking-tight ${language === 'hi' ? 'font-hindi' : 'font-display'}`}
          >
            {language === 'en' 
              ? 'Your AI Spiritual Guide'
              : 'आपका AI आध्यात्मिक मार्गदर्शक'}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed ${language === 'hi' ? 'font-hindi' : ''}`}
          >
            {language === 'en'
              ? 'Personalized Vedic astrology, Kundli analysis, and cosmic guidance powered by AI — available 24/7.'
              : 'AI द्वारा संचालित व्यक्तिगत वैदिक ज्योतिष, कुंडली विश्लेषण और ब्रह्मांडीय मार्गदर्शन — 24/7 उपलब्ध।'}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button 
              className="cosmic-button group"
              onClick={() => handleFeatureClick('/ask-astroashi')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Ask AstroAshi AI' : 'AstroAshi AI से पूछें'}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              className="cosmic-button-outline"
              onClick={() => handleFeatureClick('/kundli-generator')}
            >
              {language === 'en' ? 'Generate Your Kundli' : 'अपनी कुंडली बनाएं'}
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 flex items-center justify-center gap-8 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {language === 'en' ? 'AI-Powered' : 'AI-संचालित'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {language === 'en' ? 'Vedic Astrology' : 'वैदिक ज्योतिष'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cosmic-purple" />
              {language === 'en' ? 'Multi-Faith' : 'बहु-धार्मिक'}
            </span>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
};
