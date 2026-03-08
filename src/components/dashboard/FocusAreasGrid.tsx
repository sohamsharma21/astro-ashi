import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Heart, Coins, Activity, ArrowRight } from 'lucide-react';

interface FocusAreasGridProps {
  focusAreas: any;
  kundliData: any;
}

const FocusAreasGrid = ({ focusAreas }: FocusAreasGridProps) => {
  const { language } = useAuth();

  const t = language === 'hi' ? {
    title: 'फोकस क्षेत्र',
    subtitle: 'कुंडली और गोचर पर आधारित',
    career: 'करियर', health: 'स्वास्थ्य', finance: 'वित्त', relationships: 'संबंध',
  } : {
    title: 'Focus Areas',
    subtitle: 'Based on your Kundli & transits',
    career: 'Career', health: 'Health', finance: 'Finance', relationships: 'Relationships',
  };

  const defaultFocusAreas = {
    career: {
      status: 'positive',
      insight_en: 'Professional growth is favored. Good time for initiatives.',
      insight_hi: 'पेशेवर विकास अनुकूल है।',
      action_en: 'Network with seniors', action_hi: 'वरिष्ठों से संपर्क करें',
    },
    health: {
      status: 'caution',
      insight_en: 'Pay attention to stress levels. Rest is important.',
      insight_hi: 'तनाव पर ध्यान दें। आराम ज़रूरी है।',
      action_en: 'Take breaks', action_hi: 'ब्रेक लें',
    },
    finance: {
      status: 'neutral',
      insight_en: 'Stable financial day. Avoid impulsive purchases.',
      insight_hi: 'स्थिर वित्तीय दिन।',
      action_en: 'Review investments', action_hi: 'निवेश की समीक्षा करें',
    },
    relationships: {
      status: 'positive',
      insight_en: 'Harmony in relationships. Express gratitude.',
      insight_hi: 'संबंधों में सामंजस्य।',
      action_en: 'Quality time', action_hi: 'क्वालिटी टाइम',
    }
  };

  const areas = focusAreas || defaultFocusAreas;

  const statusStyles: Record<string, { bg: string; dot: string }> = {
    positive: { bg: 'bg-green-500/5 border-green-500/15', dot: 'bg-green-500' },
    caution: { bg: 'bg-amber-500/5 border-amber-500/15', dot: 'bg-amber-500' },
    negative: { bg: 'bg-destructive/5 border-destructive/15', dot: 'bg-destructive' },
    neutral: { bg: 'bg-cosmic-blue/5 border-cosmic-blue/15', dot: 'bg-cosmic-blue' },
  };

  const areaConfig = [
    { key: 'career', icon: Briefcase, label: t.career },
    { key: 'health', icon: Activity, label: t.health },
    { key: 'finance', icon: Coins, label: t.finance },
    { key: 'relationships', icon: Heart, label: t.relationships },
  ];

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-display">{t.title}</CardTitle>
          <span className="text-[10px] text-muted-foreground">{t.subtitle}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {areaConfig.map(({ key, icon: Icon, label }) => {
            const area = areas[key] || defaultFocusAreas[key as keyof typeof defaultFocusAreas];
            const insight = language === 'hi' ? area.insight_hi : area.insight_en;
            const action = language === 'hi' ? area.action_hi : area.action_en;
            const style = statusStyles[area.status] || statusStyles.neutral;

            return (
              <div key={key} className={`p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 ${style.bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{label}</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{insight}</p>
                <div className="flex items-center gap-1.5 text-xs text-primary">
                  <ArrowRight className="w-3 h-3" />
                  <span className="font-medium">{action}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusAreasGrid;
