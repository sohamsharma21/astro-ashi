
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';

const PrivacyPolicy = () => {
  const { language } = useAuth();

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={150} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-3xl mx-auto bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg p-8 rounded-lg border border-cosmic-gold border-opacity-20">
          <h1 className={`text-4xl md:text-5xl font-bold mb-8 text-center text-gradient-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}
          </h1>
          
          {language === 'en' ? (
            <>
              <p className="mb-6 text-white">Last Updated: {new Date().toLocaleDateString()}</p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">1. Introduction</h2>
              <p className="mb-4 text-white">
                Welcome to AstroAshi. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our website 
                and tell you about your privacy rights and how the law protects you.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">2. Information We Collect</h2>
              <p className="mb-4 text-white">
                We may collect personal identification information (Name, email address, date of birth, location) 
                to provide personalized astrological services. We also collect birth details for generating horoscopes 
                and kundlis.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">3. How We Use Your Information</h2>
              <p className="mb-4 text-white">
                We use the information we collect to provide, maintain, and improve our services, 
                generate personalized astrological content, communicate with you about services, and 
                protect our users and provide customer support.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">4. Data Security</h2>
              <p className="mb-4 text-white">
                We have implemented appropriate security measures to prevent your personal data from being accidentally lost, 
                used, or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, 
                contractors, and other third parties who have a business need to know.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">5. Contact Us</h2>
              <p className="mb-4 text-white">
                If you have any questions about this Privacy Policy, please contact us at: 
                <a href="mailto:info@astroashi.com" className="text-cosmic-gold hover:underline"> info@astroashi.com</a>
              </p>
            </>
          ) : (
            <>
              <p className="mb-6 text-white">अंतिम अपडेट: {new Date().toLocaleDateString()}</p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">1. परिचय</h2>
              <p className="mb-4 text-white">
                एस्ट्रो आशी में आपका स्वागत है। हम आपकी गोपनीयता का सम्मान करते हैं और आपके व्यक्तिगत डेटा की सुरक्षा के लिए प्रतिबद्ध हैं।
                यह गोपनीयता नीति आपको बताएगी कि जब आप हमारी वेबसाइट पर जाते हैं तो हम आपके व्यक्तिगत डेटा को कैसे देखते हैं
                और आपको आपके गोपनीयता अधिकारों के बारे में बताएं और कानून आपकी रक्षा कैसे करता है।
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">2. हम जो जानकारी एकत्र करते हैं</h2>
              <p className="mb-4 text-white">
                हम व्यक्तिगत पहचान जानकारी (नाम, ईमेल पता, जन्म तिथि, स्थान) एकत्र कर सकते हैं
                व्यक्तिगत ज्योतिषीय सेवाएं प्रदान करना। हम राशिफल उत्पन्न करने के लिए जन्म विवरण भी एकत्र करते हैं
                और कुंडलियां।
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">3. हम आपकी जानकारी का उपयोग कैसे करते हैं</h2>
              <p className="mb-4 text-white">
                हम जो जानकारी एकत्र करते हैं उसका उपयोग हमारी सेवाओं को प्रदान करने, बनाए रखने और सुधारने के लिए,
                व्यक्तिगत ज्योतिषीय सामग्री उत्पन्न करें, आपके साथ सेवाओं के बारे में संवाद करें, और
                हमारे उपयोगकर्ताओं की रक्षा करें और ग्राहक सहायता प्रदान करें।
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">4. डेटा सुरक्षा</h2>
              <p className="mb-4 text-white">
                हमने आपके व्यक्तिगत डेटा को अनजाने में खो जाने से रोकने के लिए उचित सुरक्षा उपाय लागू किए हैं,
                अनधिकृत तरीके से उपयोग किया या एक्सेस किया गया। हम आपके व्यक्तिगत डेटा तक पहुंच को उन कर्मचारियों, एजेंटों,
                ठेकेदारों, और अन्य तीसरे पक्षों तक सीमित करते हैं जिन्हें जानने की व्यावसायिक आवश्यकता होती है।
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">5. हमसे संपर्क करें</h2>
              <p className="mb-4 text-white">
                यदि आपके पास इस गोपनीयता नीति के बारे में कोई प्रश्न हैं, तो कृपया हमसे संपर्क करें:
                <a href="mailto:info@astroashi.com" className="text-cosmic-gold hover:underline"> info@astroashi.com</a>
              </p>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
