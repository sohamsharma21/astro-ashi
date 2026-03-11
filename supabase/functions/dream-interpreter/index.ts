import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit } from "../_shared/security.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rateLimit = checkRateLimit(`dream-interpreter:${user.id}`, { maxRequests: 5, windowMs: 60000 });
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { dream, language = "en" } = await req.json();

    if (!dream || dream.trim().length < 20) {
      return new Response(JSON.stringify({ error: "Dream description too short" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user profile for context
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const { data: profile } = await serviceClient.from("profiles").select("religion, moon_sign, nakshatra").eq("id", user.id).single();

    const lang = language === "hi" ? "Hindi" : "English";

    const systemPrompt = `You are an expert dream interpreter combining Jungian psychology, world mythologies, and spiritual traditions. 
You provide compassionate, insightful dream analysis.
User context: Religion: ${profile?.religion || "universal"}, Moon Sign: ${profile?.moon_sign || "unknown"}, Nakshatra: ${profile?.nakshatra || "unknown"}.
Respond in ${lang}.`;

    const userPrompt = `Analyze this dream and return a JSON response:

Dream: "${dream.slice(0, 1500)}"

Return this exact JSON structure:
{
  "symbols": [{"symbol": "...", "meaning": "..."}],
  "psychological": "Jungian/psychological analysis paragraph",
  "spiritual": "Spiritual/astrological meaning paragraph",
  "guidance": "Actionable guidance and advice paragraph",
  "emotions": ["emotion1", "emotion2", "emotion3"],
  "luckyElements": {"color": "...", "number": 1-9, "stone": "..."}
}

Include 3-5 symbols. Keep each paragraph 2-3 sentences. List 3-5 emotions.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    let interpretation;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      interpretation = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      interpretation = {
        symbols: [{ symbol: "Dream", meaning: content.slice(0, 200) }],
        psychological: content.slice(0, 300),
        spiritual: "Your dream carries deep spiritual significance.",
        guidance: "Reflect on the emotions this dream brought up.",
        emotions: ["curious", "reflective"],
        luckyElements: { color: "Blue", number: 7, stone: "Amethyst" },
      };
    }

    return new Response(JSON.stringify({ interpretation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Dream interpreter error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
