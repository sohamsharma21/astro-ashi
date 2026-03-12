
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HoroscopeRequest {
  zodiacSign: string;
  date: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const authClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: claimsData, error: authError } = await authClient.auth.getClaims(token);
    if (authError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { zodiacSign, date } = await req.json() as HoroscopeRequest;

    // Check if horoscope already exists for this sign and date
    const { data: existingHoroscope, error: fetchError } = await supabaseClient
      .from('daily_horoscopes')
      .select('*')
      .eq('zodiac_sign', zodiacSign)
      .eq('date', date)
      .maybeSingle();

    if (fetchError) {
      throw new Error(`Error fetching horoscope: ${fetchError.message}`);
    }
    
    if (existingHoroscope) {
      return new Response(
        JSON.stringify({ 
          horoscope: existingHoroscope,
          source: "database"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate new horoscope based on Swiss Ephemeris calculations
    // In a real implementation, we would use SwissEph here directly
    // Since we can't use npm packages in Deno edge functions, we'll simulate the calculation
    const horoscopeData = generateHoroscopeForSign(zodiacSign, date);
    
    // Store the new horoscope in the database
    const { data: newHoroscope, error: insertError } = await supabaseClient
      .from('daily_horoscopes')
      .insert({
        zodiac_sign: zodiacSign,
        date: date,
        content_en: horoscopeData.content_en,
        content_hi: horoscopeData.content_hi
      })
      .select()
      .single();
      
    if (insertError) {
      throw new Error(`Error inserting horoscope: ${insertError.message}`);
    }

    return new Response(
      JSON.stringify({
        horoscope: newHoroscope,
        source: "freshly_generated"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error generating horoscope:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// This is a simplified simulation of Swiss Ephemeris calculations
// In a real implementation, this would use actual planetary positions
function generateHoroscopeForSign(sign: string, date: string): { content_en: string; content_hi: string } {
  const dateObj = new Date(date);
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  
  // Simulate planetary influences based on date
  const sunPosition = (month * 30 + day) % 360;
  const moonPosition = (sunPosition + 45) % 360;
  const venusPosition = (sunPosition + 120) % 360;
  const marsPosition = (sunPosition + 180) % 360;
  const jupiterPosition = (sunPosition + 240) % 360;
  
  // Map zodiac signs to their typical degrees in the zodiac
  const signPositions: Record<string, number> = {
    'aries': 15,
    'taurus': 45,
    'gemini': 75,
    'cancer': 105,
    'leo': 135,
    'virgo': 165,
    'libra': 195,
    'scorpio': 225,
    'sagittarius': 255,
    'capricorn': 285,
    'aquarius': 315,
    'pisces': 345
  };
  
  // Calculate aspects between planets and the sign's position
  const signPosition = signPositions[sign];
  const sunAspect = calculateAspect(sunPosition, signPosition);
  const moonAspect = calculateAspect(moonPosition, signPosition);
  const venusAspect = calculateAspect(venusPosition, signPosition);
  const marsAspect = calculateAspect(marsPosition, signPosition);
  const jupiterAspect = calculateAspect(jupiterPosition, signPosition);
  
  // Generate horoscope text based on planetary aspects
  let horoscopeEn = generateHoroscopeText(sign, {
    sun: sunAspect,
    moon: moonAspect,
    venus: venusAspect,
    mars: marsAspect,
    jupiter: jupiterAspect
  }, "en");
  
  let horoscopeHi = generateHoroscopeText(sign, {
    sun: sunAspect,
    moon: moonAspect,
    venus: venusAspect,
    mars: marsAspect,
    jupiter: jupiterAspect
  }, "hi");
  
  return {
    content_en: horoscopeEn,
    content_hi: horoscopeHi
  };
}

// Calculate astronomical aspect between two positions
function calculateAspect(position1: number, position2: number): string {
  const diff = Math.abs(position1 - position2) % 360;
  const orb = 8; // Degree of orb allowed
  
  if (Math.abs(diff - 0) < orb || Math.abs(diff - 360) < orb) return "conjunction";
  if (Math.abs(diff - 60) < orb) return "sextile";
  if (Math.abs(diff - 90) < orb) return "square";
  if (Math.abs(diff - 120) < orb) return "trine";
  if (Math.abs(diff - 180) < orb) return "opposition";
  
  return "none";
}

// Generate horoscope text based on aspects
function generateHoroscopeText(sign: string, aspects: Record<string, string>, language: 'en' | 'hi'): string {
  const signTraits: Record<string, { en: string[], hi: string[] }> = {
    'aries': {
      en: ['energetic', 'courageous', 'confident'],
      hi: ['ऊर्जावान', 'साहसी', 'आत्मविश्वासी']
    },
    'taurus': {
      en: ['patient', 'reliable', 'practical'],
      hi: ['धैर्यवान', 'विश्वसनीय', 'व्यावहारिक']
    },
    'gemini': {
      en: ['adaptable', 'communicative', 'curious'],
      hi: ['अनुकूलनशील', 'संचारशील', 'जिज्ञासु']
    },
    'cancer': {
      en: ['emotional', 'intuitive', 'protective'],
      hi: ['भावुक', 'अंतर्ज्ञानी', 'सुरक्षात्मक']
    },
    'leo': {
      en: ['proud', 'creative', 'passionate'],
      hi: ['गर्वित', 'रचनात्मक', 'भावुक']
    },
    'virgo': {
      en: ['analytical', 'precise', 'helpful'],
      hi: ['विश्लेषणात्मक', 'सटीक', 'मददगार']
    },
    'libra': {
      en: ['diplomatic', 'fair', 'social'],
      hi: ['कूटनीतिक', 'निष्पक्ष', 'सामाजिक']
    },
    'scorpio': {
      en: ['intense', 'powerful', 'transformative'],
      hi: ['गहन', 'शक्तिशाली', 'परिवर्तनशील']
    },
    'sagittarius': {
      en: ['optimistic', 'adventurous', 'philosophical'],
      hi: ['आशावादी', 'साहसिक', 'दार्शनिक']
    },
    'capricorn': {
      en: ['disciplined', 'responsible', 'ambitious'],
      hi: ['अनुशासित', 'जिम्मेदार', 'महत्वाकांक्षी']
    },
    'aquarius': {
      en: ['progressive', 'original', 'humanitarian'],
      hi: ['प्रगतिशील', 'मौलिक', 'मानवतावादी']
    },
    'pisces': {
      en: ['compassionate', 'artistic', 'intuitive'],
      hi: ['करुणामय', 'कलात्मक', 'सहज']
    }
  };

  const planetInfluences: Record<string, Record<string, { en: string; hi: string }>> = {
    'sun': {
      'conjunction': {
        en: 'Your identity and core self are emphasized today',
        hi: 'आज आपकी पहचान और मूल स्वयं पर जोर दिया गया है'
      },
      'trine': {
        en: 'You will find it easy to express yourself authentically',
        hi: 'आपको स्वयं को प्रामाणिक रूप से व्यक्त करना आसान लगेगा'
      },
      'square': {
        en: 'You may face challenges related to self-expression',
        hi: 'आपको आत्म-अभिव्यक्ति से संबंधित चुनौतियों का सामना करना पड़ सकता है'
      },
      'opposition': {
        en: 'Balance between personal goals and relationships is key',
        hi: 'व्यक्तिगत लक्ष्यों और रिश्तों के बीच संतुलन महत्वपूर्ण है'
      },
      'sextile': {
        en: 'Opportunities for creative self-expression arise',
        hi: 'रचनात्मक आत्म-अभिव्यक्ति के अवसर उत्पन्न होते हैं'
      },
      'none': {
        en: 'Your identity and ego are functioning normally today',
        hi: 'आज आपकी पहचान और अहंकार सामान्य रूप से कार्य कर रहे हैं'
      }
    },
    'moon': {
      'conjunction': {
        en: 'Your emotions are intensified, pay attention to your feelings',
        hi: 'आपकी भावनाएं तीव्र हैं, अपनी भावनाओं पर ध्यान दें'
      },
      'trine': {
        en: 'Emotional harmony and flow are with you today',
        hi: 'भावनात्मक सामंजस्य और प्रवाह आज आपके साथ हैं'
      },
      'square': {
        en: 'You may experience emotional conflicts or tension',
        hi: 'आप भावनात्मक संघर्ष या तनाव का अनुभव कर सकते हैं'
      },
      'opposition': {
        en: 'Balance your emotional needs with practical responsibilities',
        hi: 'अपनी भावनात्मक जरूरतों को व्यावहारिक जिम्मेदारियों के साथ संतुलित करें'
      },
      'sextile': {
        en: 'Opportunities for emotional growth and connection present themselves',
        hi: 'भावनात्मक विकास और संबंध के अवसर स्वयं प्रस्तुत होते हैं'
      },
      'none': {
        en: 'Your emotional state is steady and balanced today',
        hi: 'आज आपकी भावनात्मक स्थिति स्थिर और संतुलित है'
      }
    },
    'venus': {
      'conjunction': {
        en: 'Love, harmony and beauty are highlighted in your life today',
        hi: 'आज आपके जीवन में प्रेम, सामंजस्य और सौंदर्य पर प्रकाश डाला गया है'
      },
      'trine': {
        en: 'Relationships flow smoothly, bringing joy and pleasure',
        hi: 'संबंध सहजता से बहते हैं, जो आनंद और खुशी लाते हैं'
      },
      'square': {
        en: 'Challenges in relationships or finances may arise',
        hi: 'संबंधों या वित्त में चुनौतियां उत्पन्न हो सकती हैं'
      },
      'opposition': {
        en: 'Balance between giving and receiving in relationships is important',
        hi: 'रिश्तों में देने और लेने के बीच संतुलन महत्वपूर्ण है'
      },
      'sextile': {
        en: 'Opportunities for love, harmony and financial gain are present',
        hi: 'प्रेम, सामंजस्य और आर्थिक लाभ के अवसर मौजूद हैं'
      },
      'none': {
        en: 'Your relationships and finances proceed as normal',
        hi: 'आपके संबंध और वित्त सामान्य रूप से आगे बढ़ते हैं'
      }
    },
    'mars': {
      'conjunction': {
        en: 'Your energy and drive are at a peak today',
        hi: 'आज आपकी ऊर्जा और ड्राइव चरम पर है'
      },
      'trine': {
        en: 'You can easily channel your energy into productive activities',
        hi: 'आप अपनी ऊर्जा को आसानी से उत्पादक गतिविधियों में चैनल कर सकते हैं'
      },
      'square': {
        en: 'You may feel frustrated or encounter conflicts today',
        hi: 'आज आप निराश महसूस कर सकते हैं या संघर्षों का सामना कर सकते हैं'
      },
      'opposition': {
        en: 'Balance your assertiveness with consideration for others',
        hi: 'अपनी दृढ़ता को दूसरों के लिए विचार के साथ संतुलित करें'
      },
      'sextile': {
        en: 'Opportunities to take action and make progress are available',
        hi: 'कार्रवाई करने और प्रगति करने के अवसर उपलब्ध हैं'
      },
      'none': {
        en: 'Your energy levels and drive are operating at their usual pace',
        hi: 'आपके ऊर्जा स्तर और ड्राइव अपनी सामान्य गति से काम कर रहे हैं'
      }
    },
    'jupiter': {
      'conjunction': {
        en: 'Expansion, growth and good fortune are highlighted today',
        hi: 'आज विस्तार, विकास और सौभाग्य पर प्रकाश डाला गया है'
      },
      'trine': {
        en: 'Growth comes easily to you, and optimism is high',
        hi: 'विकास आपके लिए आसानी से आता है, और आशावाद उच्च है'
      },
      'square': {
        en: 'Be cautious of overexpansion or excess in your endeavors',
        hi: 'अपने प्रयासों में अत्यधिक विस्तार या अतिरेक के प्रति सावधान रहें'
      },
      'opposition': {
        en: 'Balance growth with practicality and moderation',
        hi: 'व्यावहारिकता और संयम के साथ विकास को संतुलित करें'
      },
      'sextile': {
        en: 'Opportunities for growth and expansion are present',
        hi: 'विकास और विस्तार के अवसर मौजूद हैं'
      },
      'none': {
        en: 'Your growth and expansion proceed at their natural pace',
        hi: 'आपका विकास और विस्तार अपनी प्राकृतिक गति से आगे बढ़ते हैं'
      }
    }
  };
  
  const traits = signTraits[sign][language];
  const trait1 = traits[0];
  const trait2 = traits[1];
  const trait3 = traits[2];
  
  let horoscope = '';
  
  if (language === 'en') {
    horoscope = `Today, your ${trait1} nature is particularly strong. ${planetInfluences.sun[aspects.sun].en}. ${planetInfluences.moon[aspects.moon].en}. 
    
As a ${sign} with ${trait2} tendencies, ${planetInfluences.venus[aspects.venus].en}. ${planetInfluences.mars[aspects.mars].en}.

Your ${trait3} qualities will help you navigate the day. ${planetInfluences.jupiter[aspects.jupiter].en}. Remember to stay true to your authentic self and embrace the cosmic energies flowing your way today.`;
  } else {
    horoscope = `आज, आपका ${trait1} स्वभाव विशेष रूप से मजबूत है। ${planetInfluences.sun[aspects.sun].hi}। ${planetInfluences.moon[aspects.moon].hi}।
    
${trait2} प्रवृत्ति वाले ${sign} के रूप में, ${planetInfluences.venus[aspects.venus].hi}। ${planetInfluences.mars[aspects.mars].hi}।

आपके ${trait3} गुण आपको दिन का नेविगेशन करने में मदद करेंगे। ${planetInfluences.jupiter[aspects.jupiter].hi}। अपने प्रामाणिक स्वयं के प्रति सच्चे रहना याद रखें और आज आपके रास्ते में बहने वाली कॉस्मिक ऊर्जाओं का स्वागत करें।`;
  }
  
  return horoscope;
}
