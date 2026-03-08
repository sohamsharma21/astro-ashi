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
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    // Verify user
    const authClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { question, language = 'en' } = await req.json();
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Question is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user context in parallel: profile/kundli, panchang, mahadasha
    const [profileRes, mahadashaRes, panchangRes] = await Promise.all([
      serviceClient.from('profiles').select('*').eq('id', user.id).single(),
      serviceClient.from('user_mahadasha').select('*').eq('user_id', user.id).maybeSingle(),
      serviceClient.from('panchang_cache').select('*')
        .eq('date', new Date().toISOString().split('T')[0])
        .maybeSingle(),
    ]);

    const profile = profileRes.data;
    const mahadasha = mahadashaRes.data;
    const panchang = panchangRes.data;
    const kundli = profile?.kundli_data;

    // Build transit context
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const transitInfo = `Current approximate planetary positions based on day ${dayOfYear} of the year.`;

    // Build rich astrological context
    const contextParts: string[] = [];

    if (profile) {
      contextParts.push(`User: ${profile.full_name || 'Unknown'}, Gender: ${profile.gender || 'Unknown'}`);
      if (profile.birth_date) contextParts.push(`Birth Date: ${profile.birth_date}`);
      if (profile.birth_place) contextParts.push(`Birth Place: ${profile.birth_place}`);
      if (profile.birth_time) contextParts.push(`Birth Time: ${profile.birth_time}`);
      if (profile.moon_sign) contextParts.push(`Moon Sign (Rashi): ${profile.moon_sign}`);
      if (profile.lagna) contextParts.push(`Lagna (Ascendant): ${profile.lagna}`);
      if (profile.nakshatra) contextParts.push(`Nakshatra: ${profile.nakshatra}`);
    }

    if (kundli) {
      contextParts.push(`Kundli Data: ${JSON.stringify(kundli).substring(0, 1500)}`);
    }

    if (mahadasha) {
      contextParts.push(`Current Mahadasha: ${mahadasha.current_mahadasha}, Antardasha: ${mahadasha.current_antardasha}`);
      contextParts.push(`Mahadasha Period: ${mahadasha.mahadasha_start} to ${mahadasha.mahadasha_end}`);
    }

    if (panchang) {
      contextParts.push(`Today's Panchang - Tithi: ${JSON.stringify(panchang.tithi)}, Nakshatra: ${JSON.stringify(panchang.nakshatra)}, Yoga: ${JSON.stringify(panchang.yoga)}, Karana: ${JSON.stringify(panchang.karana)}`);
      contextParts.push(`Sunrise: ${panchang.sunrise}, Sunset: ${panchang.sunset}`);
    }

    contextParts.push(transitInfo);

    const langInstruction = language === 'hi'
      ? 'Respond ENTIRELY in Hindi (Devanagari script). Use astrological Hindi terminology.'
      : 'Respond in English.';

    const systemPrompt = `You are AstroAshi AI — an expert Vedic astrologer providing personalized guidance.

${langInstruction}

You have access to the user's birth chart (Kundli), current Mahadasha/Antardasha periods, today's Panchang, and planetary transits.

ASTROLOGICAL CONTEXT:
${contextParts.join('\n')}

RESPONSE FORMAT — You MUST structure every response with these three sections using markdown headers:

## ${language === 'hi' ? '🔍 विश्लेषण (Analysis)' : '🔍 Analysis'}
Provide deep astrological analysis based on the user's Kundli, current planetary transits, Mahadasha period, and today's Panchang. Reference specific planets, houses, and aspects.

## ${language === 'hi' ? '💡 सलाह (Advice)' : '💡 Advice'}
Give actionable, specific advice grounded in Vedic astrology. Include remedies (mantras, gemstones, donations, fasting) where relevant.

## ${language === 'hi' ? '⚠️ क्या न करें (What to Avoid)' : '⚠️ What to Avoid'}
List specific things the user should avoid during this period based on their chart and current transits.

Be compassionate, wise, and specific. Never give generic advice — always tie guidance to the user's actual astrological data.`;

    // Call AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please try again later.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const responseContent = aiData.choices?.[0]?.message?.content || 'Unable to generate response.';

    // Store in database
    await serviceClient.from('ai_questions').insert({
      user_id: user.id,
      question: question.substring(0, 2000),
      ai_response: { content: responseContent, language, model: 'gemini-3-flash-preview' },
      language,
    });

    return new Response(JSON.stringify({
      response: responseContent,
      language,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('ask-astroashi error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process your question' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
