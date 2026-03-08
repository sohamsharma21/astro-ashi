import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { BotMessageSquare, CalendarDays, TrendingUp } from 'lucide-react';
import UserSnapshotCard from './UserSnapshotCard';
import PersonalDailyPrediction from './PersonalDailyPrediction';
import FocusAreasGrid from './FocusAreasGrid';
import PanchangWidget from './PanchangWidget';
import PredictionTabs from './PredictionTabs';
import FaithDashboardModule from './FaithDashboardModule';
import EmailVerificationBanner from './EmailVerificationBanner';
import { Skeleton } from '@/components/ui/skeleton';
import { Religion } from '@/lib/faithModules';

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
      <div className="space-y-5 p-4 max-w-6xl mx-auto">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  const quickActions = [
    {
      icon: BotMessageSquare,
      label: language === 'hi' ? 'AstroAshi AI' : 'Ask AI',
      path: '/ask-astroashi',
      color: 'bg-primary/10 text-primary border-primary/20',
    },
    {
      icon: CalendarDays,
      label: language === 'hi' ? 'पंचांग' : 'Panchang',
      path: '/panchang',
      color: 'bg-cosmic-purple/10 text-cosmic-purple border-cosmic-purple/20',
    },
    {
      icon: TrendingUp,
      label: language === 'hi' ? 'भविष्यफल' : 'Predictions',
      path: '/predictions',
      color: 'bg-cosmic-blue/10 text-cosmic-blue border-cosmic-blue/20',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 p-4 max-w-6xl mx-auto"
    >
      <EmailVerificationBanner />

      {/* User Snapshot */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <UserSnapshotCard
          profile={dashboardData?.profile}
          mahadasha={dashboardData?.mahadasha}
          panchang={dashboardData?.panchang}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 ${action.color}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Faith Module */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <FaithDashboardModule religion={(dashboardData?.profile?.religion as Religion) || 'hindu'} />
      </motion.div>

      {/* Panchang & Prediction Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PanchangWidget panchang={dashboardData?.panchang} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <PersonalDailyPrediction
            prediction={dashboardData?.predictions}
            profile={dashboardData?.profile}
          />
        </motion.div>
      </div>

      {/* Focus Areas */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <FocusAreasGrid
          focusAreas={dashboardData?.predictions?.focus_areas}
          kundliData={dashboardData?.profile?.kundli_data}
        />
      </motion.div>

      {/* Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <PredictionTabs userId={user?.id || ''} />
      </motion.div>
    </motion.div>
  );
};

export default PersonalizedDashboard;
