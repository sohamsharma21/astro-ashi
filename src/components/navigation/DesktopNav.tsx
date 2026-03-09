import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { getFilteredNavItems, type NavItem } from '@/lib/navigationConfig';
import { ChevronDown, Menu } from 'lucide-react';

const navCategories = [
  { 
    labelEn: 'Astrology', labelHi: 'ज्योतिष',
    paths: ['/', '/daily-horoscope', '/panchang', '/kundli-generator', '/predictions', '/compatibility', '/astro-love']
  },
  { 
    labelEn: 'AI Tools', labelHi: 'AI टूल्स',
    paths: ['/ask-astroashi', '/face-reading', '/palm-reading', '/ai-life-insights', '/personality-test']
  },
  { 
    labelEn: 'Spiritual', labelHi: 'आध्यात्मिक',
    paths: ['/spiritual-guide', '/meditation', '/devotional-music', '/sleep-relaxation', '/spiritual-routine', '/gratitude-journal', '/daily-inspiration', '/karma-tracker']
  },
  { 
    labelEn: 'Explore', labelHi: 'खोजें',
    paths: ['/sacred-calendar', '/community', '/spiritual-knowledge', '/spiritual-progress', '/worship-places', '/life-path', '/spiritual-challenges', '/cosmic-journal', '/reading-history']
  },
  { 
    labelEn: 'More', labelHi: 'और',
    paths: ['/about-us', '/contact-us']
  },
];

export const DesktopNav = () => {
  const { user, language } = useAuth();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navItems = getFilteredNavItems(!!user);
  const navMap = new Map(navItems.map(item => [item.path, item]));

  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const handleEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(label);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenMenu(null), 200);
  };

  return (
    <div ref={menuRef} className="hidden lg:flex items-center gap-0.5">
      {navCategories.map((cat) => {
        const catItems = cat.paths.map(p => navMap.get(p)).filter(Boolean) as NavItem[];
        if (catItems.length === 0) return null;

        const isActive = catItems.some(item => location.pathname === item.path);
        const label = language === 'hi' ? cat.labelHi : cat.labelEn;

        return (
          <div
            key={cat.labelEn}
            className="relative"
            onMouseEnter={() => handleEnter(cat.labelEn)}
            onMouseLeave={handleLeave}
          >
            <button
              className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {label}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openMenu === cat.labelEn ? 'rotate-180' : ''}`} />
            </button>

            {openMenu === cat.labelEn && (
              <div
                className="absolute top-full left-0 mt-1 min-w-[220px] py-2 rounded-xl border border-border/60 bg-popover/95 backdrop-blur-xl shadow-xl shadow-background/30 z-50 animate-fade-in"
                onMouseEnter={() => handleEnter(cat.labelEn)}
                onMouseLeave={handleLeave}
              >
                {catItems.map((item) => {
                  const Icon = item.icon;
                  const itemActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                        itemActive
                          ? 'text-primary bg-primary/10'
                          : 'text-foreground/80 hover:text-primary hover:bg-muted/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
