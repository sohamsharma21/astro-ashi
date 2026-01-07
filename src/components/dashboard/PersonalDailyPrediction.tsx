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

  const translations = {
    en: {
      title: 'Your Personal Daily Insight',
      based_on: 'Based on your Kundli',
      what_may_happen: 'What may happen',
      what_to_do: 'What to do',
      what_to_avoid: 'What to avoid',
      general: 'General Forecast',
      personalized: 'Personalized for You',
    },
    hi: {
      title: 'आपकी व्यक्तिगत दैनिक जानकारी',
      based_on: 'आपकी कुंडली पर आधारित',
      what_may_happen: 'क्या हो सकता है',
      what_to_do: 'क्या करें',
      what_to_avoid: 'क्या न करें',
      general: 'सामान्य भविष्यफल',
      personalized: 'आपके लिए विशेष',
    }
  };

  const t = translations[language] || translations.en;

  // Default prediction content
  const predictionContent = prediction || {
    content_en: "Today brings positive energy for personal growth. Your ruling planet's influence suggests focusing on long-term goals. Communication will be key in resolving any pending matters.",
    content_hi: "आज व्यक्तिगत विकास के लिए सकारात्मक ऊर्जा लाता है। आपके शासक ग्रह का प्रभाव दीर्घकालिक लक्ष्यों पर ध्यान केंद्रित करने का सुझाव देता है।",
    what_may_happen: language === 'hi' 
      ? 'करियर में नई संभावनाएं आ सकती हैं'
      : 'New opportunities may arise in career',
    what_to_do: language === 'hi'
      ? 'सुबह ध्यान करें, पीला रंग पहनें'
      : 'Meditate in morning, wear yellow',
    what_to_avoid: language === 'hi'
      ? 'बड़े वित्तीय निर्णय टालें'
      : 'Avoid major financial decisions',
  };

  const content = language === 'hi' ? predictionContent.content_hi : predictionContent.content_en;

  return (
    <Card className="h-full bg-gradient-to-br from-background to-primary/5 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-cinzel">
          <Sparkles className="w-5 h-5 text-primary" />
          {t.title}
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            {profile?.moon_sign || 'Aries'}
          </Badge>
          <Badge className="text-xs bg-primary/20 text-primary">
            {t.based_on}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Two-layer prediction */}
        <div className="space-y-3">
          {/* General Layer */}
          <div className="p-3 rounded-lg bg-muted/30 border border-muted/50">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-muted-foreground" />
              {t.general}
            </p>
            <p className="text-sm leading-relaxed">
              {content?.split('.')[0]}.
            </p>
          </div>

          {/* Personalized Layer */}
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-primary mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {t.personalized}
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              {content?.split('.').slice(1, 3).join('. ')}.
            </p>
          </div>
        </div>

        {/* Action Items */}
        <div className="grid grid-cols-1 gap-2">
          {/* What may happen */}
          <div className="flex items-start gap-2 p-2 rounded bg-blue-500/10">
            <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-blue-400 font-medium">{t.what_may_happen}</p>
              <p className="text-sm">{predictionContent.what_may_happen}</p>
            </div>
          </div>

          {/* What to do */}
          <div className="flex items-start gap-2 p-2 rounded bg-green-500/10">
            <Lightbulb className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-green-400 font-medium">{t.what_to_do}</p>
              <p className="text-sm">{predictionContent.what_to_do}</p>
            </div>
          </div>

          {/* What to avoid */}
          <div className="flex items-start gap-2 p-2 rounded bg-amber-500/10">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-amber-400 font-medium">{t.what_to_avoid}</p>
              <p className="text-sm">{predictionContent.what_to_avoid}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalDailyPrediction;
