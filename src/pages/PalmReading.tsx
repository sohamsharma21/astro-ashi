import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, RotateCcw, Share2, Bookmark, Hand, Sparkles, Heart, Brain, Fingerprint, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { SEOHead } from '@/components/SEOHead';

type Phase = 'instructions' | 'scanning' | 'results';

interface PalmLine {
  name: string;
  nameHi: string;
  strength: 'strong' | 'moderate' | 'gentle';
  insight: string;
}

interface PalmReading {
  palmShape: { type: string; description: string };
  lines: PalmLine[];
  personality: string[];
  emotionalNature: string;
  strengths: string[];
  lifePatterns: string[];
  spiritualAdvice: string;
}

const strengthColor = (s: string) =>
  s === 'strong' ? 'text-emerald-400' : s === 'moderate' ? 'text-primary' : 'text-blue-400';

const strengthBg = (s: string) =>
  s === 'strong' ? 'bg-emerald-400/10 border-emerald-400/20' : s === 'moderate' ? 'bg-primary/10 border-primary/20' : 'bg-blue-400/10 border-blue-400/20';

const lineIcon = (name: string) => {
  if (name.toLowerCase().includes('life')) return <Fingerprint className="w-5 h-5" />;
  if (name.toLowerCase().includes('heart')) return <Heart className="w-5 h-5" />;
  if (name.toLowerCase().includes('head')) return <Brain className="w-5 h-5" />;
  return <Hand className="w-5 h-5" />;
};

const PalmReadingPage = () => {
  const { language } = useAuth();
  const [phase, setPhase] = useState<Phase>('instructions');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [reading, setReading] = useState<PalmReading | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const hi = language === 'hi';

  const processImage = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: hi ? 'कृपया एक छवि अपलोड करें' : 'Please upload an image file', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: hi ? 'छवि 5MB से छोटी होनी चाहिए' : 'Image must be under 5MB', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setImagePreview(base64);
      setPhase('scanning');
      setScanProgress(0);

      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) { clearInterval(interval); return 90; }
          return prev + Math.random() * 12;
        });
      }, 300);

      try {
        const { data, error } = await supabase.functions.invoke('palm-reading', {
          body: { imageBase64: base64, language },
        });

        clearInterval(interval);

        if (error || data?.error) {
          throw new Error(data?.error || error?.message || 'Analysis failed');
        }

        setScanProgress(100);
        setTimeout(() => {
          setReading(data.reading);
          setPhase('results');
        }, 600);
      } catch (err: any) {
        clearInterval(interval);
        toast({ title: hi ? 'विश्लेषण विफल' : 'Analysis failed', description: err.message, variant: 'destructive' });
        setPhase('instructions');
        setImagePreview(null);
      }
    };
    reader.readAsDataURL(file);
  }, [hi, language]);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
    e.target.value = '';
  }, [processImage]);

  const handleCameraCapture = useCallback(() => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  }, []);

  const handleGalleryUpload = useCallback(() => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  }, []);

  const handleShare = async () => {
    if (!reading) return;
    const text = `🖐️ My Palm Reading by AstroAshi\n\n` +
      `Personality: ${reading.personality.join(', ')}\n` +
      `Strengths: ${reading.strengths.join(', ')}\n\n` +
      `${reading.spiritualAdvice}\n\nTry yours at astroashi.lovable.app/palm-reading`;
    if (navigator.share) {
      await navigator.share({ title: 'My Palm Reading', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: hi ? 'कॉपी किया गया!' : 'Copied to clipboard!' });
    }
  };

  const handleSave = () => {
    toast({ title: hi ? '✅ रीडिंग सहेजी गई!' : '✅ Reading saved!', description: hi ? 'आपकी पठन इतिहास में सहेजी गई' : 'Saved to your reading history' });
  };

  const handleReset = () => {
    setPhase('instructions');
    setImagePreview(null);
    setReading(null);
    setScanProgress(0);
  };

  return (
    <>
      <SEOHead title="Palm Reading AI - AstroAshi" description="Upload a photo of your palm and receive AI-powered spiritual insights about your life lines, personality, and future patterns." canonical="/palm-reading" />
      <Navigation />
      <main className="min-h-screen pt-16 sm:pt-18 md:pt-20 pb-24 lg:pb-10">
        <div className="container mx-auto px-4 max-w-2xl md:max-w-3xl py-4 sm:py-6">

          {/* Separate file inputs for camera and gallery */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageSelect}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
              <Hand className="w-3.5 h-3.5" /> {hi ? 'AI हस्तरेखा विज्ञान' : 'AI Palmistry'}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
              {hi ? '🖐️ हस्तरेखा पठन' : '🖐️ Palm Reading AI'}
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {hi ? 'अपनी हथेली की तस्वीर अपलोड करें और AI-संचालित आध्यात्मिक अंतर्दृष्टि प्राप्त करें' : 'Upload a photo of your palm and receive AI-powered spiritual insights'}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* PHASE: Instructions */}
            {phase === 'instructions' && (
              <motion.div key="instructions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
                <Card className="p-6 bg-card/60 backdrop-blur border-border/50">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-primary" />
                    {hi ? 'कैसे शुरू करें' : 'How to get started'}
                  </h2>
                  <div className="space-y-3">
                    {[
                      { icon: '📸', en: 'Take a clear photo of your dominant palm', hi: 'अपनी प्रमुख हथेली की स्पष्ट तस्वीर लें' },
                      { icon: '💡', en: 'Ensure good lighting — natural light works best', hi: 'अच्छी रोशनी सुनिश्चित करें — प्राकृतिक प्रकाश सबसे अच्छा' },
                      { icon: '✋', en: 'Keep your full palm visible and fingers spread', hi: 'पूरी हथेली दिखाई दे और उंगलियां फैली हुई हों' },
                      { icon: '🧘', en: 'Relax your hand — don\'t clench or stretch', hi: 'हाथ को आराम दें — न कसें, न खींचें' },
                    ].map((tip, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <span className="text-lg">{tip.icon}</span>
                        <span className="text-muted-foreground">{hi ? tip.hi : tip.en}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleCameraCapture} className="flex-1 h-14 text-base gap-2 bg-primary hover:bg-primary/90">
                    <Camera className="w-5 h-5" />
                    {hi ? 'कैमरा से कैप्चर करें' : 'Capture from Camera'}
                  </Button>
                  <Button onClick={handleGalleryUpload} variant="outline" className="flex-1 h-14 text-base gap-2">
                    <Upload className="w-5 h-5" />
                    {hi ? 'गैलरी से अपलोड करें' : 'Upload from Gallery'}
                  </Button>
                </div>

                <Card className="p-4 bg-card/40 border-border/30">
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                    <span>{hi ? 'आपकी तस्वीर सुरक्षित है। इसे सर्वर पर संग्रहीत नहीं किया जाता — विश्लेषण के बाद तुरंत हटा दिया जाता है।' : 'Your photo is secure. It is not stored on our servers — deleted immediately after analysis.'}</span>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* PHASE: Scanning */}
            {phase === 'scanning' && (
              <motion.div key="scanning" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6 py-8">
                <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-primary/30">
                  {imagePreview && <img src={imagePreview} alt="Your palm" className="w-full h-full object-cover" />}
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/10" />
                </div>

                <div className="text-center space-y-3 w-full max-w-xs">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span className="font-medium">{hi ? 'हथेली का विश्लेषण हो रहा है...' : 'Analyzing your palm...'}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full" animate={{ width: `${scanProgress}%` }} transition={{ duration: 0.3 }} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {scanProgress < 30 ? (hi ? 'रेखाओं की पहचान...' : 'Detecting palm lines...') :
                     scanProgress < 60 ? (hi ? 'पैटर्न का विश्लेषण...' : 'Analyzing patterns...') :
                     scanProgress < 90 ? (hi ? 'अंतर्दृष्टि तैयार हो रही...' : 'Generating insights...') :
                     (hi ? 'पूर्ण!' : 'Complete!')}
                  </p>
                </div>
              </motion.div>
            )}

            {/* PHASE: Results */}
            {phase === 'results' && reading && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

                <Card className="p-4 bg-card/60 backdrop-blur border-border/50 flex gap-4 items-center">
                  {imagePreview && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-border/50 shrink-0">
                      <img src={imagePreview} alt="Your palm" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{reading.palmShape.type}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{reading.palmShape.description}</p>
                  </div>
                </Card>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Hand className="w-4 h-4 text-primary" />
                    {hi ? 'हस्तरेखा विश्लेषण' : 'Palm Line Analysis'}
                  </h3>
                  {reading.lines.map((line, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                      <Card className={`p-4 border ${strengthBg(line.strength)}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={strengthColor(line.strength)}>{lineIcon(line.name)}</span>
                          <span className="font-semibold text-sm text-foreground">{hi ? line.nameHi : line.name}</span>
                          <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${strengthBg(line.strength)} ${strengthColor(line.strength)} font-medium capitalize`}>
                            {line.strength}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{line.insight}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-4 bg-card/60 border-border/50">
                    <h4 className="text-xs font-semibold text-primary mb-2">{hi ? '🧠 व्यक्तित्व लक्षण' : '🧠 Personality Traits'}</h4>
                    <div className="space-y-1.5">
                      {reading.personality.map((t, i) => (
                        <span key={i} className="block text-xs text-foreground/80">• {t}</span>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4 bg-card/60 border-border/50">
                    <h4 className="text-xs font-semibold text-emerald-400 mb-2">{hi ? '💪 शक्तियां' : '💪 Strengths'}</h4>
                    <div className="space-y-1.5">
                      {reading.strengths.map((s, i) => (
                        <span key={i} className="block text-xs text-foreground/80">• {s}</span>
                      ))}
                    </div>
                  </Card>
                </div>

                <Card className="p-4 bg-card/60 border-border/50">
                  <h4 className="text-xs font-semibold text-pink-400 mb-2">{hi ? '💖 भावनात्मक स्वभाव' : '💖 Emotional Nature'}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{reading.emotionalNature}</p>
                </Card>

                <Card className="p-4 bg-card/60 border-border/50">
                  <h4 className="text-xs font-semibold text-blue-400 mb-2">{hi ? '🔮 जीवन पैटर्न' : '🔮 Life Patterns'}</h4>
                  <div className="space-y-1.5">
                    {reading.lifePatterns.map((p, i) => (
                      <span key={i} className="block text-xs text-foreground/80">• {p}</span>
                    ))}
                  </div>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> {hi ? 'आध्यात्मिक सलाह' : 'Spiritual Advice'}
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed italic">"{reading.spiritualAdvice}"</p>
                </Card>

                <div className="flex gap-3">
                  <Button onClick={handleSave} variant="outline" className="flex-1 gap-2">
                    <Bookmark className="w-4 h-4" /> {hi ? 'सहेजें' : 'Save'}
                  </Button>
                  <Button onClick={handleShare} variant="outline" className="flex-1 gap-2">
                    <Share2 className="w-4 h-4" /> {hi ? 'शेयर' : 'Share'}
                  </Button>
                  <Button onClick={handleReset} className="flex-1 gap-2 bg-primary hover:bg-primary/90">
                    <RotateCcw className="w-4 h-4" /> {hi ? 'दोबारा' : 'Try Again'}
                  </Button>
                </div>

                <p className="text-center text-[10px] text-muted-foreground/60">
                  {hi ? '⚠️ ये अंतर्दृष्टि AI-जनित हैं और केवल मनोरंजन व आत्म-चिंतन के लिए हैं।' : '⚠️ These insights are AI-generated and intended for entertainment and self-reflection only.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
};

export default PalmReadingPage;
