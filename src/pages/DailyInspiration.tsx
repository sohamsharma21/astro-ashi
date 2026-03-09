import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Bookmark, Copy, RefreshCw, Globe, Check } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { inspirations, getDailyInspiration, Inspiration } from '@/lib/inspirationData';
import { Religion } from '@/lib/faithModules';

const religionLabels: Record<string, { en: string; hi: string }> = {
  hindu: { en: 'Hindu', hi: 'हिंदू' }, muslim: { en: 'Muslim', hi: 'मुस्लिम' }, christian: { en: 'Christian', hi: 'ईसाई' },
  buddhist: { en: 'Buddhist', hi: 'बौद्ध' }, jain: { en: 'Jain', hi: 'जैन' }, sikh: { en: 'Sikh', hi: 'सिख' }, other: { en: 'Universal', hi: 'सार्वभौमिक' },
};

const DailyInspiration = () => {
  const { user, userProfile, language } = useAuth();
  const { toast } = useToast();
  const religion = (userProfile?.religion as Religion) || 'hindu';
  const [currentQuote, setCurrentQuote] = useState<Inspiration>(getDailyInspiration(religion));
  const [viewingReligion, setViewingReligion] = useState<Religion>(religion);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showOtherFaiths, setShowOtherFaiths] = useState(false);

  useEffect(() => {
    setCurrentQuote(getDailyInspiration(viewingReligion));
  }, [viewingReligion]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`"${currentQuote.quote[language]}" — ${currentQuote.source[language]}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = `"${currentQuote.quote[language]}" — ${currentQuote.source[language]}\n\nvia AstroAshi`;
    if (navigator.share) { try { await navigator.share({ text }); } catch {} }
    else { await navigator.clipboard.writeText(text); toast({ title: language === 'hi' ? 'कॉपी हो गया!' : 'Copied to clipboard!' }); }
  };

  const handleSave = async () => {
    if (!user) return;
    await supabase.from('saved_inspirations').insert({ user_id: user.id, quote_text: currentQuote.quote[language], source: currentQuote.source[language], religion: currentQuote.religion });
    setSaved(true);
    toast({ title: language === 'hi' ? 'उद्धरण सहेजा गया!' : 'Quote saved!' });
  };

  const handleShuffle = () => {
    const quotes = inspirations[viewingReligion] || inspirations.other;
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(random);
  };

  const t = {
    en: { title: 'Daily Inspiration', otherFaiths: 'See Inspirations from Other Faiths', todayQuote: "Today's Quote" },
    hi: { title: 'दैनिक प्रेरणा', otherFaiths: 'अन्य धर्मों से प्रेरणा देखें', todayQuote: 'आज का उद्धरण' },
  };
  const tr = t[language] || t.en;

  return (
    <>
      <SEOHead title="Daily Inspiration - AstroAshi" description="Daily spiritual quotes and inspiration from all faiths." canonical="/daily-inspiration" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={100} />
        <Navigation />
        <main className="pt-16 sm:pt-18 md:pt-20 pb-24 lg:pb-10 px-4 max-w-2xl md:max-w-3xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center mb-6 sm:mb-8">
            ✨ {tr.title}
          </motion.h1>

          {/* Quote Card */}
          <AnimatePresence mode="wait">
            <motion.div key={currentQuote.quote.en} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
              <Card className="p-8 bg-gradient-to-br from-secondary/80 via-accent/30 to-secondary/60 border-primary/20 backdrop-blur-lg text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
                <Badge className="mb-4">{religionLabels[viewingReligion]?.[language] || viewingReligion}</Badge>
                <p className="text-sm text-muted-foreground mb-3">{tr.todayQuote}</p>
                <blockquote className="text-xl md:text-2xl font-serif text-foreground leading-relaxed mb-4 italic">
                  "{currentQuote.quote[language]}"
                </blockquote>
                <p className="text-primary font-medium">— {currentQuote.source[language]}</p>

                {/* Actions */}
                <div className="flex justify-center gap-2 mt-6">
                  <Button size="sm" variant="secondary" onClick={handleCopy} className="gap-1">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handleShare} className="gap-1"><Share2 className="w-4 h-4" /> Share</Button>
                  <Button size="sm" variant="secondary" onClick={handleSave} disabled={saved || !user} className="gap-1"><Bookmark className="w-4 h-4" /> {saved ? 'Saved!' : 'Save'}</Button>
                  <Button size="sm" variant="outline" onClick={handleShuffle}><RefreshCw className="w-4 h-4" /></Button>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Other Faiths */}
          <div className="mt-8 text-center">
            <Button variant="ghost" onClick={() => setShowOtherFaiths(!showOtherFaiths)} className="gap-2">
              <Globe className="w-4 h-4" /> {tr.otherFaiths}
            </Button>
            <AnimatePresence>
              {showOtherFaiths && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap justify-center gap-2 mt-4">
                  {(Object.keys(religionLabels) as Religion[]).map(r => (
                    <Button key={r} size="sm" variant={viewingReligion === r ? 'default' : 'outline'}
                      onClick={() => { setViewingReligion(r); setSaved(false); }}>
                      {religionLabels[r][language]}
                    </Button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DailyInspiration;
