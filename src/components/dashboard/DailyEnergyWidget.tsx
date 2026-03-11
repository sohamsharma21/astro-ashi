import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Palette, Hash, Star, Activity } from 'lucide-react';

interface DailyEnergyWidgetProps {
  zodiacSign?: string;
  language: 'en' | 'hi';
}

const COLORS = ['Red', 'Blue', 'Green', 'Gold', 'Purple', 'Orange', 'White', 'Silver', 'Pink', 'Teal'];
const COLORS_HI = ['लाल', 'नीला', 'हरा', 'सुनहरा', 'बैंगनी', 'नारंगी', 'सफेद', 'चांदी', 'गुलाबी', 'टील'];
const ACTIVITIES = [
  { en: 'Start new projects', hi: 'नई परियोजनाएं शुरू करें' },
  { en: 'Focus on relationships', hi: 'रिश्तों पर ध्यान दें' },
  { en: 'Creative work', hi: 'रचनात्मक कार्य' },
  { en: 'Financial planning', hi: 'वित्तीय योजना' },
  { en: 'Self-care and rest', hi: 'आत्म-देखभाल और विश्राम' },
  { en: 'Learning and study', hi: 'सीखना और अध्ययन' },
  { en: 'Meditation and prayer', hi: 'ध्यान और प्रार्थना' },
  { en: 'Physical exercise', hi: 'शारीरिक व्यायाम' },
  { en: 'Social connections', hi: 'सामाजिक संबंध' },
  { en: 'Declutter and organize', hi: 'सफाई और व्यवस्था' },
];
const PLANETS = ['Sun ☀️', 'Moon 🌙', 'Mars ♂️', 'Mercury ☿️', 'Jupiter ♃', 'Venus ♀️', 'Saturn ♄'];
const ENERGY_LEVELS = [
  { en: 'High Energy', hi: 'उच्च ऊर्जा', emoji: '⚡' },
  { en: 'Balanced', hi: 'संतुलित', emoji: '☯️' },
  { en: 'Calm Focus', hi: 'शांत ध्यान', emoji: '🧘' },
  { en: 'Creative Flow', hi: 'रचनात्मक प्रवाह', emoji: '🎨' },
  { en: 'Restful', hi: 'विश्रामपूर्ण', emoji: '😌' },
];

function getDailyEnergy(zodiacSign: string) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const signHash = zodiacSign.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hash = (n: number) => Math.abs(Math.floor(Math.sin(n) * 10000));

  return {
    colorIndex: hash(seed + signHash) % COLORS.length,
    luckyNumber: (hash(seed + signHash * 2) % 9) + 1,
    activityIndex: hash(seed + signHash * 3) % ACTIVITIES.length,
    planetIndex: hash(seed + signHash * 4) % PLANETS.length,
    energyIndex: hash(seed + signHash * 5) % ENERGY_LEVELS.length,
  };
}

const DailyEnergyWidget = ({ zodiacSign = 'aries', language }: DailyEnergyWidgetProps) => {
  const energy = useMemo(() => getDailyEnergy(zodiacSign), [zodiacSign]);

  const items = [
    { icon: <Zap className="w-4 h-4 text-amber-400" />, label: language === 'hi' ? 'आज की ऊर्जा' : "Today's Energy", value: `${ENERGY_LEVELS[energy.energyIndex].emoji} ${ENERGY_LEVELS[energy.energyIndex][language] || ENERGY_LEVELS[energy.energyIndex].en}` },
    { icon: <Star className="w-4 h-4 text-indigo-400" />, label: language === 'hi' ? 'ग्रह प्रभाव' : 'Planet Influence', value: PLANETS[energy.planetIndex] },
    { icon: <Palette className="w-4 h-4 text-pink-400" />, label: language === 'hi' ? 'शुभ रंग' : 'Lucky Color', value: language === 'hi' ? COLORS_HI[energy.colorIndex] : COLORS[energy.colorIndex] },
    { icon: <Hash className="w-4 h-4 text-emerald-400" />, label: language === 'hi' ? 'शुभ अंक' : 'Lucky Number', value: energy.luckyNumber.toString() },
    { icon: <Activity className="w-4 h-4 text-blue-400" />, label: language === 'hi' ? 'सर्वश्रेष्ठ गतिविधि' : 'Best Activity', value: ACTIVITIES[energy.activityIndex][language] || ACTIVITIES[energy.activityIndex].en },
  ];

  return (
    <Card className="bg-gradient-to-br from-cosmic-blue/10 to-cosmic-purple/10 border-cosmic-blue/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="w-4 h-4 text-cosmic-blue" />
          {language === 'hi' ? 'दैनिक ऊर्जा' : 'Daily Energy'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              {item.icon} {item.label}
            </span>
            <Badge variant="secondary" className="text-xs font-medium">{item.value}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DailyEnergyWidget;
