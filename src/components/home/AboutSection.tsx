
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';

export const AboutSection = () => {
  const { language } = useAuth();

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary/60 mb-4 font-medium">
            {language === 'en' ? 'About AstroAshi' : 'AstroAshi के बारे में'}
          </p>
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-gradient-gold ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
            {language === 'en' ? 'Ancient Wisdom, Modern AI' : 'प्राचीन ज्ञान, आधुनिक AI'}
          </h2>
          <p className={`text-base md:text-lg text-muted-foreground leading-relaxed ${language === 'hi' ? 'font-hindi' : ''}`}>
            {language === 'en'
              ? 'AstroAshi combines thousands of years of Vedic astrology with cutting-edge AI to deliver deeply personalized spiritual guidance. From Kundli analysis to real-time Panchang — your cosmic journey starts here.'
              : 'AstroAshi हज़ारों वर्षों की वैदिक ज्योतिष विद्या को अत्याधुनिक AI के साथ जोड़कर गहन व्यक्तिगत आध्यात्मिक मार्गदर्शन प्रदान करता है। कुंडली विश्लेषण से लेकर रीयल-टाइम पंचांग तक — आपकी ब्रह्मांडीय यात्रा यहाँ से शुरू होती है।'}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
