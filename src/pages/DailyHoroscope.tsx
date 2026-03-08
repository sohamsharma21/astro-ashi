import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { ZodiacSign } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { getZodiacSignName } from '@/lib/translations';
import { SEOHead } from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Share2, Bookmark, Sun, Briefcase, Heart, Sparkles, RefreshCw, Loader2 } from 'lucide-react';

import ZodiacSignSelector from '@/components/horoscope/ZodiacSignSelector';
import HoroscopeDisplay from '@/components/horoscope/HoroscopeDisplay';
import SavePreferenceButton from '@/components/horoscope/SavePreferenceButton';
import { useHoroscope } from '@/hooks/useHoroscope';
import { useZodiacPreference } from '@/hooks/useZodiacPreference';
import { getGlobalLanguage, GlobalLanguage } from '@/lib/globalTranslations';

interface AIHoroscope {
  energy: string;
  career: string;
  love: string;
  spiritual: string;
}

const DailyHoroscope = () => {
  const { user, language, userProfile } = useAuth();
  const lang = getGlobalLanguage(language);
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>('aries');
  const [aiHoroscope, setAiHoroscope] = useState<AIHoroscope | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: horoscope, isLoading } = useHoroscope(selectedSign, language, user?.id);
  const { savingPreference, savePreference } = useZodiacPreference(user?.id, language);

  const labels: Record<GlobalLanguage, Record<string, string>> = {
    en: { title: 'My Daily Horoscope', energy: "Today's Energy", career: 'Career Insight', love: 'Love Insight', spiritual: 'Spiritual Advice', aiPowered: 'AI-Enhanced Insights', generating: 'Generating AI insights...', share: 'Share', save: 'Save', refresh: 'Refresh' },
    hi: { title: 'मेरा दैनिक राशिफल', energy: 'आज की ऊर्जा', career: 'करियर अंतर्दृष्टि', love: 'प्रेम अंतर्दृष्टि', spiritual: 'आध्यात्मिक सलाह', aiPowered: 'AI-संवर्धित अंतर्दृष्टि', generating: 'AI अंतर्दृष्टि बनाई जा रही है...', share: 'साझा करें', save: 'सहेजें', refresh: 'रिफ्रेश' },
    ar: { title: 'برجي اليومي', energy: 'طاقة اليوم', career: 'رؤية مهنية', love: 'رؤية الحب', spiritual: 'نصيحة روحية', aiPowered: 'رؤى محسنة بالذكاء الاصطناعي', generating: 'جار إنشاء الرؤى...', share: 'مشاركة', save: 'حفظ', refresh: 'تحديث' },
    es: { title: 'Mi Horóscopo Diario', energy: 'Energía de Hoy', career: 'Perspectiva Profesional', love: 'Perspectiva Amorosa', spiritual: 'Consejo Espiritual', aiPowered: 'Perspectivas Mejoradas por IA', generating: 'Generando perspectivas IA...', share: 'Compartir', save: 'Guardar', refresh: 'Actualizar' },
    fr: { title: 'Mon Horoscope Quotidien', energy: 'Énergie du Jour', career: 'Aperçu Carrière', love: 'Aperçu Amour', spiritual: 'Conseil Spirituel', aiPowered: 'Aperçus Améliorés par IA', generating: 'Génération des aperçus IA...', share: 'Partager', save: 'Enregistrer', refresh: 'Actualiser' }
  };
  const lb = labels[lang] || labels.en;

  useEffect(() => {
    if (userProfile?.primary_zodiac_sign) {
      setSelectedSign(userProfile.primary_zodiac_sign as ZodiacSign);
    }
  }, [userProfile]);

  useEffect(() => {
    if (user && selectedSign) {
      loadAIHoroscope();
    }
  }, [selectedSign, user]);

  const loadAIHoroscope = async () => {
    if (!user) return;
    setAiLoading(true);
    setAiHoroscope(null);
    try {
      const { data, error } = await supabase.functions.invoke('ai-life-insights', {
        body: { language: lang, insightType: 'horoscope' }
      });
      if (error) throw error;
      if (data?.insights) {
        setAiHoroscope({
          energy: data.insights.encouragement || data.insights.dailySuggestion || '',
          career: data.insights.career?.content || '',
          love: data.insights.relationships?.content || '',
          spiritual: data.insights.spiritual?.content || ''
        });
      }
    } catch {
      // Non-critical: AI horoscope is optional enhancement
    } finally {
      setAiLoading(false);
    }
  };

  const handleShare = async () => {
    const text = `${lb.title}: ${getZodiacSignName(selectedSign, language as 'en' | 'hi')}\n\n${horoscope || ''}\n\n- AstroAshi`;
    if (navigator.share) {
      await navigator.share({ title: lb.title, text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success(lang === 'hi' ? 'कॉपी हो गया!' : 'Copied!');
    }
  };

  const handleSave = () => {
    setSaved(true);
    toast.success(lang === 'hi' ? 'राशिफल सहेजा गया!' : 'Horoscope saved!');
    // Save to reading history
    if (user) {
      supabase.from('reading_history').insert({
        user_id: user.id,
        content_type: 'horoscope',
        content_id: `horoscope-${selectedSign}-${new Date().toISOString().split('T')[0]}`,
        content_title: `${getZodiacSignName(selectedSign, 'en')} Daily Horoscope`,
        content_summary: typeof horoscope === 'string' ? horoscope.slice(0, 200) : ''
      }).then(() => {});
    }
  };

  const aiSections = aiHoroscope ? [
    { icon: Sun, label: lb.energy, content: aiHoroscope.energy, color: 'text-amber-500', bg: 'from-amber-500/10 to-amber-600/5 border-amber-500/20' },
    { icon: Briefcase, label: lb.career, content: aiHoroscope.career, color: 'text-blue-500', bg: 'from-blue-500/10 to-blue-600/5 border-blue-500/20' },
    { icon: Heart, label: lb.love, content: aiHoroscope.love, color: 'text-pink-500', bg: 'from-pink-500/10 to-pink-600/5 border-pink-500/20' },
    { icon: Sparkles, label: lb.spiritual, content: aiHoroscope.spiritual, color: 'text-purple-500', bg: 'from-purple-500/10 to-purple-600/5 border-purple-500/20' },
  ] : [];

  return (
    <>
      <SEOHead 
        title={`${lb.title} - AstroAshi`}
        description="Get your personalized daily horoscope with AI insights."
        canonical="/daily-horoscope"
      />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={150} />
        <Navigation />
      
        <main className="container mx-auto px-4 pt-28 pb-20">
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-10 text-center text-gradient-gold font-cinzel">
            {lb.title}
          </motion.h1>

          <ZodiacSignSelector selectedSign={selectedSign} onSelectSign={setSelectedSign} language={language} />

          {/* Standard Horoscope */}
          <Card className="max-w-3xl mx-auto bg-card/60 backdrop-blur border-primary/20 mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-primary text-center font-cinzel">
                {language === 'en' ? `${getZodiacSignName(selectedSign, 'en')}'s Horoscope` : `${getZodiacSignName(selectedSign, 'hi')} राशिफल`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HoroscopeDisplay horoscope={horoscope} loading={isLoading} language={language} />
              
              {/* Actions */}
              <div className="flex justify-center gap-3 mt-6">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" /> {lb.share}
                </Button>
                <Button variant="outline" size="sm" onClick={handleSave} disabled={saved}>
                  <Bookmark className={`w-4 h-4 mr-2 ${saved ? 'fill-primary text-primary' : ''}`} /> {lb.save}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI-Enhanced Sections */}
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {lb.aiPowered}
              </h2>
              <Button variant="ghost" size="sm" onClick={loadAIHoroscope} disabled={aiLoading}>
                <RefreshCw className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {aiLoading ? (
              <Card className="py-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                <p className="text-sm text-muted-foreground">{lb.generating}</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiSections.map((section, i) => {
                  const Icon = section.icon;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                      <Card className={`bg-gradient-to-br ${section.bg} h-full`}>
                        <CardContent className="py-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className={`w-5 h-5 ${section.color}`} />
                            <span className={`font-semibold text-sm ${section.color}`}>{section.label}</span>
                          </div>
                          <p className="text-sm text-foreground/90 line-clamp-4">{section.content}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <SavePreferenceButton onClick={() => savePreference(selectedSign)} isLoading={savingPreference} language={language} />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DailyHoroscope;
