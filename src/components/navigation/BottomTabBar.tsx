import { Link, useLocation } from 'react-router-dom';
import { Home, BotMessageSquare, TrendingUp, CalendarDays, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';

const tabs = [
  { path: '/', icon: Home, labelEn: 'Home', labelHi: 'होम' },
  { path: '/ask-astroashi', icon: BotMessageSquare, labelEn: 'Ask AI', labelHi: 'AI पूछें' },
  { path: '/predictions', icon: TrendingUp, labelEn: 'Predictions', labelHi: 'भविष्यफल' },
  { path: '/panchang', icon: CalendarDays, labelEn: 'Panchang', labelHi: 'पंचांग' },
  { path: '/profile', icon: User, labelEn: 'Profile', labelHi: 'प्रोफ़ाइल' },
];

export const BottomTabBar = () => {
  const { user, language } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="glass border-t border-border/40 backdrop-blur-xl bg-background/80">
        <div className="flex items-center justify-around px-1 pb-[env(safe-area-inset-bottom)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            const label = language === 'en' ? tab.labelEn : tab.labelHi;

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="relative flex flex-col items-center justify-center py-2 px-3 min-w-[64px] group"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomTabIndicator"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.75, y: -2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15, mass: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <Icon
                      className={`h-5 w-5 transition-colors duration-200 ${
                        isActive ? 'text-primary' : 'text-muted-foreground group-active:text-foreground'
                      }`}
                    />
                  </motion.div>
                  <span
                    className={`text-[10px] mt-0.5 font-medium transition-colors duration-200 ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
