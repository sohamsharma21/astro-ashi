import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, BarChart3, Clock, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';
import { getRoutinesForReligion, RoutineItem } from '@/lib/spiritualRoutineData';
import { Religion } from '@/lib/faithModules';

const SpiritualRoutine = () => {
  const { user, userProfile, language } = useAuth();
  const { toast } = useToast();
  const religion = (userProfile?.religion as Religion) || 'hindu';
  const routines = getRoutinesForReligion(religion);
  const today = format(new Date(), 'yyyy-MM-dd');

  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [weekData, setWeekData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const weekAgo = format(subDays(new Date(), 6), 'yyyy-MM-dd');
    const { data } = await supabase.from('spiritual_routine_logs').select('*').eq('user_id', user.id).gte('completed_date', weekAgo);
    const logs = data || [];
    setCompletedToday(logs.filter((l: any) => l.completed_date === today).map((l: any) => l.routine_key));
    // Weekly data
    const wd: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
      wd[d] = logs.filter((l: any) => l.completed_date === d).length;
    }
    setWeekData(wd);
    setLoading(false);
  }, [user, today]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const toggleRoutine = async (key: string) => {
    if (!user) return;
    if (completedToday.includes(key)) {
      await supabase.from('spiritual_routine_logs').delete().eq('user_id', user.id).eq('routine_key', key).eq('completed_date', today);
      setCompletedToday(prev => prev.filter(k => k !== key));
    } else {
      await supabase.from('spiritual_routine_logs').insert({ user_id: user.id, routine_key: key, completed_date: today });
      setCompletedToday(prev => [...prev, key]);
      toast({ title: language === 'hi' ? '✅ पूर्ण!' : '✅ Completed!' });
    }
    fetchLogs();
  };

  const progress = routines.length > 0 ? (completedToday.length / routines.length) * 100 : 0;
  const maxWeek = Math.max(...Object.values(weekData), 1);

  const t = {
    en: { title: 'Spiritual Routine Planner', today: "Today's Progress", weekly: '7-Day Progress', completed: 'completed' },
    hi: { title: 'आध्यात्मिक दिनचर्या', today: 'आज की प्रगति', weekly: '7-दिन की प्रगति', completed: 'पूर्ण' },
  };
  const tr = t[language] || t.en;

  return (
    <>
      <SEOHead title="Spiritual Routine - AstroAshi" description="Plan and track your daily spiritual practices." canonical="/spiritual-routine" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={100} />
        <Navigation />
        <main className="pt-20 pb-24 px-4 max-w-2xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
            🙏 {tr.title}
          </motion.h1>

          {/* Today's Progress */}
          <Card className="p-4 mb-6 mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{tr.today}</span>
              <span className="text-sm text-primary font-bold">{completedToday.length}/{routines.length} {tr.completed}</span>
            </div>
            <Progress value={progress} className="h-3" />
          </Card>

          {/* Routines */}
          <div className="space-y-3 mb-8">
            {routines.map((r, i) => {
              const done = completedToday.includes(r.key);
              return (
                <motion.div key={r.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className={`p-4 flex items-center gap-4 cursor-pointer transition-all ${done ? 'border-primary/40 bg-primary/5' : 'hover:border-border/80'}`}
                    onClick={() => toggleRoutine(r.key)}>
                    <button className="shrink-0">
                      {done ? <CheckCircle2 className="w-6 h-6 text-primary" /> : <Circle className="w-6 h-6 text-muted-foreground" />}
                    </button>
                    <span className="text-2xl">{r.icon}</span>
                    <div className="flex-1">
                      <h3 className={`font-medium ${done ? 'text-primary line-through' : 'text-foreground'}`}>{r.label[language]}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {r.defaultTime}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Weekly Chart */}
          <Card className="p-4">
            <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /> {tr.weekly}</h3>
            <div className="flex items-end gap-2 h-24">
              {Object.entries(weekData).map(([date, count]) => (
                <div key={date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-primary/20 rounded-t-sm relative" style={{ height: `${(count / maxWeek) * 80}px`, minHeight: '4px' }}>
                    <div className="absolute inset-0 bg-primary rounded-t-sm" style={{ height: `${(count / maxWeek) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{format(new Date(date), 'EEE').slice(0, 2)}</span>
                </div>
              ))}
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default SpiritualRoutine;
