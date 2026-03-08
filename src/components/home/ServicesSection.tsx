

import { Star, Moon, Users, Book, BotMessageSquare, Heart, BookOpen, Sparkles, ListChecks, Calendar, Music, HandHeart, CloudMoon, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const serviceFeatures = [
  {
    icon: BotMessageSquare,
    titleEn: "AstroAshi AI",
    titleHi: "AstroAshi AI",
    descEn: "Get personalized AI-powered spiritual guidance based on your Kundli.",
    descHi: "आपकी कुंडली के आधार पर AI मार्गदर्शन प्राप्त करें।",
    path: "/ask-astroashi",
    highlight: true
  },
  {
    icon: Star,
    titleEn: "Daily Horoscopes",
    titleHi: "दैनिक राशिफल",
    descEn: "Personalized cosmic insights for your sign, updated daily.",
    descHi: "आपकी राशि के लिए दैनिक अंतर्दृष्टि।",
    path: "/daily-horoscope"
  },
  {
    icon: Moon,
    titleEn: "Kundli Generator",
    titleHi: "कुंडली जनरेटर",
    descEn: "Detailed Vedic birth chart analysis with AI interpretations.",
    descHi: "AI व्याख्याओं के साथ वैदिक जन्म कुंडली।",
    path: "/kundli-generator"
  },
  {
    icon: Users,
    titleEn: "Compatibility",
    titleHi: "संगतता जांच",
    descEn: "Discover celestial compatibility with your partner.",
    descHi: "अपने साथी के साथ आकाशीय संगतता जानें।",
    path: "/compatibility"
  },
  {
    icon: Heart,
    titleEn: "Meditation",
    titleHi: "ध्यान",
    descEn: "Guided meditation with ambient sounds like rain, ocean & temple bells.",
    descHi: "बारिश, समुद्र और मंदिर की घंटियों के साथ ध्यान करें।",
    path: "/meditation"
  },
  {
    icon: BookOpen,
    titleEn: "Gratitude Journal",
    titleHi: "कृतज्ञता डायरी",
    descEn: "Daily gratitude practice with mood tracking and streaks.",
    descHi: "मूड ट्रैकिंग के साथ दैनिक कृतज्ञता अभ्यास।",
    path: "/gratitude-journal"
  },
  {
    icon: Sparkles,
    titleEn: "Daily Inspiration",
    titleHi: "दैनिक प्रेरणा",
    descEn: "Spiritual quotes and wisdom from all faiths, updated daily.",
    descHi: "सभी धर्मों से आध्यात्मिक उद्धरण और ज्ञान।",
    path: "/daily-inspiration"
  },
  {
    icon: ListChecks,
    titleEn: "Spiritual Routine",
    titleHi: "आध्यात्मिक दिनचर्या",
    descEn: "Build your daily spiritual practice with personalized routines.",
    descHi: "व्यक्तिगत दिनचर्या के साथ दैनिक आध्यात्मिक अभ्यास बनाएं।",
    path: "/spiritual-routine"
  },
  {
    icon: Calendar,
    titleEn: "Sacred Calendar",
    titleHi: "पवित्र कैलेंडर",
    descEn: "Festivals, fasts & auspicious dates for your faith tradition.",
    descHi: "आपकी धार्मिक परंपरा के त्योहार, व्रत और शुभ तिथियां।",
    path: "/sacred-calendar"
  },
  {
    icon: Book,
    titleEn: "Cosmic Journal",
    titleHi: "कॉस्मिक जर्नल",
    descEn: "Articles on astrology, spirituality, and cosmic wisdom.",
    descHi: "ज्योतिष और आध्यात्मिकता पर लेख।",
    path: "/cosmic-journal"
  }
];

export const ServicesSection = () => {
  const { language, user } = useAuth();
  const navigate = useNavigate();

  const go = (path: string) => navigate(user ? path : '/auth');

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.25em] text-primary/50 mb-3 font-semibold">
            {language === 'en' ? 'Features' : 'विशेषताएं'}
          </p>
          <h2 className={`text-3xl md:text-4xl font-extrabold text-gradient-gold ${language === 'hi' ? 'font-hindi' : 'font-heading'}`}>
            {language === 'en' ? 'Cosmic Services' : 'ब्रह्मांडीय सेवाएं'}
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {serviceFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.button 
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className={`group text-left rounded-2xl p-5 transition-all duration-300 border ${
                  feature.highlight 
                    ? 'bg-primary/[0.06] border-primary/15 hover:border-primary/30' 
                    : 'bg-card/40 border-border/40 hover:border-primary/15'
                } hover:shadow-xl hover:shadow-primary/[0.04] hover:-translate-y-1`}
                onClick={() => go(feature.path)}
              >
                <div className={`mb-3.5 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  feature.highlight 
                    ? 'bg-primary/15 text-primary' 
                    : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                }`}>
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <h3 className={`text-[15px] font-bold mb-1.5 text-foreground ${language === 'hi' ? 'font-hindi' : 'font-heading'}`}>
                  {language === 'en' ? feature.titleEn : feature.titleHi}
                </h3>
                <p className={`text-[13px] text-muted-foreground leading-relaxed ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {language === 'en' ? feature.descEn : feature.descHi}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
