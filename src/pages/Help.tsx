import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Help = () => {
  const { language } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const userManualEN = [
    {
      title: "Getting Started",
      content: "Welcome to AstroAshi! To begin your astrological journey, create an account or sign in using your email and password. Once logged in, you'll have access to all our features like daily horoscopes, Kundli generation, consultations, and Ask Astro. Complete your profile with your birth details for personalized insights."
    },
    {
      title: "Daily Horoscope",
      content: "Visit the Daily Horoscope page to read predictions for your zodiac sign. Select your preferred sign from the dropdown menu to view today's horoscope. You can save your zodiac sign preference in your profile settings for quick access. Horoscopes are updated daily and available in both English and Hindi."
    },
    {
      title: "Kundli Generator",
      content: "The Kundli Generator creates a detailed birth chart (Janam Kundli) based on your birth details. Enter your name, date of birth, exact time of birth (hour and minute), and place of birth accurately for the most precise results. Your generated Kundli will show planetary positions, house placements, and detailed astrological insights. Save your Kundli for future reference in your profile."
    },
    {
      title: "Compatibility Calculator",
      content: "Our Compatibility Calculator analyzes the astrological compatibility between two people. Enter complete birth details (name, date, time, and place of birth) for both individuals. The system will generate a comprehensive report covering love compatibility, emotional connection, communication, and long-term prospects based on planetary positions and zodiac signs."
    },
    {
      title: "Ask Astro - AI Astrologer",
      content: "The Ask Astro feature connects you with our AI-powered astrologer for instant guidance. Type your questions related to astrology, career, relationships, health, or spiritual matters. The AI analyzes your query and provides personalized responses based on astrological principles. Your conversation history is saved automatically, so you can refer back to previous insights anytime."
    },
    {
      title: "Book Consultations",
      content: "For personalized one-on-one guidance, book a consultation with our experienced astrologers. We offer three packages: ₹19 Cosmic Guidance (1 question, 24hr response), ₹39 Celestial Insight (2-3 questions, priority reply with chart-based analysis), and ₹59 Divine Oracle (5 questions, full horoscope, potential live session). Choose your package, select date and time, enter your phone number, and confirm booking. You'll receive a verification email - click the link to confirm. Track all your bookings in the Profile section."
    },
    {
      title: "Installing the App (PWA)",
      content: "AstroAshi can be installed on your phone or computer for easy access. On mobile: Open the app in your browser, tap the Share button (iPhone) or menu (Android), and select 'Add to Home Screen'. On desktop: Look for the install icon in the address bar or use the browser menu. Once installed, the app works offline and loads faster like a native app."
    }
  ];
  
  const userManualHI = [
    {
      title: "शुरू करना",
      content: "एस्ट्रोआशी में आपका स्वागत है! अपनी ज्योतिषीय यात्रा शुरू करने के लिए, अपने ईमेल और पासवर्ड का उपयोग करके एक खाता बनाएं या साइन इन करें। एक बार लॉग इन होने के बाद, आपके पास दैनिक राशिफल, कुंडली जनरेशन, परामर्श और ज्योतिषी से पूछें जैसी सभी सुविधाएँ उपलब्ध होंगी। व्यक्तिगत अंतर्दृष्टि के लिए अपनी जन्म जानकारी के साथ अपनी प्रोफ़ाइल पूरी करें।"
    },
    {
      title: "दैनिक राशिफल",
      content: "अपनी राशि के लिए भविष्यवाणी पढ़ने के लिए दैनिक राशिफल पेज पर जाएं। आज का राशिफल देखने के लिए ड्रॉपडाउन मेनू से अपनी पसंदीदा राशि चुनें। त्वरित पहुंच के लिए आप अपनी प्रोफ़ाइल सेटिंग्स में अपनी राशि की प्राथमिकता सहेज सकते हैं। राशिफल प्रतिदिन अपडेट होते हैं और अंग्रेजी और हिंदी दोनों में उपलब्ध हैं।"
    },
    {
      title: "कुंडली जनरेटर",
      content: "कुंडली जनरेटर आपके जन्म विवरण के आधार पर एक विस्तृत जन्म कुंडली (जनम कुंडली) बनाता है। सबसे सटीक परिणामों के लिए अपना नाम, जन्मतिथि, सटीक जन्म समय (घंटा और मिनट), और जन्म स्थान सही ढंग से दर्ज करें। आपकी उत्पन्न कुंडली ग्रहों की स्थिति, भाव स्थान और विस्तृत ज्योतिषीय अंतर्दृष्टि दिखाएगी। भविष्य के संदर्भ के लिए अपनी कुंडली को अपनी प्रोफ़ाइल में सहेजें।"
    },
    {
      title: "संगतता कैलकुलेटर",
      content: "हमारा संगतता कैलकुलेटर दो व्यक्तियों के बीच ज्योतिषीय संगतता का विश्लेषण करता है। दोनों व्यक्तियों के लिए पूर्ण जन्म विवरण (नाम, तिथि, समय और जन्म स्थान) दर्ज करें। सिस्टम ग्रहों की स्थिति और राशि चक्र के आधार पर प्रेम संगतता, भावनात्मक संबंध, संचार और दीर्घकालिक संभावनाओं को कवर करते हुए एक व्यापक रिपोर्ट तैयार करेगा।"
    },
    {
      title: "ज्योतिषी से पूछें - AI ज्योतिषी",
      content: "ज्योतिषी से पूछें सुविधा आपको तत्काल मार्गदर्शन के लिए हमारे AI-संचालित ज्योतिषी से जोड़ती है। ज्योतिष, करियर, रिश्ते, स्वास्थ्य या आध्यात्मिक मामलों से संबंधित अपने प्रश्न टाइप करें। AI आपके प्रश्न का विश्लेषण करता है और ज्योतिषीय सिद्धांतों के आधार पर व्यक्तिगत प्रतिक्रियाएं प्रदान करता है। आपका वार्तालाप इतिहास स्वचालित रूप से सहेजा जाता है, इसलिए आप किसी भी समय पिछली अंतर्दृष्टि को देख सकते हैं।"
    },
    {
      title: "परामर्श बुक करें",
      content: "व्यक्तिगत एक-से-एक मार्गदर्शन के लिए, हमारे अनुभवी ज्योतिषियों के साथ परामर्श बुक करें। हम तीन पैकेज प्रदान करते हैं: ₹19 कॉस्मिक मार्गदर्शन (1 प्रश्न, 24 घंटे प्रतिक्रिया), ₹39 सेलेस्टियल इनसाइट (2-3 प्रश्न, कुंडली आधारित विश्लेषण के साथ प्राथमिकता उत्तर), और ₹59 डिवाइन ओरेकल (5 प्रश्न, पूर्ण राशिफल, संभावित लाइव सत्र)। अपना पैकेज चुनें, तिथि और समय चुनें, अपना फोन नंबर दर्ज करें, और बुकिंग की पुष्टि करें। आपको एक सत्यापन ईमेल प्राप्त होगा - पुष्टि करने के लिए लिंक पर क्लिक करें। प्रोफ़ाइल अनुभाग में अपनी सभी बुकिंग ट्रैक करें।"
    },
    {
      title: "ऐप इंस्टॉल करना (PWA)",
      content: "आसान पहुंच के लिए एस्ट्रोआशी को आपके फोन या कंप्यूटर पर इंस्टॉल किया जा सकता है। मोबाइल पर: अपने ब्राउज़र में ऐप खोलें, शेयर बटन (iPhone) या मेनू (Android) पर टैप करें, और 'होम स्क्रीन में जोड़ें' चुनें। डेस्कटॉप पर: एड्रेस बार में इंस्टॉल आइकन देखें या ब्राउज़र मेनू का उपयोग करें। एक बार इंस्टॉल होने के बाद, ऐप ऑफ़लाइन काम करता है और मूल ऐप की तरह तेज़ी से लोड होता है।"
    }
  ];

  const faqsEN = [
    {
      question: "What is AstroAshi?",
      answer: "AstroAshi is a comprehensive astrology platform offering daily horoscopes, birth chart analysis, compatibility calculations, AI-powered guidance, and consultations with professional astrologers."
    },
    {
      question: "How do I book a consultation?",
      answer: "Visit the Consultations page, browse packages, select one, choose date/time, provide phone number, and confirm. You'll receive a verification email - click the link to confirm your booking."
    },
    {
      question: "Can I install AstroAshi as an app?",
      answer: "Yes! AstroAshi is a PWA (Progressive Web App). On mobile, use your browser's 'Add to Home Screen' option. On desktop, look for the install icon in the address bar. Once installed, it works offline."
    }
  ];
  
  const faqsHI = [
    {
      question: "एस्ट्रोआशी क्या है?",
      answer: "एस्ट्रोआशी एक व्यापक ज्योतिष प्लेटफॉर्म है जो दैनिक राशिफल, जन्म कुंडली विश्लेषण, संगतता गणना, AI-संचालित मार्गदर्शन और पेशेवर ज्योतिषियों के साथ परामर्श प्रदान करता है।"
    },
    {
      question: "मैं परामर्श कैसे बुक करूँ?",
      answer: "परामर्श पेज पर जाएं, पैकेज ब्राउज़ करें, एक चुनें, तिथि/समय चुनें, फोन नंबर प्रदान करें, और पुष्टि करें। आपको एक सत्यापन ईमेल प्राप्त होगा - अपनी बुकिंग की पुष्टि करने के लिए लिंक पर क्लिक करें।"
    },
    {
      question: "क्या मैं एस्ट्रोआशी को ऐप के रूप में इंस्टॉल कर सकता हूं?",
      answer: "हाँ! एस्ट्रोआशी एक PWA (प्रोग्रेसिव वेब ऐप) है। मोबाइल पर, अपने ब्राउज़र के 'होम स्क्रीन में जोड़ें' विकल्प का उपयोग करें। डेस्कटॉप पर, एड्रेस बार में इंस्टॉल आइकन देखें। एक बार इंस्टॉल होने के बाद, यह ऑफ़लाइन काम करता है।"
    }
  ];
  
  const filteredUserManual = language === 'en' 
    ? userManualEN.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : userManualHI.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
  const filteredFaqs = language === 'en'
    ? faqsEN.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqsHI.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={150} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className={`text-4xl md:text-6xl font-bold mb-6 text-center text-gradient-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' ? 'Help & Support' : 'मदद और सहायता'}
        </h1>
        
        <p className={`text-lg text-white text-center mb-12 max-w-3xl mx-auto ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' 
            ? 'Find answers to common questions and learn how to use all features of our application.'
            : 'सामान्य प्रश्नों के उत्तर पाएं और हमारे एप्लिकेशन की सभी सुविधाओं का उपयोग करना सीखें।'}
        </p>
        
        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              type="text"
              placeholder={language === 'en' ? 'Search help topics...' : 'सहायता विषयों की खोज करें...'}
              className="pl-10 bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="manual" className={language === 'hi' ? 'font-noto-devanagari' : ''}>
                {language === 'en' ? 'User Manual' : 'उपयोगकर्ता मार्गदर्शिका'}
              </TabsTrigger>
              <TabsTrigger value="faqs" className={language === 'hi' ? 'font-noto-devanagari' : ''}>
                {language === 'en' ? 'FAQs' : 'अक्सर पूछे जाने वाले प्रश्न'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <div className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg p-6 rounded-lg border border-cosmic-gold border-opacity-20">
                <Accordion type="single" collapsible className="w-full">
                  {filteredUserManual.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className={`text-cosmic-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                        {item.title}
                      </AccordionTrigger>
                      <AccordionContent className={`text-gray-300 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                        {item.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                  
                  {filteredUserManual.length === 0 && (
                    <p className={`text-center py-8 text-gray-400 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                      {language === 'en' 
                        ? 'No results found. Please try a different search term.' 
                        : 'कोई परिणाम नहीं मिला। कृपया कोई अन्य खोज शब्द आज़माएं।'}
                    </p>
                  )}
                </Accordion>
              </div>
            </TabsContent>
            
            <TabsContent value="faqs">
              <div className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg p-6 rounded-lg border border-cosmic-gold border-opacity-20">
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((item, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className={`text-cosmic-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className={`text-gray-300 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                  
                  {filteredFaqs.length === 0 && (
                    <p className={`text-center py-8 text-gray-400 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                      {language === 'en' 
                        ? 'No results found. Please try a different search term.' 
                        : 'कोई परिणाम नहीं मिला। कृपया कोई अन्य खोज शब्द आज़माएं।'}
                    </p>
                  )}
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Help;
