import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function VerifyBooking() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyBooking = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided');
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-booking?token=${token}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          setStatus('success');
          setMessage('Your booking has been verified successfully!');
        } else {
          const errorData = await response.json();
          setStatus('error');
          setMessage(errorData.error || 'Verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Failed to verify booking. Please try again.');
      }
    };

    verifyBooking();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cosmic-void via-cosmic-deep-space to-cosmic-void p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          {status === 'loading' && (
            <>
              <div className="text-6xl mb-4">⏳</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifying...</h1>
              <p className="text-gray-600">Please wait while we verify your booking.</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">Booking Verified!</h1>
              <p className="text-gray-600">{message}</p>
              <p className="text-gray-500 text-sm mt-4">
                You will receive a confirmation email shortly. Our team will contact you before your appointment.
              </p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h1>
              <p className="text-gray-600">{message}</p>
              <p className="text-gray-500 text-sm mt-4">
                Please contact our support team if you continue to have issues.
              </p>
            </>
          )}
        </div>
        
        <div className="mt-8">
          <a 
            href="/" 
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            Return to AstroAshi
          </a>
        </div>
      </div>
    </div>
  );
}