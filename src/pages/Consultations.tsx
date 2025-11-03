
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import { ConsultationPackages } from '@/components/consultations/ConsultationPackages';
import { BookingForm } from '@/components/consultations/BookingForm';
import { useConsultationBooking } from '@/hooks/useConsultationBooking';

const Consultations = () => {
  const { language } = useAuth();
  const { isBooking, selectedPackage, handleBooking, resetBooking } = useConsultationBooking();

  const consultationPackages = [
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

  const onBookPackage = (packageId: string) => {
    handleBooking(packageId, consultationPackages);
  };

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={150} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className={`text-4xl md:text-6xl font-bold mb-6 text-center text-gradient-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' ? 'Astrological Consultations' : 'ज्योतिषीय परामर्श'}
        </h1>
        
        <p className={`text-lg text-white text-center mb-12 max-w-3xl mx-auto ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' 
            ? 'Connect with our experienced astrologers for personalized guidance on your life path, relationships, career, and spiritual growth.'
            : 'अपने जीवन पथ, रिश्तों, करियर और आध्यात्मिक विकास पर व्यक्तिगत मार्गदर्शन के लिए हमारे अनुभवी ज्योतिषियों से जुड़ें।'}
        </p>
        
        {!isBooking ? (
          <ConsultationPackages onBooking={onBookPackage} />
        ) : selectedPackage && (
          <BookingForm 
            selectedPackage={selectedPackage}
            onCancel={resetBooking}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Consultations;
