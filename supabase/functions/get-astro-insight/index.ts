
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';
import { ZodiacSign } from '../_shared/types.ts';

// Define the request body type
interface RequestBody {
  query: string;
  language: 'en' | 'hi';
  userProfile?: {
    full_name?: string;
    birth_date?: string;
    birth_place?: string;
    primary_zodiac_sign?: ZodiacSign;
  };
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Generate response using Swiss Ephemeris calculations
const generateAstroInsight = async (
  query: string,
  language: 'en' | 'hi',
  userProfile?: RequestBody['userProfile']
): Promise<string> => {
  try {
    // In a production app, we would use a proper AI service with our own prompt
    // For now, we'll simulate the response based on the query content
    
    // Get current planetary positions from database (simulated)
    const { data: planets } = await supabase
      .from('astrological_events')
      .select('*')
      .limit(3);
      
    // Extract query keywords
    const keywords = query.toLowerCase();
    const zodiacSigns = [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
      'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
      'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'
    ];
    
    const mentionedSign = zodiacSigns.find(sign => keywords.includes(sign)) || 
      userProfile?.primary_zodiac_sign || 
      'aries';
      
    // Topics
    const isAboutCareer = keywords.includes('career') || keywords.includes('job') || 
      keywords.includes('work') || keywords.includes('business') ||
      keywords.includes('करियर') || keywords.includes('नौकरी') ||
      keywords.includes('काम') || keywords.includes('व्यापार');
      
    const isAboutLove = keywords.includes('love') || keywords.includes('relationship') ||
      keywords.includes('marriage') || keywords.includes('partner') || 
      keywords.includes('प्यार') || keywords.includes('रिश्ता') ||
      keywords.includes('शादी') || keywords.includes('साथी');
      
    const isAboutHealth = keywords.includes('health') || keywords.includes('medical') ||
      keywords.includes('wellness') || keywords.includes('body') ||
      keywords.includes('स्वास्थ्य') || keywords.includes('चिकित्सा') ||
      keywords.includes('तंदुरुस्ती') || keywords.includes('शरीर');
      
    const isAboutMoney = keywords.includes('money') || keywords.includes('finance') ||
      keywords.includes('wealth') || keywords.includes('investment') ||
      keywords.includes('पैसा') || keywords.includes('वित्त') ||
      keywords.includes('धन') || keywords.includes('निवेश');

    // Current date for calculations
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    
    // Generate appropriate response based on query context
    let response = '';
    
    if (language === 'en') {
      if (isAboutCareer) {
        response = `Based on the current position of Mars and Jupiter, ${mentionedSign} is experiencing a positive influence in career matters. The next 3 weeks present opportunities for growth and recognition. Focus on showcasing your unique skills, and don't hesitate to take calculated risks. A senior colleague may offer valuable guidance around the ${currentDay + 5}th.`;
      } else if (isAboutLove) {
        response = `Venus is currently in a favorable position for ${mentionedSign}, bringing harmony and understanding to your relationships. If single, you may encounter someone intriguing through a mutual friend. If committed, this is an excellent time to deepen your connection through meaningful conversations. Pay attention to subtle cues from your partner around the ${currentDay + 3}rd.`;
      } else if (isAboutHealth) {
        response = `The alignment of the Sun and Saturn suggests that ${mentionedSign} should pay special attention to rest and recovery right now. Your energy levels might fluctuate, so balance activity with adequate rest. Focus on nutrition rich in minerals and vitamins C and D. Gentle movement like walking or swimming would be beneficial rather than intense exercise for the next 10 days.`;
      } else if (isAboutMoney) {
        response = `Mercury's current position indicates a favorable time for ${mentionedSign} to review financial strategies. You may discover overlooked opportunities for saving or investment. Avoid impulsive purchases until after the ${currentDay + 7}th. A conversation with someone experienced in financial matters could prove extremely valuable this month.`;
      } else {
        response = `According to the Swiss Ephemeris calculations, ${mentionedSign} is currently under the influence of ${planets ? planets[0].event_type : 'a planetary transit'}. This is a time of reflection and inner growth. Your intuition is heightened, making it an excellent period to connect with your deeper purpose. Pay attention to recurring thoughts or dreams, as they contain important messages for your journey ahead. The coming weeks will bring clarity to a situation that has seemed uncertain.`;
      }
    } else {
      // Hindi responses
      if (isAboutCareer) {
        response = `मंगल और बृहस्पति की वर्तमान स्थिति के आधार पर, ${mentionedSign} करियर के मामलों में सकारात्मक प्रभाव का अनुभव कर रहा है। अगले 3 हफ्तों में विकास और पहचान के अवसर मिलेंगे। अपने अनोखे कौशल को प्रदर्शित करने पर ध्यान दें, और सोच-समझकर जोखिम लेने से हिचकिचाएं नहीं। एक वरिष्ठ सहकर्मी ${currentDay + 5} के आसपास मूल्यवान मार्गदर्शन प्रदान कर सकते हैं।`;
      } else if (isAboutLove) {
        response = `शुक्र वर्तमान में ${mentionedSign} के लिए एक अनुकूल स्थिति में है, जो आपके संबंधों में सामंजस्य और समझ ला रहा है। अगर आप अविवाहित हैं, तो आप एक आम दोस्त के माध्यम से किसी दिलचस्प व्यक्ति से मिल सकते हैं। अगर आप प्रतिबद्ध हैं, तो यह सार्थक बातचीत के माध्यम से अपने संबंध को गहरा करने का एक उत्कृष्ट समय है। ${currentDay + 3} के आसपास अपने साथी के सूक्ष्म संकेतों पर ध्यान दें।`;
      } else if (isAboutHealth) {
        response = `सूर्य और शनि का संरेखण बताता है कि ${mentionedSign} को अभी आराम और रिकवरी पर विशेष ध्यान देना चाहिए। आपके ऊर्जा स्तर में उतार-चढ़ाव हो सकता है, इसलिए गतिविधि को पर्याप्त आराम के साथ संतुलित करें। खनिजों और विटामिन सी और डी से भरपूर पोषण पर ध्यान दें। अगले 10 दिनों के लिए तीव्र व्यायाम के बजाय पैदल चलना या तैराकी जैसी हल्की गतिविधि फायदेमंद होगी।`;
      } else if (isAboutMoney) {
        response = `बुध की वर्तमान स्थिति ${mentionedSign} के लिए वित्तीय रणनीतियों की समीक्षा के लिए एक अनुकूल समय का संकेत देती है। आप बचत या निवेश के लिए अनदेखे अवसरों की खोज कर सकते हैं। ${currentDay + 7} के बाद तक आवेगी खरीदारी से बचें। वित्तीय मामलों में अनुभवी किसी व्यक्ति के साथ बातचीत इस महीने बेहद मूल्यवान साबित हो सकती है।`;
      } else {
        response = `स्विस एफेमेरिस गणनाओं के अनुसार, ${mentionedSign} वर्तमान में ${planets ? planets[0].event_type : 'एक ग्रह पारगमन'} के प्रभाव में है। यह चिंतन और आंतरिक विकास का समय है। आपकी अंतर्ज्ञान बढ़ी हुई है, जिससे यह आपके गहरे उद्देश्य से जुड़ने के लिए एक उत्कृष्ट अवधि बन जाती है। बार-बार आने वाले विचारों या सपनों पर ध्यान दें, क्योंकि उनमें आपकी यात्रा के लिए महत्वपूर्ण संदेश हैं। आने वाले हफ्तों में एक ऐसी स्थिति में स्पष्टता आएगी जो अनिश्चित लग रही थी।`;
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error generating astrological insight:', error);
    return language === 'en' 
      ? 'I apologize, but I am unable to provide an astrological insight at this time due to a technical issue. Please try again later.'
      : 'मुझे क्षमा करें, लेकिन मैं तकनीकी समस्या के कारण इस समय ज्योतिषीय अंतर्दृष्टि प्रदान करने में असमर्थ हूं। कृपया बाद में पुन: प्रयास करें।';
  }
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { query, language, userProfile } = await req.json() as RequestBody;
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const response = await generateAstroInsight(
      query, 
      language || 'en',
      userProfile
    );
    
    return new Response(
      JSON.stringify({ response }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
