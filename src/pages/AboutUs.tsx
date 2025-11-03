
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';

const AboutUs = () => {
  const { language } = useAuth();

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={150} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-4xl md:text-5xl font-bold mb-12 text-center text-gradient-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en' ? 'About Us' : 'हमारे बारे में'}
          </h1>
          
          <div className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg p-8 rounded-lg border border-cosmic-gold border-opacity-20">
            {language === 'en' ? (
              <>
                <div className="mb-10 flex justify-center">
                  <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-cosmic-gold glow-effect">
                    <img
                      src="/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png"
                      alt="AstroAshi Logo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                
                <p className="mb-6 text-white text-lg">
                  AstroAshi is a premier destination for astrological guidance and cosmic wisdom, 
                  dedicated to illuminating your path through the ancient science of Vedic astrology.
                </p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">Our Mission</h2>
                <p className="mb-6 text-white">
                  We strive to make the profound wisdom of Vedic astrology accessible to everyone. 
                  Our mission is to provide accurate, insightful, and personalized astrological guidance 
                  that helps you navigate life's journey with confidence and clarity.
                </p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">Our Expertise</h2>
                <p className="mb-6 text-white">
                  With over two decades of collective experience in Vedic astrology, our team of dedicated 
                  astrologers combines traditional wisdom with modern analytical techniques to provide you 
                  with the most accurate readings and predictions.
                </p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">Our Approach</h2>
                <p className="mb-6 text-white">
                  We believe that astrology is not about rigid determinism, but about understanding potentials 
                  and possibilities. Our approach is empowering, focusing on how you can harness cosmic energies 
                  to create your best life. We provide guidance without judgment, insights without fear-mongering, 
                  and predictions with practical advice.
                </p>
              </>
            ) : (
              <>
                <div className="mb-10 flex justify-center">
                  <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-cosmic-gold glow-effect">
                    <img
                      src="/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png"
                      alt="एस्ट्रो आशी लोगो"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                
                <p className="mb-6 text-white text-lg">
                  एस्ट्रो आशी ज्योतिषीय मार्गदर्शन और ब्रह्मांडीय ज्ञान के लिए एक प्रमुख गंतव्य है,
                  वैदिक ज्योतिष के प्राचीन विज्ञान के माध्यम से आपके मार्ग को प्रकाशित करने के लिए समर्पित।
                </p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">हमारा मिशन</h2>
                <p className="mb-6 text-white">
                  हम वैदिक ज्योतिष के गहन ज्ञान को हर किसी के लिए सुलभ बनाने का प्रयास करते हैं।
                  हमारा मिशन सटीक, अंतर्दृष्टिपूर्ण और व्यक्तिगत ज्योतिषीय मार्गदर्शन प्रदान करना है
                  जो आपको जीवन की यात्रा में आत्मविश्वास और स्पष्टता के साथ नेविगेट करने में मदद करता है।
                </p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">हमारी विशेषज्ञता</h2>
                <p className="mb-6 text-white">
                  वैदिक ज्योतिष में दो दशकों से अधिक के सामूहिक अनुभव के साथ, हमारी समर्पित टीम
                  ज्योतिषी पारंपरिक ज्ञान को आधुनिक विश्लेषणात्मक तकनीकों के साथ जोड़ते हैं ताकि आपको
                  सबसे सटीक रीडिंग और भविष्यवाणियां प्रदान की जा सकें।
                </p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4 text-cosmic-gold">हमारा दृष्टिकोण</h2>
                <p className="mb-6 text-white">
                  हमारा मानना है कि ज्योतिष कठोर निर्धारणवाद के बारे में नहीं है, बल्कि संभावनाओं और संभावनाओं को समझने के बारे में है।
                  हमारा दृष्टिकोण सशक्त बनाना है, इस बात पर ध्यान केंद्रित करना है कि आप अपने ब्रह्मांडीय ऊर्जाओं का उपयोग कैसे कर सकते हैं
                  अपना सर्वश्रेष्ठ जीवन बनाने के लिए। हम बिना किसी निर्णय के मार्गदर्शन प्रदान करते हैं, बिना भय-मांगरिंग के अंतर्दृष्टि,
                  और व्यावहारिक सलाह के साथ भविष्यवाणियां।
                </p>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
