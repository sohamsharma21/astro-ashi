import React from 'npm:react@18.3.1'
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { AuthEmail } from './_templates/auth-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailRequest {
  email: string;
  type: 'password_reset' | 'email_verification' | 'magic_link';
  actionUrl: string;
  userName?: string;
  language?: 'en' | 'hi';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, actionUrl, userName, language = 'en' }: AuthEmailRequest = await req.json();

    console.log(`Sending ${type} email to ${email}`);

    const subjects = {
      en: {
        password_reset: '🔐 Reset Your AstroAshi Password',
        email_verification: '✨ Verify Your AstroAshi Account',
        magic_link: '🌟 Your AstroAshi Login Link',
      },
      hi: {
        password_reset: '🔐 अपना AstroAshi पासवर्ड रीसेट करें',
        email_verification: '✨ अपना AstroAshi खाता सत्यापित करें',
        magic_link: '🌟 आपका AstroAshi लॉगिन लिंक',
      }
    };

    const html = await renderAsync(
      React.createElement(AuthEmail, {
        type,
        actionUrl,
        userName,
        language,
      })
    );

    const { error } = await resend.emails.send({
      from: 'AstroAshi <onboarding@resend.dev>',
      to: [email],
      subject: subjects[language][type],
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
