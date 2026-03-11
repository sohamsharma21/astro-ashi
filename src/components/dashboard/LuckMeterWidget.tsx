import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Briefcase, Heart, DollarSign, Activity } from 'lucide-react';

interface LuckMeterWidgetProps {
  zodiacSign?: string;
  language: 'en' | 'hi';
}

function generateDailyLuck(zodiacSign: string): { career: number; relationship: number; financial: number; health: number; overall: number } {
  // Deterministic daily score based on date + sign
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const signHash = zodiacSign.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hash = (n: number) => ((Math.sin(n) * 10000) % 1 + 1) % 1;

  const career = Math.round(hash(seed + signHash * 1) * 50 + 40);
  const relationship = Math.round(hash(seed + signHash * 2) * 50 + 40);
  const financial = Math.round(hash(seed + signHash * 3) * 50 + 40);
  const health = Math.round(hash(seed + signHash * 4) * 50 + 40);
  const overall = Math.round((career + relationship + financial + health) / 4);

  return { career, relationship, financial, health, overall };
}

const luckColor = (val: number) => {
  if (val >= 80) return 'text-emerald-400';
  if (val >= 60) return 'text-primary';
  if (val >= 40) return 'text-amber-400';
  return 'text-rose-400';
};

const progressColor = (val: number) => {
  if (val >= 80) return '[&>div]:bg-emerald-400';
  if (val >= 60) return '[&>div]:bg-primary';
  if (val >= 40) return '[&>div]:bg-amber-400';
  return '[&>div]:bg-rose-400';
};

const LuckMeterWidget = ({ zodiacSign = 'aries', language }: LuckMeterWidgetProps) => {
  const luck = useMemo(() => generateDailyLuck(zodiacSign), [zodiacSign]);

  const categories = [
    { key: 'career', icon: Briefcase, label: language === 'hi' ? 'करियर' : 'Career', value: luck.career },
    { key: 'relationship', icon: Heart, label: language === 'hi' ? 'रिश्ते' : 'Relationships', value: luck.relationship },
    { key: 'financial', icon: DollarSign, label: language === 'hi' ? 'वित्तीय' : 'Financial', value: luck.financial },
    { key: 'health', icon: Activity, label: language === 'hi' ? 'स्वास्थ्य' : 'Health', value: luck.health },
  ];

  return (
    <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {language === 'hi' ? 'दैनिक भाग्य मीटर' : 'Daily Luck Meter'}
          </span>
          <span className={`text-2xl font-bold ${luckColor(luck.overall)}`}>{luck.overall}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {categories.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Icon className="w-3.5 h-3.5" /> {c.label}
                </span>
                <span className={`font-semibold text-xs ${luckColor(c.value)}`}>{c.value}%</span>
              </div>
              <Progress value={c.value} className={`h-1.5 ${progressColor(c.value)}`} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LuckMeterWidget;
