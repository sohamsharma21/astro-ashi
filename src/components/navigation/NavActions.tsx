
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, BookOpen, Calendar, MessageSquare, Settings, BotMessageSquare } from 'lucide-react';
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
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        className="text-muted-foreground hover:text-foreground hover:bg-muted/50 text-xs font-medium rounded-full px-3"
      >
        {language === 'en' ? 'हिं' : 'EN'}
      </Button>

      {user && <NotificationBell />}

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 rounded-full hover:ring-2 hover:ring-primary/30 transition-all">
              <Avatar className="h-8 w-8 cursor-pointer border border-border hover:border-primary/50 transition-all duration-300">
                <AvatarImage src={userProfile?.avatar_url || ""} alt={userProfile?.full_name || 'User'} />
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass border-border/50 min-w-[200px] mr-2 p-1.5">
            <DropdownMenuItem className="hover:bg-muted/50 cursor-pointer rounded-lg">
              <Link to="/profile" className="flex items-center w-full gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>{language === 'en' ? 'Settings' : 'सेटिंग्स'}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted/50 cursor-pointer rounded-lg">
              <Link to="/ask-astroashi" className="flex items-center w-full gap-2">
                <BotMessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>AstroAshi AI</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted/50 cursor-pointer rounded-lg">
              <Link to="/reading-history" className="flex items-center w-full gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{language === 'en' ? 'History' : 'इतिहास'}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted/50 cursor-pointer rounded-lg">
              <Link to="/daily-horoscope" className="flex items-center w-full gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{language === 'en' ? 'Horoscope' : 'राशिफल'}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/30 my-1" />
            <DropdownMenuItem className="hover:bg-destructive/10 cursor-pointer rounded-lg text-destructive" onClick={handleSignOut}>
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
        className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full"
      >
        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    </div>
  );
};
