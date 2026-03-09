
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import StarBackground from '@/components/StarBackground';
import { Separator } from '@/components/ui/separator';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, language } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success(language === 'en' ? 'Successfully signed in!' : 'सफलतापूर्वक साइन इन किया गया!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/` }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center cosmic-bg px-4 sm:px-6">
      <StarBackground starCount={150} />
      <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8 p-6 sm:p-8 bg-card/80 backdrop-blur-lg rounded-xl border border-border/30">
        <div className="text-center">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-primary/30 glow-effect">
              <img
                src="/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png"
                alt="AstroAshi Logo"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-bold text-gradient-gold font-heading ${language === 'hi' ? 'font-hindi' : ''}`}>
            {language === 'en' ? 'Welcome to AstroAshi' : 'AstroAshi में आपका स्वागत है'}
          </h2>
          <p className={`mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground ${language === 'hi' ? 'font-hindi' : ''}`}>
            {language === 'en' ? 'Sign in or create your account' : 'साइन इन करें या अपना खाता बनाएं'}
          </p>
        </div>

        {/* Google - Primary */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 border-border/30 py-5 sm:py-6 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {language === 'en' ? 'Continue with Google' : 'Google से जारी रखें'}
        </Button>

        <p className="text-center text-[10px] sm:text-xs text-muted-foreground">
          {language === 'en' ? 'New users will be automatically registered' : 'नए उपयोगकर्ता स्वचालित रूप से पंजीकृत होंगे'}
        </p>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-border/20" />
          </div>
          <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {language === 'en' ? 'Or sign in with email' : 'या ईमेल से साइन इन करें'}
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">
              {language === 'en' ? 'Email Address' : 'ईमेल पता'}
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'en' ? 'Email address' : 'ईमेल पता'}
              required
              className="bg-muted/20 border-border/30 text-foreground placeholder:text-muted-foreground/50"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">
              {language === 'en' ? 'Password' : 'पासवर्ड'}
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'en' ? 'Password' : 'पासवर्ड'}
              required
              className="bg-muted/20 border-border/30 text-foreground placeholder:text-muted-foreground/50"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full cosmic-button">
            {loading
              ? (language === 'en' ? 'Please wait...' : 'कृपया प्रतीक्षा करें...')
              : (language === 'en' ? 'Sign In' : 'साइन इन करें')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
