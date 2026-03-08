import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StarBackground from '@/components/StarBackground';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-email?token=${token}`
        );
        if (res.ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="cosmic-bg min-h-screen flex items-center justify-center">
      <StarBackground starCount={80} />
      <div className="text-center space-y-6 p-8 max-w-md mx-auto relative z-10">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
            <h1 className="text-2xl font-cinzel text-foreground">Verifying your email...</h1>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
            <h1 className="text-2xl font-cinzel text-foreground">Email Verified!</h1>
            <p className="text-muted-foreground">Your email has been verified. You now have full access to AstroAshi.</p>
            <Button asChild className="cosmic-button">
              <Link to="/">Go to Dashboard</Link>
            </Button>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-cinzel text-foreground">Verification Failed</h1>
            <p className="text-muted-foreground">This link may be expired or invalid. Please request a new verification email.</p>
            <Button asChild variant="outline">
              <Link to="/">Go to Dashboard</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
