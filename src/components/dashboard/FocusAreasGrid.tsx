import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Heart, Coins, Activity, ArrowUpRight } from 'lucide-react';

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
    title: 'Life Areas',
    subtitle: 'Based on Kundli & transits',
    career: 'Career', health: 'Health', finance: 'Finance', relationships: 'Relationships',
  };

  const defaultFocusAreas = {
    career: { status: 'positive', insight_en: 'Professional growth is favored. Good time for initiatives.', insight_hi: 'पेशेवर विकास अनुकूल है।', action_en: 'Network with seniors', action_hi: 'वरिष्ठों से संपर्क करें' },
    health: { status: 'caution', insight_en: 'Pay attention to stress levels. Rest is important.', insight_hi: 'तनाव पर ध्यान दें।', action_en: 'Take breaks', action_hi: 'ब्रेक लें' },
    finance: { status: 'neutral', insight_en: 'Stable financial day. Avoid impulsive purchases.', insight_hi: 'स्थिर वित्तीय दिन।', action_en: 'Review investments', action_hi: 'निवेश की समीक्षा करें' },
    relationships: { status: 'positive', insight_en: 'Harmony in relationships. Express gratitude.', insight_hi: 'संबंधों में सामंजस्य।', action_en: 'Quality time', action_hi: 'क्वालिटी टाइम' }
  };

  const areas = focusAreas || defaultFocusAreas;

  const statusStyles: Record<string, { border: string; dot: string; iconBg: string }> = {
    positive: { border: 'border-emerald-500/15 hover:border-emerald-500/25', dot: 'bg-emerald-500', iconBg: 'bg-emerald-500/10 text-emerald-400' },
    caution: { border: 'border-amber-500/15 hover:border-amber-500/25', dot: 'bg-amber-500', iconBg: 'bg-amber-500/10 text-amber-400' },
    negative: { border: 'border-rose-500/15 hover:border-rose-500/25', dot: 'bg-rose-500', iconBg: 'bg-rose-500/10 text-rose-400' },
    neutral: { border: 'border-sky-500/15 hover:border-sky-500/25', dot: 'bg-sky-500', iconBg: 'bg-sky-500/10 text-sky-400' },
  };

  const areaConfig = [
    { key: 'career', icon: Briefcase, label: t.career },
    { key: 'health', icon: Activity, label: t.health },
    { key: 'finance', icon: Coins, label: t.finance },
    { key: 'relationships', icon: Heart, label: t.relationships },
  ];

  return (
    <Card className="border-border/40 bg-card">
      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-heading font-bold">{t.title}</CardTitle>
          <span className="text-[10px] text-muted-foreground font-medium">{t.subtitle}</span>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {areaConfig.map(({ key, icon: Icon, label }) => {
            const area = areas[key] || defaultFocusAreas[key as keyof typeof defaultFocusAreas];
            const insight = language === 'hi' ? area.insight_hi : area.insight_en;
            const action = language === 'hi' ? area.action_hi : area.action_en;
            const style = statusStyles[area.status] || statusStyles.neutral;

            return (
              <div key={key} className={`p-3.5 rounded-xl border bg-muted/10 transition-all duration-300 hover:-translate-y-0.5 ${style.border}`}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.iconBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                </div>
                <h4 className="text-xs font-bold text-foreground font-heading mb-1">{label}</h4>
                <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{insight}</p>
                <div className="flex items-center gap-1 text-[11px] text-primary font-medium">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{action}</span>
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
