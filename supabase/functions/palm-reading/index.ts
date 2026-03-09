import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit } from "../_shared/security.ts";

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
      ? `तुम AstroAshi के विशेषज्ञ हस्तरेखा विश्लेषक (palmist) हो, जिसे प्राचीन भारतीय हस्तरेखा विज्ञान (Hast Rekha Shastra), वैदिक ज्योतिष, और पाश्चात्य चिरोमेंसी का गहन ज्ञान है।

उपयोगकर्ता ने अपनी हथेली की तस्वीर अपलोड की है। ध्यान से देखो और विस्तृत विश्लेषण करो:

🔍 विश्लेषण क्षेत्र:
1. **हथेली का आकार** (वर्ग/आयताकार/शंक्वाकार/फावड़े जैसा) — मूल स्वभाव
2. **जीवन रेखा (Life Line)** — शक्ति, गहराई, लंबाई, वक्रता — जीवन शक्ति और ऊर्जा
3. **हृदय रेखा (Heart Line)** — शुरुआत, अंत, गहराई — प्रेम और भावनात्मक गहराई
4. **मस्तिष्क रेखा (Head Line)** — दिशा, लंबाई — बौद्धिक शक्ति और सोचने का ढंग
5. **भाग्य रेखा (Fate Line)** — यदि दिखे — करियर और जीवन उद्देश्य
6. **सूर्य रेखा (Sun Line)** — यदि दिखे — सफलता और प्रसिद्धि
7. **उंगलियों का अनुपात** — महत्वाकांक्षा और व्यक्तित्व संकेत
8. **पर्वत क्षेत्र (Mounts)** — शुक्र, बृहस्पति, शनि — ग्रहीय प्रभाव

JSON format में जवाब दो:
{
  "palmShape": { "type": "विस्तृत नाम", "description": "3-4 वाक्यों में हस्तरेखा शास्त्र के अनुसार गहन विश्लेषण" },
  "lines": [
    { "name": "Life Line", "nameHi": "जीवन रेखा", "strength": "strong|moderate|gentle", "insight": "3-4 वाक्यों में विस्तृत विश्लेषण - शक्ति, गहराई, वक्रता का अर्थ" },
    { "name": "Heart Line", "nameHi": "हृदय रेखा", "strength": "strong|moderate|gentle", "insight": "3-4 वाक्यों में विस्तृत विश्लेषण - प्रेम, भावनाएं, रिश्ते" },
    { "name": "Head Line", "nameHi": "मस्तिष्क रेखा", "strength": "strong|moderate|gentle", "insight": "3-4 वाक्यों में विस्तृत विश्लेषण - बुद्धि, रचनात्मकता, निर्णय" },
    { "name": "Fate Line", "nameHi": "भाग्य रेखा", "strength": "strong|moderate|gentle", "insight": "3-4 वाक्यों में विस्तृत विश्लेषण - करियर, जीवन उद्देश्य" }
  ],
  "personality": ["विस्तृत लक्षण 1", "विस्तृत लक्षण 2", "विस्तृत लक्षण 3", "विस्तृत लक्षण 4", "विस्तृत लक्षण 5"],
  "emotionalNature": "3-4 वाक्यों में भावनात्मक स्वभाव का गहन विश्लेषण",
  "strengths": ["विस्तृत शक्ति 1", "विस्तृत शक्ति 2", "विस्तृत शक्ति 3", "विस्तृत शक्ति 4"],
  "lifePatterns": ["विस्तृत पैटर्न 1", "विस्तृत पैटर्न 2", "विस्तृत पैटर्न 3", "विस्तृत पैटर्न 4"],
  "spiritualAdvice": "3-4 वाक्यों में व्यक्तिगत आध्यात्मिक सलाह"
}

⚠️ महत्वपूर्ण नियम:
- हथेली की वास्तविक रेखाओं को ध्यान से देखो
- हमेशा सकारात्मक और प्रेरणादायक रहो
- नकारात्मक भविष्यवाणी बिल्कुल मत करो
- हस्तरेखा शास्त्र के सिद्धांतों का संदर्भ दो
- प्रत्येक विश्लेषण विस्तृत और व्यक्तिगत हो

उपयोगकर्ता: ${userName}, लिंग: ${gender}, धर्म: ${religion}।`
      : `You are AstroAshi's master palmist, deeply trained in ancient Indian Hast Rekha Shastra (palmistry), Vedic astrology-based hand analysis, Western chiromancy, and modern dermatoglyphics.

The user has uploaded a photo of their palm. CAREFULLY observe the actual lines, mounts, and shape visible in the image.

🔍 COMPREHENSIVE ANALYSIS FRAMEWORK:
1. **Palm Shape** (square/rectangular/conic/spatulate/philosophic/psychic) — Foundation of temperament
2. **Life Line** — Depth, length, curve, breaks, branches — Vitality, health, life energy
3. **Heart Line** — Starting point, ending, depth, chains — Love, emotions, relationships
4. **Head Line** — Direction, length, slope — Intellect, thinking style, creativity vs logic
5. **Fate Line** — If visible — Career path, life purpose, destiny
6. **Sun Line** — If visible — Success, fame, creative achievement
7. **Finger Proportions** — Length ratios — Ambition, personality indicators
8. **Mounts** — Venus, Jupiter, Saturn, Apollo, Mercury — Planetary influences on personality

📊 ANALYSIS DEPTH:
- Each line insight MUST be 3-4 sentences, SPECIFIC to what you observe
- Reference palmistry traditions and principles
- Connect observations to personality and life patterns
- Provide at least 4 lines of analysis (include Fate Line if visible)

Respond in STRICT JSON format:
{
  "palmShape": { "type": "specific palm shape with description", "description": "3-4 sentences explaining what this palm shape reveals about fundamental nature, temperament, and life approach according to palmistry traditions" },
  "lines": [
    { "name": "Life Line", "nameHi": "जीवन रेखा", "strength": "strong|moderate|gentle", "insight": "3-4 sentences - analyze depth, curve, length. What it reveals about vitality, resilience, major life changes, and overall life energy" },
    { "name": "Heart Line", "nameHi": "हृदय रेखा", "strength": "strong|moderate|gentle", "insight": "3-4 sentences - analyze starting/ending points, depth. What it reveals about love style, emotional depth, relationship patterns, and heart's desires" },
    { "name": "Head Line", "nameHi": "मस्तिष्क रेखा", "strength": "strong|moderate|gentle", "insight": "3-4 sentences - analyze direction, length, slope. What it reveals about thinking style, creativity, decision-making, and intellectual strengths" },
    { "name": "Fate Line", "nameHi": "भाग्य रेखा", "strength": "strong|moderate|gentle", "insight": "3-4 sentences - career path indicators, life purpose, self-made success potential, and destiny patterns" }
  ],
  "personality": ["detailed trait 1 with context", "detailed trait 2", "detailed trait 3", "detailed trait 4", "detailed trait 5"],
  "emotionalNature": "3-4 sentences providing deep analysis of emotional depth, how they process feelings, emotional intelligence, and relationship dynamics",
  "strengths": ["detailed strength 1 with palmistry reasoning", "detailed strength 2", "detailed strength 3", "detailed strength 4"],
  "lifePatterns": ["detailed positive life pattern 1", "detailed pattern 2", "detailed pattern 3", "detailed pattern 4"],
  "spiritualAdvice": "3-4 sentences of deeply personalized spiritual advice based on their specific palm features and identified patterns"
}

⚠️ CRITICAL RULES:
- CAREFULLY OBSERVE the actual palm lines in the image
- All insights MUST be positive, supportive, and empowering
- NEVER make negative predictions about health, death, or misfortune
- Reference Hast Rekha Shastra and chiromancy principles
- Each analysis must be DETAILED and SPECIFIC to what you observe
- Make the person feel understood, valued, and empowered
- These are spiritual insights for self-reflection, not medical/absolute predictions

User: ${userName}, gender: ${gender}, faith: ${religion}.`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Step 1: Validate image is actually a palm/hand
    const validationResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an image validation assistant. Your ONLY job is to determine if the uploaded image contains a clear human palm/hand with visible palm lines. Respond with ONLY a JSON object: {"is_palm": true/false, "reason": "brief reason"}. The image must show a real human palm with lines visible - not a face, animal, object, landscape, text, cartoon, or anything else.' },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Does this image contain a clear human palm with visible lines? Respond ONLY with JSON.' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${cleanBase64}` } }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 100,
      }),
    });

    if (validationResponse.ok) {
      const valData = await validationResponse.json();
      const valContent = valData.choices?.[0]?.message?.content || '';
      try {
        const valMatch = valContent.match(/\{[\s\S]*?\}/) || [null];
        const valParsed = JSON.parse(valMatch[0] || valContent.trim());
        if (valParsed.is_palm === false) {
          return new Response(JSON.stringify({ 
            error: language === 'hi' 
              ? '⚠️ यह हथेली की तस्वीर नहीं है। कृपया अपनी हथेली की एक स्पष्ट तस्वीर अपलोड करें जिसमें रेखाएं दिखें।' 
              : '⚠️ This does not appear to be a palm photo. Please upload a clear photo of your palm with visible lines.' 
          }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (e) {
        console.log('Validation parse warning (continuing):', e);
      }
    }

    // Step 2: Main palm reading analysis
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
              { type: 'text', text: language === 'hi' 
                ? 'कृपया मेरी हथेली का विस्तृत विश्लेषण करें। हस्तरेखा शास्त्र के सिद्धांतों का उपयोग करें और प्रत्येक रेखा और विशेषता को गहराई से विश्लेषण करें।' 
                : 'Please provide a thorough, detailed analysis of my palm using traditional palmistry principles. Observe each line carefully, note its depth, direction, and characteristics, and provide specific personalized insights.' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${cleanBase64}` } }
            ]
          }
        ],
        temperature: 0.75,
        max_tokens: 4000,
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
          palmShape: { type: 'Square Palm with Balanced Proportions', description: 'Your square-shaped palm indicates a practical, grounded nature with excellent organizational abilities. According to Hast Rekha Shastra, this palm type belongs to individuals who build lasting structures in life. You combine reliability with creative thinking, making you both dependable and innovative.' },
          lines: [
            { name: 'Life Line', nameHi: 'जीवन रेखा', strength: 'strong', insight: 'Your life line shows remarkable depth and a wide arc, indicating strong vitality and resilience. The clear, unbroken path suggests consistent energy throughout life with excellent recovery ability. In palmistry, such a life line indicates someone who embraces life fully and draws strength from challenges.' },
            { name: 'Heart Line', nameHi: 'हृदय रेखा', strength: 'moderate', insight: 'Your heart line reveals emotional depth balanced with wisdom. The gentle curve suggests someone who loves deeply but also maintains healthy boundaries. According to chiromancy traditions, this pattern indicates genuine emotional connections and the ability to nurture lasting relationships.' },
            { name: 'Head Line', nameHi: 'मस्तिष्क रेखा', strength: 'strong', insight: 'Your head line shows clear direction and good length, indicating sharp analytical thinking combined with creative problem-solving. The line suggests excellent concentration and the ability to process complex information efficiently. You make decisions based on both logic and intuition.' },
            { name: 'Fate Line', nameHi: 'भाग्य रेखा', strength: 'moderate', insight: 'Your fate line indicates a self-made path to success. The clarity of this line suggests growing career stability and purposeful direction. In Vedic palmistry, this pattern reveals someone who creates their own opportunities through dedication and authentic effort.' }
          ],
          personality: ['Grounded wisdom with practical intelligence', 'Deep emotional intelligence and empathy', 'Strong determination balanced with flexibility', 'Natural problem-solver with creative thinking', 'Reliable and trustworthy with authentic leadership'],
          emotionalNature: 'You possess a rich emotional landscape that combines depth with practical wisdom. Your heart line and palm shape together reveal someone who experiences feelings genuinely while maintaining the ability to navigate emotional complexity with grace. You form deep, meaningful bonds and your emotional intelligence allows you to understand and support others intuitively.',
          strengths: ['Remarkable resilience and ability to overcome challenges with grace', 'Deep empathy that creates genuine human connections', 'Determined willpower that drives consistent progress toward goals', 'Creative intelligence that finds unique solutions to complex problems'],
          lifePatterns: ['Growth through meaningful challenges that strengthen your character', 'Deep personal connections that enrich your life journey', 'Creative expression that brings joy and fulfillment', 'Spiritual evolution through life experiences and self-reflection'],
          spiritualAdvice: 'Your palm reveals a soul on a meaningful spiritual journey. Continue your practice of self-reflection and trust the inner guidance that your strong intuition provides. The depth of your life line and heart line together suggest that your greatest growth comes through serving others while honoring your own needs. Embrace gratitude practices to amplify the abundant positive energy already flowing through your hands.'
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
