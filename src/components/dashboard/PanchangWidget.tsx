import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Sun, Moon, Star, Clock, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

interface PanchangWidgetProps {
  panchang: any;
}

const PanchangWidget = ({ panchang }: PanchangWidgetProps) => {
  const { language } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const translations = {
    en: {
      title: "Today's Panchang",
      tithi: 'Tithi',
      nakshatra: 'Nakshatra',
      yoga: 'Yoga',
      karana: 'Karana',
      vaar: 'Vaar (Day)',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      rahuKaal: 'Rahu Kaal',
      abhijitMuhurat: 'Abhijit Muhurat',
      shubhMuhurat: 'Shubh Muhurat',
      ashubhMuhurat: 'Avoid',
      showMore: 'Show More',
      showLess: 'Show Less',
      caution: 'Caution Period',
      auspicious: 'Auspicious',
    },
    hi: {
      title: 'आज का पंचांग',
      tithi: 'तिथि',
      nakshatra: 'नक्षत्र',
      yoga: 'योग',
      karana: 'करण',
      vaar: 'वार',
      sunrise: 'सूर्योदय',
      sunset: 'सूर्यास्त',
      rahuKaal: 'राहु काल',
      abhijitMuhurat: 'अभिजीत मुहूर्त',
      shubhMuhurat: 'शुभ मुहूर्त',
      ashubhMuhurat: 'अशुभ',
      showMore: 'और देखें',
      showLess: 'कम देखें',
      caution: 'सावधानी काल',
      auspicious: 'शुभ',
    }
  };

  const t = translations[language] || translations.en;

  const vaarTranslations: Record<string, string> = {
    Sunday: 'रविवार',
    Monday: 'सोमवार',
    Tuesday: 'मंगलवार',
    Wednesday: 'बुधवार',
    Thursday: 'गुरुवार',
    Friday: 'शुक्रवार',
    Saturday: 'शनिवार'
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[new Date().getDay()];

  // Default panchang data if not available
  const panchangData = panchang || {
    tithi: { name: 'Shukla Pratipada', deity: 'Agni' },
    nakshatra: { name: 'Ashwini', deity: 'Ashwini Kumaras' },
    yoga: { name: 'Vishkumbha' },
    karana: { name: 'Bava' },
    vaar: currentDay,
    sunrise: '06:30',
    sunset: '18:30',
    rahu_kaal: { start: '09:00', end: '10:30' },
    abhijit_muhurat: { start: '12:00', end: '12:48' },
  };

  return (
    <Card className="h-full bg-gradient-to-br from-background to-secondary/5 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-cinzel">
          <Calendar className="w-5 h-5 text-primary" />
          {t.title}
          <Badge variant="outline" className="ml-auto text-xs">
            {format(new Date(), 'dd MMM yyyy')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Panchang Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Tithi */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Moon className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{t.tithi}</span>
            </div>
            <p className="font-semibold text-sm">{panchangData.tithi?.name || 'N/A'}</p>
          </div>

          {/* Nakshatra */}
          <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/10">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{t.nakshatra}</span>
            </div>
            <p className="font-semibold text-sm">{panchangData.nakshatra?.name || 'N/A'}</p>
          </div>

          {/* Yoga */}
          <div className="p-3 rounded-lg bg-muted/30 border border-muted/50">
            <span className="text-xs text-muted-foreground">{t.yoga}</span>
            <p className="font-semibold text-sm">{panchangData.yoga?.name || 'N/A'}</p>
          </div>

          {/* Karana */}
          <div className="p-3 rounded-lg bg-muted/30 border border-muted/50">
            <span className="text-xs text-muted-foreground">{t.karana}</span>
            <p className="font-semibold text-sm">{panchangData.karana?.name || 'N/A'}</p>
          </div>
        </div>

        {/* Sunrise & Sunset */}
        <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500/10 to-blue-500/10">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-orange-400" />
            <div>
              <p className="text-xs text-muted-foreground">{t.sunrise}</p>
              <p className="font-semibold text-sm">{panchangData.sunrise}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-blue-400" />
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{t.sunset}</p>
              <p className="font-semibold text-sm">{panchangData.sunset}</p>
            </div>
          </div>
        </div>

        {/* Rahu Kaal - Warning */}
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-xs font-medium text-destructive">{t.rahuKaal}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <p className="font-semibold text-sm">
              {panchangData.rahu_kaal?.start} - {panchangData.rahu_kaal?.end}
            </p>
            <Badge variant="destructive" className="text-[10px] ml-auto">{t.caution}</Badge>
          </div>
        </div>

        {/* Expandable Section */}
        {expanded && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            {/* Abhijit Muhurat - Auspicious */}
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-green-600">{t.abhijitMuhurat}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <p className="font-semibold text-sm">
                  {panchangData.abhijit_muhurat?.start} - {panchangData.abhijit_muhurat?.end}
                </p>
                <Badge className="text-[10px] ml-auto bg-green-500">{t.auspicious}</Badge>
              </div>
            </div>

            {/* Vaar */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <span className="text-xs text-muted-foreground">{t.vaar}</span>
              <p className="font-semibold text-sm">
                {language === 'hi' ? vaarTranslations[panchangData.vaar] || panchangData.vaar : panchangData.vaar}
              </p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              {t.showLess}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              {t.showMore}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PanchangWidget;
