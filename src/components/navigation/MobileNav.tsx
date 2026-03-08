import { useAuth } from '@/lib/auth';
import { Link, useLocation } from 'react-router-dom';
import { getFilteredNavItems } from '@/lib/navigationConfig';

interface MobileNavProps {
  isOpen: boolean;
}

export const MobileNav = ({ isOpen }: MobileNavProps) => {
  const { user, language } = useAuth();
  const location = useLocation();

  if (!isOpen) return null;

  const navItems = getFilteredNavItems(!!user);

  return (
    <div className="lg:hidden glass border-t border-border/50 animate-fade-in">
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-2 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const label = language === 'en' ? item.labelEn : item.labelHi;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-primary bg-primary/10 border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
          {!user && (
            <Link
              to="/auth"
              className="flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-xl text-primary hover:bg-primary/10"
            >
              <span>{language === 'en' ? 'Sign In' : 'साइन इन'}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
