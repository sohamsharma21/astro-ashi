import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Allowed frontend domains for verification links
const ALLOWED_ORIGINS = [
  'https://astroashi.vercel.app',
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authenticatedUserId = claimsData.claims.sub;

    const { userId, email, language = 'en' } = await req.json();

    // Ensure the authenticated user can only send verification for their own account
    if (userId !== authenticatedUserId) {
      return new Response(JSON.stringify({ error: 'Forbidden: cannot send verification for another user' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!userId || !email) {
      return new Response(JSON.stringify({ error: 'userId and email are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Rate limit: max 3 verification emails per user per hour
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { count } = await supabase
      .from('email_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', oneHourAgo);

    if (count && count >= 3) {
      return new Response(JSON.stringify({ error: 'Too many verification emails. Try again later.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create verification token
    const { data: verification, error: insertError } = await supabase
      .from('email_verifications')
      .insert({ user_id: userId, email })
      .select()
      .single();

    if (insertError) throw insertError;

    // Build frontend verification URL (not edge function URL)
    const origin = ALLOWED_ORIGINS[0]; // Production URL
    const verifyUrl = `${origin}/verify-email?token=${verification.token}`;

    // Send email via Resend
    if (resendApiKey) {
      const subject = language === 'hi' ? 'अपना ईमेल सत्यापित करें - AstroAshi' : 'Verify Your Email - AstroAshi';
      const html = language === 'hi'
        ? `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#ffffff;padding:40px;">
            <div style="max-width:500px;margin:0 auto;text-align:center;">
              <h1 style="color:#1a0b2e;">🌟 AstroAshi</h1>
              <h2 style="color:#333;">नमस्ते!</h2>
              <p style="color:#555;">अपना AstroAshi खाता सत्यापित करने के लिए नीचे क्लिक करें:</p>
              <a href="${verifyUrl}" style="display:inline-block;padding:14px 32px;background:#D4AF37;color:#1a0b2e;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;margin:20px 0;">ईमेल सत्यापित करें</a>
              <p style="color:#999;font-size:12px;">यह लिंक 24 घंटे में समाप्त हो जाएगा।</p>
              <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
              <p style="color:#999;font-size:11px;">© 2025 AstroAshi. सर्वाधिकार सुरक्षित।</p>
            </div>
          </body></html>`
        : `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#ffffff;padding:40px;">
            <div style="max-width:500px;margin:0 auto;text-align:center;">
              <h1 style="color:#1a0b2e;">🌟 AstroAshi</h1>
              <h2 style="color:#333;">Welcome!</h2>
              <p style="color:#555;">Click below to verify your AstroAshi account:</p>
              <a href="${verifyUrl}" style="display:inline-block;padding:14px 32px;background:#D4AF37;color:#1a0b2e;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;margin:20px 0;">Verify Email</a>
              <p style="color:#999;font-size:12px;">This link expires in 24 hours.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
              <p style="color:#999;font-size:11px;">© 2025 AstroAshi. All rights reserved.</p>
            </div>
          </body></html>`;

      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AstroAshi <onboarding@resend.dev>',
          to: [email],
          subject,
          html,
        }),
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        console.error('Resend API error:', errText);
      }
    } else {
      console.warn('RESEND_API_KEY not configured, skipping email send');
    }

    // Log audit event
    await supabase.from('audit_events').insert({
      user_id: userId,
      action: 'verification_email_sent',
      details: { email, language },
    });

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
