
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export const CTASection = () => {
  const { user, language } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-28 relative">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto text-center relative z-10"
        >
          <div className="w-11 h-11 rounded-xl bg-primary/[0.08] border border-primary/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 text-gradient-gold ${language === 'hi' ? 'font-hindi' : 'font-heading'}`}>
            {language === 'en' ? 'Begin Your Cosmic Journey' : 'अपनी ब्रह्मांडीय यात्रा शुरू करें'}
          </h2>
          <p className={`text-muted-foreground mb-8 text-sm md:text-base leading-relaxed ${language === 'hi' ? 'font-hindi' : ''}`}>
            {language === 'en'
              ? 'Unlock the wisdom of the stars with AI-powered spiritual guidance, personalized for you.'
              : 'AI-संचालित आध्यात्मिक मार्गदर्शन के साथ तारों के ज्ञान को अनलॉक करें।'}
          </p>
          <Button 
            className="cosmic-button group"
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
