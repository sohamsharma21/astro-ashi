
import { Star } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    nameEn: "Priya Sharma",
    nameHi: "प्रिया शर्मा",
    locationEn: "New Delhi",
    locationHi: "नई दिल्ली",
    textEn: "AstroAshi's birth chart reading gave me incredible clarity during a difficult transition. The insights were uncannily accurate and helped me make decisions with confidence.",
    textHi: "एस्ट्रोआशी की जन्म कुंडली रीडिंग ने मुझे एक कठिन संक्रमण के दौरान अविश्वसनीय स्पष्टता दी। अंतर्दृष्टि अकल्पनीय रूप से सटीक थी और मुझे आत्मविश्वास से निर्णय लेने में मदद की।",
    rating: 5
  },
  {
    nameEn: "Rahul Patel",
    nameHi: "राहुल पटेल",
    locationEn: "Mumbai",
    locationHi: "मुंबई",
    textEn: "The compatibility analysis helped me understand my relationship dynamics in ways I never considered. The guidance on how to navigate challenges has been invaluable.",
    textHi: "संगतता विश्लेषण ने मुझे अपने रिश्ते की गतिशीलता को ऐसे तरीकों से समझने में मदद की जिन पर मैंने कभी विचार नहीं किया था। चुनौतियों का सामना करने के तरीके पर मार्गदर्शन अमूल्य रहा है।",
    rating: 5
  },
  {
    nameEn: "Ananya Desai",
    nameHi: "अनन्या देसाई",
    locationEn: "Bangalore",
    locationHi: "बैंगलोर",
    textEn: "I've been following my daily horoscope for months, and the accuracy is remarkable. AstroAshi provides deeper insights than any other astrology service I've tried.",
    textHi: "मैं महीनों से अपने दैनिक राशिफल का पालन कर रही हूं, और सटीकता उल्लेखनीय है। एस्ट्रोआशी मेरे द्वारा आजमाई गई किसी भी अन्य ज्योतिष सेवा की तुलना में गहरी अंतर्दृष्टि प्रदान करता है।",
    rating: 4
  }
];

export const TestimonialsSection = () => {
  const { language } = useAuth();

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-cosmic-gold text-center">
          {language === 'en' ? 'Cosmic Transformations' : 'ब्रह्मांडीय परिवर्तन'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-cosmic-violet bg-opacity-20 border-cosmic-gold border-opacity-20 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-cosmic-gold' : 'text-gray-500'}`}
                      fill={i < testimonial.rating ? '#ffd700' : 'none'}
                    />
                  ))}
                </div>
                <p className="text-white mb-4 font-cormorant text-lg italic">
                  "{language === 'en' ? testimonial.textEn : testimonial.textHi}"
                </p>
                <div className="text-cosmic-gold font-cinzel">
                  {language === 'en' ? testimonial.nameEn : testimonial.nameHi}
                  <span className="text-white text-opacity-60 text-sm font-lora">
                    • {language === 'en' ? testimonial.locationEn : testimonial.locationHi}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
