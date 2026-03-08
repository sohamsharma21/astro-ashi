import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Clock, Play, Pause, Volume2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getSleepContent, typeLabels, type SleepContent as SleepItem } from '@/lib/sleepStoriesData';
import { getAmbientEngine } from '@/lib/ambientSoundEngine';
import { SEOHead } from '@/components/SEOHead';
import { toast } from '@/hooks/use-toast';

const TIMER_OPTIONS = [10, 15, 20, 30, 45, 60];

const SleepRelaxation = () => {
  const { language, userProfile } = useAuth();
  const religion = (userProfile as any)?.religion || 'other';
  const content = getSleepContent(religion);
  const [activeType, setActiveType] = useState<string>('all');
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ambientTrackRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = activeType === 'all' ? content : content.filter(c => c.type === activeType);
  const types = ['all', ...Object.keys(typeLabels)];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAll();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const stopAll = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (ambientTrackRef.current) {
      try { getAmbientEngine().stop(); } catch {}
      ambientTrackRef.current = null;
    }
  };

  const startTimer = (minutes: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSleepTimer(minutes);
    toast({
      title: language === 'hi' ? `${minutes} मिनट टाइमर शुरू` : `${minutes} min timer set`,
      description: language === 'hi' ? 'ऑडियो अपने आप बंद हो जाएगा' : 'Audio will stop automatically'
    });
    timerRef.current = setTimeout(() => {
      stopAll();
      setSleepTimer(null);
      setPlaying(null);
    }, minutes * 60000);
  };

  const togglePlay = (item: SleepItem) => {
    if (playing === item.id) {
      stopAll();
      setPlaying(null);
      return;
    }

    // Stop previous
    stopAll();

    // Ambient engine track
    if (item.ambientId) {
      try {
        const engine = getAmbientEngine();
        engine.play(item.ambientId);
        engine.setVolume(volume / 100);
        ambientTrackRef.current = item.ambientId;
        setPlaying(item.id);
      } catch {
        toast({ title: language === 'hi' ? 'त्रुटि' : 'Error',
          description: language === 'hi' ? 'ऑडियो शुरू नहीं हो सका' : 'Could not start audio' });
      }
      return;
    }

    // Archive.org / external URL
    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl);
      audio.volume = volume / 100;
      audio.play().catch(() => {
        toast({ title: language === 'hi' ? 'त्रुटि' : 'Error',
          description: language === 'hi' ? 'ऑडियो लोड नहीं हो सका' : 'Could not load audio' });
      });
      audio.onended = () => setPlaying(null);
      audioRef.current = audio;
      setPlaying(item.id);
      return;
    }

    toast({ title: language === 'hi' ? 'जल्द आ रहा है' : 'Coming Soon',
      description: language === 'hi' ? 'ऑडियो जल्द उपलब्ध होगा' : 'Audio will be available soon' });
  };

  const handleVolume = (val: number[]) => {
    const v = val[0];
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
    if (ambientTrackRef.current) {
      try { getAmbientEngine().setVolume(v / 100); } catch {}
    }
  };

  return (
    <>
      <SEOHead title="Sleep & Relaxation - AstroAshi" description="Guided sleep meditation and spiritual bedtime stories" />
      <Navigation />
      <main className="min-h-screen pt-16 pb-24 lg:pb-8 bg-gradient-to-b from-background to-background/95">
        <div className="container mx-auto px-4 max-w-2xl py-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 mb-2">
              <Moon className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-400">
                {language === 'hi' ? 'नींद और विश्राम' : 'Sleep & Relaxation'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'hi' ? 'शांतिपूर्ण नींद के लिए' : 'For peaceful sleep'}
            </p>
          </motion.div>

          {/* Volume + Timer row */}
          <Card className="p-4 mb-4 bg-card/40 border-border/30 space-y-4">
            <div className="flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <Slider value={[volume]} onValueChange={handleVolume} max={100} step={1} className="flex-1" />
              <span className="text-xs text-muted-foreground w-8 text-right">{volume}%</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {language === 'hi' ? 'स्लीप टाइमर' : 'Sleep Timer'}
                </span>
                {sleepTimer && <span className="text-xs text-primary ml-auto">{sleepTimer} min active</span>}
              </div>
              <div className="flex gap-2 flex-wrap">
                {TIMER_OPTIONS.map(min => (
                  <Button key={min} variant={sleepTimer === min ? 'default' : 'outline'} size="sm"
                    className="text-xs rounded-full" onClick={() => startTimer(min)}>
                    {min}m
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Type tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
            {types.map(type => (
              <Button key={type} variant={activeType === type ? 'default' : 'outline'} size="sm"
                className="shrink-0 text-xs rounded-full" onClick={() => setActiveType(type)}>
                {type === 'all' ? (language === 'hi' ? 'सभी' : 'All') :
                  (language === 'hi' ? typeLabels[type].hi : typeLabels[type].en)}
              </Button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}>
                <Card className={`p-4 border transition-all ${
                  playing === item.id ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-card/60 border-border/40'
                }`}>
                  <div className="flex items-center gap-3">
                    <Button variant={playing === item.id ? 'default' : 'outline'} size="icon"
                      className="h-10 w-10 rounded-full shrink-0" onClick={() => togglePlay(item)}>
                      {playing === item.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                    </Button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.icon}</span>
                        <p className="text-sm font-medium text-foreground truncate">
                          {language === 'hi' ? item.titleHi : item.titleEn}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {language === 'hi' ? item.descHi : item.descEn} · {item.duration}
                        {item.ambientId && <span className="ml-1 text-indigo-400/70">⚡ Generated</span>}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default SleepRelaxation;
