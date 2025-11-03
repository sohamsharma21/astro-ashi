import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { 
  Logger, 
  generateRequestId, 
  checkRateLimit,
  validateInput 
} from "../_shared/security.ts";
import { emailService } from "../_shared/email-service.ts";

interface SignupEmailRequest {
  email: string;
  name: string;
  language: 'en' | 'hi';
}

const handler = async (req: Request): Promise<Response> => {
  const requestId = generateRequestId();
  const logger = new Logger({ 
    functionName: 'send-signup-confirmation',
    requestId 
  });
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logger.info('Processing signup confirmation request');
    
    const { email, name, language }: SignupEmailRequest = await req.json();
    
    // Rate limiting by email
    const rateLimit = checkRateLimit(`signup:${email}`, { 
      maxRequests: 3, 
      windowMs: 3600000 // 1 hour
    });
    
    if (!rateLimit.allowed) {
      logger.warn('Rate limit exceeded', { email });
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          resetAt: new Date(rateLimit.resetAt).toISOString()
        }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders,
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimit.resetAt).toISOString()
          },
        }
      );
    }
    
    // Validate input
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

    // Send email using centralized service
    await emailService.sendSignupConfirmation(email, name, language, logger);
    
    logger.info('Signup confirmation email sent successfully', { email });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Signup confirmation email sent successfully' 
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
    logger.error('Error in send-signup-confirmation function', error);
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
