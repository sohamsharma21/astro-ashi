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
    <div className="lg:hidden bg-cosmic-deep-space bg-opacity-95 backdrop-blur-lg border-t border-cosmic-gold border-opacity-20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const label = language === 'en' ? item.labelEn : item.labelHi;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-md transition-all duration-300 ${
                  isActive
                    ? 'text-cosmic-gold bg-cosmic-violet bg-opacity-20'
                    : 'text-white hover:text-cosmic-gold hover:bg-cosmic-deep-space hover:bg-opacity-40'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
          {!user && (
            <Link
              to="/auth"
              className="flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-md text-white hover:text-cosmic-gold hover:bg-cosmic-deep-space hover:bg-opacity-40"
            >
              <span>{language === 'en' ? 'Sign In' : 'साइन इन'}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
