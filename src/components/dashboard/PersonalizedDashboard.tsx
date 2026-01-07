import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import UserSnapshotCard from './UserSnapshotCard';
import PersonalDailyPrediction from './PersonalDailyPrediction';
import FocusAreasGrid from './FocusAreasGrid';
import PanchangWidget from './PanchangWidget';
import PredictionTabs from './PredictionTabs';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardData {
  profile: any;
  mahadasha: any;
  panchang: any;
  predictions: any;
}

const PersonalizedDashboard = () => {
  const { user, language } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch profile, mahadasha, and panchang in parallel
      const [profileRes, mahadashaRes, panchangRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single(),
        supabase
          .from('user_mahadasha')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase.functions.invoke('get-panchang', {
          body: { date: new Date().toISOString().split('T')[0] }
        })
      ]);

      // Generate personalized prediction
      const { data: predictionData } = await supabase.functions.invoke('generate-personalized-prediction', {
        body: {
          userId: user.id,
          predictionType: 'daily',
          language
        }
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
      <div className="space-y-6 p-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4 max-w-7xl mx-auto"
    >
      {/* User Snapshot Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <UserSnapshotCard
          profile={dashboardData?.profile}
          mahadasha={dashboardData?.mahadasha}
          panchang={dashboardData?.panchang}
        />
      </motion.div>

      {/* Panchang & Daily Prediction Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PanchangWidget panchang={dashboardData?.panchang} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PersonalDailyPrediction
            prediction={dashboardData?.predictions}
            profile={dashboardData?.profile}
          />
        </motion.div>
      </div>

      {/* Focus Areas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <FocusAreasGrid
          focusAreas={dashboardData?.predictions?.focus_areas}
          kundliData={dashboardData?.profile?.kundli_data}
        />
      </motion.div>

      {/* Prediction Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <PredictionTabs userId={user?.id || ''} />
      </motion.div>
    </motion.div>
  );
};

export default PersonalizedDashboard;
