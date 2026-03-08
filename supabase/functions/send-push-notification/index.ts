import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushNotificationRequest {
  type: 'daily_horoscope' | 'auspicious_timing' | 'custom';
  title?: string;
  body?: string;
  language?: 'en' | 'hi';
}

const notificationTemplates = {
  en: {
    daily_horoscope: {
      title: '🌟 Your Daily Horoscope is Ready!',
      body: 'Discover what the stars have in store for you today. Tap to view your personalized prediction.',
    },
    auspicious_timing: {
      title: '✨ Auspicious Time Alert!',
      body: 'Shubh Muhurat is approaching. Perfect time for important decisions and new beginnings.',
    },
  },
  hi: {
    daily_horoscope: {
      title: '🌟 आपका दैनिक राशिफल तैयार है!',
      body: 'जानें आज सितारे आपके लिए क्या लाए हैं। अपना व्यक्तिगत भविष्यफल देखने के लिए टैप करें।',
    },
    auspicious_timing: {
      title: '✨ शुभ समय अलर्ट!',
      body: 'शुभ मुहूर्त निकट है। महत्वपूर्ण निर्णयों और नई शुरुआत के लिए उत्तम समय।',
    },
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Verify the caller's identity
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub as string;

    const { type, title, body, language = 'en' }: PushNotificationRequest = await req.json();

    // Use service role client for writing notifications
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get notification content
    let notificationTitle = title;
    let notificationBody = body;

    if (type !== 'custom' && notificationTemplates[language]?.[type]) {
      notificationTitle = notificationTemplates[language][type].title;
      notificationBody = notificationTemplates[language][type].body;
    }

    if (!notificationTitle || !notificationBody) {
      return new Response(
        JSON.stringify({ error: 'Missing notification title or body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Only send notification to the authenticated user — no broadcast
    const { error: insertError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: notificationTitle,
        body: notificationBody,
        type,
        read: false,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Failed to insert notification:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to send notification' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Push notification sent to user ${userId}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notification sent',
        notification: {
          title: notificationTitle,
          body: notificationBody,
          type,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Push notification error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
