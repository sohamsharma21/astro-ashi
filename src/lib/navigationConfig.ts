import { 
  Home, 
  Calendar, 
  Sparkles, 
  Heart, 
  HeartHandshake, 
  MessageSquare, 
  Phone, 
  BookOpen, 
  Info, 
  Mail,
  CalendarDays,
  TrendingUp,
  Video,
  Settings,
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
    path: '/ask-astro',
    labelEn: 'Ask Astro',
    labelHi: 'पूछें',
    icon: MessageSquare,
    requiresAuth: true,
    showWhenLoggedOut: false
  },
  {
    path: '/consultations',
    labelEn: 'Consultations',
    labelHi: 'परामर्श',
    icon: Phone,
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
    path: '/live-consultation',
    labelEn: 'Live Chat',
    labelHi: 'लाइव चैट',
    icon: Video,
    requiresAuth: true,
    showWhenLoggedOut: false
  },
  {
    path: '/settings',
    labelEn: 'Settings',
    labelHi: 'सेटिंग्स',
    icon: Settings,
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
      // Show all items when logged in, except hide public-only pages like About/Contact to reduce clutter
      return item.requiresAuth || item.path === '/' || item.path === '/panchang';
    }
    return item.showWhenLoggedOut;
  });
};
