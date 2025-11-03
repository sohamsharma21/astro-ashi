import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { 
  Logger, 
  generateRequestId, 
  checkRateLimit,
  validateInput 
} from "../_shared/security.ts";
import { emailService } from "../_shared/email-service.ts";

interface MagicLinkRequest {
  email: string;
  token: string;
  type: 'signup' | 'magiclink' | 'recovery' | 'invite';
  redirect_to?: string;
}

const handler = async (req: Request): Promise<Response> => {
  const requestId = generateRequestId();
  const logger = new Logger({ 
    functionName: 'send-magic-link',
    requestId 
  });
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logger.info('Processing magic link email request');
    
    const payload: MagicLinkRequest = await req.json();
    const { email, token, type, redirect_to } = payload;
    
    // Rate limiting by email
    const rateLimit = checkRateLimit(`magic-link:${email}`, { 
      maxRequests: 5, 
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
    const validation = validateInput({ email, token, type }, {
      email: { required: true, type: 'email', maxLength: 255 },
      token: { required: true, minLength: 1 },
      type: { required: true, pattern: /^(signup|magiclink|recovery|invite)$/ }
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

    // Construct magic link URL
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const baseRedirect = redirect_to || `${supabaseUrl}/`;
    
    const magicLink = `${supabaseUrl}/auth/v1/verify?token=${token}&type=${type}&redirect_to=${encodeURIComponent(baseRedirect)}`;
    
    logger.info('Magic link constructed', { email, type });

    // Default to English if language preference is not available
    const language = 'en';

    // Send email using centralized service
    await emailService.sendMagicLink(email, magicLink, language, logger);
    
    logger.info('Magic link email sent successfully', { email, type });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Magic link email sent successfully' 
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
    logger.error('Error in send-magic-link function', error);
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
