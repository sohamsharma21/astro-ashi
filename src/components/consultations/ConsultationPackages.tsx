
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';

export interface ConsultationPackage {
  id: string;
  title: string;
  description: string;
  price: string;
  popular?: boolean;
  features: string[];
}

interface ConsultationPackagesProps {
  onBooking: (packageId: string) => void;
}

export const ConsultationPackages = ({ onBooking }: ConsultationPackagesProps) => {
  const { language } = useAuth();
  
  const consultationPackages: ConsultationPackage[] = [
    {
      id: 'basic',
      title: language === 'en' ? 'Cosmic Guidance' : 'ब्रह्मांडीय मार्गदर्शन',
      description: language === 'en' 
        ? '30-minute personal consultation focusing on one specific area of your life.'
        : '30 मिनट का व्यक्तिगत परामर्श जो आपके जीवन के एक विशिष्ट क्षेत्र पर केंद्रित है।',
      price: '₹19',
      features: [
        language === 'en' ? '1 question answered' : '1 प्रश्न का उत्तर',
        language === 'en' ? '24-hour response time' : '24 घंटे में उत्तर',
        language === 'en' ? 'Basic astrological insight' : 'बुनियादी ज्योतिषीय अंतर्दृष्टि',
        language === 'en' ? 'Email summary' : 'ईमेल सारांश'
      ]
    },
    {
      id: 'standard',
      title: language === 'en' ? 'Celestial Insight' : 'दिव्य अंतर्दृष्टि',
      description: language === 'en'
        ? 'Comprehensive 45-minute consultation covering multiple aspects of your birth chart.'
        : 'आपकी जन्म कुंडली के कई पहलुओं को कवर करने वाला 45 मिनट का व्यापक परामर्श।',
      price: '₹39',
      popular: true,
      features: [
        language === 'en' ? '2-3 questions answered' : '2-3 प्रश्नों के उत्तर',
        language === 'en' ? 'Priority response within 12 hours' : 'प्राथमिकता - 12 घंटे में उत्तर',
        language === 'en' ? 'Chart-based detailed insight' : 'कुंडली आधारित विस्तृत अंतर्दृष्टि',
        language === 'en' ? 'Personalized remedies' : 'व्यक्तिगत उपाय',
        language === 'en' ? 'Digital chart summary' : 'डिजिटल चार्ट सारांश'
      ]
    },
    {
      id: 'premium',
      title: language === 'en' ? 'Divine Oracle' : 'दिव्य ओरेकल',
      description: language === 'en'
        ? 'In-depth 60-minute consultation with our senior astrologer for complete life guidance.'
        : 'पूर्ण जीवन मार्गदर्शन के लिए हमारे वरिष्ठ ज्योतिषी के साथ 60 मिनट का गहन परामर्श।',
      price: '₹59',
      features: [
        language === 'en' ? '5 questions answered' : '5 प्रश्नों के उत्तर',
        language === 'en' ? 'Complete horoscope reading' : 'पूर्ण राशिफल पठन',
        language === 'en' ? 'Detailed remedies & solutions' : 'विस्तृत उपाय और समाधान',
        language === 'en' ? 'Potential live consultation invite' : 'संभावित लाइव परामर्श आमंत्रण',
        language === 'en' ? 'Priority support' : 'प्राथमिकता समर्थन',
        language === 'en' ? 'Gemstone recommendations' : 'रत्न सिफारिशें'
      ]
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {consultationPackages.map((pkg) => (
        <Card 
          key={pkg.id} 
          className={`bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg border ${
            pkg.popular ? 'border-cosmic-gold' : 'border-cosmic-gold border-opacity-20'
          } overflow-hidden`}
        >
          {pkg.popular && (
            <div className="bg-cosmic-gold text-cosmic-deep-space text-center py-1 font-medium">
              {language === 'en' ? 'Most Popular' : 'सबसे लोकप्रिय'}
            </div>
          )}
          
          <CardHeader className={pkg.popular ? '' : 'pt-6'}>
            <CardTitle className="text-cosmic-gold text-xl">{pkg.title}</CardTitle>
            <CardDescription className="text-gray-300">{pkg.description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="text-3xl font-bold text-white mb-6">{pkg.price}</p>
            
            <ul className="space-y-3">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-cosmic-gold shrink-0 mt-0.5" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          
          <CardFooter>
            <Button 
              className={pkg.popular ? 'cosmic-button w-full' : 'cosmic-button-outline w-full'} 
              onClick={() => onBooking(pkg.id)}
            >
              {language === 'en' ? 'Book Consultation' : 'परामर्श बुक करें'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
