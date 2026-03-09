import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Save, Flame, Smile, Meh, Frown, Loader2, Sparkles } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const moods = [
  { value: 'happy', icon: '😊', label: { en: 'Happy', hi: 'खुश' } },
  { value: 'neutral', icon: '😐', label: { en: 'Neutral', hi: 'सामान्य' } },
  { value: 'sad', icon: '😔', label: { en: 'Sad', hi: 'उदास' } },
];

const prompts = {
  en: ['What are you grateful for today?', 'What good happened today?', 'What lesson did you learn today?', 'Who made you smile today?', 'What small joy did you experience?'],
  hi: ['आज आप किसके लिए आभारी हैं?', 'आज क्या अच्छा हुआ?', 'आज आपने क्या सबक सीखा?', 'आज किसने आपको मुस्कुराया?', 'आज आपने कौन सी छोटी खुशी अनुभव की?'],
};

const GratitudeJournal = () => {
  const { user, language } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const todayPrompt = prompts[language][Math.floor(Date.now() / 86400000) % prompts[language].length];

  const t = {
    en: { title: 'Daily Gratitude Journal', save: 'Save Entry', streak: 'Day Streak', entries: 'Entries', prompt: 'Today\'s Prompt', saved: 'Entry saved!', history: 'This Month' },
    hi: { title: 'दैनिक कृतज्ञता पत्रिका', save: 'प्रविष्टि सहेजें', streak: 'दिन की लय', entries: 'प्रविष्टियाँ', prompt: 'आज का प्रश्न', saved: 'प्रविष्टि सहेजी गई!', history: 'इस महीने' },
  };
  const tr = t[language] || t.en;

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const start = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
    const end = format(endOfMonth(selectedDate), 'yyyy-MM-dd');
    const { data } = await supabase.from('gratitude_entries').select('*').eq('user_id', user.id).gte('entry_date', start).lte('entry_date', end).order('entry_date', { ascending: false });
    setEntries(data || []);
    // Calculate streak
    let s = 0;
    let d = new Date();
    for (let i = 0; i < 365; i++) {
      const ds = format(subDays(d, i), 'yyyy-MM-dd');
      if ((data || []).find((e: any) => e.entry_date === ds) || i === 0) {
        if ((data || []).find((e: any) => e.entry_date === ds)) s++;
        else break;
      } else break;
    }
    setStreak(s);
    // Load current day entry
    const todayEntry = (data || []).find((e: any) => e.entry_date === dateStr);
    if (todayEntry) { setContent(todayEntry.content); setMood(todayEntry.mood); }
    else { setContent(''); setMood('neutral'); }
    setLoading(false);
  }, [user, selectedDate, dateStr]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  // When date changes, load that entry
  useEffect(() => {
    const entry = entries.find((e: any) => e.entry_date === dateStr);
    if (entry) { setContent(entry.content); setMood(entry.mood); }
    else { setContent(''); setMood('neutral'); }
  }, [dateStr, entries]);

  const handleSave = async () => {
    if (!user || !content.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('gratitude_entries').upsert({
      user_id: user.id, entry_date: dateStr, content: content.trim(), mood, prompt: todayPrompt, updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,entry_date' });
    if (!error) { toast({ title: tr.saved }); fetchEntries(); }
    else toast({ title: 'Error', description: error.message, variant: 'destructive' });
    setSaving(false);
  };

  const daysInMonth = eachDayOfInterval({ start: startOfMonth(selectedDate), end: endOfMonth(selectedDate) });
  const entryDates = entries.map((e: any) => e.entry_date);

  return (
    <>
      <SEOHead title="Gratitude Journal - AstroAshi" description="Daily gratitude journal for reflection and mindfulness." canonical="/gratitude-journal" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={100} />
        <Navigation />
        <main className="pt-16 sm:pt-18 md:pt-20 pb-24 lg:pb-10 px-4 max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
            📝 {tr.title}
          </motion.h1>

          {/* Stats */}
          <div className="flex justify-center gap-4 mb-6">
            <Badge variant="secondary" className="text-base px-4 py-2 gap-2"><Flame className="w-4 h-4 text-orange-400" /> {streak} {tr.streak}</Badge>
            <Badge variant="secondary" className="text-base px-4 py-2 gap-2"><CalendarDays className="w-4 h-4 text-primary" /> {entries.length} {tr.entries}</Badge>
          </div>

          {/* Mini Calendar */}
          <Card className="p-4 mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {tr.history} — {format(selectedDate, 'MMMM yyyy')}</h3>
            <div className="grid grid-cols-7 gap-1">
              {['S','M','T','W','T','F','S'].map((d,i) => <div key={i} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>)}
              {Array.from({ length: startOfMonth(selectedDate).getDay() }).map((_, i) => <div key={`pad-${i}`} />)}
              {daysInMonth.map(day => {
                const ds = format(day, 'yyyy-MM-dd');
                const hasEntry = entryDates.includes(ds);
                const isSelected = isSameDay(day, selectedDate);
                return (
                  <button key={ds} onClick={() => setSelectedDate(day)}
                    className={`text-xs rounded-full w-8 h-8 flex items-center justify-center transition-all mx-auto
                      ${isSelected ? 'bg-primary text-primary-foreground font-bold' : hasEntry ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Entry Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <p className="text-sm text-muted-foreground italic">{tr.prompt}: {todayPrompt}</p>
              </div>

              <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder={todayPrompt} rows={5}
                className="mb-4 bg-muted/30 border-border/50 focus:border-primary/50 resize-none" />

              {/* Mood */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-muted-foreground">Mood:</span>
                {moods.map(m => (
                  <button key={m.value} onClick={() => setMood(m.value)}
                    className={`text-2xl transition-transform ${mood === m.value ? 'scale-125' : 'opacity-50 hover:opacity-80'}`}>
                    {m.icon}
                  </button>
                ))}
              </div>

              <Button onClick={handleSave} disabled={saving || !content.trim()} className="w-full gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {tr.save}
              </Button>
            </Card>
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default GratitudeJournal;
