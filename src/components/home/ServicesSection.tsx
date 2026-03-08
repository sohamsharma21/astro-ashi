
import { Star, Moon, Users, MessageCircle, Book, BotMessageSquare } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const serviceFeatures = [
  {
    icon: BotMessageSquare,
    titleEn: "AstroAshi AI",
    titleHi: "AstroAshi AI",
    descriptionEn: "Get personalized AI-powered spiritual guidance based on your Kundli and Mahadasha.",
    descriptionHi: "आपकी कुंडली और महादशा के आधार पर AI मार्गदर्शन प्राप्त करें।",
    path: "/ask-astroashi",
    highlight: true
  },
  {
    icon: Star,
    titleEn: "Daily Horoscopes",
    titleHi: "दैनिक राशिफल",
    descriptionEn: "Personalized cosmic insights for your sign, updated daily.",
    descriptionHi: "आपकी राशि के लिए व्यक्तिगत अंतर्दृष्टि, दैनिक अपडेट।",
    path: "/daily-horoscope"
  },
  {
    icon: Moon,
    titleEn: "Kundli Generator",
    titleHi: "कुंडली जनरेटर",
    descriptionEn: "Detailed Vedic birth chart analysis with AI interpretations.",
    descriptionHi: "AI व्याख्याओं के साथ वैदिक जन्म कुंडली विश्लेषण।",
    path: "/kundli-generator"
  },
  {
    icon: Users,
    titleEn: "Compatibility",
    titleHi: "संगतता जांच",
    descriptionEn: "Discover celestial compatibility with your partner.",
    descriptionHi: "अपने साथी के साथ आकाशीय संगतता जानें।",
    path: "/compatibility"
  },
  {
    icon: MessageCircle,
    titleEn: "Ask Astro",
    titleHi: "एस्ट्रो से पूछें",
    descriptionEn: "Get answers to specific astrological questions.",
    descriptionHi: "विशिष्ट ज्योतिषीय प्रश्नों के उत्तर प्राप्त करें।",
    path: "/ask-astro"
  },
  {
    icon: Book,
    titleEn: "Cosmic Journal",
    titleHi: "कॉस्मिक जर्नल",
    descriptionEn: "Articles on astrology, spirituality, and cosmic wisdom.",
    descriptionHi: "ज्योतिष और आध्यात्मिकता पर लेख।",
    path: "/cosmic-journal"
  }
];

export const ServicesSection = () => {
  const { language, user } = useAuth();
  const navigate = useNavigate();

  const handleFeatureClick = (path: string) => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate(path);
    }
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary/60 mb-3 font-medium">
            {language === 'en' ? 'Features' : 'विशेषताएं'}
          </p>
          <h2 className={`text-3xl md:text-4xl font-bold text-gradient-gold ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
            {language === 'en' ? 'Cosmic Services' : 'ब्रह्मांडीय सेवाएं'}
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {serviceFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={`group cursor-pointer rounded-2xl p-6 transition-all duration-500 border ${
                  feature.highlight 
                    ? 'bg-primary/5 border-primary/20 hover:border-primary/40 hover:bg-primary/10' 
                    : 'bg-card/50 border-border/50 hover:border-primary/20 hover:bg-card'
                } hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1`}
                onClick={() => handleFeatureClick(feature.path)}
              >
                <div className={`mb-4 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  feature.highlight 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className={`text-base font-semibold mb-2 text-foreground ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {language === 'en' ? feature.titleEn : feature.titleHi}
                </h3>
                <p className={`text-sm text-muted-foreground leading-relaxed ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {language === 'en' ? feature.descriptionEn : feature.descriptionHi}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
