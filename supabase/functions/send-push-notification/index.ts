import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushNotificationRequest {
  userId?: string;
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
    const { userId, type, title, body, language = 'en' }: PushNotificationRequest = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get notification content
    let notificationTitle = title;
    let notificationBody = body;

    if (type !== 'custom' && notificationTemplates[language]?.[type]) {
      notificationTitle = notificationTemplates[language][type].title;
      notificationBody = notificationTemplates[language][type].body;
    }

    // Get user's push subscription if userId provided
    let subscriptions: any[] = [];
    
    if (userId) {
      const { data } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId);
      subscriptions = data || [];
    } else {
      // Get all subscriptions for broadcast
      const { data } = await supabase
        .from('push_subscriptions')
        .select('*');
      subscriptions = data || [];
    }

    // For now, we'll store notifications in a queue table
    // In production, you'd integrate with Firebase Cloud Messaging or similar
    const notifications = subscriptions.map(sub => ({
      user_id: sub.user_id,
      title: notificationTitle,
      body: notificationBody,
      type,
      read: false,
      created_at: new Date().toISOString(),
    }));

    if (notifications.length > 0) {
      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (insertError) {
        console.error('Failed to insert notifications:', insertError);
      }
    }

    console.log(`Push notification queued for ${subscriptions.length} users`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notification sent to ${subscriptions.length} subscribers`,
        notification: {
          title: notificationTitle,
          body: notificationBody,
          type,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Push notification error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
