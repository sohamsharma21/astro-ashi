import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';

interface PersonalDailyPredictionProps {
  prediction: any;
  profile: any;
}

const PersonalDailyPrediction = ({ prediction }: PersonalDailyPredictionProps) => {
  const { language } = useAuth();

  const t = language === 'hi' ? {
    title: 'आज की अंतर्दृष्टि',
    badge: 'कुंडली आधारित',
    outlook: 'संभावना', advice: 'सुझाव', avoid: 'बचें',
  } : {
    title: "Today's AI Guidance",
    badge: 'Kundli-based',
    outlook: 'Outlook', advice: 'Advice', avoid: 'Avoid',
  };

  const p = prediction || {
    content_en: "Today brings positive energy for personal growth. Focus on long-term goals. Communication is key.",
    content_hi: "आज व्यक्तिगत विकास के लिए सकारात्मक ऊर्जा लाता है। दीर्घकालिक लक्ष्यों पर ध्यान दें।",
    what_may_happen: language === 'hi' ? 'करियर में नई संभावनाएं' : 'New career opportunities may arise',
    what_to_do: language === 'hi' ? 'सुबह ध्यान करें' : 'Meditate in the morning',
    what_to_avoid: language === 'hi' ? 'बड़े वित्तीय निर्णय टालें' : 'Avoid major financial decisions',
  };

  const content = language === 'hi' ? p.content_hi : p.content_en;

  const items = [
    { icon: TrendingUp, label: t.outlook, value: p.what_may_happen, color: 'text-sky-400', bg: 'bg-sky-500/[0.06] border-sky-500/10' },
    { icon: Lightbulb, label: t.advice, value: p.what_to_do, color: 'text-emerald-400', bg: 'bg-emerald-500/[0.06] border-emerald-500/10' },
    { icon: AlertCircle, label: t.avoid, value: p.what_to_avoid, color: 'text-amber-400', bg: 'bg-amber-500/[0.06] border-amber-500/10' },
  ];

  return (
    <Card className="h-full border-border/40 bg-card">
      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-heading font-bold">
            <Sparkles className="w-4 h-4 text-primary" />
            {t.title}
          </CardTitle>
          <span className="text-[9px] uppercase tracking-wider font-semibold text-primary/60 bg-primary/[0.06] px-2 py-0.5 rounded-full">
            {t.badge}
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 space-y-3.5">
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          {content?.split('.').slice(0, 2).join('. ')}.
        </p>

        <div className="space-y-2">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${item.bg}`}>
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${item.color}`} />
                <div>
                  <p className={`text-[10px] uppercase tracking-wider font-semibold mb-0.5 ${item.color}`}>{item.label}</p>
                  <p className="text-[13px] text-foreground/80">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalDailyPrediction;
