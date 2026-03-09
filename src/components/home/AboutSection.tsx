
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { Zap, Shield, Globe } from 'lucide-react';

export const AboutSection = () => {
  const { language } = useAuth();

  const features = [
    { icon: Zap, en: 'Real-time AI Analysis', hi: 'रीयल-टाइम AI विश्लेषण' },
    { icon: Shield, en: 'Vedic Accuracy', hi: 'वैदिक सटीकता' },
    { icon: Globe, en: 'Multi-Faith Support', hi: 'बहु-धार्मिक सहायता' },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl sm:max-w-2xl mx-auto text-center"
        >
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-primary/50 mb-2 sm:mb-3 font-semibold">
            {language === 'en' ? 'About AstroAshi' : 'AstroAshi के बारे में'}
          </p>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-5 text-gradient-gold ${language === 'hi' ? 'font-hindi' : 'font-heading'}`}>
            {language === 'en' ? 'Ancient Wisdom, Modern AI' : 'प्राचीन ज्ञान, आधुनिक AI'}
          </h2>
          <p className={`text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed mb-8 sm:mb-10 px-2 sm:px-0 ${language === 'hi' ? 'font-hindi' : ''}`}>
            {language === 'en'
              ? 'AstroAshi combines thousands of years of Vedic astrology with cutting-edge AI to deliver deeply personalized spiritual guidance. From Kundli analysis to real-time Panchang — your cosmic journey starts here.'
              : 'AstroAshi हज़ारों वर्षों की वैदिक ज्योतिष विद्या को अत्याधुनिक AI के साथ जोड़कर गहन व्यक्तिगत आध्यात्मिक मार्गदर्शन प्रदान करता है।'}
          </p>

          <div className="flex items-center justify-center gap-5 sm:gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center gap-1.5 sm:gap-2"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/[0.08] border border-primary/10 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <span className="text-[9px] sm:text-[11px] text-muted-foreground font-medium text-center leading-tight">
                    {language === 'en' ? f.en : f.hi}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
