import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Moon, Sparkles, Brain, RefreshCw, Send, BookOpen, Eye, Heart, Shield } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface DreamResult {
  symbols: { symbol: string; meaning: string }[];
  psychological: string;
  spiritual: string;
  guidance: string;
  emotions: string[];
  luckyElements: { color: string; number: number; stone: string };
}

const DreamInterpreter = () => {
  const { user, language } = useAuth();
  const [dreamText, setDreamText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DreamResult | null>(null);

  const t = {
    en: {
      title: 'AI Dream Interpreter', subtitle: 'Unlock the hidden meaning of your dreams', placeholder: 'Describe your dream in detail... What did you see? How did you feel? What happened?',
      analyze: 'Interpret Dream', analyzing: 'Analyzing your dream...', symbols: 'Dream Symbols', psychological: 'Psychological Insight',
      spiritual: 'Spiritual Meaning', guidance: 'Guidance', emotions: 'Dream Emotions', lucky: 'Lucky Elements', tryAnother: 'Interpret Another Dream',
      minLength: 'Please describe your dream in at least 20 characters.',
      examples: ['I was flying over mountains and oceans', 'I was lost in a dark forest with glowing lights', 'I dreamed of water flowing through my home'],
      exampleLabel: 'Try an example:',
    },
    hi: {
      title: 'AI स्वप्न व्याख्या', subtitle: 'अपने सपनों के छिपे अर्थ को समझें', placeholder: 'अपना सपना विस्तार से बताएं... आपने क्या देखा? आपको कैसा लगा? क्या हुआ?',
      analyze: 'सपने की व्याख्या करें', analyzing: 'आपके सपने का विश्लेषण हो रहा है...', symbols: 'स्वप्न प्रतीक', psychological: 'मनोवैज्ञानिक अंतर्दृष्टि',
      spiritual: 'आध्यात्मिक अर्थ', guidance: 'मार्गदर्शन', emotions: 'स्वप्न भावनाएं', lucky: 'शुभ तत्व', tryAnother: 'एक और सपने की व्याख्या करें',
      minLength: 'कृपया अपने सपने का कम से कम 20 अक्षरों में वर्णन करें।',
      examples: ['मैं पहाड़ों और समुद्रों के ऊपर उड़ रहा था', 'मैं एक अंधेरे जंगल में खो गया था', 'मैंने पानी अपने घर में बहते देखा'],
      exampleLabel: 'एक उदाहरण आज़माएं:',
    },
  };
  const tr = t[language] || t.en;

  const handleSubmit = async () => {
    if (dreamText.trim().length < 20) {
      toast.error(tr.minLength);
      return;
    }
    if (!user) { toast.error('Please login first'); return; }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('dream-interpreter', {
        body: { dream: dreamText.trim(), language }
      });
      if (error) throw error;
      setResult(data.interpretation);
    } catch (err: any) {
      console.error('Dream interpretation error:', err);
      toast.error(err.message || 'Failed to interpret dream');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setDreamText('');
  };

  const sectionIcon = (icon: React.ReactNode, color: string) => (
    <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${color}`}>{icon}</span>
  );

  return (
    <>
      <SEOHead title="AI Dream Interpreter - AstroAshi" description="Analyze your dreams with AI using psychology and astrology. Discover hidden meanings and spiritual guidance." canonical="/dream-interpreter" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={150} />
        <Navigation />
        <main className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-24 lg:pb-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-cinzel text-gradient-gold mb-2">🌙 {tr.title}</h1>
            <p className="text-muted-foreground">{tr.subtitle}</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card className="bg-gradient-to-br from-secondary/80 to-accent/30 border-primary/20">
                  <CardContent className="pt-6 space-y-4">
                    <Textarea
                      value={dreamText}
                      onChange={(e) => setDreamText(e.target.value)}
                      placeholder={tr.placeholder}
                      className="min-h-[150px] bg-background/50 border-border/50 resize-none text-base"
                      maxLength={2000}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{dreamText.length}/2000</span>
                      <Button onClick={handleSubmit} disabled={loading || dreamText.trim().length < 20} className="gap-2">
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {loading ? tr.analyzing : tr.analyze}
                      </Button>
                    </div>

                    {/* Examples */}
                    <div className="pt-2 border-t border-border/30">
                      <p className="text-xs text-muted-foreground mb-2">{tr.exampleLabel}</p>
                      <div className="flex flex-wrap gap-2">
                        {tr.examples.map((ex, i) => (
                          <Button key={i} variant="outline" size="sm" className="text-xs h-auto py-1.5" onClick={() => setDreamText(ex)}>
                            {ex.slice(0, 40)}...
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {loading && (
                  <div className="space-y-4 mt-6">
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-24 rounded-2xl" />
                    <Skeleton className="h-24 rounded-2xl" />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                {/* Symbols */}
                <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {sectionIcon(<Eye className="w-4 h-4 text-indigo-400" />, 'bg-indigo-500/20')} {tr.symbols}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.symbols.map((s, i) => (
                        <div key={i} className="flex gap-2 p-3 rounded-lg bg-background/50 border border-border/30">
                          <span className="text-lg">🔮</span>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{s.symbol}</p>
                            <p className="text-xs text-muted-foreground">{s.meaning}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Psychological */}
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {sectionIcon(<Brain className="w-4 h-4 text-blue-400" />, 'bg-blue-500/20')} {tr.psychological}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{result.psychological}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>

                {/* Spiritual */}
                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {sectionIcon(<Sparkles className="w-4 h-4 text-purple-400" />, 'bg-purple-500/20')} {tr.spiritual}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{result.spiritual}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>

                {/* Emotions */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {sectionIcon(<Heart className="w-4 h-4 text-pink-400" />, 'bg-pink-500/20')} {tr.emotions}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.emotions.map((e, i) => (
                        <Badge key={i} variant="secondary">{e}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Guidance */}
                <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {sectionIcon(<Shield className="w-4 h-4 text-emerald-400" />, 'bg-emerald-500/20')} {tr.guidance}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{result.guidance}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>

                {/* Lucky Elements */}
                {result.luckyElements && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {sectionIcon(<Moon className="w-4 h-4 text-amber-400" />, 'bg-amber-500/20')} {tr.lucky}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        <Badge variant="outline" className="gap-1">🎨 {result.luckyElements.color}</Badge>
                        <Badge variant="outline" className="gap-1">🔢 {result.luckyElements.number}</Badge>
                        <Badge variant="outline" className="gap-1">💎 {result.luckyElements.stone}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button onClick={handleReset} className="w-full gap-2">
                  <RefreshCw className="w-4 h-4" /> {tr.tryAnother}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DreamInterpreter;
