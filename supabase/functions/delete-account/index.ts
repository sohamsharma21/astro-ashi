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
    // Verify JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = claimsData.claims.sub;
    const { confirmation } = await req.json();

    if (confirmation !== 'DELETE_MY_ACCOUNT') {
      return new Response(JSON.stringify({ error: 'Invalid confirmation. Send { confirmation: "DELETE_MY_ACCOUNT" }' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Log audit event before deletion
    await supabase.from('audit_events').insert({
      user_id: userId,
      action: 'account_deletion_requested',
      details: { requested_at: new Date().toISOString() },
    });

    // Delete user data from all tables (cascading from profiles via foreign keys where applicable)
    const tables = [
      'user_predictions',
      'user_mahadasha',
      'kundli_reports',
      'kundli_data',
      'reading_history',
      'astro_conversations',
      'email_verifications',
      'push_subscriptions',
      'chat_messages',
      'user_zodiac_preferences',
      'notifications',
    ];

    for (const table of tables) {
      const col = table === 'chat_messages' ? 'sender_id' : 'user_id';
      await supabase.from(table).delete().eq(col, userId);
    }

    // Delete live sessions
    await supabase.from('live_sessions').delete().eq('user_id', userId);

    // Delete booking verifications via bookings
    const { data: bookings } = await supabase
      .from('consultation_bookings')
      .select('id')
      .eq('user_id', userId);
    
    if (bookings?.length) {
      const bookingIds = bookings.map(b => b.id);
      await supabase.from('booking_verifications').delete().in('booking_id', bookingIds);
    }
    await supabase.from('consultation_bookings').delete().eq('user_id', userId);

    // Delete profile
    await supabase.from('profiles').delete().eq('id', userId);

    // Delete auth user
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteAuthError) {
      console.error('Auth deletion error:', deleteAuthError);
    }

    return new Response(JSON.stringify({ success: true, message: 'Account and all data deleted.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete account' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
