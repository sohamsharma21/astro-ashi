
import { Star, Quote } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';

const testimonials = [
  {
    nameEn: "Priya Sharma", nameHi: "प्रिया शर्मा",
    locationEn: "New Delhi", locationHi: "नई दिल्ली",
    textEn: "AstroAshi's Kundli reading gave me incredible clarity during a difficult transition. The insights were uncannily accurate.",
    textHi: "AstroAshi की कुंडली रीडिंग ने मुझे कठिन समय में अद्भुत स्पष्टता दी।",
    rating: 5
  },
  {
    nameEn: "Rahul Patel", nameHi: "राहुल पटेल",
    locationEn: "Mumbai", locationHi: "मुंबई",
    textEn: "The compatibility analysis helped me understand my relationship dynamics in ways I never considered.",
    textHi: "संगतता विश्लेषण ने मुझे अपने रिश्ते को नई नज़र से समझने में मदद की।",
    rating: 5
  },
  {
    nameEn: "Ananya Desai", nameHi: "अनन्या देसाई",
    locationEn: "Bangalore", locationHi: "बैंगलोर",
    textEn: "I've been following my daily horoscope for months, and the accuracy is remarkable. Deeper insights than any other service.",
    textHi: "महीनों से दैनिक राशिफल पढ़ रही हूं, सटीकता उल्लेखनीय है।",
    rating: 4
  }
];

export const TestimonialsSection = () => {
  const { language } = useAuth();

  return (
    <section className="py-16 sm:py-20 md:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-primary/50 mb-2 sm:mb-3 font-semibold">
            {language === 'en' ? 'Testimonials' : 'प्रशंसापत्र'}
          </p>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold text-gradient-gold ${language === 'hi' ? 'font-hindi' : 'font-heading'}`}>
            {language === 'en' ? 'Cosmic Transformations' : 'ब्रह्मांडीय परिवर्तन'}
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="cosmic-card p-4 sm:p-5 md:p-6"
            >
              <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-primary/30 mb-2 sm:mb-3" />
              <div className="flex gap-0.5 mb-2 sm:mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < t.rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`}
                  />
                ))}
              </div>
              <p className={`text-xs sm:text-sm text-foreground/80 mb-3 sm:mb-4 leading-relaxed italic ${language === 'hi' ? 'font-hindi' : ''}`}>
                "{language === 'en' ? t.textEn : t.textHi}"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] sm:text-xs font-bold text-primary">
                  {(language === 'en' ? t.nameEn : t.nameHi)[0]}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground font-heading">
                    {language === 'en' ? t.nameEn : t.nameHi}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                    {language === 'en' ? t.locationEn : t.locationHi}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
