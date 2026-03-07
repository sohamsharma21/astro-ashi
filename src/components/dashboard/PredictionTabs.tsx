import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, CalendarDays, CalendarRange, CalendarClock } from 'lucide-react';

interface PredictionTabsProps {
  userId: string;
}

const PredictionTabs = ({ userId }: PredictionTabsProps) => {
  const { language } = useAuth();
  const [activeTab, setActiveTab] = useState('daily');
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<Record<string, any>>({});

  const translations = {
    en: {
      title: 'Your Predictions',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly',
      loading: 'Generating prediction...',
      basedOn: 'Based on your Kundli + Panchang + Transits',
    },
    hi: {
      title: 'आपका भविष्यफल',
      daily: 'दैनिक',
      weekly: 'साप्ताहिक',
      monthly: 'मासिक',
      yearly: 'वार्षिक',
      loading: 'भविष्यफल बन रहा है...',
      basedOn: 'आपकी कुंडली + पंचांग + गोचर पर आधारित',
    }
  };

  const t = translations[language] || translations.en;

  const fetchPrediction = async (type: string) => {
    if (predictions[type]) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-personalized-prediction', {
        body: {
          predictionType: type,
          language
        }
      });

      if (error) throw error;
      
      setPredictions(prev => ({ ...prev, [type]: data }));
    } catch (error) {
      console.error('Prediction fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPrediction(activeTab);
    }
  }, [activeTab, userId]);

  const tabConfig = [
    { key: 'daily', label: t.daily, icon: Calendar },
    { key: 'weekly', label: t.weekly, icon: CalendarDays },
    { key: 'monthly', label: t.monthly, icon: CalendarRange },
    { key: 'yearly', label: t.yearly, icon: CalendarClock },
  ];

  const renderPredictionContent = (type: string) => {
    const pred = predictions[type];
    
    if (loading && !pred) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
          <p>{t.loading}</p>
        </div>
      );
    }

    if (!pred) {
      return (
        <div className="py-8 text-center text-muted-foreground">
          <p>Click to load prediction</p>
        </div>
      );
    }

    const content = language === 'hi' ? pred.content_hi : pred.content_en;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
          <span className="text-xs text-muted-foreground">{t.basedOn}</span>
        </div>
        
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-foreground leading-relaxed whitespace-pre-line">
            {content || 'No prediction available.'}
          </p>
        </div>

        {/* Factors breakdown */}
        {pred.factors && (
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
            <div className="text-center p-2 rounded bg-primary/5">
              <p className="text-xs text-muted-foreground">Kundli</p>
              <p className="text-lg font-bold text-primary">40%</p>
            </div>
            <div className="text-center p-2 rounded bg-secondary/10">
              <p className="text-xs text-muted-foreground">Transits</p>
              <p className="text-lg font-bold">30%</p>
            </div>
            <div className="text-center p-2 rounded bg-muted/30">
              <p className="text-xs text-muted-foreground">Panchang</p>
              <p className="text-lg font-bold">20%</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="font-cinzel">{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-muted/30">
            {tabConfig.map(({ key, label, icon: Icon }) => (
              <TabsTrigger
                key={key}
                value={key}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon className="w-4 h-4 mr-1 hidden sm:inline" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabConfig.map(({ key }) => (
            <TabsContent key={key} value={key} className="mt-4">
              {renderPredictionContent(key)}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PredictionTabs;
