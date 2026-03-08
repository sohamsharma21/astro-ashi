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

  const t = language === 'hi' ? {
    title: 'आज का पंचांग',
    tithi: 'तिथि', nakshatra: 'नक्षत्र', yoga: 'योग', karana: 'करण',
    sunrise: 'सूर्योदय', sunset: 'सूर्यास्त', rahuKaal: 'राहु काल',
    abhijitMuhurat: 'अभिजीत मुहूर्त', showMore: 'और देखें', showLess: 'कम देखें',
    caution: 'सावधानी', auspicious: 'शुभ', vaar: 'वार',
  } : {
    title: "Today's Panchang",
    tithi: 'Tithi', nakshatra: 'Nakshatra', yoga: 'Yoga', karana: 'Karana',
    sunrise: 'Sunrise', sunset: 'Sunset', rahuKaal: 'Rahu Kaal',
    abhijitMuhurat: 'Abhijit Muhurat', showMore: 'Show More', showLess: 'Show Less',
    caution: 'Caution', auspicious: 'Auspicious', vaar: 'Day',
  };

  const vaarHi: Record<string, string> = {
    Sunday: 'रविवार', Monday: 'सोमवार', Tuesday: 'मंगलवार', Wednesday: 'बुधवार',
    Thursday: 'गुरुवार', Friday: 'शुक्रवार', Saturday: 'शनिवार'
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[new Date().getDay()];

  const data = panchang || {
    tithi: { name: 'Shukla Pratipada' },
    nakshatra: { name: 'Ashwini' },
    yoga: { name: 'Vishkumbha' },
    karana: { name: 'Bava' },
    vaar: currentDay,
    sunrise: '06:30', sunset: '18:30',
    rahu_kaal: { start: '09:00', end: '10:30' },
    abhijit_muhurat: { start: '12:00', end: '12:48' },
  };

  return (
    <Card className="h-full border-border/50 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-display">
            <Calendar className="w-4 h-4 text-primary" />
            {t.title}
          </CardTitle>
          <Badge variant="outline" className="text-[10px] font-medium">
            {format(new Date(), 'dd MMM')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Panchang Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-1.5 mb-1">
              <Moon className="w-3 h-3 text-primary/70" />
              <span className="text-[10px] text-muted-foreground font-medium">{t.tithi}</span>
            </div>
            <p className="font-semibold text-xs">{data.tithi?.name || 'N/A'}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-secondary/30 border border-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Star className="w-3 h-3 text-primary/70" />
              <span className="text-[10px] text-muted-foreground font-medium">{t.nakshatra}</span>
            </div>
            <p className="font-semibold text-xs">{data.nakshatra?.name || 'N/A'}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/30 border border-border/30">
            <span className="text-[10px] text-muted-foreground font-medium">{t.yoga}</span>
            <p className="font-semibold text-xs">{data.yoga?.name || 'N/A'}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/30 border border-border/30">
            <span className="text-[10px] text-muted-foreground font-medium">{t.karana}</span>
            <p className="font-semibold text-xs">{data.karana?.name || 'N/A'}</p>
          </div>
        </div>

        {/* Sunrise/Sunset */}
        <div className="flex justify-between items-center px-3 py-2.5 rounded-lg bg-gradient-to-r from-amber-500/5 to-cosmic-blue/5 border border-border/30">
          <div className="flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <div>
              <p className="text-[10px] text-muted-foreground">{t.sunrise}</p>
              <p className="font-semibold text-xs">{data.sunrise}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="w-3.5 h-3.5 text-cosmic-blue" />
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">{t.sunset}</p>
              <p className="font-semibold text-xs">{data.sunset}</p>
            </div>
          </div>
        </div>

        {/* Rahu Kaal */}
        <div className="p-2.5 rounded-lg bg-destructive/5 border border-destructive/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
              <span className="text-[10px] font-medium text-destructive">{t.rahuKaal}</span>
            </div>
            <Badge variant="outline" className="text-[9px] border-destructive/20 text-destructive">{t.caution}</Badge>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <p className="font-semibold text-xs">{data.rahu_kaal?.start} - {data.rahu_kaal?.end}</p>
          </div>
        </div>

        {expanded && (
          <div className="space-y-2 animate-fade-in">
            <div className="p-2.5 rounded-lg bg-green-500/5 border border-green-500/10">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[10px] font-medium text-green-600">{t.abhijitMuhurat}</span>
                <Badge className="text-[9px] ml-auto bg-green-500/10 text-green-600 border-green-500/20">{t.auspicious}</Badge>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <p className="font-semibold text-xs">{data.abhijit_muhurat?.start} - {data.abhijit_muhurat?.end}</p>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
              <span className="text-[10px] text-muted-foreground font-medium">{t.vaar}</span>
              <p className="font-semibold text-xs">
                {language === 'hi' ? vaarHi[data.vaar] || data.vaar : data.vaar}
              </p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground text-xs h-8 hover:bg-muted/30"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <><ChevronUp className="w-3.5 h-3.5 mr-1.5" />{t.showLess}</> : <><ChevronDown className="w-3.5 h-3.5 mr-1.5" />{t.showMore}</>}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PanchangWidget;
