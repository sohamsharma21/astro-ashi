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
    // Verify JWT and extract userId from token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Create client with user's auth token to verify identity
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    
    const { predictionType, language } = await req.json();
    
    // Use service role to fetch profile data for the authenticated user only
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch user profile with kundli data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Fetch mahadasha
    const { data: mahadasha } = await supabase
      .from('user_mahadasha')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const prompt = buildPrompt(profile, mahadasha, predictionType, language);

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
            content: `You are a compassionate Vedic astrologer. Provide personalized predictions based on the user's Kundli data. Be supportive, practical, and action-oriented. Never be fatalistic or fear-based. Include:
- What may happen
- What to do
- What to avoid
Always maintain a positive yet realistic tone. Response in ${language === 'hi' ? 'Hindi' : 'English'}.`
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('AI API error');
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || '';

    // Parse and structure the prediction
    const prediction = {
      content_en: language === 'en' ? content : '',
      content_hi: language === 'hi' ? content : '',
      prediction_type: predictionType,
      what_may_happen: extractSection(content, language === 'hi' ? 'क्या हो सकता है' : 'What may happen'),
      what_to_do: extractSection(content, language === 'hi' ? 'क्या करें' : 'What to do'),
      what_to_avoid: extractSection(content, language === 'hi' ? 'क्या न करें' : 'What to avoid'),
      focus_areas: {
        career: { status: 'positive', insight_en: 'Good day for career growth', insight_hi: 'करियर विकास के लिए अच्छा दिन', action_en: 'Take initiative', action_hi: 'पहल करें' },
        health: { status: 'caution', insight_en: 'Take care of your health', insight_hi: 'अपने स्वास्थ्य का ध्यान रखें', action_en: 'Rest well', action_hi: 'अच्छी नींद लें' },
        finance: { status: 'neutral', insight_en: 'Stable financial day', insight_hi: 'स्थिर वित्तीय दिन', action_en: 'Save wisely', action_hi: 'बुद्धिमानी से बचत करें' },
        relationships: { status: 'positive', insight_en: 'Harmony in relationships', insight_hi: 'रिश्तों में सामंजस्य', action_en: 'Express love', action_hi: 'प्यार व्यक्त करें' },
      },
      factors: { kundli: 40, transits: 30, panchang: 20, ai: 10 },
    };

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

function buildPrompt(profile: any, mahadasha: any, type: string, lang: string): string {
  const period = type === 'daily' ? 'today' : type === 'weekly' ? 'this week' : type === 'monthly' ? 'this month' : 'this year';
  
  return `Generate a ${type} Vedic astrology prediction for ${period}.

User's Kundli Details:
- Lagna (Ascendant): ${profile?.lagna || 'Aries'}
- Moon Sign: ${profile?.moon_sign || 'Aries'}
- Nakshatra: ${profile?.nakshatra || 'Ashwini'}
- Current Mahadasha: ${mahadasha?.current_mahadasha || 'Rahu'}
- Current Antardasha: ${mahadasha?.current_antardasha || 'Rahu'}

Create a personalized prediction with:
1. ${lang === 'hi' ? 'क्या हो सकता है' : 'What may happen'} (2-3 points)
2. ${lang === 'hi' ? 'क्या करें' : 'What to do'} (2-3 actionable suggestions)
3. ${lang === 'hi' ? 'क्या न करें' : 'What to avoid'} (1-2 cautions)

Keep the tone supportive and practical.`;
}

function extractSection(content: string, header: string): string {
  const lines = content.split('\n');
  let capturing = false;
  let result = '';
  
  for (const line of lines) {
    if (line.toLowerCase().includes(header.toLowerCase())) {
      capturing = true;
      continue;
    }
    if (capturing) {
      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        result += line.trim().replace(/^[-•]\s*/, '') + ' ';
      } else if (line.trim() === '' && result) {
        break;
      }
    }
  }
  
  return result.trim() || 'Check your daily insights';
}
