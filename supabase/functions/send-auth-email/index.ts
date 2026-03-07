import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from 'npm:resend@2.0.0';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit } from "../_shared/security.ts";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Allowed domains for actionUrl to prevent phishing
const ALLOWED_DOMAINS = [
  'astroashi-24419.lovable.app',
  'astroashi.lovable.app',
  'localhost',
  'czpumlrofurdktvjtibl.supabase.co',
];

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_DOMAINS.some(domain => parsed.hostname === domain || parsed.hostname.endsWith('.' + domain));
  } catch {
    return false;
  }
}

interface AuthEmailRequest {
  email: string;
  type: 'password_reset' | 'email_verification' | 'magic_link';
  actionUrl: string;
  userName?: string;
  language?: 'en' | 'hi';
}

const translations = {
  en: {
    password_reset: {
      subject: '🔐 Reset Your AstroAshi Password',
      title: 'Reset Your Password',
      subtitle: 'Click the button below to reset your password',
      button: 'Reset Password',
      note: 'This link will expire in 24 hours.',
      ignore: "If you didn't request a password reset, you can safely ignore this email.",
    },
    email_verification: {
      subject: '✨ Verify Your AstroAshi Account',
      title: 'Verify Your Email',
      subtitle: 'Click the button below to verify your email address',
      button: 'Verify Email',
      note: 'This link will expire in 24 hours.',
      ignore: "If you didn't create an account, you can safely ignore this email.",
    },
    magic_link: {
      subject: '🌟 Your AstroAshi Login Link',
      title: 'Sign In to AstroAshi',
      subtitle: 'Click the button below to sign in to your account',
      button: 'Sign In',
      note: 'This link will expire in 1 hour.',
      ignore: "If you didn't request this link, you can safely ignore this email.",
    },
    welcome: 'Hello',
    footer: 'May the stars guide your path',
    copyright: '© 2025 AstroAshi. All rights reserved.',
  },
  hi: {
    password_reset: {
      subject: '🔐 अपना AstroAshi पासवर्ड रीसेट करें',
      title: 'अपना पासवर्ड रीसेट करें',
      subtitle: 'अपना पासवर्ड रीसेट करने के लिए नीचे बटन पर क्लिक करें',
      button: 'पासवर्ड रीसेट करें',
      note: 'यह लिंक 24 घंटे में समाप्त हो जाएगा।',
      ignore: 'यदि आपने पासवर्ड रीसेट का अनुरोध नहीं किया है, तो आप इस ईमेल को सुरक्षित रूप से अनदेखा कर सकते हैं।',
    },
    email_verification: {
      subject: '✨ अपना AstroAshi खाता सत्यापित करें',
      title: 'अपना ईमेल सत्यापित करें',
      subtitle: 'अपना ईमेल पता सत्यापित करने के लिए नीचे बटन पर क्लिक करें',
      button: 'ईमेल सत्यापित करें',
      note: 'यह लिंक 24 घंटे में समाप्त हो जाएगा।',
      ignore: 'यदि आपने खाता नहीं बनाया है, तो आप इस ईमेल को सुरक्षित रूप से अनदेखा कर सकते हैं।',
    },
    magic_link: {
      subject: '🌟 आपका AstroAshi लॉगिन लिंक',
      title: 'AstroAshi में साइन इन करें',
      subtitle: 'अपने खाते में साइन इन करने के लिए नीचे बटन पर क्लिक करें',
      button: 'साइन इन करें',
      note: 'यह लिंक 1 घंटे में समाप्त हो जाएगा।',
      ignore: 'यदि आपने इस लिंक का अनुरोध नहीं किया है, तो आप इस ईमेल को सुरक्षित रूप से अनदेखा कर सकते हैं।',
    },
    welcome: 'नमस्ते',
    footer: 'सितारे आपका मार्गदर्शन करें',
    copyright: '© 2025 AstroAshi. सर्वाधिकार सुरक्षित।',
  }
};

function generateEmailHtml(type: string, actionUrl: string, userName: string | undefined, lang: 'en' | 'hi') {
  const t = translations[lang];
  const content = t[type as keyof typeof t] as any;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0f0520; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <tr>
            <td>
              <!-- Header -->
              <table width="100%" style="background: linear-gradient(135deg, #1a0b2e 0%, #321c5c 100%); border-radius: 16px 16px 0 0; padding: 40px 20px; text-align: center;">
                <tr>
                  <td>
                    <img src="https://astroashi.lovable.app/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png" width="80" height="80" alt="AstroAshi" style="border-radius: 50%; border: 3px solid #ffd700; box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);">
                    <h1 style="color: #ffd700; font-size: 32px; font-weight: bold; margin: 16px 0 8px; text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);">AstroAshi</h1>
                    <p style="color: #c0c0c0; font-size: 14px; margin: 0;">✨ Your Personal Vedic Astrology Guide ✨</p>
                  </td>
                </tr>
              </table>
              
              <!-- Content -->
              <table width="100%" style="background-color: #1a0b2e; padding: 32px 40px;">
                <tr>
                  <td>
                    <p style="color: #ffffff; font-size: 18px; margin: 0 0 24px;">${t.welcome}${userName ? `, ${userName}` : ''}! 🌟</p>
                    <h2 style="color: #ffd700; font-size: 24px; font-weight: bold; margin: 0 0 16px;">${content.title}</h2>
                    <p style="color: #e0e0e0; font-size: 16px; line-height: 24px; margin: 0 0 24px;">${content.subtitle}</p>
                    
                    <!-- Button -->
                    <table width="100%" style="margin: 32px 0; text-align: center;">
                      <tr>
                        <td>
                          <a href="${actionUrl}" style="background-color: #ffd700; border-radius: 30px; color: #1a0b2e; display: inline-block; font-size: 16px; font-weight: bold; padding: 14px 32px; text-decoration: none; box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);">${content.button}</a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #a0a0a0; font-size: 14px; margin: 0 0 16px; text-align: center;">${content.note}</p>
                    <p style="color: #707070; font-size: 12px; margin: 0; text-align: center;">${content.ignore}</p>
                    
                    <!-- Cosmic divider -->
                    <p style="color: #ffd700; font-size: 16px; letter-spacing: 8px; text-align: center; margin: 32px 0;">⭐ ✦ ⭐ ✦ ⭐</p>
                  </td>
                </tr>
              </table>
              
              <!-- Footer -->
              <table width="100%" style="background-color: #0f0520; border-radius: 0 0 16px 16px; padding: 24px 20px; text-align: center; border-top: 1px solid #321c5c;">
                <tr>
                  <td>
                    <p style="color: #ffd700; font-size: 14px; font-style: italic; margin: 0 0 8px;">${t.footer}</p>
                    <p style="color: #606060; font-size: 12px; margin: 0;">${t.copyright}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Require JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userId = claimsData.claims.sub as string;

    // 2. Rate limit: 3 requests per hour per user
    const rateLimitResult = checkRateLimit(userId, { maxRequests: 3, windowMs: 60 * 60 * 1000 });
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { email, type, actionUrl, userName, language = 'en' }: AuthEmailRequest = await req.json();

    // 3. Validate actionUrl against allowed domains
    if (!isAllowedUrl(actionUrl)) {
      console.error('Blocked disallowed actionUrl:', actionUrl);
      return new Response(
        JSON.stringify({ error: 'Invalid action URL' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 4. Validate email type
    if (!['password_reset', 'email_verification', 'magic_link'].includes(type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email type' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending ${type} email to ${email} (requested by user ${userId})`);

    const t = translations[language];
    const content = t[type as keyof typeof t] as any;
    const html = generateEmailHtml(type, actionUrl, userName, language);

    const { error } = await resend.emails.send({
      from: 'AstroAshi <onboarding@resend.dev>',
      to: [email],
      subject: content.subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      throw error;
    }

    console.log(`${type} email sent successfully to ${email}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-auth-email function:", error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
