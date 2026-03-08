import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer, Sparkles, Wind } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { meditations, getRecommendedMeditations, MeditationSession } from '@/lib/meditationData';
import { Religion } from '@/lib/faithModules';

const Meditation = () => {
  const { userProfile, language } = useAuth();
  const religion = (userProfile?.religion as Religion) || 'hindu';
  const recommended = getRecommendedMeditations(religion);
  
  const [activeSession, setActiveSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = activeSession ? activeSession.duration * 60 : 0;
  const progress = totalSeconds > 0 ? (elapsed / totalSeconds) * 100 : 0;

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setElapsed(prev => {
        if (prev >= totalSeconds - 1) {
          clearInterval(intervalRef.current!);
          setIsPlaying(false);
          return totalSeconds;
        }
        return prev + 1;
      });
    }, 1000);
  }, [totalSeconds]);

  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
    setElapsed(0);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const t = {
    en: { title: 'Meditation & Mindfulness', recommended: 'Recommended for You', all: 'All Meditations', playing: 'Now Playing', complete: 'Session Complete! 🎉', start: 'Start', breathe: 'Breathe in... hold... breathe out...' },
    hi: { title: 'ध्यान और सतर्कता', recommended: 'आपके लिए अनुशंसित', all: 'सभी ध्यान', playing: 'अभी चल रहा है', complete: 'सत्र पूर्ण! 🎉', start: 'शुरू करें', breathe: 'सांस अंदर... रोकें... सांस बाहर...' }
  };
  const tr = t[language] || t.en;

  const allGeneral = meditations.filter(m => m.religion === 'general');
  const religionSpecific = meditations.filter(m => m.religion === religion);

  return (
    <>
      <SEOHead title="Meditation & Mindfulness - AstroAshi" description="Guided meditation and mindfulness exercises for inner peace." canonical="/meditation" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={100} />
        <Navigation />
        <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            🧘 {tr.title}
          </motion.h1>

          {/* Active Session Player */}
          <AnimatePresence>
            {activeSession && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="mb-8">
                <Card className="p-6 bg-gradient-to-br from-secondary/80 to-accent/40 border-primary/20 backdrop-blur-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">{tr.playing}</p>
                  <h2 className="text-xl font-bold text-foreground mb-1">{activeSession.icon} {activeSession.title[language]}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{activeSession.description[language]}</p>

                  {/* Circular progress */}
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                      <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 52}`} strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                        className="transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-mono font-bold text-foreground">{formatTime(elapsed)}</span>
                      <span className="text-xs text-muted-foreground">/ {formatTime(totalSeconds)}</span>
                    </div>
                  </div>

                  {progress >= 100 ? (
                    <p className="text-primary font-semibold text-lg mb-4">{tr.complete}</p>
                  ) : isPlaying ? (
                    <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 4 }} className="text-muted-foreground text-sm mb-4 italic">
                      {tr.breathe}
                    </motion.p>
                  ) : null}

                  <div className="flex justify-center gap-3">
                    {!isPlaying ? (
                      <Button onClick={startTimer} className="gap-2" disabled={progress >= 100}><Play className="w-4 h-4" /> {progress > 0 ? 'Resume' : tr.start}</Button>
                    ) : (
                      <Button onClick={pauseTimer} variant="secondary" className="gap-2"><Pause className="w-4 h-4" /> Pause</Button>
                    )}
                    <Button onClick={resetTimer} variant="outline" size="icon"><RotateCcw className="w-4 h-4" /></Button>
                    <Button onClick={() => { resetTimer(); setActiveSession(null); }} variant="ghost" size="sm">Close</Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recommended */}
          {religionSpecific.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> {tr.recommended}</h2>
              <div className="grid gap-3">
                {religionSpecific.map((m, i) => (
                  <MeditationCard key={m.id} session={m} language={language} index={i} onSelect={() => { resetTimer(); setActiveSession(m); }} />
                ))}
              </div>
            </section>
          )}

          {/* All General */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Wind className="w-5 h-5 text-primary" /> {tr.all}</h2>
            <div className="grid gap-3">
              {allGeneral.map((m, i) => (
                <MeditationCard key={m.id} session={m} language={language} index={i} onSelect={() => { resetTimer(); setActiveSession(m); }} />
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

const MeditationCard = ({ session, language, index, onSelect }: { session: MeditationSession; language: 'en' | 'hi'; index: number; onSelect: () => void }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
    <Card className="p-4 flex items-center gap-4 cursor-pointer hover:border-primary/40 transition-all group" onClick={onSelect}>
      <div className="text-3xl">{session.icon}</div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{session.title[language]}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{session.description[language]}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="secondary" className="gap-1"><Timer className="w-3 h-3" />{session.duration}m</Badge>
        <Button size="icon" variant="ghost" className="rounded-full group-hover:bg-primary/10"><Play className="w-4 h-4 text-primary" /></Button>
      </div>
    </Card>
  </motion.div>
);

export default Meditation;
