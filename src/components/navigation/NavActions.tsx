
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, BookOpen, Calendar, MessageSquare, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { getTranslation } from '@/lib/translations';
import { supabase } from '@/integrations/supabase/client';
import NotificationBell from '@/components/notifications/NotificationBell';

interface NavActionsProps {
  menuOpen: boolean;
  onMenuToggle: () => void;
}

export const NavActions = ({ menuOpen, onMenuToggle }: NavActionsProps) => {
  const { user, language, setLanguage, userProfile } = useAuth();
  const isMobile = useIsMobile();

  // Function to get user initials for avatar fallback
  const getUserInitials = () => {
    if (!userProfile?.full_name) return 'U';
    return userProfile.full_name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="flex items-center space-x-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        className="text-cosmic-gold hover:bg-cosmic-deep-space hover:bg-opacity-50"
      >
        {language === 'en' ? 'हिंदी' : 'EN'}
      </Button>

      {user && <NotificationBell />}

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 rounded-full">
              <Avatar className="h-9 w-9 cursor-pointer border border-cosmic-gold border-opacity-40 hover:border-opacity-100 transition-all duration-300">
                <AvatarImage src={userProfile?.avatar_url || ""} alt={userProfile?.full_name || 'User'} />
                <AvatarFallback className="bg-cosmic-violet text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              {!isMobile && (
                <span className="ml-2 text-cosmic-gold">
                  {userProfile?.full_name?.split(' ')[0] || (language === 'en' ? 'Profile' : 'प्रोफाइल')}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-cosmic-deep-space border border-cosmic-gold text-white min-w-[220px] mr-2">
            <DropdownMenuItem className="hover:bg-cosmic-violet hover:bg-opacity-20 cursor-pointer">
              <Link to="/profile" className="flex items-center w-full">
                <Settings className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Settings' : 'सेटिंग्स'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-cosmic-violet hover:bg-opacity-20 cursor-pointer">
              <Link to="/reading-history" className="flex items-center w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Reading History' : 'पठन इतिहास'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-cosmic-violet hover:bg-opacity-20 cursor-pointer">
              <Link to="/daily-horoscope" className="flex items-center w-full">
                <Calendar className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Daily Horoscope' : 'दैनिक राशिफल'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-cosmic-violet hover:bg-opacity-20 cursor-pointer">
              <Link to="/ask-astro" className="flex items-center w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Ask Astro' : 'एस्ट्रो से पूछें'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-cosmic-gold bg-opacity-20" />
            <DropdownMenuItem className="hover:bg-cosmic-violet hover:bg-opacity-20 cursor-pointer" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {getTranslation('navItems', 'signout', language)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to="/auth">
          <Button className="cosmic-button-small" size="sm">
            {language === 'en' ? 'Sign In' : 'साइन इन'}
          </Button>
        </Link>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuToggle}
        className="lg:hidden text-cosmic-gold hover:bg-cosmic-deep-space hover:bg-opacity-50"
      >
        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </div>
  );
};
