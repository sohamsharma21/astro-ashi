import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, Trophy, TrendingUp } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { getDailyDeeds } from '@/lib/karmaData';
import { SEOHead } from '@/components/SEOHead';

const KarmaTracker = () => {
  const { user, language, userProfile } = useAuth();
  const [completedDeeds, setCompletedDeeds] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [weeklyPoints, setWeeklyPoints] = useState(0);

  const religion = (userProfile as any)?.religion || 'other';
  const dailyDeeds = useMemo(() => getDailyDeeds(religion), [religion]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    // Today's completed deeds
    const { data: todayDeeds } = await supabase
      .from('karma_deeds')
      .select('deed_key, points')
      .eq('user_id', user.id)
      .eq('completed_date', today);
    if (todayDeeds) {
      setCompletedDeeds(todayDeeds.map(d => d.deed_key));
    }

    // Total points
    const { data: allDeeds } = await supabase
      .from('karma_deeds')
      .select('points, completed_date')
      .eq('user_id', user.id);
    if (allDeeds) {
      setTotalPoints(allDeeds.reduce((sum, d) => sum + d.points, 0));
      // Weekly
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      const weekStr = weekAgo.toISOString().split('T')[0];
      setWeeklyPoints(allDeeds.filter(d => d.completed_date >= weekStr).reduce((s, d) => s + d.points, 0));
      // Streak
      let s = 0;
      const dates = [...new Set(allDeeds.map(d => d.completed_date))].sort().reverse();
      const checkDate = new Date();
      for (const date of dates) {
        const expected = checkDate.toISOString().split('T')[0];
        if (date === expected) { s++; checkDate.setDate(checkDate.getDate() - 1); }
        else break;
      }
      setStreak(s);
    }
  };

  const toggleDeed = async (deedKey: string, points: number) => {
    if (!user) return;
    if (completedDeeds.includes(deedKey)) {
      // Remove
      await supabase.from('karma_deeds').delete()
        .eq('user_id', user.id).eq('deed_key', deedKey).eq('completed_date', today);
      setCompletedDeeds(prev => prev.filter(k => k !== deedKey));
      setTotalPoints(prev => prev - points);
      setWeeklyPoints(prev => prev - points);
    } else {
      // Add
      // Use security definer function to prevent point manipulation
      const { error } = await supabase.rpc('record_karma_deed', {
        _user_id: user.id, _deed_key: deedKey, _points: points
      });
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      setCompletedDeeds(prev => [...prev, deedKey]);
      setTotalPoints(prev => prev + points);
      setWeeklyPoints(prev => prev + points);
      toast({ title: language === 'hi' ? `+${points} कर्म अंक!` : `+${points} Karma Points!` });
    }
  };

  return (
    <>
      <SEOHead title="Good Deeds Tracker - AstroAshi" description="Track your daily good deeds and build karma" />
      <Navigation />
      <main className="min-h-screen pt-16 sm:pt-18 md:pt-20 pb-24 lg:pb-10">
        <div className="container mx-auto px-4 max-w-2xl md:max-w-3xl lg:max-w-4xl py-4 sm:py-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {language === 'hi' ? 'दैनिक सद्कर्म' : 'Daily Good Deeds'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {language === 'hi' ? 'अच्छे कर्म करें, कर्म अंक अर्जित करें' : 'Do good deeds, earn karma points'}
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Trophy, label: language === 'hi' ? 'कुल अंक' : 'Total', value: totalPoints, color: 'text-yellow-500' },
              { icon: Flame, label: language === 'hi' ? 'स्ट्रीक' : 'Streak', value: `${streak}d`, color: 'text-orange-500' },
              { icon: TrendingUp, label: language === 'hi' ? 'इस सप्ताह' : 'This Week', value: weeklyPoints, color: 'text-green-500' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                <Card className="p-3 text-center bg-card/60 border-border/40">
                  <stat.icon className={`h-5 w-5 mx-auto mb-1 ${stat.color}`} />
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Deeds */}
          <div className="space-y-3">
            {dailyDeeds.map((deed, i) => {
              const done = completedDeeds.includes(deed.key);
              return (
                <motion.div key={deed.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <Card className={`p-4 border transition-all ${done ? 'bg-primary/5 border-primary/20' : 'bg-card/60 border-border/40'}`}>
                    <div className="flex items-center gap-3">
                      <Button variant={done ? 'default' : 'outline'} size="icon"
                        className={`h-9 w-9 rounded-full shrink-0 ${done ? '' : 'border-dashed'}`}
                        onClick={() => toggleDeed(deed.key, deed.points)}>
                        {done ? <Check className="h-4 w-4" /> : <span className="text-lg">{deed.icon}</span>}
                      </Button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {language === 'hi' ? deed.titleHi : deed.titleEn}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                            +{deed.points}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {language === 'hi' ? deed.descHi : deed.descEn}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default KarmaTracker;
