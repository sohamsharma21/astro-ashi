import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data, error: claimsError } = await authClient.auth.getClaims(token);
    
    if (claimsError || !data?.claims) {
      console.error('Auth error:', claimsError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = data.claims.sub as string;
    const { predictionType, language } = await req.json();
    
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cache first - reuse today's prediction if already generated
    const today = new Date().toISOString().split('T')[0];
    const { data: cached } = await supabase
      .from('user_predictions')
      .select('*')
      .eq('user_id', userId)
      .eq('prediction_type', predictionType)
      .eq('prediction_date', today)
      .maybeSingle();

    if (cached) {
      return new Response(JSON.stringify({
        content_en: cached.content_en,
        content_hi: cached.content_hi,
        prediction_type: cached.prediction_type,
        focus_areas: cached.focus_areas,
        factors: { kundli: 40, transits: 30, panchang: 20, ai: 10 },
        kundli_factors: cached.kundli_factors,
        transit_factors: cached.transit_factors,
        panchang_factors: cached.panchang_factors,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Fetch all data sources in parallel
    const [profileRes, mahadashaRes, panchangRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('user_mahadasha').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('panchang_cache').select('*').eq('date', today).limit(1).maybeSingle(),
    ]);

    const profile = profileRes.data;
    const mahadasha = mahadashaRes.data;
    const panchang = panchangRes.data;

    // --- SOURCE 1: Kundli factors (40%) ---
    const kundliFactors = {
      lagna: profile?.lagna || 'Aries',
      moon_sign: profile?.moon_sign || 'Aries',
      nakshatra: profile?.nakshatra || 'Ashwini',
      kundli_data: profile?.kundli_data,
      weight: 40,
    };

    // --- SOURCE 2: Graha Gochar / Transits (30%) ---
    const transitFactors = computeCurrentTransits(today);

    // --- SOURCE 3: Panchang (20%) ---
    const panchangFactors = {
      tithi: panchang?.tithi || { name: 'Pratipada' },
      nakshatra: panchang?.nakshatra || { name: 'Ashwini' },
      yoga: panchang?.yoga || { name: 'Vishkambha' },
      karana: panchang?.karana || { name: 'Bava' },
      vaar: panchang?.vaar || getDayName(new Date()),
      rahu_kaal: panchang?.rahu_kaal,
      weight: 20,
    };

    // --- SOURCE 4: AI interpretation (10%) ---
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const prompt = buildDetailedPrompt(profile, mahadasha, kundliFactors, transitFactors, panchangFactors, predictionType, language);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: `You are a compassionate, expert Vedic astrologer providing personalized predictions. You combine birth chart analysis (Kundli), planetary transits (Gochar), Panchang data, and astrological wisdom to create accurate, supportive predictions.

Rules:
- Never be fatalistic or fear-based
- Always provide actionable advice
- Be emotionally supportive and practical
- Structure output clearly with the 3 required sections
- Respond in ${language === 'hi' ? 'Hindi (Devanagari script)' : 'English'}
- Generate BOTH English and Hindi versions`
          },
          { role: 'user', content: prompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_prediction",
            description: "Generate a structured astrological prediction",
            parameters: {
              type: "object",
              properties: {
                content_en: { type: "string", description: "Full prediction text in English" },
                content_hi: { type: "string", description: "Full prediction text in Hindi" },
                what_may_happen_en: { type: "string", description: "What may happen section in English" },
                what_may_happen_hi: { type: "string", description: "What may happen section in Hindi" },
                what_to_do_en: { type: "string", description: "What to do section in English" },
                what_to_do_hi: { type: "string", description: "What to do section in Hindi" },
                what_to_avoid_en: { type: "string", description: "What to avoid section in English" },
                what_to_avoid_hi: { type: "string", description: "What to avoid section in Hindi" },
                career_status: { type: "string", enum: ["positive", "caution", "neutral"] },
                career_insight_en: { type: "string" },
                career_insight_hi: { type: "string" },
                career_action_en: { type: "string" },
                career_action_hi: { type: "string" },
                health_status: { type: "string", enum: ["positive", "caution", "neutral"] },
                health_insight_en: { type: "string" },
                health_insight_hi: { type: "string" },
                health_action_en: { type: "string" },
                health_action_hi: { type: "string" },
                finance_status: { type: "string", enum: ["positive", "caution", "neutral"] },
                finance_insight_en: { type: "string" },
                finance_insight_hi: { type: "string" },
                finance_action_en: { type: "string" },
                finance_action_hi: { type: "string" },
                relationships_status: { type: "string", enum: ["positive", "caution", "neutral"] },
                relationships_insight_en: { type: "string" },
                relationships_insight_hi: { type: "string" },
                relationships_action_en: { type: "string" },
                relationships_action_hi: { type: "string" },
              },
              required: ["content_en", "content_hi", "what_may_happen_en", "what_may_happen_hi", "what_to_do_en", "what_to_do_hi", "what_to_avoid_en", "what_to_avoid_hi"],
              additionalProperties: false,
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_prediction" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errText = await response.text();
      console.error('AI API error:', response.status, errText);
      // Return deterministic fallback
      return new Response(JSON.stringify(buildFallbackPrediction(kundliFactors, panchangFactors, mahadasha, predictionType)), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await response.json();
    
    // Parse tool call response
    let parsed: any = {};
    try {
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        parsed = JSON.parse(toolCall.function.arguments);
      }
    } catch {
      // Fallback: try to get plain content
      const content = aiData.choices?.[0]?.message?.content || '';
      parsed = { content_en: content, content_hi: content };
    }

    const prediction = {
      content_en: parsed.content_en || 'Your stars indicate a day of growth and learning.',
      content_hi: parsed.content_hi || 'आपके सितारे विकास और सीखने का दिन बता रहे हैं।',
      prediction_type: predictionType,
      what_may_happen: parsed.what_may_happen_en || '',
      what_to_do: parsed.what_to_do_en || '',
      what_to_avoid: parsed.what_to_avoid_en || '',
      focus_areas: {
        career: {
          status: parsed.career_status || 'neutral',
          insight_en: parsed.career_insight_en || 'Stable career outlook',
          insight_hi: parsed.career_insight_hi || 'स्थिर करियर दृष्टिकोण',
          action_en: parsed.career_action_en || 'Stay focused',
          action_hi: parsed.career_action_hi || 'केंद्रित रहें',
        },
        health: {
          status: parsed.health_status || 'neutral',
          insight_en: parsed.health_insight_en || 'Take care of yourself',
          insight_hi: parsed.health_insight_hi || 'अपना ध्यान रखें',
          action_en: parsed.health_action_en || 'Rest well',
          action_hi: parsed.health_action_hi || 'अच्छी नींद लें',
        },
        finance: {
          status: parsed.finance_status || 'neutral',
          insight_en: parsed.finance_insight_en || 'Steady finances',
          insight_hi: parsed.finance_insight_hi || 'स्थिर वित्त',
          action_en: parsed.finance_action_en || 'Budget wisely',
          action_hi: parsed.finance_action_hi || 'बजट बनाएं',
        },
        relationships: {
          status: parsed.relationships_status || 'positive',
          insight_en: parsed.relationships_insight_en || 'Harmony in connections',
          insight_hi: parsed.relationships_insight_hi || 'संबंधों में सामंजस्य',
          action_en: parsed.relationships_action_en || 'Express gratitude',
          action_hi: parsed.relationships_action_hi || 'कृतज्ञता व्यक्त करें',
        },
      },
      factors: { kundli: 40, transits: 30, panchang: 20, ai: 10 },
      kundli_factors: kundliFactors,
      transit_factors: transitFactors,
      panchang_factors: panchangFactors,
    };

    // Cache prediction in database
    await supabase.from('user_predictions').insert({
      user_id: userId,
      prediction_type: predictionType,
      prediction_date: today,
      content_en: prediction.content_en,
      content_hi: prediction.content_hi,
      focus_areas: prediction.focus_areas,
      kundli_factors: prediction.kundli_factors,
      transit_factors: prediction.transit_factors,
      panchang_factors: prediction.panchang_factors,
    });

    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred generating your prediction' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function computeCurrentTransits(dateStr: string): any {
  // Simplified transit calculation based on date
  const date = new Date(dateStr);
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  
  // Approximate sidereal positions for major planets
  const sunSign = signs[Math.floor(((dayOfYear + 256) % 365) / 30.44) % 12];
  const moonSign = signs[Math.floor(((dayOfYear * 13.37) % 365) / 30.44) % 12];
  // Jupiter moves ~1 sign/year, Saturn ~2.5 years/sign
  const jupiterSign = signs[Math.floor((date.getFullYear() - 2023 + 0) % 12)];
  const saturnSign = signs[Math.floor((date.getFullYear() - 2020) / 2.5) % 12];
  // Rahu/Ketu move ~1.5 years/sign retrograde
  const rahuSign = signs[11 - (Math.floor((date.getFullYear() - 2023) / 1.5) % 12)];

  return {
    sun: sunSign,
    moon: moonSign,
    jupiter: jupiterSign,
    saturn: saturnSign,
    rahu: rahuSign,
    weight: 30,
    description: `Sun in ${sunSign}, Moon in ${moonSign}, Jupiter in ${jupiterSign}, Saturn in ${saturnSign}`,
  };
}

function getDayName(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

function buildDetailedPrompt(
  profile: any, mahadasha: any, kundli: any, transits: any, panchang: any,
  type: string, lang: string
): string {
  const period = type === 'daily' ? 'today' : type === 'weekly' ? 'this week' : type === 'monthly' ? 'this month' : 'this year';
  
  return `Generate a personalized ${type} Vedic astrology prediction for ${period}.

=== BIRTH KUNDLI (40% weight) ===
- Lagna (Ascendant): ${kundli.lagna}
- Moon Sign (Rashi): ${kundli.moon_sign}
- Nakshatra: ${kundli.nakshatra}
- Current Mahadasha: ${mahadasha?.current_mahadasha || 'Unknown'}
- Current Antardasha: ${mahadasha?.current_antardasha || 'Unknown'}
- Mahadasha Period: ${mahadasha?.mahadasha_start || 'N/A'} to ${mahadasha?.mahadasha_end || 'N/A'}

=== CURRENT TRANSITS / GOCHAR (30% weight) ===
- Transit Sun: ${transits.sun}
- Transit Moon: ${transits.moon}
- Transit Jupiter: ${transits.jupiter}
- Transit Saturn: ${transits.saturn}
- Transit Rahu: ${transits.rahu}
- Key aspects: Analyze how these transits interact with the native's Lagna and Moon sign

=== PANCHANG DATA (20% weight) ===
- Tithi: ${JSON.stringify(panchang.tithi)}
- Nakshatra: ${JSON.stringify(panchang.nakshatra)}
- Yoga: ${JSON.stringify(panchang.yoga)}
- Karana: ${JSON.stringify(panchang.karana)}
- Vaar (Day): ${panchang.vaar}

=== INSTRUCTIONS ===
Combine all four sources to create a deeply personalized prediction. Generate bilingual content (English AND Hindi). Focus on practical, actionable guidance across Career, Health, Finance, and Relationships.`;
}

function buildFallbackPrediction(kundli: any, panchang: any, mahadasha: any, type: string): any {
  const lagnaInsights: Record<string, { en: string; hi: string }> = {
    Aries: { en: 'Your Mars-ruled nature brings energy and initiative today.', hi: 'आपकी मंगल-शासित प्रकृति आज ऊर्जा और पहल लाती है।' },
    Taurus: { en: 'Venus blesses you with stability and comfort.', hi: 'शुक्र आपको स्थिरता और आराम का आशीर्वाद देता है।' },
    Gemini: { en: 'Mercury enhances your communication skills.', hi: 'बुध आपके संवाद कौशल को बढ़ाता है।' },
  };

  const insight = lagnaInsights[kundli.lagna] || { en: 'The stars are aligned for personal growth.', hi: 'सितारे व्यक्तिगत विकास के लिए अनुकूल हैं।' };

  return {
    content_en: `${insight.en} Your ${mahadasha?.current_mahadasha || 'current'} Mahadasha period continues to influence your journey. Today's ${panchang?.vaar || 'day'} is a good time for reflection and planning.`,
    content_hi: `${insight.hi} आपका ${mahadasha?.current_mahadasha || 'वर्तमान'} महादशा काल आपकी यात्रा को प्रभावित कर रहा है। आज का ${panchang?.vaar || 'दिन'} चिंतन और योजना के लिए अच्छा है।`,
    prediction_type: type,
    focus_areas: {
      career: { status: 'neutral', insight_en: 'Steady progress expected', insight_hi: 'स्थिर प्रगति की उम्मीद', action_en: 'Stay consistent', action_hi: 'निरंतर रहें' },
      health: { status: 'positive', insight_en: 'Good vitality today', insight_hi: 'आज अच्छी जीवन शक्ति', action_en: 'Exercise regularly', action_hi: 'नियमित व्यायाम करें' },
      finance: { status: 'neutral', insight_en: 'Stable day financially', insight_hi: 'आर्थिक रूप से स्थिर दिन', action_en: 'Avoid impulsive purchases', action_hi: 'आवेगपूर्ण खरीदारी से बचें' },
      relationships: { status: 'positive', insight_en: 'Warm connections today', insight_hi: 'आज गर्मजोशी भरे संबंध', action_en: 'Reach out to loved ones', action_hi: 'प्रियजनों से संपर्क करें' },
    },
    factors: { kundli: 40, transits: 30, panchang: 20, ai: 10 },
  };
}
