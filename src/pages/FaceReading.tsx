import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, RotateCcw, Share2, Bookmark, Sparkles, ShieldCheck, Eye, Brain, Smile, Crown, Zap, Heart, ScanFace, Download } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { SEOHead } from '@/components/SEOHead';

type Phase = 'instructions' | 'scanning' | 'results';

interface FaceFeature {
  name: string;
  nameHi: string;
  icon: string;
  analysis: string;
  confidence: number;
}

interface PersonalityTrait {
  trait: string;
  description: string;
  strength: number;
}

interface FaceReading {
  faceShape: { type: string; description: string; confidence: number };
  features: FaceFeature[];
  personality: PersonalityTrait[];
  energyType: { type: string; description: string; color: string };
  leadership: { style: string; description: string; strength: number };
  emotionalNature: { type: string; description: string };
  lifePatterns: string[];
  spiritualAdvice: string;
}

const featureIcon = (icon: string) => {
  switch (icon) {
    case 'eyes': return <Eye className="w-5 h-5" />;
    case 'forehead': return <Brain className="w-5 h-5" />;
    case 'jawline': return <Crown className="w-5 h-5" />;
    case 'smile': return <Smile className="w-5 h-5" />;
    default: return <ScanFace className="w-5 h-5" />;
  }
};

const energyColorMap: Record<string, { bg: string; text: string; border: string }> = {
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
};

const FaceReadingPage = () => {
  const { language } = useAuth();
  const [phase, setPhase] = useState<Phase>('instructions');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [reading, setReading] = useState<FaceReading | null>(null);
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
          return prev + Math.random() * 10;
        });
      }, 350);

      try {
        const { data, error } = await supabase.functions.invoke('face-reading', {
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
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [processImage]);

  const handleCameraCapture = useCallback(() => {
    // Directly triggered by user click - camera permission will work
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  }, []);

  const handleGalleryUpload = useCallback(() => {
    // Directly triggered by user click
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  }, []);

  const handleShare = async () => {
    if (!reading) return;
    const text = `🧑 My Face Reading by AstroAshi\n\n` +
      `Face Shape: ${reading.faceShape.type}\n` +
      `Energy Type: ${reading.energyType.type}\n` +
      `Leadership: ${reading.leadership.style}\n` +
      `Traits: ${reading.personality.map(p => p.trait).join(', ')}\n\n` +
      `${reading.spiritualAdvice}\n\nTry yours at astroashi.vercel.app/face-reading`;
    if (navigator.share) {
      await navigator.share({ title: 'My Face Reading - AstroAshi', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: hi ? 'कॉपी किया गया!' : 'Copied to clipboard!' });
    }
  };

  const handleSave = () => {
    toast({ title: hi ? '✅ रीडिंग सहेजी गई!' : '✅ Reading saved!', description: hi ? 'आपकी रीडिंग इतिहास में सहेजी गई' : 'Saved to your reading history' });
  };

  const generateStoryCard = useCallback(async () => {
    if (!reading) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, '#0f0a1e');
    grad.addColorStop(0.5, '#1a1035');
    grad.addColorStop(1, '#0f0a1e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Decorative circles
    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(200, 300, 250, 0, Math.PI * 2);
    ctx.fillStyle = '#a78bfa';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(900, 1600, 300, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.globalAlpha = 1;

    // Face circle with image
    if (imagePreview) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = imagePreview;
        });
        ctx.save();
        ctx.beginPath();
        ctx.arc(540, 380, 150, 0, Math.PI * 2);
        ctx.clip();
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 390, 230, 300, 300);
        ctx.restore();
        ctx.beginPath();
        ctx.arc(540, 380, 155, 0, Math.PI * 2);
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 3;
        ctx.stroke();
      } catch { /* ignore */ }
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#e2e0ff';
    ctx.font = 'bold 52px system-ui, -apple-system, sans-serif';
    ctx.fillText('🧑 Face Reading AI', 540, 610);

    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillText(reading.faceShape.type, 540, 680);

    let y = 760;
    ctx.fillStyle = '#9ca3af';
    ctx.font = '24px system-ui, sans-serif';
    ctx.fillText('━━━ Personality Traits ━━━', 540, y);
    y += 50;

    reading.personality.slice(0, 4).forEach((trait) => {
      ctx.fillStyle = '#f3f4f6';
      ctx.font = 'bold 30px system-ui, sans-serif';
      ctx.fillText(trait.trait, 540, y);
      y += 36;
      ctx.fillStyle = '#9ca3af';
      ctx.font = '22px system-ui, sans-serif';
      const desc = trait.description.length > 50 ? trait.description.slice(0, 50) + '...' : trait.description;
      ctx.fillText(desc, 540, y);
      y += 50;
    });

    y += 20;
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillText(`⚡ ${reading.energyType.type}`, 540, y);
    y += 40;
    ctx.fillStyle = '#9ca3af';
    ctx.font = '22px system-ui, sans-serif';
    const energyDesc = reading.energyType.description.length > 60 ? reading.energyType.description.slice(0, 60) + '...' : reading.energyType.description;
    ctx.fillText(energyDesc, 540, y);

    y += 70;
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillText(`👑 ${reading.leadership.style}`, 540, y);

    ctx.fillStyle = '#6b7280';
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText('Discover yours at', 540, 1780);
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.fillText('astroashi.vercel.app/face-reading', 540, 1820);

    ctx.fillStyle = '#4b5563';
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText('✨ AstroAshi', 540, 1880);

    const link = document.createElement('a');
    link.download = 'astroashi-face-reading.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    toast({ title: hi ? '📸 स्टोरी कार्ड डाउनलोड हो गया!' : '📸 Story card downloaded!' });
  }, [reading, imagePreview, hi]);

  const handleReset = () => {
    setPhase('instructions');
    setImagePreview(null);
    setReading(null);
    setScanProgress(0);
  };

  const ec = energyColorMap[reading?.energyType?.color || 'amber'];

  return (
    <>
      <SEOHead title="Face Reading AI | AstroAshi" description="Upload a selfie and discover your personality traits, energy type, and leadership qualities through AI-powered face reading." canonical="/face-reading" />
      <Navigation />
      <main className="min-h-screen pt-16 sm:pt-18 md:pt-20 pb-24 lg:pb-10">
        <div className="container mx-auto px-4 max-w-2xl md:max-w-3xl py-4 sm:py-6">

          {/* Separate file inputs for camera and gallery */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
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
              <ScanFace className="w-3.5 h-3.5" /> {hi ? 'AI चेहरा विज्ञान' : 'AI Physiognomy'}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
              {hi ? '🧑 फेस रीडिंग AI' : '🧑 Face Reading AI'}
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {hi ? 'अपनी सेल्फी अपलोड करें और AI-संचालित व्यक्तित्व अंतर्दृष्टि प्राप्त करें' : 'Upload your selfie and discover personality insights through AI face analysis'}
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
                      { icon: '📸', en: 'Take a clear selfie or upload a face photo', hi: 'स्पष्ट सेल्फी लें या चेहरे की फोटो अपलोड करें' },
                      { icon: '🎯', en: 'Keep your face centered in the frame', hi: 'अपना चेहरा फ्रेम में केंद्रित रखें' },
                      { icon: '💡', en: 'Ensure good lighting — natural light works best', hi: 'अच्छी रोशनी सुनिश्चित करें — प्राकृतिक प्रकाश सबसे अच्छा' },
                      { icon: '😊', en: 'A relaxed, natural expression gives the best results', hi: 'शांत, प्राकृतिक अभिव्यक्ति सर्वोत्तम परिणाम देती है' },
                    ].map((tip, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <span className="text-lg">{tip.icon}</span>
                        <span className="text-muted-foreground">{hi ? tip.hi : tip.en}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* What we analyze */}
                <Card className="p-6 bg-card/60 backdrop-blur border-border/50">
                  <h3 className="text-sm font-semibold text-foreground mb-3">{hi ? '🔍 हम क्या विश्लेषण करते हैं' : '🔍 What we analyze'}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { icon: <ScanFace className="w-4 h-4" />, label: hi ? 'चेहरे का आकार' : 'Face Shape' },
                      { icon: <Eye className="w-4 h-4" />, label: hi ? 'आँखें' : 'Eyes' },
                      { icon: <Brain className="w-4 h-4" />, label: hi ? 'माथा' : 'Forehead' },
                      { icon: <Crown className="w-4 h-4" />, label: hi ? 'जबड़े की रेखा' : 'Jawline' },
                      { icon: <Smile className="w-4 h-4" />, label: hi ? 'मुस्कान पैटर्न' : 'Smile Pattern' },
                      { icon: <Zap className="w-4 h-4" />, label: hi ? 'ऊर्जा प्रकार' : 'Energy Type' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-muted/30">
                        <span className="text-primary">{item.icon}</span>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleCameraCapture} className="flex-1 h-14 text-base gap-2 bg-primary hover:bg-primary/90">
                    <Camera className="w-5 h-5" />
                    {hi ? 'सेल्फी लें' : 'Take a Selfie'}
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
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-primary/30 shadow-lg shadow-primary/10">
                  {imagePreview && <img src={imagePreview} alt="Your face" className="w-full h-full object-cover" />}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/10 rounded-full" />
                </div>

                <div className="text-center space-y-3 w-full max-w-xs">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span className="font-medium">{hi ? 'चेहरे का विश्लेषण हो रहा है...' : 'Analyzing your face...'}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full" animate={{ width: `${scanProgress}%` }} transition={{ duration: 0.3 }} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {scanProgress < 25 ? (hi ? 'चेहरे की पहचान...' : 'Detecting facial features...') :
                     scanProgress < 50 ? (hi ? 'आकार विश्लेषण...' : 'Analyzing face shape...') :
                     scanProgress < 75 ? (hi ? 'व्यक्तित्व पैटर्न...' : 'Reading personality patterns...') :
                     scanProgress < 90 ? (hi ? 'अंतर्दृष्टि तैयार हो रही...' : 'Generating insights...') :
                     (hi ? 'पूर्ण!' : 'Complete!')}
                  </p>
                </div>
              </motion.div>
            )}

            {/* PHASE: Results */}
            {phase === 'results' && reading && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

                {/* Face preview + shape */}
                <Card className="p-4 bg-card/60 backdrop-blur border-border/50 flex gap-4 items-center">
                  {imagePreview && (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 shrink-0">
                      <img src={imagePreview} alt="Your face" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{reading.faceShape.type}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{reading.faceShape.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${reading.faceShape.confidence}%` }} />
                      </div>
                      <span className="text-[10px] text-primary font-medium">{reading.faceShape.confidence}%</span>
                    </div>
                  </div>
                </Card>

                {/* Feature Analysis */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <ScanFace className="w-4 h-4 text-primary" />
                    {hi ? 'चेहरे का विश्लेषण' : 'Feature Analysis'}
                  </h3>
                  {reading.features.map((feature, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                      <Card className="p-4 bg-card/60 border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-primary">{featureIcon(feature.icon)}</span>
                          <span className="font-semibold text-sm text-foreground">{hi ? feature.nameHi : feature.name}</span>
                          <span className="ml-auto text-xs text-primary font-medium">{feature.confidence}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">{feature.analysis}</p>
                        <Progress value={feature.confidence} className="h-1.5" />
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Personality Traits */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    {hi ? 'व्यक्तित्व लक्षण' : 'Personality Traits'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {reading.personality.map((trait, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                        <Card className="p-4 bg-card/60 border-border/50 h-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm text-foreground">{trait.trait}</span>
                            <span className="text-xs text-primary font-medium">{trait.strength}%</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{trait.description}</p>
                          <Progress value={trait.strength} className="h-1" />
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Energy Type */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Card className={`p-5 ${ec?.bg || 'bg-primary/10'} border ${ec?.border || 'border-primary/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className={`w-5 h-5 ${ec?.text || 'text-primary'}`} />
                      <h4 className={`text-sm font-semibold ${ec?.text || 'text-primary'}`}>
                        {hi ? 'ऊर्जा प्रकार' : 'Energy Type'}
                      </h4>
                    </div>
                    <p className="font-semibold text-foreground text-base mb-1">{reading.energyType.type}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{reading.energyType.description}</p>
                  </Card>
                </motion.div>

                {/* Leadership + Emotional Nature */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <Card className="p-4 bg-card/60 border-border/50 h-full">
                      <h4 className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5" /> {hi ? 'नेतृत्व शैली' : 'Leadership Style'}
                      </h4>
                      <p className="font-semibold text-sm text-foreground mb-1">{reading.leadership.style}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{reading.leadership.description}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={reading.leadership.strength} className="h-1 flex-1" />
                        <span className="text-[10px] text-amber-400 font-medium">{reading.leadership.strength}%</span>
                      </div>
                    </Card>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
                    <Card className="p-4 bg-card/60 border-border/50 h-full">
                      <h4 className="text-xs font-semibold text-rose-400 mb-2 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5" /> {hi ? 'भावनात्मक स्वभाव' : 'Emotional Nature'}
                      </h4>
                      <p className="font-semibold text-sm text-foreground mb-1">{reading.emotionalNature.type}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{reading.emotionalNature.description}</p>
                    </Card>
                  </motion.div>
                </div>

                {/* Life Patterns */}
                <Card className="p-4 bg-card/60 border-border/50">
                  <h4 className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> {hi ? '🔮 जीवन पैटर्न' : '🔮 Life Patterns'}
                  </h4>
                  <div className="space-y-1.5">
                    {reading.lifePatterns.map((p, i) => (
                      <span key={i} className="block text-xs text-foreground/80">• {p}</span>
                    ))}
                  </div>
                </Card>

                {/* Spiritual Advice */}
                <Card className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> {hi ? 'आध्यात्मिक सलाह' : 'Spiritual Advice'}
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed italic">"{reading.spiritualAdvice}"</p>
                </Card>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleSave} variant="outline" className="gap-2">
                    <Bookmark className="w-4 h-4" /> {hi ? 'सहेजें' : 'Save'}
                  </Button>
                  <Button onClick={handleShare} variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" /> {hi ? 'शेयर' : 'Share'}
                  </Button>
                  <Button onClick={generateStoryCard} className="gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white border-0">
                    <Download className="w-4 h-4" /> {hi ? 'Instagram स्टोरी' : 'Story Card'}
                  </Button>
                  <Button onClick={handleReset} variant="outline" className="gap-2">
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
      <Footer />
    </>
  );
};

export default FaceReadingPage;
