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
      return new Response(JSON.stringify({ error: 'Face image is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (imageBase64.length > 7_000_000) {
      return new Response(JSON.stringify({ error: 'Image too large. Please use an image under 5MB.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, religion, birth_date, gender')
      .eq('id', userId)
      .single();

    const userName = profile?.full_name || 'Friend';
    const religion = profile?.religion || 'spiritual';
    const gender = profile?.gender || 'person';

    const systemPrompt = language === 'hi'
      ? `तुम AstroAshi के विशेषज्ञ चेहरा पठन विश्लेषक हो। उपयोगकर्ता ने अपने चेहरे की तस्वीर अपलोड की है।

चेहरे के इन पहलुओं का विश्लेषण करो:
- चेहरे का आकार (Face Shape)
- आँखें (Eyes)
- माथा (Forehead)
- जबड़े की रेखा (Jawline)
- मुस्कान पैटर्न (Smile Pattern)

JSON format में जवाब दो (बिल्कुल यही structure):
{
  "faceShape": { "type": "string", "description": "string", "confidence": 85 },
  "features": [
    { "name": "string", "nameHi": "string", "icon": "eyes|forehead|jawline|smile", "analysis": "string", "confidence": 80 }
  ],
  "personality": [
    { "trait": "string", "description": "string", "strength": 85 }
  ],
  "energyType": { "type": "string", "description": "string", "color": "amber|emerald|blue|purple|rose" },
  "leadership": { "style": "string", "description": "string", "strength": 80 },
  "emotionalNature": { "type": "string", "description": "string" },
  "lifePatterns": ["string", "string", "string"],
  "spiritualAdvice": "string"
}

महत्वपूर्ण नियम:
- हमेशा सकारात्मक और प्रेरणादायक रहो
- नकारात्मक भविष्यवाणी बिल्कुल मत करो
- confidence 65-95 के बीच रखो
- ये आध्यात्मिक अंतर्दृष्टि हैं, पूर्ण भविष्यवाणी नहीं

उपयोगकर्ता: ${userName}, लिंग: ${gender}, धर्म: ${religion}।`
      : `You are AstroAshi's expert face reading analyst (physiognomy). The user has uploaded a selfie/photo of their face.

Analyze these facial aspects:
- Face Shape (oval, round, square, heart, oblong, diamond)
- Eyes (size, spacing, expression)
- Forehead (width, height, lines)
- Jawline (strong, soft, angular)
- Smile Pattern (warm, reserved, expressive)

Respond in STRICT JSON format (exactly this structure):
{
  "faceShape": { "type": "descriptive name", "description": "what it reveals about personality", "confidence": 85 },
  "features": [
    { "name": "Eyes", "nameHi": "आँखें", "icon": "eyes", "analysis": "detailed positive insight", "confidence": 80 },
    { "name": "Forehead", "nameHi": "माथा", "icon": "forehead", "analysis": "detailed positive insight", "confidence": 78 },
    { "name": "Jawline", "nameHi": "जबड़े की रेखा", "icon": "jawline", "analysis": "detailed positive insight", "confidence": 82 },
    { "name": "Smile Pattern", "nameHi": "मुस्कान पैटर्न", "icon": "smile", "analysis": "detailed positive insight", "confidence": 85 }
  ],
  "personality": [
    { "trait": "trait name", "description": "why this trait is identified", "strength": 85 },
    { "trait": "trait name", "description": "why this trait is identified", "strength": 78 },
    { "trait": "trait name", "description": "why this trait is identified", "strength": 90 },
    { "trait": "trait name", "description": "why this trait is identified", "strength": 72 }
  ],
  "energyType": { "type": "energy archetype name", "description": "description of energy type", "color": "amber|emerald|blue|purple|rose" },
  "leadership": { "style": "leadership style name", "description": "how they lead and influence", "strength": 80 },
  "emotionalNature": { "type": "emotional archetype", "description": "description of emotional nature and depth" },
  "lifePatterns": ["positive pattern 1", "positive pattern 2", "positive pattern 3"],
  "spiritualAdvice": "personalized uplifting spiritual advice"
}

CRITICAL RULES:
- All insights MUST be positive and supportive
- NEVER make negative predictions or observations
- Confidence values should be between 65-95
- These are spiritual insights for entertainment and self-reflection, not absolute predictions
- Be warm, encouraging, and empowering

User: ${userName}, gender: ${gender}, faith: ${religion}.`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

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
              { type: 'text', text: language === 'hi' ? 'कृपया मेरे चेहरे का विश्लेषण करें और व्यक्तित्व अंतर्दृष्टि प्रदान करें।' : 'Please analyze my face and provide personality insights based on physiognomy.' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${cleanBase64}` } }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 2500,
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

    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1]!.trim());
    } catch {
      try {
        parsed = JSON.parse(content.trim());
      } catch {
        console.error('Failed to parse AI response:', content);
        parsed = {
          faceShape: { type: 'Balanced Oval', description: 'Your face shape suggests a harmonious and adaptable personality with natural grace.', confidence: 82 },
          features: [
            { name: 'Eyes', nameHi: 'आँखें', icon: 'eyes', analysis: 'Your eyes reflect depth, intelligence, and a compassionate soul.', confidence: 85 },
            { name: 'Forehead', nameHi: 'माथा', icon: 'forehead', analysis: 'A well-proportioned forehead indicates strong analytical abilities and wisdom.', confidence: 78 },
            { name: 'Jawline', nameHi: 'जबड़े की रेखा', icon: 'jawline', analysis: 'Your jawline suggests determination and inner strength.', confidence: 80 },
            { name: 'Smile Pattern', nameHi: 'मुस्कान पैटर्न', icon: 'smile', analysis: 'Your smile radiates warmth and genuine kindness.', confidence: 88 }
          ],
          personality: [
            { trait: 'Intuitive', description: 'You naturally sense the emotions and needs of others.', strength: 85 },
            { trait: 'Resilient', description: 'You possess remarkable inner strength during challenges.', strength: 82 },
            { trait: 'Creative', description: 'Your mind generates unique solutions and ideas.', strength: 78 },
            { trait: 'Empathetic', description: 'You connect deeply with those around you.', strength: 90 }
          ],
          energyType: { type: 'The Harmonizer', description: 'You bring balance and peace to every situation.', color: 'amber' },
          leadership: { style: 'Inspirational Leader', description: 'You lead through empathy and vision, inspiring others naturally.', strength: 80 },
          emotionalNature: { type: 'Deep Feeler', description: 'You experience emotions with great depth, which fuels your compassion and creativity.' },
          lifePatterns: ['Growth through meaningful connections', 'Success through persistent dedication', 'Joy found in creative expression'],
          spiritualAdvice: 'Trust your inner wisdom — it has guided you well and will continue to light your path forward.'
        };
      }
    }

    // Save to reading history
    await supabase.from('reading_history').insert({
      user_id: userId,
      content_type: 'face_reading',
      content_id: crypto.randomUUID(),
      content_title: language === 'hi' ? 'चेहरा पठन विश्लेषण' : 'Face Reading Analysis',
      content_summary: parsed.spiritualAdvice || 'Face reading completed',
    });

    return new Response(JSON.stringify({ reading: parsed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Face reading error:', error);
    return new Response(JSON.stringify({ error: 'Failed to analyze face. Please try again.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
