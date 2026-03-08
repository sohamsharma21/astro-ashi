import { useAuth } from '@/lib/auth';
import { IconNavLink } from './IconNavLink';
import { getFilteredNavItems } from '@/lib/navigationConfig';
import { useNavPreference } from '@/hooks/useNavPreference';

export const DesktopNav = () => {
  const { user, language } = useAuth();
  const { navDisplayMode, loading } = useNavPreference();

  if (loading) return null;

  const navItems = getFilteredNavItems(!!user);

  return (
    <div className="hidden lg:flex items-center gap-0.5">
      {navItems.map((item) => (
        <IconNavLink
          key={item.path}
          to={item.path}
          icon={item.icon}
          label={language === 'en' ? item.labelEn : item.labelHi}
          displayMode={navDisplayMode}
        />
      ))}
    </div>
  );
};
