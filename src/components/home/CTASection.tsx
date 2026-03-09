
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export const CTASection = () => {
  const { user, language } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-20 md:py-28 relative">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] sm:w-[350px] md:w-[400px] h-[250px] sm:h-[350px] md:h-[400px] rounded-full bg-primary/[0.04] blur-[80px] md:blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md sm:max-w-lg mx-auto text-center relative z-10"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/[0.08] border border-primary/10 flex items-center justify-center mx-auto mb-5 sm:mb-6">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 text-gradient-gold ${language === 'hi' ? 'font-hindi' : 'font-heading'}`}>
            {language === 'en' ? 'Begin Your Cosmic Journey' : 'अपनी ब्रह्मांडीय यात्रा शुरू करें'}
          </h2>
          <p className={`text-muted-foreground mb-6 sm:mb-8 text-xs sm:text-sm md:text-base leading-relaxed px-2 sm:px-0 ${language === 'hi' ? 'font-hindi' : ''}`}>
            {language === 'en'
              ? 'Unlock the wisdom of the stars with AI-powered spiritual guidance, personalized for you.'
              : 'AI-संचालित आध्यात्मिक मार्गदर्शन के साथ तारों के ज्ञान को अनलॉक करें।'}
          </p>
          <Button 
            className="cosmic-button group w-full sm:w-auto"
            onClick={() => navigate(user ? '/ask-astroashi' : '/auth')}
          >
            {language === 'en' ? 'Explore Your Destiny' : 'अपनी नियति का अन्वेषण करें'}
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
