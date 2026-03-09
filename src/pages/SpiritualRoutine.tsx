import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, BarChart3, Clock, Bell, BellOff, BellRing } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';
import { getRoutinesByTimeBlock, timeBlockLabels } from '@/lib/spiritualRoutineData';
import { Religion } from '@/lib/faithModules';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type ReminderPrefs = Record<string, { enabled: boolean; time: string }>;

const REMINDERS_KEY = 'astroashi_routine_reminders';

const loadReminders = (): ReminderPrefs => {
  try {
    return JSON.parse(localStorage.getItem(REMINDERS_KEY) || '{}');
  } catch { return {}; }
};

const saveReminders = (r: ReminderPrefs) => localStorage.setItem(REMINDERS_KEY, JSON.stringify(r));

const SpiritualRoutine = () => {
  const { user, userProfile, language } = useAuth();
  const { toast } = useToast();
  const religion = (userProfile?.religion as Religion) || 'hindu';
  const timeBlocks = getRoutinesByTimeBlock(religion);
  const allRoutines = [...(timeBlocks.morning || []), ...(timeBlocks.afternoon || []), ...(timeBlocks.evening || [])];
  const today = format(new Date(), 'yyyy-MM-dd');

  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [weekData, setWeekData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<ReminderPrefs>(loadReminders);
  const [editingReminder, setEditingReminder] = useState<{ key: string; label: string; time: string } | null>(null);
  const [tempTime, setTempTime] = useState('');
  const [tempEnabled, setTempEnabled] = useState(false);

  // Schedule browser notifications for enabled reminders
  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const now = new Date();

    Object.entries(reminders).forEach(([key, pref]) => {
      if (!pref.enabled) return;
      const routine = allRoutines.find(r => r.key === key);
      if (!routine) return;

      const [h, m] = pref.time.split(':').map(Number);
      const target = new Date();
      target.setHours(h, m, 0, 0);
      const diff = target.getTime() - now.getTime();

      if (diff > 0 && diff < 24 * 60 * 60 * 1000) {
        const timer = setTimeout(() => {
          new Notification(
            language === 'hi' ? `🙏 ${routine.label.hi}` : `🙏 ${routine.label.en}`,
            {
              body: language === 'hi' ? 'आपकी आध्यात्मिक दिनचर्या का समय हो गया है' : "It's time for your spiritual routine",
              icon: '/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png',
              badge: '/pwa-192x192.png',
            }
          );
        }, diff);
        timers.push(timer);
      }
    });

    return () => timers.forEach(clearTimeout);
  }, [reminders, allRoutines, language]);

  const fetchLogs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const weekAgo = format(subDays(new Date(), 6), 'yyyy-MM-dd');
    const { data } = await supabase.from('spiritual_routine_logs').select('*').eq('user_id', user.id).gte('completed_date', weekAgo);
    const logs = data || [];
    setCompletedToday(logs.filter((l: any) => l.completed_date === today).map((l: any) => l.routine_key));
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

  const openReminderDialog = (key: string, label: string, defaultTime: string) => {
    const pref = reminders[key];
    setEditingReminder({ key, label, time: defaultTime });
    setTempTime(pref?.time || defaultTime);
    setTempEnabled(pref?.enabled ?? false);
  };

  const saveReminderPref = async () => {
    if (!editingReminder) return;

    // Request notification permission if enabling
    if (tempEnabled && 'Notification' in window && Notification.permission === 'default') {
      const result = await Notification.requestPermission();
      if (result !== 'granted') {
        toast({ title: language === 'hi' ? 'नोटिफिकेशन अनुमति आवश्यक' : 'Notification permission required', variant: 'destructive' });
        return;
      }
    }

    const updated = { ...reminders, [editingReminder.key]: { enabled: tempEnabled, time: tempTime } };
    setReminders(updated);
    saveReminders(updated);
    setEditingReminder(null);
    toast({
      title: tempEnabled
        ? (language === 'hi' ? `⏰ रिमाइंडर ${tempTime} पर सेट` : `⏰ Reminder set for ${tempTime}`)
        : (language === 'hi' ? '🔕 रिमाइंडर बंद' : '🔕 Reminder off'),
    });
  };

  const progress = allRoutines.length > 0 ? (completedToday.length / allRoutines.length) * 100 : 0;
  const maxWeek = Math.max(...Object.values(weekData), 1);

  const t = {
    en: {
      title: 'My Spiritual Routine', today: "Today's Progress", weekly: '7-Day Progress', completed: 'completed',
      reminderTitle: 'Set Reminder', enable: 'Enable reminder', time: 'Reminder time', save: 'Save', cancel: 'Cancel',
    },
    hi: {
      title: 'मेरी आध्यात्मिक दिनचर्या', today: 'आज की प्रगति', weekly: '7-दिन की प्रगति', completed: 'पूर्ण',
      reminderTitle: 'रिमाइंडर सेट करें', enable: 'रिमाइंडर सक्षम करें', time: 'रिमाइंडर समय', save: 'सहेजें', cancel: 'रद्द करें',
    },
  };
  const tr = t[language] || t.en;

  const getBlockProgress = (block: string) => {
    const items = timeBlocks[block] || [];
    if (items.length === 0) return 0;
    return Math.round((items.filter(r => completedToday.includes(r.key)).length / items.length) * 100);
  };

  return (
    <>
      <SEOHead title="Spiritual Routine - AstroAshi" description="Plan and track your daily spiritual practices." canonical="/spiritual-routine" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={100} />
        <Navigation />
        <main className="pt-16 sm:pt-18 md:pt-20 pb-24 lg:pb-10 px-4 max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
            🙏 {tr.title}
          </motion.h1>

          {/* Today's Progress */}
          <Card className="p-4 mb-6 mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{tr.today}</span>
              <span className="text-sm text-primary font-bold">{completedToday.length}/{allRoutines.length} {tr.completed}</span>
            </div>
            <Progress value={progress} className="h-3" />
          </Card>

          {/* Time Block Sections */}
          {(['morning', 'afternoon', 'evening'] as const).map((block) => {
            const items = timeBlocks[block] || [];
            if (items.length === 0) return null;
            const blockProgress = getBlockProgress(block);
            return (
              <motion.div key={block} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-foreground">{timeBlockLabels[block][language]}</h2>
                  <span className="text-xs text-primary font-medium">{blockProgress}%</span>
                </div>
                <div className="space-y-2.5">
                  {items.map((r) => {
                    const done = completedToday.includes(r.key);
                    const hasReminder = reminders[r.key]?.enabled;
                    return (
                      <Card key={r.key} className={`p-3.5 flex items-center gap-3 transition-all ${done ? 'border-primary/40 bg-primary/5' : 'hover:border-border/80'}`}>
                        <button className="shrink-0 cursor-pointer" onClick={() => toggleRoutine(r.key)}>
                          {done ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                        </button>
                        <span className="text-xl cursor-pointer" onClick={() => toggleRoutine(r.key)}>{r.icon}</span>
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleRoutine(r.key)}>
                          <h3 className={`text-sm font-medium ${done ? 'text-primary line-through' : 'text-foreground'}`}>{r.label[language]}</h3>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {reminders[r.key]?.time || r.defaultTime}</p>
                        </div>
                        <button
                          className="shrink-0 p-1.5 rounded-full hover:bg-accent/50 transition-colors"
                          onClick={(e) => { e.stopPropagation(); openReminderDialog(r.key, r.label[language], r.defaultTime); }}
                          title={language === 'hi' ? 'रिमाइंडर' : 'Reminder'}
                        >
                          {hasReminder
                            ? <BellRing className="w-4 h-4 text-primary" />
                            : <Bell className="w-4 h-4 text-muted-foreground" />}
                        </button>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

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

      {/* Reminder Dialog */}
      <Dialog open={!!editingReminder} onOpenChange={(open) => !open && setEditingReminder(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              {tr.reminderTitle}
            </DialogTitle>
          </DialogHeader>
          {editingReminder && (
            <div className="space-y-5 py-2">
              <p className="text-sm text-muted-foreground">{editingReminder.label}</p>
              <div className="flex items-center justify-between">
                <Label htmlFor="reminder-toggle" className="text-sm">{tr.enable}</Label>
                <Switch id="reminder-toggle" checked={tempEnabled} onCheckedChange={setTempEnabled} />
              </div>
              {tempEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="reminder-time" className="text-sm">{tr.time}</Label>
                  <Input id="reminder-time" type="time" value={tempTime} onChange={e => setTempTime(e.target.value)} className="w-full" />
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditingReminder(null)}>{tr.cancel}</Button>
                <Button className="flex-1" onClick={saveReminderPref}>{tr.save}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpiritualRoutine;
