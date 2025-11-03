
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
  const [isLogin, setIsLogin] = useState(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success(
          language === 'en' 
            ? 'Successfully signed in!' 
            : 'सफलतापूर्वक साइन इन किया गया!'
        );
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        toast.success(
          language === 'en'
            ? 'Registration successful! Please check your email for verification.'
            : 'पंजीकरण सफल! कृपया सत्यापन के लिए अपना ईमेल जांचें।'
        );
      }
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
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center cosmic-bg px-4">
      <StarBackground starCount={150} />
      <div className="max-w-md w-full space-y-8 p-8 bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg rounded-xl border border-cosmic-gold border-opacity-20">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-cosmic-gold glow-effect">
              <img
                src="/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png"
                alt="AstroAshi Logo"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <h2 className={`text-3xl font-bold text-cosmic-gold font-cinzel ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {isLogin 
              ? (language === 'en' ? 'Welcome Back' : 'वापसी पर स्वागत है')
              : (language === 'en' ? 'Create Account' : 'खाता बनाएं')}
          </h2>
          <p className={`mt-2 text-cosmic-silver ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {isLogin 
              ? (language === 'en' ? 'Enter your details to sign in' : 'साइन इन करने के लिए अपना विवरण दर्ज करें')
              : (language === 'en' ? 'Register for a new account' : 'एक नए खाते के लिए पंजीकरण करें')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cosmic-silver mb-1">
                {language === 'en' ? 'Email Address' : 'ईमेल पता'}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'en' ? 'Email address' : 'ईमेल पता'}
                required
                className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white placeholder:text-cosmic-silver"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-cosmic-silver mb-1">
                {language === 'en' ? 'Password' : 'पासवर्ड'}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === 'en' ? 'Password' : 'पासवर्ड'}
                required
                className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white placeholder:text-cosmic-silver"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full cosmic-button"
          >
            {loading 
              ? (language === 'en' ? 'Please wait...' : 'कृपया प्रतीक्षा करें...')
              : isLogin 
                ? (language === 'en' ? 'Sign In' : 'साइन इन करें')
                : (language === 'en' ? 'Sign Up' : 'साइन अप करें')}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-cosmic-gold opacity-20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-cosmic-deep-space px-2 text-cosmic-silver">
              {language === 'en' ? 'Or continue with' : 'या जारी रखें'}
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 border-cosmic-gold border-opacity-30"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {language === 'en' ? 'Sign in with Google' : 'Google से साइन इन करें'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-cosmic-silver hover:text-cosmic-gold transition-colors"
          >
            {isLogin 
              ? (language === 'en' ? "Don't have an account? Sign Up" : "खाता नहीं है? साइन अप करें")
              : (language === 'en' ? 'Already have an account? Sign In' : 'पहले से ही खाता है? साइन इन करें')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
