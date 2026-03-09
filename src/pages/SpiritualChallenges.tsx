import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Trophy, Flame, CheckCircle, PlayCircle, Calendar, Star } from 'lucide-react';
import { spiritualChallenges, SpiritualChallenge, getChallengeByKey } from '@/lib/challengesData';
import { GlobalLanguage, t, getGlobalLanguage } from '@/lib/globalTranslations';
import { Religion } from '@/lib/faithModules';

interface ChallengeProgress {
  id: string;
  challenge_key: string;
  started_at: string;
  completed_days: string[];
  current_streak: number;
  longest_streak: number;
  completed: boolean;
  completed_at: string | null;
}

const SpiritualChallenges = () => {
  const { user, language, userProfile } = useAuth();
  const lang = getGlobalLanguage(language) as GlobalLanguage;
  const religion = (userProfile as any)?.religion as Religion || 'hindu';
  
  const [progress, setProgress] = useState<ChallengeProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<SpiritualChallenge | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const labels = {
    en: { title: 'Spiritual Challenges', subtitle: 'Transform your life with daily spiritual practices', active: 'Active', completed: 'Completed', available: 'Available', start: 'Start Challenge', markDone: 'Mark Today Done', dayOf: 'Day', streak: 'Streak', progress: 'Progress', reward: 'Reward' },
    hi: { title: 'आध्यात्मिक चुनौतियां', subtitle: 'दैनिक आध्यात्मिक अभ्यासों से अपना जीवन बदलें', active: 'सक्रिय', completed: 'पूर्ण', available: 'उपलब्ध', start: 'चुनौती शुरू करें', markDone: 'आज पूर्ण करें', dayOf: 'दिन', streak: 'स्ट्रीक', progress: 'प्रगति', reward: 'पुरस्कार' },
    ar: { title: 'التحديات الروحية', subtitle: 'حول حياتك بالممارسات الروحية اليومية', active: 'نشط', completed: 'مكتمل', available: 'متاح', start: 'ابدأ التحدي', markDone: 'أكمل اليوم', dayOf: 'اليوم', streak: 'سلسلة', progress: 'تقدم', reward: 'مكافأة' },
    es: { title: 'Desafíos Espirituales', subtitle: 'Transforma tu vida con prácticas espirituales diarias', active: 'Activo', completed: 'Completado', available: 'Disponible', start: 'Iniciar Desafío', markDone: 'Marcar Hoy', dayOf: 'Día', streak: 'Racha', progress: 'Progreso', reward: 'Recompensa' },
    fr: { title: 'Défis Spirituels', subtitle: 'Transformez votre vie avec des pratiques spirituelles quotidiennes', active: 'Actif', completed: 'Terminé', available: 'Disponible', start: 'Commencer le Défi', markDone: 'Marquer Fait', dayOf: 'Jour', streak: 'Série', progress: 'Progrès', reward: 'Récompense' }
  };
  const lb = labels[lang] || labels.en;

  useEffect(() => {
    if (user) loadProgress();
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('spiritual_challenges_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setProgress((data || []).map(p => ({ ...p, completed_days: p.completed_days as string[] })));
    } catch (err) {
      console.error('Load progress error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startChallenge = async (challenge: SpiritualChallenge) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('spiritual_challenges_progress').insert({
        user_id: user.id,
        challenge_key: challenge.key,
        completed_days: [],
        current_streak: 0,
        longest_streak: 0,
        completed: false
      });
      
      if (error) throw error;
      toast.success(lang === 'hi' ? 'चुनौती शुरू हुई!' : 'Challenge started!');
      loadProgress();
      setShowDetails(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to start challenge');
    }
  };

  const markTodayDone = async (challengeKey: string) => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const existing = progress.find(p => p.challenge_key === challengeKey);
    if (!existing) return;

    if (existing.completed_days.includes(today)) {
      toast.info(lang === 'hi' ? 'आज पहले से पूर्ण!' : 'Already done today!');
      return;
    }

    const challenge = getChallengeByKey(challengeKey);
    const newCompletedDays = [...existing.completed_days, today];
    const newStreak = existing.current_streak + 1;
    const isCompleted = newCompletedDays.length >= (challenge?.duration || 0);

    try {
      const { error } = await supabase
        .from('spiritual_challenges_progress')
        .update({
          completed_days: newCompletedDays,
          current_streak: newStreak,
          longest_streak: Math.max(existing.longest_streak, newStreak),
          completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) throw error;
      toast.success(isCompleted ? (lang === 'hi' ? '🎉 चुनौती पूर्ण!' : '🎉 Challenge completed!') : (lang === 'hi' ? '✅ आज पूर्ण!' : '✅ Done for today!'));
      loadProgress();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getChallengeStatus = (key: string) => {
    const p = progress.find(pr => pr.challenge_key === key);
    if (!p) return 'available';
    if (p.completed) return 'completed';
    return 'active';
  };

  const getProgressData = (key: string) => progress.find(p => p.challenge_key === key);

  return (
    <>
      <SEOHead title={`${lb.title} - AstroAshi`} description={lb.subtitle} canonical="/spiritual-challenges" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={120} />
        <Navigation />

        <main className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-24 lg:pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-cinzel text-gradient-gold mb-2">{lb.title}</h1>
              <p className="text-sm sm:text-base text-muted-foreground">{lb.subtitle}</p>
            </div>

            {/* Active Challenges */}
            {progress.filter(p => !p.completed).length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  {lb.active}
                </h2>
                <div className="grid gap-4">
                  {progress.filter(p => !p.completed).map(p => {
                    const challenge = getChallengeByKey(p.challenge_key);
                    if (!challenge) return null;
                    const progressPercent = (p.completed_days.length / challenge.duration) * 100;
                    const today = new Date().toISOString().split('T')[0];
                    const doneToday = p.completed_days.includes(today);

                    return (
                      <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                          <CardContent className="py-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{challenge.icon}</span>
                                <div>
                                  <h3 className="font-semibold">{challenge.title[lang] || challenge.title.en}</h3>
                                  <p className="text-xs text-muted-foreground">{lb.dayOf} {p.completed_days.length}/{challenge.duration}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
                                  <Flame className="w-3 h-3 mr-1" /> {p.current_streak}
                                </Badge>
                                <Button size="sm" onClick={() => markTodayDone(p.challenge_key)} disabled={doneToday}>
                                  {doneToday ? <CheckCircle className="w-4 h-4 text-green-500" /> : lb.markDone}
                                </Button>
                              </div>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Challenges */}
            {progress.filter(p => p.completed).length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  {lb.completed}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {progress.filter(p => p.completed).map(p => {
                    const challenge = getChallengeByKey(p.challenge_key);
                    if (!challenge) return null;
                    return (
                      <Card key={p.id} className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 text-center py-4">
                        <span className="text-4xl block mb-2">{challenge.reward.badge}</span>
                        <p className="text-sm font-medium">{challenge.reward.title[lang] || challenge.reward.title.en}</p>
                        <p className="text-[10px] text-muted-foreground">{challenge.title[lang] || challenge.title.en}</p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Challenges */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                {lb.available}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {spiritualChallenges.filter(c => getChallengeStatus(c.key) === 'available').map((challenge, index) => (
                  <motion.div
                    key={challenge.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className="cursor-pointer hover:border-primary/30 transition-all"
                      onClick={() => { setSelectedChallenge(challenge); setShowDetails(true); }}
                    >
                      <CardContent className="py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{challenge.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold">{challenge.title[lang] || challenge.title.en}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">{challenge.description[lang] || challenge.description.en}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-[10px]">
                                <Calendar className="w-3 h-3 mr-1" /> {challenge.duration} {t('days', lang)}
                              </Badge>
                              <Badge variant="outline" className="text-[10px]">{t(challenge.category, lang)}</Badge>
                            </div>
                          </div>
                          <PlayCircle className="w-8 h-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </main>

        {/* Challenge Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-md">
            {selectedChallenge && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-5xl">{selectedChallenge.icon}</span>
                    <div>
                      <DialogTitle>{selectedChallenge.title[lang] || selectedChallenge.title.en}</DialogTitle>
                      <p className="text-sm text-muted-foreground">{selectedChallenge.duration} {t('days', lang)}</p>
                    </div>
                  </div>
                </DialogHeader>
                <DialogDescription className="text-foreground">
                  {selectedChallenge.description[lang] || selectedChallenge.description.en}
                </DialogDescription>
                <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">{lb.reward}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedChallenge.reward.badge}</span>
                    <span className="font-medium">{selectedChallenge.reward.title[lang] || selectedChallenge.reward.title.en}</span>
                  </div>
                </div>
                <Button className="w-full mt-4 cosmic-button" onClick={() => startChallenge(selectedChallenge)}>
                  {lb.start}
                </Button>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </>
  );
};

export default SpiritualChallenges;
