import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { faithModules, getDailyTip, getReligionLabel, Religion } from '@/lib/faithModules';
import { Heart, BookOpen, Sparkles, Sun } from 'lucide-react';

interface FaithDashboardModuleProps {
  religion: Religion;
}

const FaithDashboardModule = ({ religion }: FaithDashboardModuleProps) => {
  const { language } = useAuth();
  const module = faithModules[religion] || faithModules.other;
  const tip = getDailyTip(religion, language);

  const translations = {
    en: {
      spiritualTip: 'Spiritual Tip of the Day',
      yourPath: 'Your Spiritual Path',
      disclaimer: 'Content is for spiritual guidance only. Sourced from traditional texts.',
      features: 'Available for you',
    },
    hi: {
      spiritualTip: 'आज का आध्यात्मिक सुझाव',
      yourPath: 'आपका आध्यात्मिक मार्ग',
      disclaimer: 'सामग्री केवल आध्यात्मिक मार्गदर्शन के लिए है।',
      features: 'आपके लिए उपलब्ध',
    },
  };
  const t = translations[language] || translations.en;

  const featureLabels: Record<string, { en: string; hi: string }> = {
    kundli: { en: 'Kundli', hi: 'कुंडली' },
    panchang: { en: 'Panchang', hi: 'पंचांग' },
    muhurat: { en: 'Muhurat', hi: 'मुहूर्त' },
    remedies: { en: 'Remedies', hi: 'उपाय' },
    predictions: { en: 'Predictions', hi: 'भविष्यफल' },
    prayer_times: { en: 'Prayer Times', hi: 'नमाज़ का समय' },
    hijri_calendar: { en: 'Hijri Calendar', hi: 'हिजरी कैलेंडर' },
    spiritual_suggestions: { en: 'Spiritual Guidance', hi: 'आध्यात्मिक मार्गदर्शन' },
    liturgical_calendar: { en: 'Liturgical Calendar', hi: 'धार्मिक कैलेंडर' },
    bible_verses: { en: 'Bible Verses', hi: 'बाइबल वचन' },
    prayer_prompts: { en: 'Prayer Prompts', hi: 'प्रार्थना' },
    jain_calendar: { en: 'Jain Calendar', hi: 'जैन कैलेंडर' },
    spiritual_reflections: { en: 'Reflections', hi: 'चिंतन' },
    ahimsa_tips: { en: 'Ahimsa Tips', hi: 'अहिंसा सुझाव' },
    buddhist_calendar: { en: 'Buddhist Calendar', hi: 'बौद्ध कैलेंडर' },
    dharma_teachings: { en: 'Dharma', hi: 'धर्म शिक्षा' },
    mindfulness: { en: 'Mindfulness', hi: 'सचेतनता' },
    nanakshahi_calendar: { en: 'Nanakshahi Calendar', hi: 'नानकशाही कैलेंडर' },
    gurbani: { en: 'Gurbani', hi: 'गुरबाणी' },
    seva_reminders: { en: 'Seva Reminders', hi: 'सेवा स्मरण' },
    general_calendar: { en: 'Calendar', hi: 'कैलेंडर' },
    inspirational_quotes: { en: 'Quotes', hi: 'विचार' },
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/10 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-cinzel text-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          {t.yourPath}
          <Badge variant="outline" className="ml-auto text-xs">
            {getReligionLabel(religion, language)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Greeting */}
        <div className="text-center py-2">
          <p className="text-2xl font-cinzel text-primary">{module.greeting[language]}</p>
        </div>

        {/* Spiritual Tip */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{t.spiritualTip}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{tip}</p>
        </div>

        {/* Available Features */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">{t.features}</p>
          <div className="flex flex-wrap gap-2">
            {module.features.map((feature) => (
              <Badge key={feature} variant="secondary" className="text-xs">
                {featureLabels[feature]?.[language] || feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center italic pt-2 border-t border-border/30">
          {t.disclaimer}
        </p>
      </CardContent>
    </Card>
  );
};

export default FaithDashboardModule;
