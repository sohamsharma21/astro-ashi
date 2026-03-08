import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const RELIGION_SOURCES: Record<string, string> = {
  hindu: "Bhagavad Gita, Upanishads, Vedas, and Hindu philosophical traditions",
  muslim: "Quran, Hadith, and Islamic spiritual traditions",
  christian: "Bible (Old & New Testament), Christian theology and spiritual traditions",
  jain: "Teachings of Lord Mahavira, Jain Agamas, and Jain philosophical traditions",
  buddhist: "Teachings of Buddha, Dhammapada, Tripitaka, and Buddhist wisdom traditions",
  sikh: "Guru Granth Sahib, teachings of the ten Sikh Gurus",
  other: "Universal spiritual wisdom from diverse philosophical and spiritual traditions",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { question, language = 'en', conversationHistory = [] } = await req.json();
    if (!question) {
      return new Response(JSON.stringify({ error: 'Question is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get user religion
    const { data: profile } = await supabase
      .from('profiles')
      .select('religion, full_name')
      .eq('id', user.id)
      .single();

    const religion = profile?.religion || 'other';
    const userName = profile?.full_name || 'Seeker';
    const sources = RELIGION_SOURCES[religion] || RELIGION_SOURCES.other;

    const systemPrompt = `You are "AstroAshi Guide" — a compassionate, wise spiritual guide and life counselor. 
You provide guidance rooted in ${sources}.

The user's name is ${userName} and their faith tradition is ${religion}.

Your responses should:
1. Draw wisdom from ${sources} when relevant
2. Provide practical, actionable life advice
3. Be warm, compassionate, and non-judgmental
4. Include short prayers, mantras, or affirmations when appropriate
5. Keep responses concise but meaningful (2-4 paragraphs)
6. ${language === 'hi' ? 'Respond in Hindi (Devanagari script). Use simple Hindi.' : 'Respond in English.'}

You can help with:
- Finding inner peace and managing stress
- Spiritual growth and self-improvement
- Prayers and devotional guidance
- Life decisions and moral dilemmas
- Relationship wisdom
- Focus, discipline, and mindfulness

Always be respectful of all faiths. Never criticize any religion.
End each response with a brief, uplifting thought or blessing.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-20),
      { role: 'user', content: question }
    ];

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages,
      }),
    });

    if (aiResponse.status === 429) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again shortly.' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    if (aiResponse.status === 402) {
      return new Response(JSON.stringify({ error: 'AI credits exhausted. Please try again later.' }), {
        status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const aiData = await aiResponse.json();
    const responseText = aiData.choices?.[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.';

    // Generate follow-up suggestions
    const followUpQuestions = language === 'hi'
      ? ["शांति कैसे पाएं?", "प्रार्थना सिखाएं", "ध्यान कैसे करें?"]
      : ["How to find inner peace?", "Teach me a prayer", "How to meditate?"];

    // Save to ai_questions
    await supabase.from('ai_questions').insert({
      user_id: user.id,
      question,
      ai_response: { response: responseText, type: 'spiritual-guide' },
      language,
    });

    return new Response(JSON.stringify({
      response: responseText,
      language,
      followUpQuestions,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Spiritual guide error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
