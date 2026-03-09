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

    const { language = "en", insightType = "all" } = await req.json();

    // Fetch user data
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const [profileRes, mahadashaRes, panchangRes] = await Promise.all([
      serviceClient.from("profiles").select("*").eq("id", user.id).single(),
      serviceClient.from("user_mahadasha").select("*").eq("user_id", user.id).maybeSingle(),
      serviceClient.from("panchang_cache").select("*").eq("date", new Date().toISOString().split("T")[0]).maybeSingle(),
    ]);

    const profile = profileRes.data;
    const mahadasha = mahadashaRes.data;
    const panchang = panchangRes.data;

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build context
    const birthDate = profile.birth_date ? new Date(profile.birth_date) : null;
    const age = birthDate ? Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null;
    
    const context = {
      name: profile.full_name || "User",
      birthDate: profile.birth_date,
      birthPlace: profile.birth_place,
      birthTime: profile.birth_time,
      religion: profile.religion || "hindu",
      moonSign: profile.moon_sign,
      lagna: profile.lagna,
      nakshatra: profile.nakshatra,
      age,
      mahadasha: mahadasha?.current_mahadasha,
      antardasha: mahadasha?.current_antardasha,
      tithi: panchang?.tithi?.name,
      nakshatra_today: panchang?.nakshatra?.name,
    };

    const systemPrompt = `You are a compassionate AI spiritual and life coach for AstroAshi app. 
You provide supportive, motivational insights (NOT absolute predictions) based on:
- Vedic astrology principles (for Hindu users)
- Universal spiritual wisdom (for all faiths)
- User's current life phase based on birth data

User Context:
- Name: ${context.name}
- Age: ${context.age || "Unknown"}
- Birth Date: ${context.birthDate || "Unknown"}
- Birth Place: ${context.birthPlace || "Unknown"}
- Religion: ${context.religion}
- Moon Sign: ${context.moonSign || "Unknown"}
- Ascendant (Lagna): ${context.lagna || "Unknown"}
- Birth Nakshatra: ${context.nakshatra || "Unknown"}
- Current Mahadasha: ${context.mahadasha || "Unknown"}
- Current Antardasha: ${context.antardasha || "Unknown"}
- Today's Tithi: ${context.tithi || "Unknown"}
- Today's Nakshatra: ${context.nakshatra_today || "Unknown"}

Language: ${language === "hi" ? "Hindi" : language === "ar" ? "Arabic" : language === "es" ? "Spanish" : language === "fr" ? "French" : "English"}

Provide insights that are:
1. Supportive and encouraging
2. Based on spiritual wisdom, not fortune-telling
3. Actionable with practical suggestions
4. Respectful of the user's faith tradition`;

    const userPrompt = `Generate personalized life insights for this user. Include 4 sections:

1. CAREER GUIDANCE: Based on their planetary positions and current dasha period, what career energies are present? What skills should they develop? What opportunities might arise?

2. RELATIONSHIP ADVICE: What relationship dynamics are favored? How can they improve communication and connection with loved ones?

3. PERSONAL GROWTH: What areas of self-improvement are highlighted? What habits should they develop? What challenges to work on?

4. SPIRITUAL GUIDANCE: Based on their faith (${context.religion}), what spiritual practices would benefit them? What wisdom applies to their current life phase?

Also provide:
- A daily suggestion for today
- A weekly focus area
- An encouraging message

Format the response as JSON with this structure:
{
  "career": { "title": "...", "content": "...", "tip": "..." },
  "relationships": { "title": "...", "content": "...", "tip": "..." },
  "growth": { "title": "...", "content": "...", "tip": "..." },
  "spiritual": { "title": "...", "content": "...", "tip": "..." },
  "dailySuggestion": "...",
  "weeklyFocus": "...",
  "encouragement": "..."
}`;

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
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    let insights;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      insights = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      // Fallback structure
      insights = {
        career: { title: language === "hi" ? "करियर मार्गदर्शन" : "Career Guidance", content: content.slice(0, 200), tip: language === "hi" ? "अपने लक्ष्यों पर ध्यान दें" : "Focus on your goals" },
        relationships: { title: language === "hi" ? "रिश्ते की सलाह" : "Relationship Advice", content: "Communication is key.", tip: language === "hi" ? "सुनने पर ध्यान दें" : "Focus on listening" },
        growth: { title: language === "hi" ? "व्यक्तिगत विकास" : "Personal Growth", content: "Embrace learning.", tip: language === "hi" ? "नई चीजें सीखें" : "Learn something new" },
        spiritual: { title: language === "hi" ? "आध्यात्मिक मार्गदर्शन" : "Spiritual Guidance", content: "Connect with your inner self.", tip: language === "hi" ? "ध्यान करें" : "Meditate daily" },
        dailySuggestion: language === "hi" ? "आज प्रार्थना से शुरू करें" : "Start today with prayer",
        weeklyFocus: language === "hi" ? "धैर्य विकसित करें" : "Develop patience",
        encouragement: language === "hi" ? "आप सही राह पर हैं!" : "You are on the right path!",
      };
    }

    return new Response(JSON.stringify({ insights, context: { name: context.name, religion: context.religion } }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Life Insights error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
