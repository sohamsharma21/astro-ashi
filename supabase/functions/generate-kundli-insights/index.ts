import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { name, ascendant, planetPositions, houses, language, gender } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const planetsInfo = planetPositions.map((p: any) => `${p.planet} in ${p.sign} at ${p.degree.toFixed(2)}°`).join(', ');
    const housesInfo = houses.filter((h: any) => h.planets.length > 0).map((h: any) => `House ${h.house} (${h.sign}): ${h.planets.join(', ')}`).join('; ');

    // Find moon sign and sun sign from planet positions
    const moonSign = planetPositions.find((p: any) => p.planet === 'Moon')?.sign || 'Unknown';
    const sunSign = planetPositions.find((p: any) => p.planet === 'Sun')?.sign || 'Unknown';

    const systemPrompt = language === 'hi'
      ? `तुम AstroAshi के विशेषज्ञ वैदिक ज्योतिषी हो। तुम्हें कुंडली का गहन विश्लेषण करना है और **शुरुआती लोगों के लिए आसान भाषा** में समझाना है।

तुम्हें STRICT JSON format में जवाब देना है:
{
  "summary": {
    "zodiacSign": "राशि का नाम",
    "zodiacDescription": "1 वाक्य में राशि का अर्थ",
    "moonSign": "चंद्र राशि",
    "moonSignDescription": "1 वाक्य - यह आपकी भावनाएं दर्शाती है",
    "risingSign": "लग्न राशि",
    "risingSignDescription": "1 वाक्य - दूसरे आपको कैसे देखते हैं",
    "element": "तत्व (अग्नि/पृथ्वी/वायु/जल)",
    "rulingPlanet": "शासक ग्रह"
  },
  "personality": {
    "title": "व्यक्तित्व लक्षण",
    "emoji": "🧠",
    "traits": ["लक्षण 1", "लक्षण 2", "लक्षण 3", "लक्षण 4"],
    "description": "3-4 सरल वाक्यों में व्यक्तित्व विश्लेषण - ज्योतिषीय कारण बताओ"
  },
  "career": {
    "title": "करियर और सफलता",
    "emoji": "💼",
    "strengths": ["ताकत 1", "ताकत 2", "ताकत 3"],
    "bestFields": ["उपयुक्त क्षेत्र 1", "क्षेत्र 2", "क्षेत्र 3"],
    "description": "3-4 सरल वाक्यों में करियर मार्गदर्शन"
  },
  "relationships": {
    "title": "रिश्ते और प्रेम",
    "emoji": "❤️",
    "loveStyle": "प्रेम शैली का नाम",
    "compatibleSigns": ["अनुकूल राशि 1", "राशि 2", "राशि 3"],
    "description": "3-4 सरल वाक्यों में रिश्तों का विश्लेषण"
  },
  "challenges": {
    "title": "जीवन की चुनौतियां",
    "emoji": "⚡",
    "areas": ["चुनौती 1", "चुनौती 2", "चुनौती 3"],
    "remedies": ["उपाय 1", "उपाय 2", "उपाय 3"],
    "description": "3-4 वाक्यों में सकारात्मक मार्गदर्शन"
  },
  "spiritual": {
    "title": "आध्यात्मिक मार्ग",
    "emoji": "🙏",
    "path": "आध्यात्मिक प्रवृत्ति",
    "practices": ["अभ्यास 1", "अभ्यास 2"],
    "description": "2-3 वाक्यों में आध्यात्मिक सलाह"
  },
  "luckyFactors": {
    "number": "भाग्यशाली अंक",
    "color": "भाग्यशाली रंग",
    "day": "भाग्यशाली दिन",
    "gemstone": "भाग्यशाली रत्न",
    "mantra": "उपयोगी मंत्र"
  }
}

⚠️ नियम: हमेशा सकारात्मक रहो, आसान भाषा में समझाओ, कुंडली के ग्रहों के आधार पर विश्लेषण करो।`
      : `You are AstroAshi's expert Vedic astrologer. Provide deep Kundli analysis in **beginner-friendly, simple language** that anyone can understand.

Respond in STRICT JSON format:
{
  "summary": {
    "zodiacSign": "Sun sign name",
    "zodiacDescription": "1 sentence - what this sign means in simple words",
    "moonSign": "Moon sign name",
    "moonSignDescription": "1 sentence - this represents your emotions & inner self",
    "risingSign": "Ascendant/Rising sign",
    "risingSignDescription": "1 sentence - how others see you",
    "element": "Fire/Earth/Air/Water",
    "rulingPlanet": "Ruling planet name"
  },
  "personality": {
    "title": "Personality Traits",
    "emoji": "🧠",
    "traits": ["trait 1", "trait 2", "trait 3", "trait 4"],
    "description": "3-4 simple sentences analyzing personality based on chart positions - explain WHY in easy terms"
  },
  "career": {
    "title": "Career & Success",
    "emoji": "💼",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "bestFields": ["suitable field 1", "field 2", "field 3"],
    "description": "3-4 simple sentences on career guidance based on 10th house and planetary positions"
  },
  "relationships": {
    "title": "Love & Relationships",
    "emoji": "❤️",
    "loveStyle": "Love style name",
    "compatibleSigns": ["compatible sign 1", "sign 2", "sign 3"],
    "description": "3-4 simple sentences analyzing relationship nature from 7th house and Venus position"
  },
  "challenges": {
    "title": "Life Challenges",
    "emoji": "⚡",
    "areas": ["challenge area 1", "area 2", "area 3"],
    "remedies": ["remedy 1", "remedy 2", "remedy 3"],
    "description": "3-4 sentences - frame challenges positively as growth opportunities with practical remedies"
  },
  "spiritual": {
    "title": "Spiritual Path",
    "emoji": "🙏",
    "path": "spiritual inclination name",
    "practices": ["practice 1", "practice 2"],
    "description": "2-3 sentences on spiritual guidance based on Jupiter, Ketu positions"
  },
  "luckyFactors": {
    "number": "lucky number",
    "color": "lucky color",
    "day": "lucky day",
    "gemstone": "recommended gemstone",
    "mantra": "beneficial mantra"
  }
}

⚠️ RULES:
- Always be positive and empowering
- Use SIMPLE language a beginner can understand — no complex jargon
- Base analysis on actual planetary positions provided
- Each section must reference specific planets/houses from the chart
- Frame challenges as growth areas with practical solutions`;

    const userPrompt = language === 'hi'
      ? `${name} की कुंडली विश्लेषण करो${gender ? ` (लिंग: ${gender})` : ''}:\n\nलग्न: ${ascendant}\nसूर्य राशि: ${sunSign}\nचंद्र राशि: ${moonSign}\nग्रह स्थिति: ${planetsInfo}\nभाव: ${housesInfo}\n\nJSON में जवाब दो।`
      : `Analyze the Kundli for ${name}${gender ? ` (Gender: ${gender})` : ''}:\n\nAscendant (Rising): ${ascendant}\nSun Sign: ${sunSign}\nMoon Sign: ${moonSign}\nPlanetary Positions: ${planetsInfo}\nHouses: ${housesInfo}\n\nRespond in JSON only.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: 'AI credits exhausted.' }), {
        status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('Failed to generate insights');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1]!.trim());
    } catch {
      try {
        parsed = JSON.parse(content.trim());
      } catch {
        console.error('Failed to parse AI insights:', content);
        // Return the raw text as fallback
        return new Response(JSON.stringify({ insights: content, structured: null }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ insights: content, structured: parsed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error generating insights:', error);
    return new Response(JSON.stringify({ error: 'An error occurred generating insights' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
