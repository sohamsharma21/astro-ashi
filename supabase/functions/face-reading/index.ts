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
      ? `तुम AstroAshi के विशेषज्ञ चेहरा पठन विश्लेषक (physiognomist) हो, जिसे प्राचीन भारतीय सामुद्रिक शास्त्र (Samudrik Shastra), चीनी Mian Xiang, और आधुनिक व्यक्तित्व मनोविज्ञान का गहन ज्ञान है।

उपयोगकर्ता ने अपने चेहरे की तस्वीर अपलोड की है। ध्यान से देखो और इन पहलुओं का विस्तृत विश्लेषण करो:

🔍 विश्लेषण क्षेत्र:
1. **चेहरे का आकार** (अंडाकार/गोल/वर्गाकार/दिल/आयताकार/हीरे जैसा) — व्यक्तित्व का मूल आधार
2. **आँखें** — आकार, दूरी, गहराई, अभिव्यक्ति, बुद्धि और आत्मा की खिड़की
3. **माथा** — चौड़ाई, ऊंचाई, बौद्धिक क्षमता, चिंतन शक्ति, नेतृत्व संकेत
4. **जबड़े की रेखा** — दृढ़ता, आत्मविश्वास, निर्णय लेने की क्षमता
5. **मुस्कान पैटर्न** — सामाजिक व्यक्तित्व, भावनात्मक गर्माहट, करिश्मा
6. **नाक की संरचना** — महत्वाकांक्षा, धन संबंध, नेतृत्व
7. **होंठ** — संचार शैली, भावनात्मक अभिव्यक्ति
8. **कान** — ज्ञान, दीर्घायु, धैर्य

JSON format में जवाब दो (बिल्कुल यही structure):
{
  "faceShape": { "type": "विस्तृत नाम", "description": "सामुद्रिक शास्त्र के अनुसार 3-4 वाक्यों में गहन विश्लेषण", "confidence": 85 },
  "features": [
    { "name": "Eyes", "nameHi": "आँखें", "icon": "eyes", "analysis": "3-4 वाक्यों में गहन विश्लेषण - बुद्धि, अंतर्ज्ञान, भावनात्मक गहराई", "confidence": 80 },
    { "name": "Forehead", "nameHi": "माथा", "icon": "forehead", "analysis": "3-4 वाक्यों में विश्लेषण - बौद्धिक क्षमता, नेतृत्व संकेत", "confidence": 78 },
    { "name": "Jawline", "nameHi": "जबड़े की रेखा", "icon": "jawline", "analysis": "3-4 वाक्यों में विश्लेषण - दृढ़ता, इच्छाशक्ति", "confidence": 82 },
    { "name": "Smile Pattern", "nameHi": "मुस्कान पैटर्न", "icon": "smile", "analysis": "3-4 वाक्यों में विश्लेषण - सामाजिक करिश्मा, भावनात्मक गर्माहट", "confidence": 85 }
  ],
  "personality": [
    { "trait": "लक्षण नाम", "description": "2-3 वाक्यों में क्यों यह लक्षण पहचाना गया - चेहरे की विशेषताओं से जोड़ो", "strength": 85 },
    { "trait": "लक्षण नाम", "description": "विस्तृत कारण", "strength": 78 },
    { "trait": "लक्षण नाम", "description": "विस्तृत कारण", "strength": 90 },
    { "trait": "लक्षण नाम", "description": "विस्तृत कारण", "strength": 72 },
    { "trait": "लक्षण नाम", "description": "विस्तृत कारण", "strength": 80 }
  ],
  "energyType": { "type": "ऊर्जा प्रकार का नाम", "description": "3-4 वाक्यों में ऊर्जा का विस्तृत वर्णन", "color": "amber|emerald|blue|purple|rose" },
  "leadership": { "style": "नेतृत्व शैली", "description": "3-4 वाक्यों में कैसे नेतृत्व करते हैं", "strength": 80 },
  "emotionalNature": { "type": "भावनात्मक प्रकार", "description": "3-4 वाक्यों में भावनात्मक गहराई और स्वभाव" },
  "lifePatterns": ["विस्तृत सकारात्मक पैटर्न 1", "विस्तृत पैटर्न 2", "विस्तृत पैटर्न 3", "विस्तृत पैटर्न 4"],
  "spiritualAdvice": "3-4 वाक्यों में व्यक्तिगत आध्यात्मिक सलाह - उनकी विशेषताओं के आधार पर"
}

⚠️ महत्वपूर्ण नियम:
- चेहरे की वास्तविक विशेषताओं को ध्यान से देखो और उसी के आधार पर विश्लेषण करो
- हमेशा सकारात्मक, प्रेरणादायक और सशक्त बनाने वाला रहो
- नकारात्मक भविष्यवाणी बिल्कुल मत करो
- confidence 65-95 के बीच रखो — बहुत ज्यादा या बहुत कम मत दो
- प्रत्येक विश्लेषण विस्तृत और व्यक्तिगत होना चाहिए, सामान्य नहीं
- सामुद्रिक शास्त्र के सिद्धांतों का संदर्भ दो

उपयोगकर्ता: ${userName}, लिंग: ${gender}, धर्म: ${religion}।`
      : `You are AstroAshi's master face reading analyst (physiognomist), deeply trained in ancient Indian Samudrik Shastra, Chinese Mian Xiang facial analysis, Greek physiognomy, and modern personality psychology.

The user has uploaded a photo of their face. Carefully observe and provide a DETAILED, PERSONALIZED analysis.

🔍 ANALYSIS FRAMEWORK:
1. **Face Shape** (oval/round/square/heart/oblong/diamond/rectangular) — The foundation of personality
2. **Eyes** — Size, spacing, depth, expression, brow position — Window to intelligence and soul
3. **Forehead** — Width, height, lines/markings — Intellectual capacity, thinking style, leadership potential
4. **Jawline** — Strong/soft/angular/rounded — Determination, willpower, decision-making
5. **Smile Pattern** — Warm/reserved/expressive/symmetrical — Social charisma, emotional warmth
6. **Nose Structure** — Shape, bridge, tip — Ambition, wealth connection, leadership
7. **Lips** — Fullness, shape, expression — Communication style, emotional expression
8. **Ears** — Size, position, shape — Wisdom, longevity, patience

📊 ANALYSIS DEPTH:
- Each feature analysis MUST be 3-4 sentences long, SPECIFIC to what you observe
- Connect facial features to personality traits with reasoning
- Reference physiognomy principles (Samudrik Shastra, Mian Xiang)
- Each personality trait description must explain WHY based on observed features

Respond in STRICT JSON format:
{
  "faceShape": { "type": "descriptive name with shape type", "description": "3-4 sentences - what this shape reveals based on physiognomy, how it influences personality, relationships, and career path", "confidence": 85 },
  "features": [
    { "name": "Eyes", "nameHi": "आँखें", "icon": "eyes", "analysis": "3-4 sentences analyzing eye shape, size, spacing. What they reveal about intelligence, intuition, emotional depth, and perception ability", "confidence": 80 },
    { "name": "Forehead", "nameHi": "माथा", "icon": "forehead", "analysis": "3-4 sentences - forehead width/height analysis, intellectual capacity, thinking patterns, and leadership indicators from Samudrik Shastra", "confidence": 78 },
    { "name": "Jawline", "nameHi": "जबड़े की रेखा", "icon": "jawline", "analysis": "3-4 sentences - jawline strength, determination level, willpower, decision-making style, and inner resilience", "confidence": 82 },
    { "name": "Smile Pattern", "nameHi": "मुस्कान पैटर्न", "icon": "smile", "analysis": "3-4 sentences - smile warmth, social charisma, emotional expressiveness, and what it reveals about interpersonal relationships", "confidence": 85 }
  ],
  "personality": [
    { "trait": "specific trait name", "description": "2-3 sentences WHY this trait is identified - link to specific facial features observed", "strength": 85 },
    { "trait": "specific trait name", "description": "detailed reasoning connected to facial analysis", "strength": 78 },
    { "trait": "specific trait name", "description": "detailed reasoning", "strength": 90 },
    { "trait": "specific trait name", "description": "detailed reasoning", "strength": 72 },
    { "trait": "specific trait name", "description": "detailed reasoning", "strength": 80 }
  ],
  "energyType": { "type": "specific energy archetype name", "description": "3-4 sentences describing their energy signature, how it manifests in daily life, and how others perceive them", "color": "amber|emerald|blue|purple|rose" },
  "leadership": { "style": "specific leadership style", "description": "3-4 sentences on how they lead, influence others, and their natural authority style based on facial features", "strength": 80 },
  "emotionalNature": { "type": "specific emotional archetype", "description": "3-4 sentences on emotional depth, how they process feelings, their emotional intelligence, and relationship patterns" },
  "lifePatterns": ["detailed positive life pattern 1", "detailed pattern 2", "detailed pattern 3", "detailed pattern 4"],
  "spiritualAdvice": "3-4 sentences of deeply personalized spiritual advice based on their specific facial features and identified traits"
}

⚠️ CRITICAL RULES:
- CAREFULLY OBSERVE the actual face in the image — your analysis must reflect what you truly see
- All insights MUST be positive, supportive, and empowering
- NEVER make negative predictions or critical observations
- Confidence values: 65-95 range (realistic, not all high)
- Each analysis section must be DETAILED and SPECIFIC — no generic responses
- Reference physiognomy traditions when relevant
- Make the person feel seen, understood, and valued
- These are spiritual insights for self-reflection, not absolute predictions

User: ${userName}, gender: ${gender}, faith: ${religion}.`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Step 1: Validate image is actually a human face
    const validationResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an image validation assistant. Your ONLY job is to determine if the uploaded image contains a clear human face. Respond with ONLY a JSON object: {"is_face": true/false, "reason": "brief reason"}. A face must be clearly visible - not a cartoon, drawing, animal, object, landscape, text, or anything else. It must be a real human face photo.' },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Does this image contain a clear human face? Respond ONLY with JSON.' },
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
        if (valParsed.is_face === false) {
          return new Response(JSON.stringify({ 
            error: language === 'hi' 
              ? '⚠️ यह चेहरे की तस्वीर नहीं है। कृपया अपने चेहरे की एक स्पष्ट सेल्फी अपलोड करें।' 
              : '⚠️ This does not appear to be a face photo. Please upload a clear selfie of your face.' 
          }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (e) {
        console.log('Validation parse warning (continuing):', e);
      }
    }

    // Step 2: Main face reading analysis
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
                ? 'कृपया मेरे चेहरे का विस्तृत विश्लेषण करें। सामुद्रिक शास्त्र के सिद्धांतों का उपयोग करें और प्रत्येक विशेषता को गहराई से विश्लेषण करें।' 
                : 'Please provide a thorough, detailed analysis of my face using physiognomy principles. Observe each feature carefully and provide specific, personalized insights based on what you see.' },
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
          faceShape: { type: 'Balanced Oval', description: 'Your face shape suggests a harmonious and adaptable personality with natural grace. According to Samudrik Shastra, an oval face indicates emotional balance and natural diplomacy. You possess the ability to navigate different social situations with ease and authenticity.', confidence: 82 },
          features: [
            { name: 'Eyes', nameHi: 'आँखें', icon: 'eyes', analysis: 'Your eyes reflect remarkable depth, intelligence, and a compassionate soul. The brightness and expressiveness suggest strong intuitive abilities and emotional intelligence. In physiognomy, such eyes indicate someone who can see beyond surface appearances and connect with deeper truths.', confidence: 85 },
            { name: 'Forehead', nameHi: 'माथा', icon: 'forehead', analysis: 'A well-proportioned forehead indicates strong analytical abilities, wisdom, and intellectual curiosity. According to Mian Xiang principles, your forehead suggests excellent memory and the ability to learn from experience. You process information thoroughly before making decisions.', confidence: 78 },
            { name: 'Jawline', nameHi: 'जबड़े की रेखा', icon: 'jawline', analysis: 'Your jawline reveals determination, inner strength, and resilience. In Samudrik Shastra, this structure indicates someone who stands firm in their convictions while remaining open to new perspectives. Your willpower is a quiet but powerful force.', confidence: 80 },
            { name: 'Smile Pattern', nameHi: 'मुस्कान पैटर्न', icon: 'smile', analysis: 'Your smile radiates genuine warmth, kindness, and approachability. The natural ease of your expression suggests high social intelligence and the ability to make others feel comfortable. People are naturally drawn to your authentic warmth and positive energy.', confidence: 88 }
          ],
          personality: [
            { trait: 'Intuitive Wisdom', description: 'Your eye depth and forehead proportions together suggest powerful intuition. You naturally sense the emotions and needs of others before they express them, making you an invaluable friend and advisor.', strength: 85 },
            { trait: 'Quiet Resilience', description: 'Your jawline and overall facial structure indicate remarkable inner strength. You possess the ability to weather life\'s storms with grace and emerge stronger from challenges.', strength: 82 },
            { trait: 'Creative Intelligence', description: 'The combination of your forehead width and eye expressiveness suggests a mind that generates unique solutions and innovative ideas. You think differently and that is your superpower.', strength: 78 },
            { trait: 'Empathetic Leadership', description: 'Your smile warmth combined with forehead indicators reveals someone who leads through understanding and compassion. People follow you because they trust your judgment and feel valued.', strength: 90 },
            { trait: 'Spiritual Depth', description: 'The overall harmony of your facial features suggests a deep connection to spiritual wisdom and inner peace. You seek meaning beyond the material and inspire others to do the same.', strength: 75 }
          ],
          energyType: { type: 'The Harmonizer', description: 'You carry a naturally balancing energy that brings peace and clarity to every situation. People feel calmer and more centered in your presence. Your energy signature combines warmth with wisdom, creating a safe space for authentic connection and growth.', color: 'amber' },
          leadership: { style: 'Inspirational Visionary', description: 'You lead not through authority but through authentic inspiration. Your empathetic nature allows you to understand what motivates each individual, and your wisdom helps you guide teams toward meaningful goals. People follow you because they believe in your vision.', strength: 80 },
          emotionalNature: { type: 'Deep Feeler with Balanced Expression', description: 'You experience emotions with great depth and richness, which fuels your compassion and creativity. However, you also possess the wisdom to process feelings constructively. Your emotional intelligence allows you to navigate complex interpersonal dynamics with grace and understanding.' },
          lifePatterns: ['Growth through meaningful connections and deep relationships', 'Success achieved through persistent dedication and authentic effort', 'Joy discovered in creative expression and helping others grow', 'Wisdom gained from life experiences that strengthen your spiritual foundation'],
          spiritualAdvice: 'Trust your remarkable inner wisdom — it has guided you well through life\'s journey and will continue to illuminate your path forward. Your facial features reveal a soul rich with compassion and strength. Embrace daily meditation or quiet reflection to further sharpen your powerful intuition, and remember that your authentic warmth is a gift that transforms the lives around you.'
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
