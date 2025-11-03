import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { NavDisplayMode } from '@/lib/navigationConfig';

export const useNavPreference = () => {
  const { user } = useAuth();
  const [navDisplayMode, setNavDisplayMode] = useState<NavDisplayMode>('icons');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreference = async () => {
      if (user) {
        try {
          // Load from database
          const { data, error } = await supabase
            .from('profiles')
            .select('nav_display_mode')
            .eq('id', user.id)
            .single();
          
          if (!error && data && 'nav_display_mode' in data) {
            setNavDisplayMode((data as any).nav_display_mode as NavDisplayMode);
          }
        } catch (error) {
          console.error('Error loading nav preference:', error);
        }
      } else {
        // Load from localStorage for non-authenticated users
        const savedMode = localStorage.getItem('nav_display_mode') as NavDisplayMode;
        if (savedMode && ['icons', 'text', 'both'].includes(savedMode)) {
          setNavDisplayMode(savedMode);
        }
      }
      setLoading(false);
    };

    loadPreference();
  }, [user]);

  const updateNavPreference = async (mode: NavDisplayMode) => {
    setNavDisplayMode(mode);
    
    if (user) {
      try {
        // Save to database
        await supabase
          .from('profiles')
          .update({ nav_display_mode: mode } as any)
          .eq('id', user.id);
      } catch (error) {
        console.error('Error saving nav preference:', error);
      }
    } else {
      // Save to localStorage
      localStorage.setItem('nav_display_mode', mode);
    }
  };

  return { navDisplayMode, updateNavPreference, loading };
};
