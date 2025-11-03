import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ConsultationBooking = {
  id?: string;
  user_id: string;
  package_id: string;
  package_title: string;
  package_price: string;
  booking_date: string;
  booking_time: string;
  phone: string;
  status?: string;
  created_at?: string;
};

// Retry configuration
const RETRY_CONFIG = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2
};

// Centralized error handler with retry logic
async function withRetry<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= RETRY_CONFIG.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`${context} - Attempt ${attempt}/${RETRY_CONFIG.maxAttempts} failed:`, error);
      
      if (attempt < RETRY_CONFIG.maxAttempts) {
        const delay = RETRY_CONFIG.delayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

export const bookingsApi = {
  // Create a new booking
  async createBooking(bookingData: Omit<ConsultationBooking, 'id' | 'status' | 'created_at'>): Promise<ConsultationBooking | null> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('consultation_bookings')
        .insert(bookingData)
        .select()
        .single();
        
      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }
      
      return data as ConsultationBooking;
    }, 'createBooking');
  },
  
  // Get user bookings
  async getUserBookings(userId: string): Promise<ConsultationBooking[]> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('consultation_bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching user bookings:', error);
        throw error;
      }
      
      return data as ConsultationBooking[];
    }, 'getUserBookings');
  },
  
  // Send booking verification email using Supabase function invocation
  async sendBookingVerificationEmail(
    email: string, 
    name: string,
    bookingId: string,
    packageTitle: string,
    date: string,
    time: string,
    language: 'en' | 'hi'
  ): Promise<void> {
    return withRetry(async () => {
      // Validate inputs to prevent edge function errors
      if (!email || !name || !bookingId || !packageTitle || !date || !time) {
        throw new Error('Missing required parameters for verification email');
      }
      
      const { data, error } = await supabase.functions.invoke('send-booking-verification', {
        body: {
          email,
          name,
          bookingId,
          packageTitle,
          date,
          time,
          language
        }
      });
      
      if (error) {
        console.error('Error sending verification email:', error);
        throw error;
      }
      
      console.log('Verification email sent successfully:', data);
    }, 'sendBookingVerificationEmail');
  },
  
  // Send direct booking confirmation email (no verification required)
  async sendBookingConfirmationEmail(
    email: string, 
    name: string,
    bookingId: string,
    packageTitle: string,
    date: string,
    time: string,
    language: 'en' | 'hi'
  ): Promise<void> {
    return withRetry(async () => {
      // Validate inputs to prevent edge function errors
      if (!email || !name || !bookingId || !packageTitle || !date || !time) {
        throw new Error('Missing required parameters for confirmation email');
      }
      
      const { data, error } = await supabase.functions.invoke('send-booking-confirmation', {
        body: {
          email,
          name,
          bookingId,
          packageTitle,
          date,
          time,
          language
        }
      });
      
      if (error) {
        console.error('Error sending confirmation email:', error);
        throw error;
      }
      
      console.log('Confirmation email sent successfully:', data);
    }, 'sendBookingConfirmationEmail');
  },

  // Get booking verification status
  async getBookingVerificationStatus(bookingId: string): Promise<{ verified: boolean; expires_at?: string }> {
    try {
      const { data, error } = await supabase
        .from('booking_verifications')
        .select('verified_at, expires_at')
        .eq('booking_id', bookingId)
        .single();
        
      if (error) {
        console.error('Error fetching verification status:', error);
        return { verified: false };
      }
      
      return { 
        verified: !!data.verified_at,
        expires_at: data.expires_at 
      };
    } catch (error) {
      console.error('Error in getBookingVerificationStatus:', error);
      return { verified: false };
    }
  }
};
