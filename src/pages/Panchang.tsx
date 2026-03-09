import { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Star, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const Panchang = () => {
  const { language } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const translations = {
    en: {
      title: 'Panchang Calendar',
      subtitle: 'Browse Hindu calendar for any date',
      selectDate: 'Select Date',
      today: 'Today',
      tithi: 'Tithi',
      nakshatra: 'Nakshatra',
      yoga: 'Yoga',
      karana: 'Karana',
      vaar: 'Day',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      rahuKaal: 'Rahu Kaal',
      abhijitMuhurat: 'Abhijit Muhurat',
      shubhMuhurat: 'Auspicious Timings',
      ashubhMuhurat: 'Avoid Periods',
      caution: 'Avoid',
      auspicious: 'Auspicious',
      loading: 'Loading Panchang...',
      error: 'Failed to load Panchang',
      noData: 'No Panchang data available',
      paksha: 'Paksha',
      shukla: 'Shukla (Waxing)',
      krishna: 'Krishna (Waning)',
      deity: 'Deity',
    },
    hi: {
      title: 'पंचांग कैलेंडर',
      subtitle: 'किसी भी तिथि के लिए हिंदू कैलेंडर देखें',
      selectDate: 'तिथि चुनें',
      today: 'आज',
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
      ashubhMuhurat: 'अशुभ काल',
      caution: 'अशुभ',
      auspicious: 'शुभ',
      loading: 'पंचांग लोड हो रहा है...',
      error: 'पंचांग लोड करने में विफल',
      noData: 'पंचांग डेटा उपलब्ध नहीं है',
      paksha: 'पक्ष',
      shukla: 'शुक्ल पक्ष',
      krishna: 'कृष्ण पक्ष',
      deity: 'देवता',
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

  const { data: panchang, isLoading, error } = useQuery({
    queryKey: ['panchang', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-panchang', {
        body: { date: format(selectedDate, 'yyyy-MM-dd') }
      });
      if (error) throw error;
      return data;
    }
  });

  const goToPreviousDay = () => setSelectedDate(prev => subDays(prev, 1));
  const goToNextDay = () => setSelectedDate(prev => addDays(prev, 1));
  const goToToday = () => setSelectedDate(new Date());

  return (
    <>
      <SEOHead 
        title={`${t.title} - AstroAshi`}
        description="Browse Hindu Panchang calendar for any date. View Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, and auspicious timings."
        keywords="panchang, hindu calendar, tithi, nakshatra, yoga, karana, rahu kaal, muhurat, vedic calendar, पंचांग"
        canonical="/panchang"
      />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={100} />
        <Navigation />
        
        <main className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-24 lg:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-cinzel text-gradient-gold mb-2">
                {t.title}
              </h1>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>

            {/* Date Navigation */}
            <Card className="mb-6 bg-gradient-to-br from-background to-secondary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={goToPreviousDay}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(selectedDate, 'PPP')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>

                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={goToNextDay}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button variant="secondary" onClick={goToToday}>
                    {t.today}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Panchang Content */}
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-32 rounded-xl" />
                  <Skeleton className="h-32 rounded-xl" />
                </div>
              </div>
            ) : error ? (
              <Card className="border-destructive/50">
                <CardContent className="p-8 text-center">
                  <p className="text-destructive">{t.error}</p>
                </CardContent>
              </Card>
            ) : panchang ? (
              <div className="space-y-6">
                {/* Main Panchang Card */}
                <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/20 overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 font-cinzel">
                      <Sparkles className="w-5 h-5 text-primary" />
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-primary/20 text-primary">
                        {language === 'hi' ? vaarTranslations[panchang.vaar] : panchang.vaar}
                      </Badge>
                      <Badge variant="outline">
                        {panchang.tithi?.paksha === 'Shukla' 
                          ? (language === 'hi' ? t.shukla : 'Shukla Paksha')
                          : (language === 'hi' ? t.krishna : 'Krishna Paksha')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Primary Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {/* Tithi */}
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Moon className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground font-medium">{t.tithi}</span>
                        </div>
                        <p className="font-semibold">{panchang.tithi?.name || 'N/A'}</p>
                      </div>

                      {/* Nakshatra */}
                      <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground font-medium">{t.nakshatra}</span>
                        </div>
                        <p className="font-semibold">{panchang.nakshatra?.name || 'N/A'}</p>
                      </div>

                      {/* Yoga */}
                      <div className="p-4 rounded-xl bg-muted/30 border border-muted/50">
                        <span className="text-xs text-muted-foreground font-medium block mb-2">{t.yoga}</span>
                        <p className="font-semibold">{panchang.yoga?.name || 'N/A'}</p>
                      </div>

                      {/* Karana */}
                      <div className="p-4 rounded-xl bg-muted/30 border border-muted/50">
                        <span className="text-xs text-muted-foreground font-medium block mb-2">{t.karana}</span>
                        <p className="font-semibold">{panchang.karana?.name || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Sun Times */}
                    <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-blue-500/10 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-orange-500/20">
                          <Sun className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t.sunrise}</p>
                          <p className="font-bold text-lg">{panchang.sunrise}</p>
                        </div>
                      </div>
                      <div className="h-12 w-px bg-border" />
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-500/20">
                          <Moon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{t.sunset}</p>
                          <p className="font-bold text-lg">{panchang.sunset}</p>
                        </div>
                      </div>
                    </div>

                    {/* Muhurat Section */}
                    <div className="space-y-4">
                      {/* Shubh Muhurat */}
                      <div>
                        <h4 className="text-sm font-medium text-green-500 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          {t.shubhMuhurat || 'Shubh Muhurat'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {panchang.shubh_muhurat?.map((muhurat: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                              <p className="text-xs text-muted-foreground">{muhurat.name}</p>
                              <p className="font-semibold text-sm text-green-600">
                                {muhurat.start} - {muhurat.end}
                              </p>
                            </div>
                          )) || (
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                              <p className="text-xs text-muted-foreground">{t.abhijitMuhurat}</p>
                              <p className="font-semibold text-sm text-green-600">
                                {panchang.abhijit_muhurat?.start} - {panchang.abhijit_muhurat?.end}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ashubh / Avoid Periods */}
                      <div>
                        <h4 className="text-sm font-medium text-destructive mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          {t.ashubhMuhurat || 'Avoid Periods'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {panchang.ashubh_muhurat?.map((muhurat: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                              <p className="text-xs text-muted-foreground">{muhurat.name}</p>
                              <p className="font-semibold text-sm text-destructive">
                                {muhurat.start} - {muhurat.end}
                              </p>
                            </div>
                          )) || (
                            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                              <p className="text-xs text-muted-foreground">{t.rahuKaal}</p>
                              <p className="font-semibold text-sm text-destructive">
                                {panchang.rahu_kaal?.start} - {panchang.rahu_kaal?.end}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="bg-muted/20 border-muted/30">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground text-center">
                      {language === 'hi' 
                        ? 'पंचांग डेटा वैदिक ज्योतिष गणनाओं पर आधारित है। समय स्थानीय समय में दिए गए हैं।'
                        : 'Panchang data is based on Vedic astrology calculations. Times are shown in local time.'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">{t.noData}</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Panchang;
