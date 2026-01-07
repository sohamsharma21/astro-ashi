
import { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext, UserProfile } from '@/lib/auth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from '@/hooks/use-toast';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [language, setLanguage] = useState<'en' | 'hi'>(
    localStorage.getItem('preferred_language') === 'hi' ? 'hi' : 'en'
  );
  const [loading, setLoading] = useState(true);
  
  // Use our custom hook to manage user profile data
  const { 
    profile: userProfile, 
    loading: profileLoading, 
    updateProfile,
    refetchProfile 
  } = useUserProfile(user?.id, language);
  
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        toast({
          title: language === 'en' ? 'Signed Out' : 'साइन आउट',
          description: language === 'en' 
            ? 'You have been signed out successfully' 
            : 'आप सफलतापूर्वक साइन आउट हो गए हैं'
        });
      } else if (currentSession?.user && event === 'SIGNED_IN') {
        setUser(currentSession.user);
        setSession(currentSession);
        
        toast({
          title: language === 'en' ? 'Signed In' : 'साइन इन',
          description: language === 'en'
            ? 'Welcome back!'
            : 'वापसी पर स्वागत है!'
        });
        
        // Send welcome email for Google sign-in
        const provider = currentSession.user.app_metadata?.provider;
        if (provider === 'google') {
          setTimeout(async () => {
            try {
              await supabase.functions.invoke('send-welcome-email', {
                body: {
                  email: currentSession.user.email,
                  name: currentSession.user.user_metadata?.full_name || currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0],
                  language: language
                }
              });
            } catch (error) {
              // Non-critical
            }
          }, 0);
        }
      } else if (currentSession?.user && event === 'USER_UPDATED') {
        // Send welcome email after email verification
        const wasJustVerified = currentSession.user.email_confirmed_at && 
                               !currentSession.user.app_metadata?.provider;
        
        if (wasJustVerified) {
          setTimeout(async () => {
            try {
              await supabase.functions.invoke('send-welcome-email', {
                body: {
                  email: currentSession.user.email,
                  name: currentSession.user.user_metadata?.full_name || currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0],
                  language: language
                }
              });
            } catch (error) {
              // Non-critical
            }
          }, 0);
        }
      }
    });

    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
        setSession(data.session);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSetLanguage = (newLanguage: 'en' | 'hi') => {
    setLanguage(newLanguage);
    localStorage.setItem('preferred_language', newLanguage);
    
    // Update user's preferred language in database if they're logged in
    if (user) {
      updateUserProfile({ preferred_language: newLanguage });
    }
  };
  
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      await updateProfile(updates);
      
      // If the language was updated in the profile, also update it in local state
      if (updates.preferred_language && updates.preferred_language !== language) {
        setLanguage(updates.preferred_language);
        localStorage.setItem('preferred_language', updates.preferred_language);
      }
      
      // Refetch profile to ensure we have the latest data
      await refetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Final loading state combines auth and profile loading
  const isLoading = loading || (user && profileLoading);

  // Check if user needs Kundli onboarding
  const needsKundliOnboarding = Boolean(user && userProfile && !userProfile.kundli_generated);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        language,
        setLanguage: handleSetLanguage,
        userProfile,
        updateUserProfile,
        refetchProfile,
        loading: isLoading,
        needsKundliOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
