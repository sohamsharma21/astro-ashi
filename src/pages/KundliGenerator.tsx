import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { KundliForm } from '@/components/kundli/KundliForm';
import KundliChartVisualization from '@/components/kundli/KundliChartVisualization';
import KundliTabs from '@/components/kundli/KundliTabs';
import CompareKundliButton from '@/components/kundli/CompareKundliButton';
import { useKundli } from '@/hooks/useKundli';
import { motion } from 'framer-motion';
import { SEOHead } from '@/components/SEOHead';
import { Download, Share2, Save, RotateCcw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCallback } from 'react';

const KundliGenerator = () => {
  const { language } = useAuth();
  const { loading, loadingInsights, kundliData, savedToProfile, generateKundli, resetKundli, saveToProfile } = useKundli();
  const hi = language === 'hi';

  const handleDownloadPDF = useCallback(async () => {
    if (!kundliData) return;
    toast.info(hi ? 'PDF तैयार हो रही है...' : 'Preparing PDF...');

    try {
      // Create a canvas-based PDF-like image
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1800;
      const ctx = canvas.getContext('2d')!;

      // Background
      const grad = ctx.createLinearGradient(0, 0, 0, 1800);
      grad.addColorStop(0, '#0f0a1e');
      grad.addColorStop(1, '#1a0b2e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 1800);

      // Border
      ctx.strokeStyle = '#d4a853';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 1140, 1740);

      // Title
      ctx.fillStyle = '#d4a853';
      ctx.font = 'bold 48px serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ AstroAshi Kundli Report ✨', 600, 100);

      // Separator
      ctx.strokeStyle = '#d4a853';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(100, 130); ctx.lineTo(1100, 130); ctx.stroke();

      // Birth details
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'left';
      let y = 180;
      const details = [
        [`${hi ? 'नाम' : 'Name'}: ${kundliData.name}`, `${hi ? 'जन्म तिथि' : 'Date'}: ${new Date(kundliData.birthDate).toLocaleDateString()}`],
        [`${hi ? 'जन्म समय' : 'Time'}: ${kundliData.birthTime}`, `${hi ? 'जन्म स्थान' : 'Place'}: ${kundliData.birthPlace}`],
      ];
      details.forEach(row => {
        ctx.fillText(row[0], 80, y);
        ctx.fillText(row[1], 620, y);
        y += 40;
      });

      // Signs
      y += 20;
      ctx.fillStyle = '#d4a853';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(`${hi ? 'लग्न' : 'Ascendant'}: ${kundliData.ascendant}`, 80, y);
      const moonSign = kundliData.planetPositions.find(p => p.planet === 'Moon')?.sign || '';
      const sunSign = kundliData.planetPositions.find(p => p.planet === 'Sun')?.sign || '';
      ctx.fillText(`${hi ? 'सूर्य' : 'Sun'}: ${sunSign}  |  ${hi ? 'चंद्र' : 'Moon'}: ${moonSign}`, 620, y);

      // Planets table
      y += 60;
      ctx.fillStyle = '#d4a853';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(hi ? 'ग्रह स्थिति' : 'Planet Positions', 80, y);
      y += 10;
      ctx.strokeStyle = '#d4a85355';
      ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(1120, y); ctx.stroke();
      y += 35;

      ctx.font = '22px sans-serif';
      kundliData.planetPositions.forEach((p, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const px = 80 + col * 360;
        const py = y + row * 40;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${p.planet}`, px, py);
        ctx.fillStyle = '#a78bfa';
        ctx.fillText(`${p.sign} ${p.degree.toFixed(1)}°`, px + 120, py);
      });

      // AI Insights summary
      y += Math.ceil(kundliData.planetPositions.length / 3) * 40 + 40;
      if (kundliData.structured) {
        const sections = [
          kundliData.structured.personality,
          kundliData.structured.career,
          kundliData.structured.relationships,
          kundliData.structured.challenges,
        ];
        sections.forEach(section => {
          if (!section || y > 1700) return;
          ctx.fillStyle = '#d4a853';
          ctx.font = 'bold 24px sans-serif';
          ctx.fillText(`${section.emoji} ${section.title}`, 80, y);
          y += 30;
          ctx.fillStyle = '#cccccc';
          ctx.font = '18px sans-serif';
          // Word wrap description
          const words = section.description.split(' ');
          let line = '';
          words.forEach(word => {
            const test = line + word + ' ';
            if (ctx.measureText(test).width > 1020) {
              ctx.fillText(line.trim(), 80, y);
              y += 25;
              line = word + ' ';
            } else {
              line = test;
            }
          });
          if (line.trim()) { ctx.fillText(line.trim(), 80, y); y += 25; }
          y += 15;
        });
      }

      // Footer
      ctx.fillStyle = '#d4a85388';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Generated by AstroAshi — astroashi-24419.lovable.app', 600, 1760);

      // Download
      const link = document.createElement('a');
      link.download = `AstroAshi-Kundli-${kundliData.name.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success(hi ? 'कुंडली डाउनलोड हो गई!' : 'Kundli report downloaded!');
    } catch (e) {
      toast.error(hi ? 'डाउनलोड विफल' : 'Download failed');
    }
  }, [kundliData, hi]);

  const handleShare = useCallback(async () => {
    if (!kundliData) return;
    const moonSign = kundliData.planetPositions.find(p => p.planet === 'Moon')?.sign || '';
    const shareText = hi
      ? `🔮 मेरी AstroAshi कुंडली:\n✨ लग्न: ${kundliData.ascendant}\n🌙 चंद्र राशि: ${moonSign}\n\nअपनी कुंडली बनाएं: https://astroashi-24419.lovable.app/kundli-generator`
      : `🔮 My AstroAshi Kundli:\n✨ Ascendant: ${kundliData.ascendant}\n🌙 Moon Sign: ${moonSign}\n\nGenerate yours: https://astroashi-24419.lovable.app/kundli-generator`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My AstroAshi Kundli', text: shareText });
      } catch { /* dismissed */ }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success(hi ? 'क्लिपबोर्ड पर कॉपी हो गया!' : 'Copied to clipboard!');
    }
  }, [kundliData, hi]);

  return (
    <>
      <SEOHead
        title="AI Kundli Generator - Free Birth Chart & Horoscope | AstroAshi"
        description="Generate your personalized Kundli with AI-powered insights. Get zodiac sign, moon sign, rising sign, planet positions, personality traits, career guidance & more."
        keywords="kundli generator, birth chart, janam kundali, vedic horoscope, natal chart, कुंडली, जन्म कुंडली, AI kundli"
        canonical="/kundli-generator"
      />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={150} />
        <Navigation />

        <main className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-24 lg:pb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-gold ${hi ? 'font-noto-devanagari' : ''}`}>
              {hi ? '🔮 AI कुंडली जनरेटर' : '🔮 AI Kundli Generator'}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm sm:text-base">
              {hi
                ? 'अपनी जन्म कुंडली बनाएं और AI से व्यक्तित्व, करियर, रिश्ते और जीवन की अंतर्दृष्टि पाएं'
                : 'Generate your birth chart and get AI-powered insights on personality, career, relationships & life path'}
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {!kundliData ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <KundliForm onSubmit={generateKundli} loading={loading} />
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-3">
                  <Button onClick={handleDownloadPDF} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    {hi ? 'डाउनलोड PDF' : 'Download PDF'}
                  </Button>
                  <Button onClick={handleShare} variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    {hi ? 'शेयर करें' : 'Share Chart'}
                  </Button>
                  <Button onClick={saveToProfile} variant="outline" className="gap-2" disabled={savedToProfile}>
                    {savedToProfile ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Save className="w-4 h-4" />}
                    {savedToProfile ? (hi ? 'सहेजा गया ✓' : 'Saved ✓') : (hi ? 'प्रोफ़ाइल में सहेजें' : 'Save to Profile')}
                  </Button>
                </div>

                {/* Chart */}
                <KundliChartVisualization
                  ascendant={kundliData.ascendant}
                  houses={kundliData.houses}
                  planetPositions={kundliData.planetPositions}
                  language={language}
                />

                {/* Tabs with insights */}
                <KundliTabs
                  name={kundliData.name}
                  birthDate={kundliData.birthDate}
                  birthTime={kundliData.birthTime}
                  birthPlace={kundliData.birthPlace}
                  ascendant={kundliData.ascendant}
                  planetPositions={kundliData.planetPositions}
                  houses={kundliData.houses}
                  insights={kundliData.insights}
                  structured={kundliData.structured}
                  language={language}
                  loadingInsights={loadingInsights}
                />

                {/* Compare & Reset */}
                <div className="space-y-3">
                  <CompareKundliButton kundliData={kundliData} language={language} />
                  <div className="flex justify-center">
                    <Button onClick={resetKundli} variant="outline" className="gap-2">
                      <RotateCcw className="w-4 h-4" />
                      {hi ? 'नई कुंडली बनाएं' : 'Generate Another Kundli'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default KundliGenerator;
