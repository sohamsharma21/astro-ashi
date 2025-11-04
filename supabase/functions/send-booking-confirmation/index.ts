import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";
import { 
  Logger, 
  generateRequestId,
  checkRateLimit,
  validateInput
} from "../_shared/security.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface BookingConfirmationRequest {
  name: string;
  email: string;
  bookingId: string;
  packageTitle: string;
  date: string;
  time: string;
  language: 'en' | 'hi';
}

const handler = async (req: Request): Promise<Response> => {
  const requestId = generateRequestId();
  const logger = new Logger({ 
    functionName: 'send-booking-confirmation',
    requestId 
  });
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logger.info('Processing booking confirmation request');
    
    const { name, email, bookingId, packageTitle, date, time, language }: BookingConfirmationRequest = await req.json();
    
    const rateLimit = checkRateLimit(`confirm:${bookingId}`, { 
      maxRequests: 3, 
      windowMs: 3600000 
    });
    
    if (!rateLimit.allowed) {
      logger.warn('Rate limit exceeded', { bookingId });
      return new Response(
        JSON.stringify({ 
          error: 'Too many confirmation emails sent.',
          resetAt: new Date(rateLimit.resetAt).toISOString()
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const validation = validateInput(
      { name, email, bookingId, packageTitle, date, time, language },
      {
        name: { required: true, minLength: 1, maxLength: 100 },
        email: { required: true, type: 'email', maxLength: 255 },
        bookingId: { required: true, minLength: 1, maxLength: 100 },
        packageTitle: { required: true, minLength: 1, maxLength: 200 },
        date: { required: true, minLength: 1, maxLength: 100 },
        time: { required: true, minLength: 1, maxLength: 50 },
        language: { required: true, pattern: /^(en|hi)$/ }
      }
    );
    
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
      ? 'Consultation Booking Confirmed! 🌟'
      : 'परामर्श बुकिंग की पुष्टि! 🌟';

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
              .booking-details { background: white; padding: 20px; border-left: 4px solid #D4AF37; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Booking Confirmed!</h1>
              </div>
              <div class="content">
                <h2>Hello ${name}!</h2>
                <p>Your consultation booking has been confirmed. We're excited to guide you on your cosmic journey!</p>
                
                <div class="booking-details">
                  <h3>Booking Details:</h3>
                  <p><strong>Booking ID:</strong> ${bookingId}</p>
                  <p><strong>Package:</strong> ${packageTitle}</p>
                  <p><strong>Date:</strong> ${date}</p>
                  <p><strong>Time:</strong> ${time}</p>
                </div>
                
                <p>Our astrology expert will reach out to you shortly before your scheduled consultation.</p>
                
                <p>Please keep this email for your records.</p>
                
                <p>If you need to reschedule or have any questions, please contact us.</p>
                
                <p>Best wishes,</p>
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
              .booking-details { background: white; padding: 20px; border-left: 4px solid #D4AF37; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ बुकिंग की पुष्टि!</h1>
              </div>
              <div class="content">
                <h2>नमस्ते ${name}!</h2>
                <p>आपकी परामर्श बुकिंग की पुष्टि हो गई है। हम आपको आपकी कॉस्मिक यात्रा में मार्गदर्शन करने के लिए उत्साहित हैं!</p>
                
                <div class="booking-details">
                  <h3>बुकिंग विवरण:</h3>
                  <p><strong>बुकिंग आईडी:</strong> ${bookingId}</p>
                  <p><strong>पैकेज:</strong> ${packageTitle}</p>
                  <p><strong>तिथि:</strong> ${date}</p>
                  <p><strong>समय:</strong> ${time}</p>
                </div>
                
                <p>हमारे ज्योतिष विशेषज्ञ आपके निर्धारित परामर्श से कुछ समय पहले आपसे संपर्क करेंगे।</p>
                
                <p>कृपया इस ईमेल को अपने रिकॉर्ड के लिए रखें।</p>
                
                <p>यदि आपको पुनर्निर्धारित करने की आवश्यकता है या कोई प्रश्न है, तो कृपया हमसे संपर्क करें।</p>
                
                <p>शुभकामनाएं,</p>
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
    
    logger.info('Booking confirmation email sent successfully', { 
      emailId: emailResponse.data?.id,
      bookingId,
      email 
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Confirmation email sent successfully'
      }), 
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
          "X-Request-Id": requestId
        },
      }
    );
  } catch (error: any) {
    logger.error('Error in send-booking-confirmation function', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        requestId 
      }), 
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders,
          "X-Request-Id": requestId
        },
      }
    );
  }
};

serve(handler);
