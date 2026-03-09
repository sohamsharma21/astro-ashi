import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, Music, Volume2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getMusicByReligion, categoryLabels, type MusicTrack } from '@/lib/devotionalMusicData';
import { getAmbientEngine } from '@/lib/ambientSoundEngine';
import { SEOHead } from '@/components/SEOHead';
import { toast } from '@/hooks/use-toast';

const DevotionalMusic = () => {
  const { language, userProfile } = useAuth();
  const religion = (userProfile as any)?.religion || 'other';
  const tracks = getMusicByReligion(religion);
  const [playing, setPlaying] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState('all');
  const [volume, setVolume] = useState(70);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ambientTrackRef = useRef<string | null>(null);

  const filteredTracks = activeCategory === 'all' ? tracks : tracks.filter(t => t.category === activeCategory);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (ambientTrackRef.current) {
        try { getAmbientEngine().stop(); } catch {}
      }
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

  const togglePlay = (track: MusicTrack) => {
    // If same track, stop
    if (playing === track.id) {
      stopAll();
      setPlaying(null);
      return;
    }

    // Stop previous
    stopAll();

    // Ambient engine track
    if (track.ambientId) {
      try {
        const engine = getAmbientEngine();
        engine.play(track.ambientId);
        engine.setVolume(volume / 100);
        ambientTrackRef.current = track.ambientId;
        setPlaying(track.id);
      } catch {
        toast({ title: language === 'hi' ? 'त्रुटि' : 'Error',
          description: language === 'hi' ? 'ऑडियो शुरू नहीं हो सका' : 'Could not start audio' });
      }
      return;
    }

    // Archive.org / external URL
    if (track.audioUrl) {
      const audio = new Audio(track.audioUrl);
      audio.volume = volume / 100;
      audio.play().catch(() => {
        toast({ title: language === 'hi' ? 'त्रुटि' : 'Error',
          description: language === 'hi' ? 'ऑडियो लोड नहीं हो सका' : 'Could not load audio' });
      });
      audio.onended = () => setPlaying(null);
      audioRef.current = audio;
      setPlaying(track.id);
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

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const categories = ['all', ...Object.keys(categoryLabels)];

  return (
    <>
      <SEOHead title="Spiritual Music - AstroAshi" description="Devotional music and chants from all faith traditions" />
      <Navigation />
      <main className="min-h-screen pt-16 sm:pt-18 md:pt-20 pb-24 lg:pb-10">
        <div className="container mx-auto px-4 max-w-2xl md:max-w-3xl lg:max-w-4xl py-4 sm:py-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 mb-2">
              <Music className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary">
                {language === 'hi' ? 'आध्यात्मिक संगीत' : 'Spiritual Music'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'hi' ? 'भक्ति संगीत और जाप' : 'Devotional music & chants'}
            </p>
          </motion.div>

          {/* Volume control */}
          <Card className="p-4 mb-4 bg-card/40 border-border/30">
            <div className="flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <Slider value={[volume]} onValueChange={handleVolume} max={100} step={1} className="flex-1" />
              <span className="text-xs text-muted-foreground w-8 text-right">{volume}%</span>
            </div>
          </Card>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
            {categories.map(cat => (
              <Button key={cat} variant={activeCategory === cat ? 'default' : 'outline'} size="sm"
                className="shrink-0 text-xs rounded-full" onClick={() => setActiveCategory(cat)}>
                {cat === 'all' ? (language === 'hi' ? 'सभी' : 'All') :
                  (language === 'hi' ? categoryLabels[cat].hi : categoryLabels[cat].en)}
              </Button>
            ))}
          </div>

          {/* Tracks */}
          <div className="space-y-3">
            {filteredTracks.map((track, i) => (
              <motion.div key={track.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}>
                <Card className={`p-4 border transition-all ${
                  playing === track.id ? 'bg-primary/5 border-primary/20' : 'bg-card/60 border-border/40'
                }`}>
                  <div className="flex items-center gap-3">
                    <Button variant={playing === track.id ? 'default' : 'outline'} size="icon"
                      className="h-10 w-10 rounded-full shrink-0" onClick={() => togglePlay(track)}>
                      {playing === track.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                    </Button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {language === 'hi' ? track.titleHi : track.titleEn}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {track.artist} · {track.duration}
                        {track.ambientId && <span className="ml-1 text-primary/70">⚡ Generated</span>}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => toggleFav(track.id)}
                      className={favorites.has(track.id) ? 'text-red-500' : 'text-muted-foreground'}>
                      <Heart className={`h-4 w-4 ${favorites.has(track.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
            {filteredTracks.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                {language === 'hi' ? 'इस श्रेणी में कोई ट्रैक नहीं' : 'No tracks in this category'}
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default DevotionalMusic;
