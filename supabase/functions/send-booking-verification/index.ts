import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from "../_shared/cors.ts";
import { 
  Logger, 
  generateRequestId,
  checkRateLimit,
  validateInput
} from "../_shared/security.ts";
import { emailService } from "../_shared/email-service.ts";

interface BookingVerificationRequest {
  bookingId: string;
  email: string;
  name: string;
  packageTitle: string;
  date: string;
  time: string;
  language: 'en' | 'hi';
}

const handler = async (req: Request): Promise<Response> => {
  const requestId = generateRequestId();
  const logger = new Logger({ 
    functionName: 'send-booking-verification',
    requestId 
  });
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logger.info('Processing booking verification request');
    
    const { bookingId, email, name, packageTitle, date, time, language }: BookingVerificationRequest = await req.json();
    
    // Rate limiting by booking ID to prevent spam
    const rateLimit = checkRateLimit(`booking:${bookingId}`, { 
      maxRequests: 5, 
      windowMs: 3600000 // 1 hour
    });
    
    if (!rateLimit.allowed) {
      logger.warn('Rate limit exceeded', { bookingId });
      return new Response(
        JSON.stringify({ 
          error: 'Too many verification emails sent. Please try again later.',
          resetAt: new Date(rateLimit.resetAt).toISOString()
        }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders,
            "X-RateLimit-Remaining": rateLimit.remaining.toString()
          },
        }
      );
    }
    
    // Validate input
    const validation = validateInput(
      { bookingId, email, name, packageTitle, date, time, language },
      {
        bookingId: { required: true, minLength: 1, maxLength: 100 },
        email: { required: true, type: 'email', maxLength: 255 },
        name: { required: true, minLength: 1, maxLength: 100 },
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

    logger.info('Creating verification token', { bookingId });
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create verification token in database with attempt tracking
    const { data: verificationData, error: dbError } = await supabase
      .from('booking_verifications')
      .insert({
        booking_id: bookingId,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      })
      .select('verification_token')
      .single();

    if (dbError) {
      logger.error('Database error creating verification token', dbError);
      throw new Error(`Failed to create verification token: ${dbError.message}`);
    }
    
    logger.info('Verification token created', { 
      bookingId,
      token: verificationData.verification_token 
    });

    const verificationUrl = `https://czpumlrofurdktvjtibl.supabase.co/functions/v1/verify-booking?token=${verificationData.verification_token}`;

    // Send email using centralized service
    await emailService.sendBookingVerification(
      email,
      name,
      bookingId,
      packageTitle,
      date,
      time,
      verificationUrl,
      language,
      logger
    );
    
    logger.info('Booking verification email sent successfully', { 
      bookingId,
      email 
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Verification email sent successfully',
        expiresIn: '24 hours'
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
    logger.error('Error in send-booking-verification function', error);
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
