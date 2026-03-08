import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { BotMessageSquare, CalendarDays, TrendingUp, ArrowRight } from 'lucide-react';
import UserSnapshotCard from './UserSnapshotCard';
import PersonalDailyPrediction from './PersonalDailyPrediction';
import FocusAreasGrid from './FocusAreasGrid';
import PanchangWidget from './PanchangWidget';
import PredictionTabs from './PredictionTabs';
import FaithDashboardModule from './FaithDashboardModule';
import EmailVerificationBanner from './EmailVerificationBanner';
import { Skeleton } from '@/components/ui/skeleton';
import { Religion } from '@/lib/faithModules';
import { getDailyInspiration } from '@/lib/inspirationData';
import { getUpcomingFestivals, getDaysUntil } from '@/lib/festivalData';
import { Card } from '@/components/ui/card';

interface DashboardData {
  profile: any;
  mahadasha: any;
  panchang: any;
  predictions: any;
}

const PersonalizedDashboard = () => {
  const { user, language } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [profileRes, mahadashaRes, panchangRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('user_mahadasha').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.functions.invoke('get-panchang', {
          body: { date: new Date().toISOString().split('T')[0] }
        })
      ]);

      const { data: predictionData } = await supabase.functions.invoke('generate-personalized-prediction', {
        body: { predictionType: 'daily', language }
      });

      setDashboardData({
        profile: profileRes.data,
        mahadasha: mahadashaRes.data,
        panchang: panchangRes.data,
        predictions: predictionData
      });
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 px-4 py-4 max-w-5xl mx-auto">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-2.5">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
        <Skeleton className="h-36 w-full rounded-2xl" />
      </div>
    );
  }

  const quickActions = [
    {
      icon: BotMessageSquare,
      label: language === 'hi' ? 'AI पूछें' : 'Ask AI',
      desc: language === 'hi' ? 'ज्योतिषीय मार्गदर्शन' : 'Spiritual guidance',
      path: '/ask-astroashi',
      gradient: 'from-primary/15 to-primary/5 border-primary/15 hover:border-primary/30',
      iconColor: 'text-primary',
    },
    {
      icon: CalendarDays,
      label: language === 'hi' ? 'पंचांग' : 'Panchang',
      desc: language === 'hi' ? 'आज का पंचांग' : "Today's almanac",
      path: '/panchang',
      gradient: 'from-cosmic-purple/15 to-cosmic-purple/5 border-cosmic-purple/15 hover:border-cosmic-purple/30',
      iconColor: 'text-cosmic-purple',
    },
    {
      icon: TrendingUp,
      label: language === 'hi' ? 'भविष्यफल' : 'Predictions',
      desc: language === 'hi' ? 'दैनिक भविष्यफल' : 'Daily forecast',
      path: '/predictions',
      gradient: 'from-cosmic-blue/15 to-cosmic-blue/5 border-cosmic-blue/15 hover:border-cosmic-blue/30',
      iconColor: 'text-cosmic-blue',
    },
  ];

  const anim = (delay: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.35 },
  });

  return (
    <motion.div {...anim(0)} className="space-y-4 px-4 py-4 max-w-5xl mx-auto">
      <EmailVerificationBanner />

      {/* Spiritual Snapshot */}
      <motion.div {...anim(0.05)}>
        <UserSnapshotCard
          profile={dashboardData?.profile}
          mahadasha={dashboardData?.mahadasha}
          panchang={dashboardData?.panchang}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div {...anim(0.1)} className="grid grid-cols-3 gap-2.5">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`group flex flex-col items-start gap-1.5 p-3.5 rounded-xl border bg-gradient-to-br transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/[0.04] ${action.gradient}`}
            >
              <Icon className={`w-5 h-5 ${action.iconColor}`} />
              <div>
                <span className="text-xs font-bold text-foreground font-heading block">{action.label}</span>
                <span className="text-[10px] text-muted-foreground hidden sm:block">{action.desc}</span>
              </div>
              <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors mt-auto" />
            </button>
          );
        })}
      </motion.div>

      {/* Spiritual Quick Access */}
      <motion.div {...anim(0.12)}>
        <SpiritualQuickAccess religion={(dashboardData?.profile?.religion as Religion) || 'hindu'} language={language} navigate={navigate} />
      </motion.div>

      {/* Faith Module */}
      <motion.div {...anim(0.15)}>
        <FaithDashboardModule religion={(dashboardData?.profile?.religion as Religion) || 'hindu'} />
      </motion.div>

      {/* Daily Guidance & Panchang */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...anim(0.2)}>
          <PersonalDailyPrediction
            prediction={dashboardData?.predictions}
            profile={dashboardData?.profile}
          />
        </motion.div>
        <motion.div {...anim(0.25)}>
          <PanchangWidget panchang={dashboardData?.panchang} />
        </motion.div>
      </div>

      {/* Life Areas */}
      <motion.div {...anim(0.3)}>
        <FocusAreasGrid
          focusAreas={dashboardData?.predictions?.focus_areas}
          kundliData={dashboardData?.profile?.kundli_data}
        />
      </motion.div>

      {/* Predictions */}
      <motion.div {...anim(0.35)}>
        <PredictionTabs userId={user?.id || ''} />
      </motion.div>
    </motion.div>
  );
};

// Spiritual Quick Access Component
const SpiritualQuickAccess = ({ religion, language, navigate }: { religion: Religion; language: 'en' | 'hi'; navigate: any }) => {
  const quote = getDailyInspiration(religion);
  const nextFestival = getUpcomingFestivals(religion, 1)[0];
  const daysUntil = nextFestival ? getDaysUntil(nextFestival.date) : null;

  const shortcuts = [
    { icon: '⭐', label: language === 'hi' ? 'राशिफल' : 'Horoscope', path: '/daily-horoscope' },
    { icon: '🔮', label: language === 'hi' ? 'कुंडली' : 'Kundli', path: '/kundli-generator' },
    { icon: '💕', label: language === 'hi' ? 'संगतता' : 'Match', path: '/compatibility' },
    { icon: '🤖', label: language === 'hi' ? 'AI गाइड' : 'AI Guide', path: '/spiritual-guide' },
    { icon: '🧘', label: language === 'hi' ? 'ध्यान' : 'Meditate', path: '/meditation' },
    { icon: '🎵', label: language === 'hi' ? 'संगीत' : 'Music', path: '/devotional-music' },
    { icon: '🌙', label: language === 'hi' ? 'नींद' : 'Sleep', path: '/sleep-relaxation' },
    { icon: '🙏', label: language === 'hi' ? 'सद्कर्म' : 'Karma', path: '/karma-tracker' },
    { icon: '📝', label: language === 'hi' ? 'कृतज्ञता' : 'Gratitude', path: '/gratitude-journal' },
    { icon: '✨', label: language === 'hi' ? 'प्रेरणा' : 'Inspire', path: '/daily-inspiration' },
    { icon: '📋', label: language === 'hi' ? 'दिनचर्या' : 'Routine', path: '/spiritual-routine' },
    { icon: '📅', label: language === 'hi' ? 'त्योहार' : 'Festivals', path: '/sacred-calendar' },
    { icon: '💬', label: language === 'hi' ? 'समुदाय' : 'Community', path: '/community' },
    { icon: '📖', label: language === 'hi' ? 'जर्नल' : 'Journal', path: '/cosmic-journal' },
  ];

  return (
    <div className="space-y-3">
      {/* Shortcut buttons */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {shortcuts.map(s => (
          <button key={s.path} onClick={() => navigate(s.path)}
            className="flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all">
            <span className="text-lg">{s.icon}</span>
            <span className="text-[9px] font-medium text-muted-foreground leading-tight text-center">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Daily Quote + Next Festival mini cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <Card className="p-3 cursor-pointer hover:border-primary/30 transition-all" onClick={() => navigate('/daily-inspiration')}>
          <p className="text-[10px] text-muted-foreground mb-1">✨ {language === 'hi' ? 'आज की प्रेरणा' : "Today's Inspiration"}</p>
          <p className="text-xs text-foreground italic line-clamp-2">"{quote.quote[language]}"</p>
          <p className="text-[10px] text-primary mt-1">— {quote.source[language]}</p>
        </Card>
        {nextFestival && (
          <Card className="p-3 cursor-pointer hover:border-primary/30 transition-all" onClick={() => navigate('/sacred-calendar')}>
            <p className="text-[10px] text-muted-foreground mb-1">📅 {language === 'hi' ? 'आगामी त्योहार' : 'Upcoming Festival'}</p>
            <p className="text-xs font-semibold text-foreground">{nextFestival.name[language]}</p>
            <p className="text-[10px] text-primary mt-1">{daysUntil === 0 ? '🎉 Today!' : `${daysUntil} ${language === 'hi' ? 'दिन बाकी' : 'days away'}`}</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PersonalizedDashboard;
