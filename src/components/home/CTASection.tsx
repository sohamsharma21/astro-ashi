
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const CTASection = () => {
  const { user, language } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-gradient-gold ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
            {language === 'en' ? 'Begin Your Cosmic Journey' : 'अपनी ब्रह्मांडीय यात्रा शुरू करें'}
          </h2>
          <p className="text-muted-foreground mb-8 text-base md:text-lg leading-relaxed">
            {language === 'en'
              ? 'Unlock the wisdom of the stars with AI-powered spiritual guidance, personalized for you.'
              : 'AI-संचालित आध्यात्मिक मार्गदर्शन के साथ तारों के ज्ञान को अनलॉक करें।'}
          </p>
          <Button 
            className="cosmic-button"
            onClick={() => user ? navigate('/ask-astroashi') : navigate('/auth')}
          >
            {language === 'en' ? 'Explore Your Destiny' : 'अपनी नियति का अन्वेषण करें'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
