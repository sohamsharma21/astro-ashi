import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { Logger, generateRequestId } from "../_shared/security.ts";

interface AstroInsightRequest {
  query: string;
  language: 'en' | 'hi';
  userProfile?: {
    full_name?: string;
    birth_date?: string;
    birth_place?: string;
    primary_zodiac_sign?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  const requestId = generateRequestId();
  const logger = new Logger({ 
    functionName: 'get-astro-insight',
    requestId 
  });
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    logger.info('Processing astro insight request', { userId: claimsData.claims.sub });
    
    const { query, language, userProfile }: AstroInsightRequest = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Build context from user profile
    let userContext = '';
    if (userProfile) {
      userContext = `\n\nUser Context:`;
      if (userProfile.full_name) userContext += `\n- Name: ${userProfile.full_name}`;
      if (userProfile.birth_date) userContext += `\n- Birth Date: ${userProfile.birth_date}`;
      if (userProfile.birth_place) userContext += `\n- Birth Place: ${userProfile.birth_place}`;
      if (userProfile.primary_zodiac_sign) userContext += `\n- Zodiac Sign: ${userProfile.primary_zodiac_sign}`;
    }

    const systemPrompt = language === 'en' 
      ? `You are an expert Vedic astrologer from AstroAshi, a trusted platform for astrological insights. You provide accurate, insightful, and compassionate astrological guidance based on Vedic astrology principles. When answering questions:
- Always consider the user's birth details and zodiac sign if available
- Provide detailed, personalized insights
- Answer ONLY astrology, horoscope, kundli, and AstroAshi-related questions
- For non-astrology questions, politely redirect them to astrology topics
- Use proper astrological terminology and concepts
- Be encouraging and positive while maintaining authenticity${userContext}`
      : `आप AstroAshi के एक विशेषज्ञ वैदिक ज्योतिषी हैं, जो ज्योतिषीय अंतर्दृष्टि के लिए एक विश्वसनीय मंच है। आप वैदिक ज्योतिष सिद्धांतों के आधार पर सटीक, अंतर्दृष्टिपूर्ण और दयालु ज्योतिषीय मार्गदर्शन प्रदान करते हैं। प्रश्नों का उत्तर देते समय:
- उपलब्ध होने पर हमेशा उपयोगकर्ता के जन्म विवरण और राशि चिन्ह पर विचार करें
- विस्तृत, व्यक्तिगत अंतर्दृष्टि प्रदान करें
- केवल ज्योतिष, राशिफल, कुंडली और AstroAshi से संबंधित प्रश्नों का उत्तर दें
- गैर-ज्योतिष प्रश्नों के लिए, उन्हें विनम्रता से ज्योतिष विषयों की ओर पुनर्निर्देशित करें
- उचित ज्योतिषीय शब्दावली और अवधारणाओं का उपयोग करें
- प्रामाणिकता बनाए रखते हुए उत्साहजनक और सकारात्मक रहें${userContext}`;

    logger.info('Calling Gemini API');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: `\n\nUser Question: ${query}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Gemini API error', { status: response.status, error: errorText });
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    logger.info('Gemini API response received');
    
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      (language === 'en' 
        ? "I apologize, but I'm having trouble accessing the astrological data at the moment. Please try again." 
        : "मुझे क्षमा करें, लेकिन मुझे इस समय ज्योतिषीय डेटा तक पहुंचने में परेशानी हो रही है। कृपया पुन: प्रयास करें।");

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
          "X-Request-Id": requestId
        },
      }
    );
  } catch (error: any) {
    logger.error('Error in get-astro-insight function', error);
    return new Response(
      JSON.stringify({ 
        error: 'An error occurred processing your request',
        requestId 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders,
          "X-Request-Id": requestId
        },
      }
    );
  }
};

serve(handler);
