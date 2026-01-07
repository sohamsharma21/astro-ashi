import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Heart, Coins, Activity, ChevronRight } from 'lucide-react';

interface FocusAreasGridProps {
  focusAreas: any;
  kundliData: any;
}

const FocusAreasGrid = ({ focusAreas, kundliData }: FocusAreasGridProps) => {
  const { language } = useAuth();

  const translations = {
    en: {
      title: 'Focus Areas Today',
      subtitle: 'Auto-detected from your Kundli & current transits',
      career: 'Career',
      health: 'Health',
      finance: 'Finance',
      relationships: 'Relationships',
      action: 'Action',
    },
    hi: {
      title: 'आज के फोकस क्षेत्र',
      subtitle: 'आपकी कुंडली और वर्तमान गोचर से स्वचालित',
      career: 'करियर',
      health: 'स्वास्थ्य',
      finance: 'वित्त',
      relationships: 'संबंध',
      action: 'कार्य',
    }
  };

  const t = translations[language] || translations.en;

  // Default focus areas with insights
  const defaultFocusAreas = {
    career: {
      status: 'positive',
      insight_en: 'Professional growth is favored. Good time for new initiatives.',
      insight_hi: 'पेशेवर विकास अनुकूल है। नई पहल के लिए अच्छा समय।',
      action_en: 'Network with seniors',
      action_hi: 'वरिष्ठों से संपर्क करें',
    },
    health: {
      status: 'caution',
      insight_en: 'Pay attention to stress levels. Rest is important today.',
      insight_hi: 'तनाव के स्तर पर ध्यान दें। आज आराम महत्वपूर्ण है।',
      action_en: 'Take breaks, hydrate',
      action_hi: 'ब्रेक लें, पानी पिएं',
    },
    finance: {
      status: 'neutral',
      insight_en: 'Stable financial day. Avoid impulsive purchases.',
      insight_hi: 'स्थिर वित्तीय दिन। आवेगी खरीदारी से बचें।',
      action_en: 'Review investments',
      action_hi: 'निवेश की समीक्षा करें',
    },
    relationships: {
      status: 'positive',
      insight_en: 'Harmony in relationships. Express gratitude to loved ones.',
      insight_hi: 'संबंधों में सामंजस्य। प्रियजनों के प्रति आभार व्यक्त करें।',
      action_en: 'Spend quality time',
      action_hi: 'क्वालिटी टाइम बिताएं',
    }
  };

  const areas = focusAreas || defaultFocusAreas;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive':
        return 'bg-green-500/10 border-green-500/30 text-green-500';
      case 'caution':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-500';
      case 'negative':
        return 'bg-red-500/10 border-red-500/30 text-red-500';
      default:
        return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'positive':
        return '🟢';
      case 'caution':
        return '🟡';
      case 'negative':
        return '🔴';
      default:
        return '🔵';
    }
  };

  const areaConfig = [
    { key: 'career', icon: Briefcase, label: t.career },
    { key: 'health', icon: Activity, label: t.health },
    { key: 'finance', icon: Coins, label: t.finance },
    { key: 'relationships', icon: Heart, label: t.relationships },
  ];

  return (
    <Card className="bg-gradient-to-br from-background to-secondary/5 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-cinzel">{t.title}</CardTitle>
        <p className="text-xs text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {areaConfig.map(({ key, icon: Icon, label }) => {
            const area = areas[key] || defaultFocusAreas[key as keyof typeof defaultFocusAreas];
            const insight = language === 'hi' ? area.insight_hi : area.insight_en;
            const action = language === 'hi' ? area.action_hi : area.action_en;

            return (
              <div
                key={key}
                className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${getStatusColor(area.status)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </div>
                  <span className="text-sm">{getStatusIndicator(area.status)}</span>
                </div>
                
                <p className="text-sm text-foreground/80 mb-3 line-clamp-2">
                  {insight}
                </p>

                <div className="flex items-center gap-1 text-xs">
                  <Badge variant="outline" className="text-[10px]">
                    {t.action}
                  </Badge>
                  <span className="text-muted-foreground flex-1 truncate">{action}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
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
