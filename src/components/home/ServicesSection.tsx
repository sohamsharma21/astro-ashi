
import { Star, Moon, Sun, Users, MessageCircle, Book, BotMessageSquare } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

const serviceFeatures = [
  {
    icon: <Star className="h-10 w-10 text-cosmic-gold" />,
    titleEn: "Daily Horoscopes",
    titleHi: "दैनिक राशिफल",
    descriptionEn: "Personalized cosmic insights for your sign, updated daily for optimal guidance.",
    descriptionHi: "आपकी राशि के लिए व्यक्तिगत ब्रह्मांडीय अंतर्दृष्टि, इष्टतम मार्गदर्शन के लिए दैनिक अपडेट की जाती है।",
    path: "/daily-horoscope"
  },
  {
    icon: <Moon className="h-10 w-10 text-cosmic-gold" />,
    titleEn: "Kundli Generator",
    titleHi: "कुंडली जनरेटर",
    descriptionEn: "Detailed birth chart analysis based on Vedic astrology with personalized interpretations.",
    descriptionHi: "वैदिक ज्योतिष पर आधारित व्यक्तिगत व्याख्याओं के साथ विस्तृत जन्म कुंडली विश्लेषण।",
    path: "/kundli-generator"
  },
  {
    icon: <Users className="h-10 w-10 text-cosmic-gold" />,
    titleEn: "Compatibility Check",
    titleHi: "संगतता जांच",
    descriptionEn: "Discover your celestial compatibility with friends, family, and romantic partners.",
    descriptionHi: "दोस्तों, परिवार और रोमांटिक साथियों के साथ अपनी आकाशीय संगतता का पता लगाएं।",
    path: "/compatibility"
  },
  {
    icon: <MessageCircle className="h-10 w-10 text-cosmic-gold" />,
    titleEn: "Ask Astro",
    titleHi: "एस्ट्रो से पूछें",
    descriptionEn: "Get answers to your specific questions through our cosmic query system.",
    descriptionHi: "हमारी कॉस्मिक क्वेरी सिस्टम के माध्यम से अपने विशिष्ट प्रश्नों के उत्तर प्राप्त करें।",
    path: "/ask-astro"
  },
  {
    icon: <BotMessageSquare className="h-10 w-10 text-cosmic-gold" />,
    titleEn: "AstroAshi AI Guidance",
    titleHi: "AstroAshi AI मार्गदर्शन",
    descriptionEn: "Get personalized AI-powered spiritual guidance based on your Kundli, Mahadasha, and Panchang.",
    descriptionHi: "आपकी कुंडली, महादशा और पंचांग के आधार पर व्यक्तिगत AI-संचालित आध्यात्मिक मार्गदर्शन प्राप्त करें।",
    path: "/ask-astroashi"
  },
  {
    icon: <Book className="h-10 w-10 text-cosmic-gold" />,
    titleEn: "Cosmic Journal",
    titleHi: "कॉस्मिक जर्नल",
    descriptionEn: "Explore articles and insights about astrology, spirituality, and cosmic wisdom.",
    descriptionHi: "ज्योतिष, आध्यात्मिकता और ब्रह्मांडीय ज्ञान के बारे में लेख और अंतर्दृष्टि का अन्वेषण करें।",
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
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-cosmic-gold text-center">
          {language === 'en' ? 'Our Cosmic Services' : 'हमारी ब्रह्मांडीय सेवाएं'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="service-card flex flex-col items-center text-center cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleFeatureClick(feature.path)}
            >
              <div className="mb-5 rounded-full bg-cosmic-violet bg-opacity-30 p-4 border border-cosmic-gold border-opacity-20">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-cosmic-gold">
                {language === 'en' ? feature.titleEn : feature.titleHi}
              </h3>
              <p className="text-white text-opacity-80">
                {language === 'en' ? feature.descriptionEn : feature.descriptionHi}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
