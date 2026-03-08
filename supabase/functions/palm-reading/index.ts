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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = claimsData.claims.sub;
    const { imageBase64, language = 'en' } = await req.json();

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return new Response(JSON.stringify({ error: 'Palm image is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Limit image size (~5MB base64)
    if (imageBase64.length > 7_000_000) {
      return new Response(JSON.stringify({ error: 'Image too large. Please use an image under 5MB.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch user profile for personalization
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, religion, birth_date, gender')
      .eq('id', userId)
      .single();

    const userName = profile?.full_name || 'Friend';
    const religion = profile?.religion || 'spiritual';

    const systemPrompt = language === 'hi'
      ? `तुम AstroAshi के विशेषज्ञ हस्तरेखा विश्लेषक हो। उपयोगकर्ता ने अपनी हथेली की तस्वीर अपलोड की है।

हस्तरेखाओं का विश्लेषण करो:
- जीवन रेखा (Life Line)
- हृदय रेखा (Heart Line)  
- मस्तिष्क रेखा (Head Line)
- हथेली का आकार (Palm Shape)

JSON format में जवाब दो (बिल्कुल यही structure):
{
  "palmShape": { "type": "string", "description": "string" },
  "lines": [
    { "name": "string", "nameHi": "string", "strength": "strong|moderate|gentle", "insight": "string" }
  ],
  "personality": ["string", "string", "string"],
  "emotionalNature": "string",
  "strengths": ["string", "string", "string"],
  "lifePatterns": ["string", "string", "string"],
  "spiritualAdvice": "string"
}

सहायक और प्रेरणादायक रहो। ये अंतर्दृष्टि आध्यात्मिक मार्गदर्शन हैं, पूर्ण भविष्यवाणी नहीं। उपयोगकर्ता का नाम: ${userName}, धर्म: ${religion}।`
      : `You are AstroAshi's expert palmistry analyst. The user has uploaded a photo of their palm.

Analyze the palm lines visible in the image:
- Life Line
- Heart Line
- Head Line
- Palm Shape

Respond in STRICT JSON format (exactly this structure):
{
  "palmShape": { "type": "string description of palm shape", "description": "what it means" },
  "lines": [
    { "name": "Life Line", "nameHi": "जीवन रेखा", "strength": "strong|moderate|gentle", "insight": "detailed insight" },
    { "name": "Heart Line", "nameHi": "हृदय रेखा", "strength": "strong|moderate|gentle", "insight": "detailed insight" },
    { "name": "Head Line", "nameHi": "मस्तिष्क रेखा", "strength": "strong|moderate|gentle", "insight": "detailed insight" }
  ],
  "personality": ["trait1", "trait2", "trait3"],
  "emotionalNature": "description of emotional nature",
  "strengths": ["strength1", "strength2", "strength3"],
  "lifePatterns": ["pattern1", "pattern2", "pattern3"],
  "spiritualAdvice": "personalized spiritual advice"
}

Be supportive and motivational. These are spiritual insights, not absolute predictions. User name: ${userName}, faith: ${religion}.`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Strip data URI prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

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
          {
            role: 'user',
            content: [
              { type: 'text', text: language === 'hi' ? 'कृपया मेरी हथेली का विश्लेषण करें।' : 'Please analyze my palm and provide insights.' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${cleanBase64}` } }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again in a moment.' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: 'AI service credits exhausted. Please try later.' }), {
        status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse JSON from response (handle markdown code blocks)
    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1]!.trim());
    } catch {
      // Fallback: try parsing raw
      try {
        parsed = JSON.parse(content.trim());
      } catch {
        console.error('Failed to parse AI response:', content);
        parsed = {
          palmShape: { type: 'Square Palm', description: 'Indicates a practical and grounded nature.' },
          lines: [
            { name: 'Life Line', nameHi: 'जीवन रेखा', strength: 'strong', insight: 'Your life line suggests strong resilience and vitality.' },
            { name: 'Heart Line', nameHi: 'हृदय रेखा', strength: 'moderate', insight: 'Your heart line suggests emotional depth and sensitivity.' },
            { name: 'Head Line', nameHi: 'मस्तिष्क रेखा', strength: 'strong', insight: 'Your head line suggests clear thinking and determination.' }
          ],
          personality: ['Resilient', 'Thoughtful', 'Compassionate'],
          emotionalNature: 'You have a deep emotional nature balanced with practical wisdom.',
          strengths: ['Inner strength', 'Empathy', 'Determination'],
          lifePatterns: ['Growth through challenges', 'Deep personal connections', 'Creative expression'],
          spiritualAdvice: 'Continue your spiritual practice and trust your inner guidance.'
        };
      }
    }

    // Save to reading history
    await supabase.from('reading_history').insert({
      user_id: userId,
      content_type: 'palm_reading',
      content_id: crypto.randomUUID(),
      content_title: language === 'hi' ? 'हस्तरेखा विश्लेषण' : 'Palm Reading Analysis',
      content_summary: parsed.spiritualAdvice || 'Palm reading completed',
    });

    return new Response(JSON.stringify({ reading: parsed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Palm reading error:', error);
    return new Response(JSON.stringify({ error: 'Failed to analyze palm. Please try again.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
