import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Award, Flame } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { badgeDefinitions } from '@/lib/spiritualBadgesData';
import { format, subDays, differenceInCalendarDays } from 'date-fns';

const SpiritualProgress = () => {
  const { user, language } = useAuth();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [stats, setStats] = useState({ meditation: 0, prayer: 0, gratitude: 0, karma: 0, scripture: 0, routine: 0 });
  const [streaks, setStreaks] = useState({ meditation: 0, prayer: 0, routine: 0 });
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const today = format(new Date(), 'yyyy-MM-dd');

  const getDateRange = useCallback(() => {
    if (period === 'daily') return { from: today, to: today };
    if (period === 'weekly') return { from: format(subDays(new Date(), 6), 'yyyy-MM-dd'), to: today };
    return { from: format(subDays(new Date(), 29), 'yyyy-MM-dd'), to: today };
  }, [period, today]);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { from, to } = getDateRange();

    const [routineRes, karmaRes, gratitudeRes, growthRes, badgesRes] = await Promise.all([
      supabase.from('spiritual_routine_logs').select('*').eq('user_id', user.id).gte('completed_date', from).lte('completed_date', to),
      supabase.from('karma_deeds').select('*').eq('user_id', user.id).gte('completed_date', from).lte('completed_date', to),
      supabase.from('gratitude_entries').select('*').eq('user_id', user.id).gte('entry_date', from).lte('entry_date', to),
      supabase.from('spiritual_growth_logs').select('*').eq('user_id', user.id).gte('completed_date', from).lte('completed_date', to),
      supabase.from('spiritual_badges').select('badge_key').eq('user_id', user.id),
    ]);

    const routineLogs = routineRes.data || [];
    const karmaLogs = karmaRes.data || [];
    const gratitudeLogs = gratitudeRes.data || [];
    const growthLogs = growthRes.data || [];

    // Count by type
    const meditationKeys = ['meditation', 'morning-meditation', 'evening-meditation', 'samayik'];
    const prayerKeys = ['morning-puja', 'evening-aarti', 'fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'morning-prayer', 'evening-prayer', 'japji-sahib', 'rehras-sahib', 'pratikraman'];

    setStats({
      meditation: routineLogs.filter((l: any) => meditationKeys.some(k => l.routine_key.includes(k))).length + growthLogs.filter((l: any) => l.activity_type === 'meditation').length,
      prayer: routineLogs.filter((l: any) => prayerKeys.some(k => l.routine_key.includes(k))).length + growthLogs.filter((l: any) => l.activity_type === 'prayer').length,
      gratitude: gratitudeLogs.length,
      karma: karmaLogs.length,
      scripture: growthLogs.filter((l: any) => l.activity_type === 'scripture_reading').length,
      routine: new Set(routineLogs.map((l: any) => l.completed_date)).size,
    });

    setEarnedBadges((badgesRes.data || []).map((b: any) => b.badge_key));

    // Calculate streaks (simple: count consecutive days backward from today)
    const allRoutineDates = (await supabase.from('spiritual_routine_logs').select('completed_date').eq('user_id', user.id).order('completed_date', { ascending: false }).limit(365)).data || [];
    const uniqueDates = [...new Set(allRoutineDates.map((d: any) => d.completed_date))].sort().reverse();

    let routineStreak = 0;
    for (let i = 0; i < uniqueDates.length; i++) {
      const expected = format(subDays(new Date(), i), 'yyyy-MM-dd');
      if (uniqueDates[i] === expected) routineStreak++;
      else break;
    }
    setStreaks({ meditation: Math.min(routineStreak, 999), prayer: Math.min(routineStreak, 999), routine: routineStreak });
    setLoading(false);
  }, [user, getDateRange]);

  useEffect(() => { loadData(); }, [loadData]);

  // Check and award badges
  useEffect(() => {
    if (!user || loading) return;
    const checkBadges = async () => {
      const totalKarma = (await supabase.from('karma_deeds').select('id', { count: 'exact', head: true }).eq('user_id', user.id)).count || 0;
      const totalGratitude = (await supabase.from('gratitude_entries').select('id', { count: 'exact', head: true }).eq('user_id', user.id)).count || 0;

      for (const badge of badgeDefinitions) {
        if (earnedBadges.includes(badge.key)) continue;
        let earned = false;
        if (badge.category === 'routine' && badge.thresholdType === 'streak') earned = streaks.routine >= badge.threshold;
        if (badge.category === 'meditation' && badge.thresholdType === 'streak') earned = streaks.meditation >= badge.threshold;
        if (badge.category === 'prayer' && badge.thresholdType === 'streak') earned = streaks.prayer >= badge.threshold;
        if (badge.category === 'karma' && badge.thresholdType === 'total') earned = totalKarma >= badge.threshold;
        if (badge.category === 'gratitude' && badge.thresholdType === 'total') earned = totalGratitude >= badge.threshold;
        if (earned) {
          await supabase.from('spiritual_badges').insert({ user_id: user.id, badge_key: badge.key }).onConflict('user_id,badge_key' as any).select();
          setEarnedBadges(prev => [...prev, badge.key]);
        }
      }
    };
    checkBadges();
  }, [user, loading, streaks, earnedBadges]);

  const t = {
    en: { title: 'Spiritual Progress', daily: 'Today', weekly: 'This Week', monthly: 'This Month', streak: 'Day Streak', badges: 'Achievements', meditation: 'Meditation', prayer: 'Prayer', gratitude: 'Gratitude', karma: 'Good Deeds', scripture: 'Scripture', routine: 'Routine Days', earned: 'Earned', locked: 'Locked' },
    hi: { title: 'आध्यात्मिक प्रगति', daily: 'आज', weekly: 'इस सप्ताह', monthly: 'इस माह', streak: 'दिन स्ट्रीक', badges: 'उपलब्धियां', meditation: 'ध्यान', prayer: 'प्रार्थना', gratitude: 'कृतज्ञता', karma: 'सद्कर्म', scripture: 'पठन', routine: 'दिनचर्या दिन', earned: 'अर्जित', locked: 'लॉक' },
  };
  const tr = t[language] || t.en;

  const activities = [
    { key: 'meditation', icon: '🧘', label: tr.meditation, count: stats.meditation, color: 'bg-purple-500' },
    { key: 'prayer', icon: '🙏', label: tr.prayer, count: stats.prayer, color: 'bg-blue-500' },
    { key: 'gratitude', icon: '📝', label: tr.gratitude, count: stats.gratitude, color: 'bg-green-500' },
    { key: 'karma', icon: '💚', label: tr.karma, count: stats.karma, color: 'bg-emerald-500' },
    { key: 'scripture', icon: '📖', label: tr.scripture, count: stats.scripture, color: 'bg-amber-500' },
    { key: 'routine', icon: '✅', label: tr.routine, count: stats.routine, color: 'bg-primary' },
  ];

  const maxCount = Math.max(...activities.map(a => a.count), 1);

  return (
    <>
      <SEOHead title="Spiritual Progress - AstroAshi" description="Track your spiritual growth with streaks, badges and progress." canonical="/spiritual-progress" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={100} />
        <Navigation />
        <main className="pt-20 pb-24 px-4 max-w-2xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-6">
            📊 {tr.title}
          </motion.h1>

          {/* Streak Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-5 mb-6 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <Flame className="w-10 h-10 text-primary mx-auto mb-2" />
              <p className="text-4xl font-extrabold text-primary">{streaks.routine}</p>
              <p className="text-sm text-muted-foreground">{tr.streak}</p>
            </Card>
          </motion.div>

          {/* Period Tabs */}
          <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="mb-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="daily">{tr.daily}</TabsTrigger>
              <TabsTrigger value="weekly">{tr.weekly}</TabsTrigger>
              <TabsTrigger value="monthly">{tr.monthly}</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Activity Progress */}
          <div className="space-y-3 mb-8">
            {activities.map((a, i) => (
              <motion.div key={a.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <span className="text-lg">{a.icon}</span> {a.label}
                    </span>
                    <span className="text-sm font-bold text-primary">{a.count}</span>
                  </div>
                  <Progress value={(a.count / maxCount) * 100} className="h-2" />
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Badges */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" /> {tr.badges}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {badgeDefinitions.map((badge) => {
                const isEarned = earnedBadges.includes(badge.key);
                return (
                  <Card key={badge.key} className={`p-3 text-center transition-all ${isEarned ? 'border-primary/40 bg-primary/5' : 'opacity-40 grayscale'}`}>
                    <span className="text-2xl block mb-1">{badge.icon}</span>
                    <p className="text-[10px] font-medium text-foreground leading-tight">{badge.label[language]}</p>
                    <Badge variant={isEarned ? 'default' : 'secondary'} className="mt-1 text-[8px] px-1.5">
                      {isEarned ? tr.earned : tr.locked}
                    </Badge>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default SpiritualProgress;
