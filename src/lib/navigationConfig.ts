import { 
  Home, 
  Calendar, 
  Sparkles, 
  Heart, 
  HeartHandshake, 
  BotMessageSquare,
  BookOpen, 
  Info, 
  Mail,
  CalendarDays,
  TrendingUp,
  Leaf,
  BookOpenCheck,
  MessageSquareQuote,
  ListChecks,
  Star,
  type LucideIcon 
} from 'lucide-react';

export interface NavItem {
  path: string;
  labelEn: string;
  labelHi: string;
  icon: LucideIcon;
  requiresAuth: boolean;
  showWhenLoggedOut?: boolean;
}

export const navigationConfig: NavItem[] = [
  {
    path: '/',
    labelEn: 'Home',
    labelHi: 'होम',
    icon: Home,
    requiresAuth: false,
    showWhenLoggedOut: true
  },
  {
    path: '/daily-horoscope',
    labelEn: 'Horoscope',
    labelHi: 'राशिफल',
    icon: Calendar,
    requiresAuth: true,
    showWhenLoggedOut: false
  },
  {
    path: '/panchang',
    labelEn: 'Panchang',
    labelHi: 'पंचांग',
    icon: CalendarDays,
    requiresAuth: false,
    showWhenLoggedOut: true
  },
  {
    path: '/kundli-generator',
    labelEn: 'Kundli',
    labelHi: 'कुंडली',
    icon: Sparkles,
    requiresAuth: true,
    showWhenLoggedOut: false
  },
  {
    path: '/compatibility',
    labelEn: 'Compatibility',
    labelHi: 'संगतता',
    icon: HeartHandshake,
    requiresAuth: true,
    showWhenLoggedOut: false
  },
  {
    path: '/astro-love',
    labelEn: 'AstroLove',
    labelHi: 'एस्ट्रोलव',
    icon: Heart,
    requiresAuth: true,
    showWhenLoggedOut: false
  },
  {
    path: '/ask-astroashi',
    labelEn: 'AstroAshi AI',
    labelHi: 'AstroAshi AI',
    icon: BotMessageSquare,
    requiresAuth: true,
    showWhenLoggedOut: false
  },
  {
    path: '/reading-history',
    labelEn: 'History',
    labelHi: 'इतिहास',
    icon: BookOpen,
    requiresAuth: true,
    showWhenLoggedOut: false
  },
  {
    path: '/predictions',
    labelEn: 'Predictions',
    labelHi: 'भविष्यफल',
    icon: TrendingUp,
    requiresAuth: true,
    showWhenLoggedOut: false
  },
  {
    path: '/meditation',
    labelEn: 'Meditation',
    labelHi: 'ध्यान',
    icon: Leaf,
    requiresAuth: true,
    showWhenLoggedOut: false
  },
  {
    path: '/gratitude-journal',
    labelEn: 'Gratitude',
    labelHi: 'कृतज्ञता',
    icon: BookOpenCheck,
    requiresAuth: true,
    showWhenLoggedOut: false
  },
  {
    path: '/daily-inspiration',
    labelEn: 'Inspiration',
    labelHi: 'प्रेरणा',
    icon: MessageSquareQuote,
    requiresAuth: true,
    showWhenLoggedOut: false
  },
  {
    path: '/spiritual-routine',
    labelEn: 'Routine',
    labelHi: 'दिनचर्या',
    icon: ListChecks,
    requiresAuth: true,
    showWhenLoggedOut: false
  },
  {
    path: '/sacred-calendar',
    labelEn: 'Festivals',
    labelHi: 'त्योहार',
    icon: CalendarHeart,
    requiresAuth: true,
    showWhenLoggedOut: false
  },
  {
    path: '/about-us',
    labelEn: 'About',
    labelHi: 'हमारे बारे में',
    icon: Info,
    requiresAuth: false,
    showWhenLoggedOut: true
  },
  {
    path: '/contact-us',
    labelEn: 'Contact',
    labelHi: 'संपर्क',
    icon: Mail,
    requiresAuth: false,
    showWhenLoggedOut: true
  }
];

export type NavDisplayMode = 'icons' | 'text' | 'both';

export const getFilteredNavItems = (isAuthenticated: boolean): NavItem[] => {
  return navigationConfig.filter(item => {
    if (isAuthenticated) {
      return item.requiresAuth || item.path === '/' || item.path === '/panchang';
    }
    return item.showWhenLoggedOut;
  });
};
