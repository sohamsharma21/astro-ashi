
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';

const TermsOfService = () => {
  const { language } = useAuth();

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={150} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-3xl mx-auto bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg p-8 rounded-lg border border-cosmic-gold border-opacity-20">
          <h1 className={`text-4xl md:text-5xl font-bold mb-8 text-center text-gradient-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en' ? 'Terms of Service' : 'सेवा की शर्तें'}
          </h1>
          
          {language === 'en' ? (
            <>
              <p className="mb-6 text-white">Last Updated: {new Date().toLocaleDateString()}</p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">1. Acceptance of Terms</h2>
              <p className="mb-4 text-white">
                By accessing and using AstroAshi, you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to abide by the above, please do not 
                use this service.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">2. Description of Service</h2>
              <p className="mb-4 text-white">
                AstroAshi provides astrological services including daily horoscopes, birth chart analysis,
                compatibility readings, and astrological consultations. The service is provided "as is" and 
                on an "as available" basis without warranties of any kind.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">3. User Conduct</h2>
              <p className="mb-4 text-white">
                You agree not to use the Service for any unlawful purpose or in any way that could damage, 
                disable, overburden, or impair the Service. You also agree not to attempt to gain unauthorized 
                access to any part of the Service or any system or network connected to the Service.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">4. Disclaimer</h2>
              <p className="mb-4 text-white">
                The information provided by AstroAshi is for general guidance on matters of interest only. 
                The application of the information to specific situations will depend on the particular circumstances involved. 
                Accordingly, such information should not be regarded as a substitute for professional advice.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">5. Contact</h2>
              <p className="mb-4 text-white">
                If you have any questions about these Terms, please contact us at: 
                <a href="mailto:info@astroashi.com" className="text-cosmic-gold hover:underline"> info@astroashi.com</a>
              </p>
            </>
          ) : (
            <>
              <p className="mb-6 text-white">अंतिम अपडेट: {new Date().toLocaleDateString()}</p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">1. शर्तों की स्वीकृति</h2>
              <p className="mb-4 text-white">
                एस्ट्रो आशी का उपयोग करके, आप इस समझौते की शर्तों और प्रावधानों से बाध्य होने के लिए स्वीकार और सहमत होते हैं।
                यदि आप उपरोक्त का पालन करने के लिए सहमत नहीं हैं, तो कृपया इस सेवा का उपयोग न करें।
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">2. सेवा का विवरण</h2>
              <p className="mb-4 text-white">
                एस्ट्रो आशी ज्योतिषीय सेवाएं प्रदान करता है जिसमें दैनिक राशिफल, जन्म कुंडली विश्लेषण,
                संगतता पढ़ना, और ज्योतिषीय परामर्श शामिल हैं। सेवा "जैसी है" और
                किसी भी प्रकार की वारंटी के बिना "जैसे उपलब्ध है" के आधार पर प्रदान की जाती है।
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">3. उपयोगकर्ता आचरण</h2>
              <p className="mb-4 text-white">
                आप सेवा का उपयोग किसी भी अवैध उद्देश्य के लिए या किसी ऐसे तरीके से न करने के लिए सहमत हैं जिससे सेवा को नुकसान,
                अक्षम, अधिभारित, या बाधित हो सकता है। आप सेवा के किसी भी हिस्से या सेवा से जुड़े किसी भी सिस्टम या नेटवर्क तक अनधिकृत
                पहुंच प्राप्त करने का प्रयास न करने के लिए भी सहमत हैं।
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">4. अस्वीकरण</h2>
              <p className="mb-4 text-white">
                एस्ट्रो आशी द्वारा प्रदान की गई जानकारी केवल रुचि के मामलों पर सामान्य मार्गदर्शन के लिए है।
                विशिष्ट स्थितियों में जानकारी का अनुप्रयोग शामिल विशेष परिस्थितियों पर निर्भर करेगा।
                तदनुसार, ऐसी जानकारी को पेशेवर सलाह के विकल्प के रूप में नहीं माना जाना चाहिए।
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">5. संपर्क</h2>
              <p className="mb-4 text-white">
                यदि आपके पास इन शर्तों के बारे में कोई प्रश्न हैं, तो कृपया हमसे संपर्क करें:
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

export default TermsOfService;
