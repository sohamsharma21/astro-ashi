
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { NavigationPreferences } from './NavigationPreferences';

const AccountSection = () => {
  const { user, language } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      toast.success(
        language === 'en' 
          ? 'Successfully signed out' 
          : 'सफलतापूर्वक साइन आउट किया गया'
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <NavigationPreferences />
      
      <div className="bg-cosmic-deep-space border border-cosmic-gold border-opacity-30 rounded-lg p-6 space-y-6">
        <div>
          <h3 className={`text-lg font-medium text-white mb-2 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en' ? 'Email Address' : 'ईमेल पता'}
          </h3>
          <p className="text-gray-300">{user?.email}</p>
        </div>
        
        <div>
          <h3 className={`text-lg font-medium text-white mb-4 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en' ? 'Sign Out' : 'साइन आउट करें'}
          </h3>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`bg-red-900 hover:bg-red-800 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === 'en' ? 'Signing out...' : 'साइन आउट हो रहा है...'}
              </>
            ) : (
              language === 'en' ? 'Sign Out' : 'साइन आउट'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSection;
