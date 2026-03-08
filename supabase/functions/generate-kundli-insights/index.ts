import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InsightRequest {
  name: string;
  ascendant: string;
  planetPositions: Array<{
    planet: string;
    sign: string;
    degree: number;
  }>;
  houses: Array<{
    house: number;
    sign: string;
    planets: string[];
  }>;
  language: 'en' | 'hi';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT auth
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

    const { name, ascendant, planetPositions, houses, language }: InsightRequest = await req.json();

    console.log('Generating insights for:', name);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Prepare context for AI
    const planetsInfo = planetPositions.map(p => 
      `${p.planet} in ${p.sign} at ${p.degree.toFixed(2)}°`
    ).join(', ');

    const housesInfo = houses
      .filter(h => h.planets.length > 0)
      .map(h => `House ${h.house} (${h.sign}): ${h.planets.join(', ')}`)
      .join('; ');

    const systemPrompt = language === 'hi'
      ? `आप एक विशेषज्ञ वैदिक ज्योतिषी हैं जो गहन और सटीक कुंडली विश्लेषण प्रदान करते हैं। संक्षिप्त लेकिन व्यावहारिक अंतर्दृष्टि प्रदान करें।`
      : `You are an expert Vedic astrologer providing deep and accurate Kundli analysis. Provide concise but actionable insights.`;

    const userPrompt = language === 'hi'
      ? `${name} की कुंडली का विश्लेषण करें:\n\nलग्न: ${ascendant}\nग्रह स्थिति: ${planetsInfo}\nभाव विवरण: ${housesInfo}\n\nकृपया प्रदान करें:\n1. व्यक्तित्व और जीवन पथ (2-3 वाक्य)\n2. करियर और वित्त (2-3 वाक्य)\n3. संबंध और परिवार (2-3 वाक्य)\n4. स्वास्थ्य और कल्याण (2-3 वाक्य)\n5. आध्यात्मिक प्रवृत्ति (2-3 वाक्य)\n\nसंक्षिप्त और सटीक रहें।`
      : `Analyze the Kundli for ${name}:\n\nAscendant: ${ascendant}\nPlanetary Positions: ${planetsInfo}\nHouse Details: ${housesInfo}\n\nPlease provide:\n1. Personality & Life Path (2-3 sentences)\n2. Career & Finance (2-3 sentences)\n3. Relationships & Family (2-3 sentences)\n4. Health & Wellness (2-3 sentences)\n5. Spiritual Inclinations (2-3 sentences)\n\nBe concise and specific.`;

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
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI credits exhausted. Please add credits to your workspace.');
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('Failed to generate insights');
    }

    const data = await response.json();
    const insights = data.choices[0].message.content;

    console.log('Insights generated successfully');

    return new Response(
      JSON.stringify({ insights }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error generating insights:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
