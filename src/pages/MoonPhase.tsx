import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Moon, Sparkles, Brain, Activity, Calendar } from 'lucide-react';

interface MoonPhaseData {
  name: string;
  nameHi: string;
  emoji: string;
  illumination: number;
  spiritualMeaning: { en: string; hi: string };
  activities: { en: string[]; hi: string[] };
  energy: string;
  element: string;
}

const MOON_PHASES: MoonPhaseData[] = [
  { name: 'New Moon', nameHi: 'अमावस्या', emoji: '🌑', illumination: 0, energy: 'Introspective', element: 'Earth',
    spiritualMeaning: { en: 'A time for new beginnings, setting intentions, and planting seeds for the future. The darkness invites inner reflection.', hi: 'नई शुरुआत, संकल्प स्थापित करने और भविष्य के बीज बोने का समय। अंधकार आंतरिक चिंतन को आमंत्रित करता है।' },
    activities: { en: ['Set new intentions and goals', 'Meditation and quiet reflection', 'Journal about what you want to manifest', 'Cleanse your space energetically'], hi: ['नए संकल्प और लक्ष्य निर्धारित करें', 'ध्यान और शांत चिंतन', 'जो प्रकट करना चाहते हैं उसके बारे में लिखें', 'अपने स्थान को ऊर्जात्मक रूप से शुद्ध करें'] } },
  { name: 'Waxing Crescent', nameHi: 'शुक्ल द्वितीया', emoji: '🌒', illumination: 15, energy: 'Hopeful', element: 'Water',
    spiritualMeaning: { en: 'The first light emerges. This is the phase of hope, courage, and taking initial steps toward your dreams.', hi: 'पहला प्रकाश उभरता है। यह आशा, साहस और अपने सपनों की ओर पहला कदम उठाने का चरण है।' },
    activities: { en: ['Take the first step on a new project', 'Affirm your goals daily', 'Practice gratitude for what is coming', 'Connect with supportive people'], hi: ['किसी नई परियोजना पर पहला कदम उठाएं', 'अपने लक्ष्यों की दैनिक पुष्टि करें', 'जो आ रहा है उसके लिए कृतज्ञता व्यक्त करें', 'सहायक लोगों से जुड़ें'] } },
  { name: 'First Quarter', nameHi: 'शुक्ल अष्टमी', emoji: '🌓', illumination: 50, energy: 'Determined', element: 'Fire',
    spiritualMeaning: { en: 'A time of decision and action. Challenges arise to test your resolve. Push through obstacles with determination.', hi: 'निर्णय और कार्रवाई का समय। चुनौतियां आपके संकल्प की परीक्षा लेती हैं। दृढ़ संकल्प के साथ बाधाओं को पार करें।' },
    activities: { en: ['Make important decisions', 'Face challenges head-on', 'Physical exercise and movement', 'Problem-solving and planning'], hi: ['महत्वपूर्ण निर्णय लें', 'चुनौतियों का सामना करें', 'शारीरिक व्यायाम और गतिविधि', 'समस्या-समाधान और योजना बनाना'] } },
  { name: 'Waxing Gibbous', nameHi: 'शुक्ल एकादशी', emoji: '🌔', illumination: 75, energy: 'Refining', element: 'Air',
    spiritualMeaning: { en: 'A time to refine and adjust. Review your progress, make improvements, and prepare for the fullness ahead.', hi: 'परिष्कृत और समायोजित करने का समय। अपनी प्रगति की समीक्षा करें, सुधार करें और आगे की पूर्णता के लिए तैयार हों।' },
    activities: { en: ['Review and refine your goals', 'Edit and improve ongoing work', 'Practice patience and persistence', 'Seek feedback from trusted advisors'], hi: ['अपने लक्ष्यों की समीक्षा करें', 'चल रहे काम में सुधार करें', 'धैर्य और दृढ़ता का अभ्यास करें', 'विश्वसनीय सलाहकारों से प्रतिक्रिया लें'] } },
  { name: 'Full Moon', nameHi: 'पूर्णिमा', emoji: '🌕', illumination: 100, energy: 'Illuminated', element: 'Spirit',
    spiritualMeaning: { en: 'The peak of lunar energy. Emotions are heightened, intuition is strongest. A time for celebration, gratitude, and releasing what no longer serves you.', hi: 'चंद्र ऊर्जा का चरम। भावनाएं तीव्र होती हैं, अंतर्ज्ञान सबसे मजबूत होता है। उत्सव, कृतज्ञता और जो अब आपके काम का नहीं है उसे छोड़ने का समय।' },
    activities: { en: ['Full moon meditation under the sky', 'Express gratitude for blessings', 'Release negative patterns and habits', 'Charge crystals and sacred objects'], hi: ['आकाश के नीचे पूर्णिमा ध्यान', 'आशीर्वाद के लिए कृतज्ञता व्यक्त करें', 'नकारात्मक पैटर्न छोड़ें', 'क्रिस्टल और पवित्र वस्तुओं को चार्ज करें'] } },
  { name: 'Waning Gibbous', nameHi: 'कृष्ण तृतीया', emoji: '🌖', illumination: 75, energy: 'Grateful', element: 'Water',
    spiritualMeaning: { en: 'A time to share wisdom, express gratitude, and give back. The light begins to wane, inviting reflection on what was received.', hi: 'ज्ञान साझा करने, कृतज्ञता व्यक्त करने और वापस देने का समय।' },
    activities: { en: ['Share knowledge with others', 'Volunteer or give to charity', 'Deep reflection and journaling', 'Express appreciation to loved ones'], hi: ['दूसरों के साथ ज्ञान साझा करें', 'स्वयंसेवा या दान करें', 'गहन चिंतन और पत्रिका लेखन', 'प्रियजनों के प्रति आभार व्यक्त करें'] } },
  { name: 'Last Quarter', nameHi: 'कृष्ण अष्टमी', emoji: '🌗', illumination: 50, energy: 'Releasing', element: 'Fire',
    spiritualMeaning: { en: 'A time to let go and forgive. Release old grudges, break bad habits, and clear space for renewal.', hi: 'जाने देने और क्षमा करने का समय। पुरानी शिकायतें छोड़ें, बुरी आदतें तोड़ें और नवीनीकरण के लिए जगह बनाएं।' },
    activities: { en: ['Let go of what is not working', 'Forgiveness practices', 'Declutter your space and mind', 'Break a bad habit consciously'], hi: ['जो काम नहीं कर रहा उसे छोड़ दें', 'क्षमा का अभ्यास करें', 'अपने स्थान और मन को साफ करें', 'सचेत रूप से एक बुरी आदत तोड़ें'] } },
  { name: 'Waning Crescent', nameHi: 'कृष्ण चतुर्दशी', emoji: '🌘', illumination: 10, energy: 'Surrendering', element: 'Earth',
    spiritualMeaning: { en: 'The final phase before rebirth. A time for rest, surrender, and deep spiritual connection. Trust the process of life.', hi: 'पुनर्जन्म से पहले का अंतिम चरण। विश्राम, समर्पण और गहन आध्यात्मिक संबंध का समय।' },
    activities: { en: ['Rest and restore energy', 'Deep meditation and prayer', 'Surrender outcomes to the divine', 'Prepare mentally for the new cycle'], hi: ['विश्राम करें और ऊर्जा बहाल करें', 'गहन ध्यान और प्रार्थना', 'परिणामों को ईश्वर पर छोड़ें', 'नए चक्र के लिए मानसिक रूप से तैयार हों'] } },
];

function getCurrentMoonPhase(): MoonPhaseData {
  const now = new Date();
  // Synodic month = 29.53 days. Known new moon: Jan 11, 2024
  const knownNewMoon = new Date(2024, 0, 11, 11, 57, 0);
  const daysSinceNewMoon = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const lunarAge = ((daysSinceNewMoon % 29.53) + 29.53) % 29.53;
  const phaseIndex = Math.floor((lunarAge / 29.53) * 8) % 8;
  return MOON_PHASES[phaseIndex];
}

function getLunarAge(): number {
  const now = new Date();
  const knownNewMoon = new Date(2024, 0, 11, 11, 57, 0);
  const daysSinceNewMoon = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  return ((daysSinceNewMoon % 29.53) + 29.53) % 29.53;
}

const MoonPhase = () => {
  const { language } = useAuth();
  const phase = useMemo(getCurrentMoonPhase, []);
  const lunarAge = useMemo(getLunarAge, []);
  const nextNewMoon = useMemo(() => Math.round(29.53 - lunarAge), [lunarAge]);

  const t = {
    en: { title: 'Moon Phase Guide', subtitle: 'Align with lunar energy for spiritual growth', currentPhase: 'Current Phase', spiritualMeaning: 'Spiritual Meaning', recommended: 'Recommended Activities', energy: 'Energy', element: 'Element', illumination: 'Illumination', nextNew: 'Next New Moon', days: 'days', lunarDay: 'Lunar Day', allPhases: 'All Lunar Phases' },
    hi: { title: 'चंद्र चरण मार्गदर्शिका', subtitle: 'आध्यात्मिक विकास के लिए चंद्र ऊर्जा से जुड़ें', currentPhase: 'वर्तमान चरण', spiritualMeaning: 'आध्यात्मिक अर्थ', recommended: 'अनुशंसित गतिविधियां', energy: 'ऊर्जा', element: 'तत्व', illumination: 'प्रकाश', nextNew: 'अगली अमावस्या', days: 'दिन', lunarDay: 'चंद्र दिवस', allPhases: 'सभी चंद्र चरण' },
  };
  const tr = t[language] || t.en;

  return (
    <>
      <SEOHead title="Moon Phase Spiritual Guide - AstroAshi" description="Discover the current moon phase and align your spiritual practices with lunar energy." canonical="/moon-phase" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={150} />
        <Navigation />
        <main className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-24 lg:pb-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-cinzel text-gradient-gold mb-2">🌙 {tr.title}</h1>
            <p className="text-muted-foreground">{tr.subtitle}</p>
          </motion.div>

          {/* Current Phase Hero */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-primary/20 via-secondary/50 to-accent/30 border-primary/30 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
              <CardContent className="py-8 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{tr.currentPhase}</p>
                <div className="text-7xl sm:text-8xl mb-4">{phase.emoji}</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{language === 'hi' ? phase.nameHi : phase.name}</h2>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <Badge variant="secondary" className="gap-1"><Activity className="w-3 h-3" /> {tr.energy}: {phase.energy}</Badge>
                  <Badge variant="secondary" className="gap-1"><Sparkles className="w-3 h-3" /> {tr.element}: {phase.element}</Badge>
                  <Badge variant="secondary" className="gap-1"><Moon className="w-3 h-3" /> {tr.illumination}: {phase.illumination}%</Badge>
                </div>
                <div className="flex justify-center gap-6 mt-4 text-sm text-muted-foreground">
                  <span><Calendar className="w-4 h-4 inline mr-1" />{tr.lunarDay}: {Math.floor(lunarAge) + 1}</span>
                  <span>{tr.nextNew}: {nextNewMoon} {tr.days}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Spiritual Meaning */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg"><Brain className="w-5 h-5 text-purple-400" /> {tr.spiritualMeaning}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 leading-relaxed">{phase.spiritualMeaning[language] || phase.spiritualMeaning.en}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommended Activities */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-4">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg"><Sparkles className="w-5 h-5 text-emerald-400" /> {tr.recommended}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(phase.activities[language] || phase.activities.en).map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-foreground/90">
                      <span className="text-emerald-400 mt-0.5">✦</span>{a}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* All Phases Overview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">{tr.allPhases}</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {MOON_PHASES.map((p, i) => (
                <Card key={i} className={`p-3 text-center cursor-default transition-all ${p.name === phase.name ? 'border-primary bg-primary/10 ring-1 ring-primary/30' : 'hover:border-border'}`}>
                  <div className="text-2xl mb-1">{p.emoji}</div>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight">{language === 'hi' ? p.nameHi : p.name}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MoonPhase;
