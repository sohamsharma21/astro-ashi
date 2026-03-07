import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, email, language = 'en' } = await req.json();

    if (!userId || !email) {
      return new Response(JSON.stringify({ error: 'userId and email are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create verification token
    const { data: verification, error: insertError } = await supabase
      .from('email_verifications')
      .insert({ user_id: userId, email })
      .select()
      .single();

    if (insertError) throw insertError;

    const verifyUrl = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.supabase.co')}/functions/v1/verify-email?token=${verification.token}`;

    // Send email via Resend
    if (resendApiKey) {
      const subject = language === 'hi' ? 'अपना ईमेल सत्यापित करें - AstroAshi' : 'Verify Your Email - AstroAshi';
      const body = language === 'hi'
        ? `<h2>नमस्ते!</h2><p>अपना AstroAshi खाता सत्यापित करने के लिए नीचे क्लिक करें:</p><a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#d4a017;color:#000;text-decoration:none;border-radius:8px;font-weight:bold;">ईमेल सत्यापित करें</a><p>यह लिंक 24 घंटे में समाप्त हो जाएगा।</p>`
        : `<h2>Welcome!</h2><p>Click below to verify your AstroAshi account:</p><a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#d4a017;color:#000;text-decoration:none;border-radius:8px;font-weight:bold;">Verify Email</a><p>This link expires in 24 hours.</p>`;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AstroAshi <noreply@astroashi.com>',
          to: [email],
          subject,
          html: body,
        }),
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Verification email sent' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Send verification error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send verification email' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
