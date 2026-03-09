import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Play, Pause, RotateCcw, Timer, Sparkles, Wind, Volume2, VolumeX } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { meditations, MeditationSession } from '@/lib/meditationData';
import { Religion } from '@/lib/faithModules';
import { ambientSounds, getAmbientEngine } from '@/lib/ambientSoundEngine';

const Meditation = () => {
  const { userProfile, language } = useAuth();
  const religion = (userProfile?.religion as Religion) || 'hindu';

  const [activeSession, setActiveSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Ambient sound state
  const [activeAmbient, setActiveAmbient] = useState<string | null>(null);
  const [ambientVolume, setAmbientVolume] = useState(50);
  const engineRef = useRef(getAmbientEngine());

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

  // Ambient controls
  const toggleAmbient = (soundId: string) => {
    const engine = engineRef.current;
    if (activeAmbient === soundId) {
      engine.stop();
      setActiveAmbient(null);
    } else {
      engine.setVolume(ambientVolume / 100);
      engine.play(soundId);
      setActiveAmbient(soundId);
    }
  };

  const handleVolumeChange = (val: number[]) => {
    const v = val[0];
    setAmbientVolume(v);
    engineRef.current.setVolume(v / 100);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      engineRef.current.stop();
    };
  }, []);

  // Log completion & stop ambient when session completes
  useEffect(() => {
    if (progress >= 100) {
      // Log meditation to spiritual_growth_logs
      const logMeditation = async () => {
        const { user } = (await supabase.auth.getUser()).data;
        if (user) {
          const today = new Date().toISOString().split('T')[0];
          await supabase.from('spiritual_growth_logs').upsert(
            { user_id: user.id, activity_type: 'meditation', completed_date: today },
            { onConflict: 'user_id,activity_type,completed_date' }
          ).then(() => {});
        }
      };
      logMeditation();

      if (activeAmbient) {
        const engine = engineRef.current;
        const fadeOut = setInterval(() => {
          const cur = engine.getVolume();
          if (cur <= 0.02) {
            engine.stop();
            setActiveAmbient(null);
            clearInterval(fadeOut);
            engine.setVolume(ambientVolume / 100);
          } else {
            engine.setVolume(cur - 0.02);
          }
        }, 100);
        return () => clearInterval(fadeOut);
      }
    }
  }, [progress >= 100]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const t = {
    en: { title: 'Meditation & Mindfulness', recommended: 'Recommended for You', all: 'All Meditations', playing: 'Now Playing', complete: 'Session Complete! 🎉', start: 'Start', breathe: 'Breathe in... hold... breathe out...', ambient: 'Ambient Sounds', ambientDesc: 'Tap to play calming background sounds', volume: 'Volume' },
    hi: { title: 'ध्यान और सतर्कता', recommended: 'आपके लिए अनुशंसित', all: 'सभी ध्यान', playing: 'अभी चल रहा है', complete: 'सत्र पूर्ण! 🎉', start: 'शुरू करें', breathe: 'सांस अंदर... रोकें... सांस बाहर...', ambient: 'परिवेशी ध्वनियाँ', ambientDesc: 'शांत पृष्ठभूमि ध्वनि के लिए टैप करें', volume: 'वॉल्यूम' }
  };
  const tr = t[language] || t.en;

  const allGeneral = meditations.filter(m => m.religion === 'general');
  const religionSpecific = meditations.filter(m => m.religion === religion);

  return (
    <>
      <SEOHead title="Meditation & Mindfulness - AstroAshi" description="Guided meditation with ambient sounds — rain, ocean, temple bells, and more." canonical="/meditation" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={100} />
        <Navigation />
        <main className="pt-16 sm:pt-18 md:pt-20 pb-24 lg:pb-10 px-4 max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center mb-6 md:mb-8">
            🧘 {tr.title}
          </motion.h1>

          {/* Ambient Sound Mixer */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
            <Card className="p-5 border-primary/10 bg-gradient-to-br from-muted/60 to-secondary/40">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-primary" /> {tr.ambient}
                </h2>
                {activeAmbient && (
                  <Button size="sm" variant="ghost" onClick={() => { engineRef.current.stop(); setActiveAmbient(null); }} className="text-xs gap-1">
                    <VolumeX className="w-3 h-3" /> Stop
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-4">{tr.ambientDesc}</p>

              {/* Sound grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-4">
                {ambientSounds.map(sound => {
                  const isActive = activeAmbient === sound.id;
                  return (
                    <button
                      key={sound.id}
                      onClick={() => toggleAmbient(sound.id)}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all duration-200
                        ${isActive
                          ? 'bg-primary/15 border-primary/40 shadow-lg shadow-primary/10 scale-105'
                          : 'bg-muted/30 border-border/30 hover:border-primary/20 hover:bg-muted/50'}`}
                    >
                      <span className={`text-xl transition-transform ${isActive ? 'animate-pulse' : ''}`}>{sound.icon}</span>
                      <span className={`text-[10px] font-medium leading-tight text-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {sound.label[language]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Volume slider */}
              {activeAmbient && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-3">
                  <VolumeX className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Slider value={[ambientVolume]} onValueChange={handleVolumeChange} max={100} step={1} className="flex-1" />
                  <Volume2 className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground w-8 text-right">{ambientVolume}%</span>
                </motion.div>
              )}
            </Card>
          </motion.section>

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
                    {/* Breathing ring animation when playing */}
                    {isPlaying && (
                      <motion.div
                        className="absolute inset-[-8px] rounded-full border-2 border-primary/20"
                        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                      />
                    )}
                  </div>

                  {progress >= 100 ? (
                    <p className="text-primary font-semibold text-lg mb-4">{tr.complete}</p>
                  ) : isPlaying ? (
                    <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 4 }} className="text-muted-foreground text-sm mb-4 italic">
                      {tr.breathe}
                    </motion.p>
                  ) : null}

                  {/* Active ambient indicator */}
                  {activeAmbient && (
                    <p className="text-xs text-muted-foreground mb-3">
                      🔊 {ambientSounds.find(s => s.id === activeAmbient)?.label[language]}
                    </p>
                  )}

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
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {religionSpecific.map((m, i) => (
                  <MeditationCard key={m.id} session={m} language={language} index={i} onSelect={() => { resetTimer(); setActiveSession(m); }} />
                ))}
              </div>
            </section>
          )}

          {/* All General */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Wind className="w-5 h-5 text-primary" /> {tr.all}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
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
