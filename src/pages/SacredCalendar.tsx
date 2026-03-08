import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarHeart, ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { festivals, getUpcomingFestivals, getDaysUntil, Festival } from '@/lib/festivalData';
import { Religion } from '@/lib/faithModules';

const religionEmojis: Record<string, string> = { hindu: '🕉️', muslim: '☪️', christian: '✝️', buddhist: '☸️', jain: '🪷', sikh: '🙏', other: '🌍' };
const religionLabels: Record<string, { en: string; hi: string }> = {
  hindu: { en: 'Hindu', hi: 'हिंदू' }, muslim: { en: 'Muslim', hi: 'मुस्लिम' }, christian: { en: 'Christian', hi: 'ईसाई' },
  buddhist: { en: 'Buddhist', hi: 'बौद्ध' }, jain: { en: 'Jain', hi: 'जैन' }, sikh: { en: 'Sikh', hi: 'सिख' },
};

const SacredCalendar = () => {
  const { userProfile, language } = useAuth();
  const religion = (userProfile?.religion as Religion) || 'hindu';
  const [filter, setFilter] = useState<Religion | 'all'>('all');
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);

  const displayFestivals = filter === 'all' ? getUpcomingFestivals(undefined, 20) : getUpcomingFestivals(filter as Religion, 20);

  const t = {
    en: { title: 'Sacred Calendar', upcoming: 'Upcoming Festivals', all: 'All Faiths', daysAway: 'days away', practices: 'Spiritual Practices', meaning: 'About this Festival', back: 'Back' },
    hi: { title: 'पवित्र कैलेंडर', upcoming: 'आगामी त्योहार', all: 'सभी धर्म', daysAway: 'दिन बाकी', practices: 'आध्यात्मिक प्रथाएं', meaning: 'इस त्योहार के बारे में', back: 'वापस' },
  };
  const tr = t[language] || t.en;

  return (
    <>
      <SEOHead title="Sacred Calendar - AstroAshi" description="Multi-faith festival calendar with spiritual practices." canonical="/sacred-calendar" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={100} />
        <Navigation />
        <main className="pt-20 pb-24 px-4 max-w-3xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
            📅 {tr.title}
          </motion.h1>

          <AnimatePresence mode="wait">
            {selectedFestival ? (
              <motion.div key="detail" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <Button variant="ghost" onClick={() => setSelectedFestival(null)} className="mb-4 gap-1"><ArrowLeft className="w-4 h-4" /> {tr.back}</Button>
                <Card className="p-6 bg-gradient-to-br from-secondary/80 to-accent/30 border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{religionEmojis[selectedFestival.religion]}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{selectedFestival.name[language]}</h2>
                      <Badge variant="secondary">{religionLabels[selectedFestival.religion]?.[language]}</Badge>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-primary mb-2">{tr.meaning}</h3>
                    <p className="text-foreground/80 leading-relaxed">{selectedFestival.description[language]}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> {tr.practices}</h3>
                    <ul className="space-y-2">
                      {selectedFestival.practices[language].map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground/80"><span className="text-primary mt-0.5">•</span>{p}</li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Filter tabs */}
                <div className="flex flex-wrap justify-center gap-2 my-6">
                  <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>{tr.all}</Button>
                  {Object.keys(religionLabels).map(r => (
                    <Button key={r} size="sm" variant={filter === r ? 'default' : 'outline'} onClick={() => setFilter(r as Religion)}>
                      {religionEmojis[r]} {religionLabels[r][language]}
                    </Button>
                  ))}
                </div>

                {/* Festival List */}
                <div className="space-y-3">
                  {displayFestivals.map((f, i) => {
                    const days = getDaysUntil(f.date);
                    return (
                      <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <Card className="p-4 flex items-center gap-4 cursor-pointer hover:border-primary/40 transition-all group"
                          onClick={() => setSelectedFestival(f)}>
                          <span className="text-2xl">{religionEmojis[f.religion]}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{f.name[language]}</h3>
                            <p className="text-xs text-muted-foreground">{religionLabels[f.religion]?.[language]}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <Badge variant={days <= 7 ? 'default' : 'secondary'} className="text-xs">
                              {days === 0 ? '🎉 Today!' : `${days} ${tr.daysAway}`}
                            </Badge>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default SacredCalendar;
