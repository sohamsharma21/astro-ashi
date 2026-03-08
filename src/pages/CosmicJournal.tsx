
import { useState } from 'react';
import DOMPurify from 'dompurify';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useReadingHistory } from '@/hooks/useReadingHistory';

interface Article {
  id: string;
  title_en: string;
  title_hi: string;
  excerpt_en: string;
  excerpt_hi: string;
  content_en: string;
  content_hi: string;
  image: string;
  category: string;
  date: string;
}

const CosmicJournal = () => {
  const { language } = useAuth();
  const { recordReading } = useReadingHistory();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Mock articles
  const articles: Article[] = [
    {
      id: '1',
      title_en: 'Understanding Planetary Retrogrades',
      title_hi: 'ग्रहों के वक्री होने को समझना',
      excerpt_en: 'Learn how retrograde planets affect your life and why they aren\'t always negative.',
      excerpt_hi: 'जानें कि वक्री ग्रह आपके जीवन को कैसे प्रभावित करते हैं और वे हमेशा नकारात्मक क्यों नहीं होते हैं।',
      content_en: `
        <p>When a planet appears to move backward in its orbit from our perspective on Earth, we call this retrograde motion. While many fear retrogrades, especially Mercury retrograde, they offer valuable opportunities for reflection and growth.</p>
        
        <p>Mercury retrograde, occurring 3-4 times yearly, encourages us to revisit our communication patterns and revise ongoing projects. It's an excellent time for editing, reviewing, and reconnecting with people from your past. By slowing down and being more deliberate in your communication, you can navigate this period successfully.</p>
        
        <p>Venus retrograde affects our relationships and values. This 40-day period every 18 months invites us to reconsider what we truly value in relationships and material possessions. Old flames may reappear, but proceed with caution before rekindling romances during this time.</p>
        
        <p>Mars retrograde, occurring every two years for about 2-3 months, tests our patience and energy. Projects may stall and frustrations rise. Use this time to refine your approach and conserve energy rather than pushing forward aggressively.</p>
        
        <p>The outer planets (Jupiter, Saturn, Uranus, Neptune, and Pluto) spend months in retrograde each year, creating more subtle effects that influence society and generational shifts rather than day-to-day experiences.</p>
        
        <p>Rather than fearing retrogrades, view them as cosmic rest periods—opportunities to pause, reflect, and realign before moving forward with renewed clarity.</p>
      `,
      content_hi: `
        <p>जब कोई ग्रह पृथ्वी पर हमारे दृष्टिकोण से अपनी कक्षा में पीछे की ओर घूमता प्रतीत होता है, तो हम इसे वक्री गति कहते हैं। हालांकि कई लोग वक्रों से डरते हैं, विशेष रूप से बुध वक्र, वे चिंतन और विकास के लिए मूल्यवान अवसर प्रदान करते हैं।</p>
        
        <p>बुध वक्र, जो साल में 3-4 बार होता है, हमें अपने संचार पैटर्न पर फिर से विचार करने और चल रही परियोजनाओं को संशोधित करने के लिए प्रोत्साहित करता है। यह संपादन, समीक्षा और अपने अतीत के लोगों से फिर से जुड़ने के लिए एक उत्कृष्ट समय है। धीमा होकर और अपने संचार में अधिक सोच-समझकर, आप इस अवधि को सफलतापूर्वक नेविगेट कर सकते हैं।</p>
        
        <p>शुक्र वक्र हमारे संबंधों और मूल्यों को प्रभावित करता है। हर 18 महीनों में यह 40-दिवसीय अवधि हमें यह पुनर्विचार करने के लिए आमंत्रित करती है कि हम संबंधों और भौतिक वस्तुओं में वास्तव में क्या मूल्य देते हैं। पुराने प्रेमी फिर से दिखाई दे सकते हैं, लेकिन इस समय के दौरान प्रेम संबंधों को फिर से जलाने से पहले सावधानी बरतें।</p>
        
        <p>मंगल वक्र, जो हर दो साल में लगभग 2-3 महीनों के लिए होता है, हमारे धैर्य और ऊर्जा का परीक्षण करता है। परियोजनाएं रुक सकती हैं और निराशाएं बढ़ सकती हैं। आक्रामक रूप से आगे बढ़ने के बजाय अपने दृष्टिकोण को परिष्कृत करने और ऊर्जा बचाने के लिए इस समय का उपयोग करें।</p>
        
        <p>बाहरी ग्रह (बृहस्पति, शनि, अरुण, वरुण और प्लूटो) हर साल महीनों तक वक्र में रहते हैं, जो दिन-प्रतिदिन के अनुभवों के बजाय समाज और पीढ़ीगत बदलावों को प्रभावित करने वाले अधिक सूक्ष्म प्रभाव पैदा करते हैं।</p>
        
        <p>वक्रों से डरने के बजाय, उन्हें कॉस्मिक आराम अवधि के रूप में देखें - नवीनीकृत स्पष्टता के साथ आगे बढ़ने से पहले रुकने, प्रतिबिंबित करने और पुन: संरेखित करने के अवसर।</p>
      `,
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      category: 'planets',
      date: '2023-12-15'
    },
    {
      id: '2',
      title_en: 'The Moon\'s Influence on Your Emotions',
      title_hi: 'आपकी भावनाओं पर चंद्रमा का प्रभाव',
      excerpt_en: 'Discover how lunar phases affect your emotional state and daily energy levels.',
      excerpt_hi: 'जानें कि चंद्र चरण आपकी भावनात्मक स्थिति और दैनिक ऊर्जा स्तरों को कैसे प्रभावित करते हैं।',
      content_en: `
        <p>The Moon, Earth's closest celestial neighbor, has been linked to human emotions and behaviors for millennia. As it orbits around us every 29.5 days, moving through eight distinct phases, its gravitational pull affects not only our oceans but potentially our emotional tides as well.</p>
        
        <p>The New Moon marks the beginning of the lunar cycle when the Moon sits between Earth and the Sun, appearing invisible to us. This dark period symbolizes new beginnings and is ideal for setting intentions and planting seeds for future growth. Many people experience a natural urge to turn inward, reflect, and plan during this phase.</p>
        
        <p>As the Moon waxes toward fullness, our energy tends to increase. The First Quarter Moon often brings challenges that test our resolve regarding the intentions we set during the New Moon. This is a time of action and forward momentum, where emotional clarity begins to emerge.</p>
        
        <p>The Full Moon represents culmination and illumination. Under its bright light, emotions often intensify, which explains why emergency rooms and police stations historically report increased activity during Full Moons. This is an excellent time for celebration, manifestation, and bringing projects to completion. Many people experience heightened intuition and vivid dreams during this phase.</p>
        
        <p>During the waning phases, as the Moon's visible surface diminishes, we naturally turn toward release and letting go. The Last Quarter Moon supports us in releasing what no longer serves us, processing emotions, and preparing for the next cycle.</p>
        
        <p>Beyond the phases, the Moon's position in various zodiac signs colors our emotional landscape. A Scorpio Moon might intensify feelings and increase psychological depth, while a Gemini Moon could bring mental restlessness and enhanced communication.</p>
        
        <p>By tracking the Moon's phases and understanding their influence on your emotions, you can better navigate your inner landscape and use the lunar energy to support your personal growth and emotional well-being.</p>
      `,
      content_hi: `
        <p>चंद्रमा, पृथ्वी का निकटतम आकाशीय पड़ोसी, हजारों वर्षों से मानव भावनाओं और व्यवहारों से जुड़ा रहा है। जैसे-जैसे यह हर 29.5 दिनों में हमारे चारों ओर परिक्रमा करता है, आठ अलग-अलग चरणों से गुजरता है, इसका गुरुत्वाकर्षण खिंचाव न केवल हमारे महासागरों को बल्कि संभावित रूप से हमारी भावनात्मक ज्वार को भी प्रभावित करता है।</p>
        
        <p>अमावस्या चंद्र चक्र की शुरुआत को चिह्नित करती है जब चंद्रमा पृथ्वी और सूर्य के बीच बैठता है, हमें अदृश्य दिखाई देता है। यह अंधेरी अवधि नई शुरुआत का प्रतीक है और भविष्य के विकास के लिए इरादे निर्धारित करने और बीज बोने के लिए आदर्श है। कई लोग इस चरण के दौरान अंदर मुड़ने, प्रतिबिंबित करने और योजना बनाने की प्राकृतिक इच्छा का अनुभव करते हैं।</p>
        
        <p>जैसे-जैसे चंद्रमा पूर्णता की ओर बढ़ता है, हमारी ऊर्जा बढ़ने लगती है। प्रथम चतुर्थांश चंद्रमा अक्सर ऐसी चुनौतियाँ लाता है जो अमावस्या के दौरान हमारे द्वारा निर्धारित इरादों के संबंध में हमारे संकल्प का परीक्षण करती हैं। यह कार्रवाई और आगे की गति का समय है, जहां भावनात्मक स्पष्टता उभरना शुरू होती है।</p>
        
        <p>पूर्णिमा विकास और प्रकाश का प्रतिनिधित्व करती है। इसके उज्जवल प्रकाश के तहत, भावनाएं अक्सर तीव्र होती हैं, जो यह बताती हैं कि आपातकालीन कक्ष और पुलिस स्टेशन ऐतिहासिक रूप से पूर्णिमा के दौरान बढ़ी हुई गतिविधि की रिपोर्ट क्यों करते हैं। यह उत्सव, अभिव्यक्ति और परियोजनाओं को पूरा करने का एक उत्कृष्ट समय है। कई लोग इस चरण के दौरान बढ़ी हुई अंतर्ज्ञान और जीवंत सपनों का अनुभव करते हैं।</p>
        
        <p>घटते चरणों के दौरान, जैसे-जैसे चंद्रमा का दृश्यमान पृष्ठ कम होता है, हम स्वाभाविक रूप से रिलीज और जाने देने की ओर मुड़ते हैं। अंतिम चतुर्थांश चंद्रमा हमें जो अब हमारी सेवा नहीं करता है, उसे छोड़ने, भावनाओं को संसाधित करने और अगले चक्र के लिए तैयारी करने में हमारा समर्थन करता है।</p>
        
        <p>चरणों से परे, विभिन्न राशियों में चंद्रमा की स्थिति हमारे भावनात्मक परिदृश्य को रंगती है। वृश्चिक चंद्रमा भावनाओं को तीव्र कर सकता है और मनोवैज्ञानिक गहराई बढ़ा सकता है, जबकि मिथुन चंद्रमा मानसिक बेचैनी और वर्धित संचार ला सकता है।</p>
        
        <p>चंद्रमा के चरणों को ट्रैक करके और आपकी भावनाओं पर उनके प्रभाव को समझकर, आप अपने आंतरिक परिदृश्य को बेहतर ढंग से नेविगेट कर सकते हैं और अपने व्यक्तिगत विकास और भावनात्मक कल्याण के समर्थन के लिए चंद्र ऊर्जा का उपयोग कर सकते हैं।</p>
      `,
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
      category: 'moon',
      date: '2023-12-02'
    },
    {
      id: '3',
      title_en: 'Ancient Astrology Practices Around the World',
      title_hi: 'दुनिया भर में प्राचीन ज्योतिष प्रथाएं',
      excerpt_en: 'Explore how different cultures developed their own systems of celestial divination.',
      excerpt_hi: 'जानें कि विभिन्न संस्कृतियों ने आकाशीय भविष्यवाणी की अपनी प्रणालियां कैसे विकसित कीं।',
      content_en: `
        <p>Long before modern technology, ancient civilizations across the globe looked to the stars for guidance, developing sophisticated systems of celestial observation and interpretation that continue to influence contemporary astrological practices.</p>
        
        <p>Mesopotamian astrology, dating back to 3000 BCE, laid the groundwork for Western astrological traditions. Babylonian priest-astronomers meticulously recorded celestial events on clay tablets, correlating them with earthly occurrences. They divided the sky into twelve equal parts creating the zodiac we recognize today. Their primary focus was on mundane astrology—predicting events affecting kings and nations rather than individuals.</p>
        
        <p>In Egypt, astrology blended with religion as early as 2800 BCE. The Egyptian zodiac incorporates unique symbols and relies heavily on the Nile's cycles and decan stars. Egyptian priests used astronomical ceilings in temples to track time and predict seasonal changes critical for agriculture.</p>
        
        <p>Chinese astrology, with origins dating to the Shang Dynasty (1600-1046 BCE), developed independently from Western systems. Instead of constellations, it centers on a sixty-year cycle combining twelve animal signs with five elements. Chinese astrologers emphasized balance between opposed forces—yin and yang—and the five elements' influence on human affairs.</p>
        
        <p>India's Vedic astrology (Jyotish) emerged around 1500 BCE with the earliest references in the Vedas. While sharing similarities with Western zodiac signs, Jyotish uses a sidereal zodiac based on fixed stars rather than the tropical zodiac used in Western practice. The nakshatras—27 lunar mansions—add another layer of interpretation unique to this system.</p>
        
        <p>Maya civilization developed perhaps the most precise pre-telescope astronomical observations. Their complex calendar systems and Venus tables show remarkable accuracy. Maya priests used these calculations primarily for determining auspicious dates for royal ceremonies and military campaigns.</p>
        
        <p>These diverse traditions demonstrate humanity's universal desire to find meaning in the cosmos across cultures and throughout history. While methodologies differ, the fundamental quest remains consistent—understanding our connection to the stars and their influence on our lives.</p>
      `,
      content_hi: `
        <p>आधुनिक प्रौद्योगिकी से बहुत पहले, दुनिया भर की प्राचीन सभ्यताएं मार्गदर्शन के लिए तारों की ओर देखती थीं, आकाशीय अवलोकन और व्याख्या की परिष्कृत प्रणालियों को विकसित करती थीं जो समकालीन ज्योतिषीय प्रथाओं को प्रभावित करना जारी रखती हैं।</p>
        
        <p>मेसोपोटामियन ज्योतिष, जो 3000 ईसा पूर्व तक की तारीख है, ने पश्चिमी ज्योतिषीय परंपराओं के लिए आधार तैयार किया। बेबीलोनियाई पुजारी-खगोलविदों ने मिट्टी की गोलियों पर आकाशीय घटनाओं को मेहनत से दर्ज किया, उन्हें पार्थिव घटनाओं के साथ सहसंबद्ध किया। उन्होंने आकाश को बारह बराबर भागों में विभाजित किया जिससे आज हम जिस राशिचक्र को पहचानते हैं। उनका प्राथमिक फोकस सांसारिक ज्योतिष पर था—व्यक्तियों के बजाय राजाओं और देशों को प्रभावित करने वाली घटनाओं की भविष्यवाणी करना।</p>
        
        <p>मिस्र में, ज्योतिष धर्म के साथ 2800 ईसा पूर्व जितना पहले से ही मिश्रित था। मिस्र का राशिचक्र अद्वितीय प्रतीकों को शामिल करता है और नील के चक्रों और डेकन तारों पर बहुत अधिक निर्भर करता है। मिस्री पुजारियों ने समय का पता लगाने और मौसमी परिवर्तनों की भविष्यवाणी करने के लिए मंदिरों में खगोलीय छतों का उपयोग किया जो कृषि के लिए महत्वपूर्ण थे।</p>
        
        <p>चीनी ज्योतिष, जिसकी उत्पत्ति शांग राजवंश (1600-1046 ईसा पूर्व) से है, पश्चिमी प्रणालियों से स्वतंत्र रूप से विकसित हुआ। नक्षत्रों के बजाय, यह पांच तत्वों के साथ बारह जानवरों के संकेतों को जोड़कर साठ साल के चक्र पर केंद्रित है। चीनी ज्योतिषियों ने विरोधी बलों—यिन और यांग—के बीच संतुलन और मानव मामलों पर पांच तत्वों के प्रभाव पर जोर दिया।</p>
        
        <p>भारत का वैदिक ज्योतिष (ज्योतिष) वेदों में सबसे पहले संदर्भों के साथ 1500 ईसा पूर्व के आसपास उभरा। पश्चिमी राशि चिह्नों के साथ समानताएं साझा करने के दौरान, ज्योतिष पश्चिमी अभ्यास में उपयोग किए जाने वाले उष्णकटिबंधीय राशिचक्र के बजाय स्थिर तारों पर आधारित एक सिडेरियल राशिचक्र का उपयोग करता है। नक्षत्र—27 चंद्र मंजिलें—इस प्रणाली के लिए अद्वितीय व्याख्या की एक और परत जोड़ती हैं।</p>
        
        <p>माया सभ्यता ने शायद पूर्व-दूरबीन खगोलीय अवलोकनों का सबसे सटीक विकास किया। उनकी जटिल कैलेंडर प्रणालियां और वीनस टेबल उल्लेखनीय सटीकता दिखाते हैं। माया पुजारियों ने मुख्य रूप से शाही समारोहों और सैन्य अभियानों के लिए शुभ तिथियां निर्धारित करने के लिए इन गणनाओं का उपयोग किया।</p>
        
        <p>ये विविध परंपराएं संस्कृतियों में और इतिहास भर में ब्रह्मांड में अर्थ खोजने की मानवता की सार्वभौमिक इच्छा को प्रदर्शित करती हैं। जबकि कार्यप्रणालियां अलग हैं, मौलिक खोज लगातार बनी रहती है—तारों के साथ हमारे संबंध और हमारे जीवन पर उनके प्रभाव को समझना।</p>
      `,
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      category: 'history',
      date: '2023-11-20'
    }
  ];

  const readArticle = async (article: Article) => {
    setSelectedArticle(article);
    // Record this reading in history
    await recordReading('article', article.id);
    toast.success(
      language === 'en'
        ? 'Article added to your reading history!'
        : 'लेख आपके पठन इतिहास में जोड़ा गया!'
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={150} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className={`text-4xl md:text-6xl font-bold mb-6 text-center text-gradient-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' ? 'Cosmic Journal' : 'कॉस्मिक जर्नल'}
        </h1>
        
        <p className={`text-lg text-white text-center mb-12 max-w-3xl mx-auto ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' 
            ? 'Explore in-depth articles about astrology, spirituality, and cosmic wisdom to deepen your understanding of the universe.'
            : 'ब्रह्मांड की अपनी समझ को गहरा करने के लिए ज्योतिष, आध्यात्मिकता और ब्रह्मांडीय ज्ञान के बारे में गहन लेखों का अन्वेषण करें।'}
        </p>
        
        {selectedArticle ? (
          <div className="max-w-4xl mx-auto">
            <Button 
              onClick={() => setSelectedArticle(null)}
              className="cosmic-button-outline mb-6"
            >
              {language === 'en' ? '← Back to Articles' : '← लेखों पर वापस जाएं'}
            </Button>
            
            <div className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg p-8 rounded-lg border border-cosmic-gold border-opacity-20">
              <h2 className="text-3xl font-bold mb-4 text-cosmic-gold">
                {language === 'en' ? selectedArticle.title_en : selectedArticle.title_hi}
              </h2>
              
              <p className="text-gray-300 mb-6">
                {formatDate(selectedArticle.date)}
              </p>
              
              <div className="h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                <img 
                  src={selectedArticle.image} 
                  alt={language === 'en' ? selectedArticle.title_en : selectedArticle.title_hi} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div 
                className="text-white prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: language === 'en' ? selectedArticle.content_en : selectedArticle.content_hi 
                }}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card 
                key={article.id} 
                className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg border border-cosmic-gold border-opacity-20 overflow-hidden cursor-pointer hover:border-cosmic-gold transition-all duration-300 hover:-translate-y-1"
                onClick={() => readArticle(article)}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image}
                    alt={language === 'en' ? article.title_en : article.title_hi}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-cosmic-gold">
                    {language === 'en' ? article.title_en : article.title_hi}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {formatDate(article.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white mb-4">
                    {language === 'en' ? article.excerpt_en : article.excerpt_hi}
                  </p>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      readArticle(article);
                    }}
                    className="cosmic-button-outline"
                  >
                    {language === 'en' ? 'Read Article' : 'लेख पढ़ें'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CosmicJournal;
