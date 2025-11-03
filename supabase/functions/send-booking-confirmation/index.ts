import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { corsHeaders } from "../_shared/cors.ts";
import { 
  Logger, 
  generateRequestId,
  checkRateLimit,
  validateInput
} from "../_shared/security.ts";
import { emailService } from "../_shared/email-service.ts";

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
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logger.info('Processing booking confirmation request');
    
    const { name, email, bookingId, packageTitle, date, time, language }: BookingConfirmationRequest = await req.json();
    
    // Rate limiting
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
    
    // Validate input
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

    // Send email using centralized service
    await emailService.sendBookingConfirmation(
      email,
      name,
      bookingId,
      packageTitle,
      date,
      time,
      language,
      logger
    );
    
    logger.info('Booking confirmation email sent successfully', { 
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
