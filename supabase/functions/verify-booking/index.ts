import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from "../_shared/cors.ts";
import { Logger, generateRequestId } from "../_shared/security.ts";

serve(async (req) => {
  const requestId = generateRequestId();
  const logger = new Logger({ 
    functionName: 'verify-booking',
    requestId 
  });
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logger.info('Processing booking verification');
    
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      logger.warn('Missing verification token');
      return new Response('Missing verification token', {
        status: 400,
        headers: { 'Content-Type': 'text/html', ...corsHeaders },
      });
    }
    
    logger.info('Verifying token', { token });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find verification record
    const { data: verification, error: verifyError } = await supabase
      .from('booking_verifications')
      .select('*')
      .eq('verification_token', token)
      .is('verified_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (verifyError || !verification) {
      logger.warn('Invalid or expired token', { error: verifyError });
      return new Response('Invalid or expired verification token', {
        status: 400,
        headers: { 'Content-Type': 'text/html', ...corsHeaders },
      });
    }

    logger.info('Updating verification record', { 
      bookingId: verification.booking_id 
    });
    
    // Update verification record
    const { error: updateError } = await supabase
      .from('booking_verifications')
      .update({ verified_at: new Date().toISOString() })
      .eq('verification_token', token);

    if (updateError) {
      logger.error('Error updating verification', updateError);
      throw updateError;
    }
    
    logger.info('Verification record updated successfully');

    logger.info('Updating booking status', { 
      bookingId: verification.booking_id 
    });
    
    // Update booking status to confirmed
    const { error: bookingUpdateError } = await supabase
      .from('consultation_bookings')
      .update({ status: 'confirmed' })
      .eq('id', verification.booking_id);

    if (bookingUpdateError) {
      logger.error('Error updating booking', bookingUpdateError);
      throw bookingUpdateError;
    }
    
    logger.info('Booking status updated to confirmed');

    logger.info('Fetching booking details for confirmation email');
    
    // Get booking details and user email for confirmation
    const { data: booking, error: bookingError } = await supabase
      .from('consultation_bookings')
      .select('*, profiles!consultation_bookings_user_id_fkey(full_name)')
      .eq('id', verification.booking_id)
      .single();
    
    if (bookingError || !booking) {
      logger.error('Error fetching booking', bookingError);
      throw bookingError || new Error('Booking not found');
    }

    logger.info('Fetching user email');
    
    // Get user email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(booking.user_id);
    
    if (userError || !userData?.user?.email) {
      logger.error('Error fetching user', userError);
      throw userError || new Error('User email not found');
    }

    logger.info('Sending confirmation email', { 
      email: userData.user.email,
      bookingId: booking.id 
    });
    
    // Send confirmation email
    const confirmationResponse = await supabase.functions.invoke('send-booking-confirmation', {
      body: {
        name: booking.profiles?.full_name || userData.user.email.split('@')[0],
        email: userData.user.email,
        bookingId: booking.id,
        packageTitle: booking.package_title,
        date: new Date(booking.booking_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: booking.booking_time,
        language: userData.user.user_metadata?.preferred_language || 'en'
      }
    });
    
    if (confirmationResponse.error) {
      logger.error('Error sending confirmation email', confirmationResponse.error);
      // Don't throw - verification succeeded even if email fails
    } else {
      logger.info('Confirmation email sent successfully');
    }

    // Return success HTML page
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Verified - AstroAshi</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background: linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%); 
              margin: 0; 
              padding: 20px; 
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container { 
              max-width: 500px; 
              background: white; 
              border-radius: 16px; 
              padding: 40px 30px; 
              text-align: center; 
              box-shadow: 0 10px 30px rgba(0,0,0,0.3); 
            }
            .icon { font-size: 64px; margin-bottom: 20px; }
            h1 { color: #4B006E; margin-bottom: 20px; font-size: 28px; }
            p { color: #666; margin-bottom: 15px; line-height: 1.6; }
            .success { color: #22c55e; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">✅</div>
            <h1>Booking Verified Successfully!</h1>
            <p class="success">Your consultation booking has been confirmed.</p>
            <p>You will receive a confirmation email shortly with all the details.</p>
            <p>Our team will contact you before your scheduled appointment.</p>
            <p style="margin-top: 30px; font-size: 14px; color: #999;">
              You can now close this window.
            </p>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      }
    );

  } catch (error: any) {
    logger.error('Error in verify-booking function', error);
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verification Error - AstroAshi</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background: linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%); 
              margin: 0; 
              padding: 20px; 
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container { 
              max-width: 500px; 
              background: white; 
              border-radius: 16px; 
              padding: 40px 30px; 
              text-align: center; 
              box-shadow: 0 10px 30px rgba(0,0,0,0.3); 
            }
            .icon { font-size: 64px; margin-bottom: 20px; }
            h1 { color: #dc2626; margin-bottom: 20px; font-size: 28px; }
            p { color: #666; margin-bottom: 15px; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">❌</div>
            <h1>Verification Failed</h1>
            <p>There was an error verifying your booking. Please try again or contact support.</p>
            <p style="margin-top: 30px; font-size: 14px; color: #999;">
              Error: ${error.message}
            </p>
          </div>
        </body>
      </html>
      `,
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      }
    );
  }
});
