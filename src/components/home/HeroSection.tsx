
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Star } from 'lucide-react';

export const HeroSection = () => {
  const { user, userProfile, language } = useAuth();
  const navigate = useNavigate();

  const getWelcomeMessage = () => {
    const name = userProfile?.full_name?.split(' ')[0] || '';
    const h = new Date().getHours();
    const greeting = h < 12 ?
    language === 'en' ? 'Good morning' : 'सुप्रभात' :
    h < 18 ?
    language === 'en' ? 'Good afternoon' : 'शुभ अपराह्न' :
    language === 'en' ? 'Good evening' : 'शुभ संध्या';
    return name ? `${greeting}, ${name}` : greeting;
  };

  const go = (path: string) => navigate(user ? path : '/auth');

  return (
    <section className="pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-36 md:pb-28 lg:pt-40 lg:pb-36 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] rounded-full bg-primary/[0.04] blur-[80px] md:blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-[10%] w-[200px] md:w-[300px] h-[200px] md:h-[300px] rounded-full bg-cosmic-purple/[0.06] blur-[60px] md:blur-[80px] pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl lg:max-w-3xl mx-auto text-center">
          {user && userProfile &&
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-primary/70 text-xs sm:text-sm mb-4 sm:mb-5 font-medium tracking-wide ${language === 'hi' ? 'font-hindi' : ''}`}>
            
              {getWelcomeMessage()} ✨
            </motion.p>
          }
          
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-primary/[0.07] border border-primary/[0.12] mb-6 sm:mb-8">
            
            <Star className="w-3 h-3 text-primary" />
            <span className="text-[10px] sm:text-xs text-primary/80 font-medium">
              {language === 'en' ? 'AI-Powered Vedic Astrology' : 'AI-संचालित वैदिक ज्योतिष'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 text-gradient-gold leading-[1.1] ${language === 'hi' ? 'font-hindi' : 'font-heading'}`}>
            
            {language === 'en' ?
            'Your AI Spiritual Guide' :
            'आपका AI आध्यात्मिक मार्गदर्शक'}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className={`text-sm sm:text-base md:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-md sm:max-w-lg md:max-w-xl mx-auto leading-relaxed px-2 sm:px-0 ${language === 'hi' ? 'font-hindi' : ''}`}>
            
            {language === 'en' ?
            'Personalized Kundli analysis, daily predictions, and cosmic guidance powered by AI — available 24/7.' :
            'AI द्वारा संचालित व्यक्तिगत कुंडली विश्लेषण, दैनिक भविष्यफल, और ब्रह्मांडीय मार्गदर्शन — 24/7 उपलब्ध।'}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-3.5 px-4 sm:px-0">
            
            <Button
              className="cosmic-button group text-sm w-full sm:w-auto"
              onClick={() => go('/ask-astroashi')}>
              
              <Sparkles className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Ask AstroAshi AI' : 'AstroAshi AI से पूछें'}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              className="cosmic-button-outline text-sm w-full sm:w-auto text-primary-foreground"
              onClick={() => go('/kundli-generator')}>
              
              {language === 'en' ? 'Generate Your Kundli' : 'अपनी कुंडली बनाएं'}
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] text-muted-foreground">
            
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
              {language === 'en' ? 'AI-Powered' : 'AI-संचालित'}
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/80" />
              {language === 'en' ? 'Vedic Astrology' : 'वैदिक ज्योतिष'}
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cosmic-purple/80" />
              {language === 'en' ? 'Multi-Faith' : 'बहु-धार्मिक'}
            </span>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
    </section>);

};