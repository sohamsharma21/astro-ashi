
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth';
import AstrologyContent from './AstrologyContent';

interface EducationContentItem {
  title: string;
  description: string;
  content: string;
}

interface EducationContentMap {
  [key: string]: EducationContentItem;
}

const AstrologyBasics = () => {
  const { language } = useAuth();
  const [activeTab, setActiveTab] = useState('zodiac');
  
  const educationContent: EducationContentMap = {
    zodiac: {
      title: language === 'en' ? 'The Zodiac Signs' : 'राशि चक्र',
      description: language === 'en' 
        ? 'Learn about the twelve zodiac signs and their characteristics.'
        : 'बारह राशियों और उनके लक्षणों के बारे में जानें।',
      content: language === 'en' 
        ? `The zodiac is divided into twelve signs, each representing different personality traits and characteristics.
           Each sign is associated with one of the four elements (Fire, Earth, Air, Water) and has ruling planets that influence its energy.`
        : `राशि चक्र को बारह राशियों में बांटा गया है, जिनमें से प्रत्येक अलग-अलग व्यक्तित्व लक्षणों और विशेषताओं का प्रतिनिधित्व करती है।
           प्रत्येक राशि चार तत्वों (अग्नि, पृथ्वी, वायु, जल) में से एक से जुड़ी है और इसकी ऊर्जा को प्रभावित करने वाले शासक ग्रह हैं।`
    },
    planets: {
      title: language === 'en' ? 'Planets and Their Influence' : 'ग्रह और उनका प्रभाव',
      description: language === 'en' 
        ? 'Understand how planets affect different aspects of your life.'
        : 'समझें कि ग्रह आपके जीवन के विभिन्न पहलुओं को कैसे प्रभावित करते हैं।',
      content: language === 'en' 
        ? `In astrology, each planet governs different areas of life. For example, Venus rules love and relationships,
           while Mercury influences communication and intellect. The position of these planets at the time of your birth
           creates a unique celestial blueprint that shapes your personality and life path.`
        : `ज्योतिष में, प्रत्येक ग्रह जीवन के विभिन्न क्षेत्रों को नियंत्रित करता है। उदाहरण के लिए, शुक्र प्रेम और संबंधों को नियंत्रित करता है,
           जबकि बुध संचार और बुद्धि को प्रभावित करता है। आपके जन्म के समय इन ग्रहों की स्थिति एक अनूठा आकाशीय ब्लूप्रिंट बनाती है
           जो आपके व्यक्तित्व और जीवन पथ को आकार देती है।`
    },
    houses: {
      title: language === 'en' ? 'The Twelve Houses' : 'बारह भाव',
      description: language === 'en' 
        ? 'Explore the twelve houses and what they represent in your birth chart.'
        : 'बारह घरों का पता लगाएं और जानें कि वे आपकी जन्म कुंडली में क्या दर्शाते हैं।',
      content: language === 'en' 
        ? `The twelve houses in astrology represent different areas of life. The First House represents self and appearance,
           the Second House is about possessions and values, the Seventh House governs partnerships, and so on.
           The placement of planets within these houses provides deeper insights into how planetary energies manifest in specific life areas.`
        : `ज्योतिष में बारह भाव जीवन के विभिन्न क्षेत्रों का प्रतिनिधित्व करते हैं। पहला भाव स्वयं और उपस्थिति का प्रतिनिधित्व करता है,
           दूसरा भाव संपत्ति और मूल्यों के बारे में है, सातवां भाव साझेदारी को नियंत्रित करता है, और इसी तरह।
           इन भावों में ग्रहों की स्थिति इस बारे में गहरी अंतर्दृष्टि प्रदान करती है कि ग्रह ऊर्जा विशिष्ट जीवन क्षेत्रों में कैसे प्रकट होती है।`
    }
  };
  
  const tabItems = [
    { value: 'zodiac', labelEn: 'Zodiac Signs', labelHi: 'राशियाँ' },
    { value: 'planets', labelEn: 'Planets', labelHi: 'ग्रह' },
    { value: 'houses', labelEn: 'Houses', labelHi: 'भाव' }
  ];
  
  return (
    <Card className="bg-cosmic-deep-space bg-opacity-90 border-cosmic-gold">
      <CardHeader>
        <CardTitle className="text-2xl text-cosmic-gold">
          {language === 'en' ? 'Astrology Basics' : 'ज्योतिष के मूल सिद्धांत'}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {language === 'en' 
            ? 'Learn the fundamental concepts of Vedic astrology' 
            : 'वैदिक ज्योतिष के मूलभूत सिद्धांतों को जानें'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="zodiac" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="bg-cosmic-violet bg-opacity-30 mb-6">
            {tabItems.map(item => (
              <TabsTrigger 
                key={item.value}
                value={item.value} 
                className={`${activeTab === item.value ? 'bg-cosmic-gold text-cosmic-deep-space' : 'text-white'}`}
              >
                {language === 'en' ? item.labelEn : item.labelHi}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.keys(educationContent).map(key => (
            <TabsContent key={key} value={key} className="text-white">
              <AstrologyContent 
                title={educationContent[key].title}
                description={educationContent[key].description}
                content={educationContent[key].content}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AstrologyBasics;
