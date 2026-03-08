import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';

interface PersonalDailyPredictionProps {
  prediction: any;
  profile: any;
}

const PersonalDailyPrediction = ({ prediction, profile }: PersonalDailyPredictionProps) => {
  const { language } = useAuth();

  const t = language === 'hi' ? {
    title: 'आज की अंतर्दृष्टि',
    basedOn: 'कुंडली आधारित',
    whatMayHappen: 'संभावना',
    whatToDo: 'सुझाव',
    whatToAvoid: 'बचें',
  } : {
    title: "Today's Insight",
    basedOn: 'Kundli-based',
    whatMayHappen: 'Outlook',
    whatToDo: 'Advice',
    whatToAvoid: 'Avoid',
  };

  const predictionContent = prediction || {
    content_en: "Today brings positive energy for personal growth. Your ruling planet's influence suggests focusing on long-term goals. Communication will be key in resolving any pending matters.",
    content_hi: "आज व्यक्तिगत विकास के लिए सकारात्मक ऊर्जा लाता है। आपके शासक ग्रह का प्रभाव दीर्घकालिक लक्ष्यों पर ध्यान केंद्रित करने का सुझाव देता है।",
    what_may_happen: language === 'hi' ? 'करियर में नई संभावनाएं' : 'New career opportunities may arise',
    what_to_do: language === 'hi' ? 'सुबह ध्यान करें' : 'Meditate in the morning',
    what_to_avoid: language === 'hi' ? 'बड़े वित्तीय निर्णय टालें' : 'Avoid major financial decisions',
  };

  const content = language === 'hi' ? predictionContent.content_hi : predictionContent.content_en;

  return (
    <Card className="h-full border-border/50 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-display">
            <Sparkles className="w-4 h-4 text-primary" />
            {t.title}
          </CardTitle>
          <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 font-medium">
            {t.basedOn}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {content?.split('.').slice(0, 2).join('. ')}.
        </p>

        <div className="space-y-2">
          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-cosmic-blue/5 border border-cosmic-blue/10">
            <TrendingUp className="w-4 h-4 text-cosmic-blue mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-cosmic-blue font-medium">{t.whatMayHappen}</p>
              <p className="text-sm text-foreground/80">{predictionContent.what_may_happen}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-green-500/5 border border-green-500/10">
            <Lightbulb className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-green-500 font-medium">{t.whatToDo}</p>
              <p className="text-sm text-foreground/80">{predictionContent.what_to_do}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-amber-500 font-medium">{t.whatToAvoid}</p>
              <p className="text-sm text-foreground/80">{predictionContent.what_to_avoid}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalDailyPrediction;
