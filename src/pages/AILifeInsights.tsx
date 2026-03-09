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
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Briefcase, Heart, TrendingUp, Sparkles, Sun, Calendar, RefreshCw, Lightbulb, Target, Quote } from 'lucide-react';
import { GlobalLanguage, t, getGlobalLanguage } from '@/lib/globalTranslations';

interface InsightSection {
  title: string;
  content: string;
  tip: string;
}

interface LifeInsights {
  career: InsightSection;
  relationships: InsightSection;
  growth: InsightSection;
  spiritual: InsightSection;
  dailySuggestion: string;
  weeklyFocus: string;
  encouragement: string;
}

const AILifeInsights = () => {
  const { user, language } = useAuth();
  const lang = getGlobalLanguage(language);
  const [insights, setInsights] = useState<LifeInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const labels = {
    en: { title: 'AI Life Insights', subtitle: 'Personalized guidance for your life journey', refresh: 'Refresh Insights', dailyTip: 'Daily Suggestion', weeklyFocus: 'Weekly Focus' },
    hi: { title: 'AI जीवन अंतर्दृष्टि', subtitle: 'आपकी जीवन यात्रा के लिए व्यक्तिगत मार्गदर्शन', refresh: 'अंतर्दृष्टि रिफ्रेश करें', dailyTip: 'दैनिक सुझाव', weeklyFocus: 'साप्ताहिक फोकस' },
    ar: { title: 'رؤى الحياة بالذكاء الاصطناعي', subtitle: 'إرشادات مخصصة لرحلة حياتك', refresh: 'تحديث الرؤى', dailyTip: 'اقتراح اليوم', weeklyFocus: 'تركيز الأسبوع' },
    es: { title: 'Perspectivas de Vida IA', subtitle: 'Orientación personalizada para tu viaje de vida', refresh: 'Actualizar Perspectivas', dailyTip: 'Sugerencia Diaria', weeklyFocus: 'Enfoque Semanal' },
    fr: { title: 'Aperçus de Vie IA', subtitle: 'Orientation personnalisée pour votre parcours de vie', refresh: 'Actualiser les Aperçus', dailyTip: 'Suggestion du Jour', weeklyFocus: 'Focus Hebdomadaire' }
  };

  const lb = labels[lang] || labels.en;

  const loadInsights = async (refresh = false) => {
    if (!user) return;
    if (refresh) setRefreshing(true);
    else setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-life-insights', {
        body: { language: lang }
      });

      if (error) throw error;
      setInsights(data.insights);
    } catch (err: any) {
      console.error('Load insights error:', err);
      toast.error(err.message || 'Failed to load insights');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [user]);

  const insightCards = insights ? [
    { key: 'career', icon: Briefcase, color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30', iconColor: 'text-blue-500', data: insights.career },
    { key: 'relationships', icon: Heart, color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30', iconColor: 'text-pink-500', data: insights.relationships },
    { key: 'growth', icon: TrendingUp, color: 'from-green-500/20 to-green-600/10 border-green-500/30', iconColor: 'text-green-500', data: insights.growth },
    { key: 'spiritual', icon: Sparkles, color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30', iconColor: 'text-purple-500', data: insights.spiritual },
  ] : [];

  return (
    <>
      <SEOHead title={`${lb.title} - AstroAshi`} description={lb.subtitle} canonical="/ai-life-insights" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={120} />
        <Navigation />
        
        <main className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-24 lg:pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-cinzel text-gradient-gold mb-2">{lb.title}</h1>
              <p className="text-muted-foreground">{lb.subtitle}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => loadInsights(true)} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {lb.refresh}
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-40 rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-48 rounded-2xl" />
                  <Skeleton className="h-48 rounded-2xl" />
                  <Skeleton className="h-48 rounded-2xl" />
                  <Skeleton className="h-48 rounded-2xl" />
                </div>
              </div>
            ) : insights ? (
              <div className="space-y-6">
                {/* Encouragement Banner */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                  <Card className="bg-gradient-to-r from-primary/20 to-primary/5 border-primary/30">
                    <CardContent className="py-5 text-center">
                      <Quote className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-lg font-medium text-foreground italic">"{insights.encouragement}"</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Daily & Weekly */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                    <Card className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30 h-full">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sun className="w-5 h-5 text-amber-500" />
                          <span className="font-semibold text-amber-500">{lb.dailyTip}</span>
                        </div>
                        <p className="text-sm text-foreground">{insights.dailySuggestion}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 h-full">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-indigo-500" />
                          <span className="font-semibold text-indigo-500">{lb.weeklyFocus}</span>
                        </div>
                        <p className="text-sm text-foreground">{insights.weeklyFocus}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Insight Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insightCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + index * 0.1 }}
                      >
                        <Card className={`bg-gradient-to-br ${card.color} h-full`}>
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Icon className={`w-5 h-5 ${card.iconColor}`} />
                              {card.data.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-foreground/90">{card.data.content}</p>
                            <div className="flex items-start gap-2 p-2 rounded-lg bg-background/50">
                              <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                              <p className="text-xs text-muted-foreground">{card.data.tip}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Card className="py-12 text-center">
                <p className="text-muted-foreground">No insights available. Please try again.</p>
              </Card>
            )}
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AILifeInsights;
