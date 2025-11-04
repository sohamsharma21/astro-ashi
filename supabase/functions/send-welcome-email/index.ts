import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";
import { 
  Logger, 
  generateRequestId, 
  checkRateLimit,
  validateInput 
} from "../_shared/security.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface WelcomeEmailRequest {
  email: string;
  name: string;
  language: 'en' | 'hi';
}

const handler = async (req: Request): Promise<Response> => {
  const requestId = generateRequestId();
  const logger = new Logger({ 
    functionName: 'send-welcome-email',
    requestId 
  });
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logger.info('Processing welcome email request');
    
    const { email, name, language }: WelcomeEmailRequest = await req.json();
    
    const rateLimit = checkRateLimit(`welcome:${email}`, { 
      maxRequests: 2, 
      windowMs: 3600000
    });
    
    if (!rateLimit.allowed) {
      logger.warn('Rate limit exceeded', { email });
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests',
          resetAt: new Date(rateLimit.resetAt).toISOString()
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const validation = validateInput({ email, name, language }, {
      email: { required: true, type: 'email', maxLength: 255 },
      name: { required: true, minLength: 1, maxLength: 100 },
      language: { required: true, pattern: /^(en|hi)$/ }
    });
    
    if (!validation.valid) {
      logger.warn('Validation failed', { errors: validation.errors });
      return new Response(
        JSON.stringify({ error: validation.errors.join(', ') }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const subject = language === 'en' 
      ? 'Welcome to AstroAshi! 🌟'
      : 'AstroAshi में आपका स्वागत है! 🌟';

    const html = language === 'en' 
      ? `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%); color: #D4AF37; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: #1a0b2e; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to AstroAshi! 🌟</h1>
              </div>
              <div class="content">
                <h2>Hello ${name}!</h2>
                <p>We're thrilled to have you join the AstroAshi community! Your journey into the cosmos starts here.</p>
                
                <p>With AstroAshi, you can:</p>
                <ul>
                  <li>📅 Get personalized daily horoscopes</li>
                  <li>✨ Generate detailed Kundli charts</li>
                  <li>💕 Check compatibility with your loved ones</li>
                  <li>🔮 Chat with our AI astrologer</li>
                  <li>📞 Book professional consultations</li>
                </ul>
                
                <a href="https://astroashi.lovable.app" class="button">Explore AstroAshi</a>
                
                <p>If you have any questions, feel free to reach out to us anytime.</p>
                
                <p>Best wishes on your cosmic journey!</p>
                <p><strong>The AstroAshi Team</strong></p>
              </div>
              <div class="footer">
                <p>© 2025 AstroAshi. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
      : `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%); color: #D4AF37; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: #1a0b2e; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>AstroAshi में आपका स्वागत है! 🌟</h1>
              </div>
              <div class="content">
                <h2>नमस्ते ${name}!</h2>
                <p>हमें खुशी है कि आप AstroAshi समुदाय में शामिल हुए! ब्रह्मांड में आपकी यात्रा यहाँ से शुरू होती है।</p>
                
                <p>AstroAshi के साथ, आप कर सकते हैं:</p>
                <ul>
                  <li>📅 व्यक्तिगत दैनिक राशिफल प्राप्त करें</li>
                  <li>✨ विस्तृत कुंडली चार्ट बनाएं</li>
                  <li>💕 अपने प्रियजनों के साथ संगतता जांचें</li>
                  <li>🔮 हमारे AI ज्योतिषी से बात करें</li>
                  <li>📞 पेशेवर परामर्श बुक करें</li>
                </ul>
                
                <a href="https://astroashi.lovable.app" class="button">AstroAshi एक्सप्लोर करें</a>
                
                <p>यदि आपके कोई प्रश्न हैं, तो कभी भी हमसे संपर्क करने में संकोच न करें।</p>
                
                <p>आपकी कॉस्मिक यात्रा पर शुभकामनाएं!</p>
                <p><strong>AstroAshi टीम</strong></p>
              </div>
              <div class="footer">
                <p>© 2025 AstroAshi. सर्वाधिकार सुरक्षित।</p>
              </div>
            </div>
          </body>
        </html>
      `;

    const emailResponse = await resend.emails.send({
      from: "AstroAshi <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
    });

    logger.info('Welcome email sent successfully', { emailId: emailResponse.data?.id, to: email });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Welcome email sent successfully' 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
          "X-Request-Id": requestId
        },
      }
    );
  } catch (error: any) {
    logger.error('Error in send-welcome-email function', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        requestId 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders,
          "X-Request-Id": requestId
        },
      }
    );
  }
};

serve(handler);
