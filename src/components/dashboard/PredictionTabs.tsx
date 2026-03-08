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

  const t = language === 'hi' ? {
    title: 'भविष्यफल',
    daily: 'दैनिक', weekly: 'साप्ताहिक', monthly: 'मासिक', yearly: 'वार्षिक',
    loading: 'लोड हो रहा है...', basedOn: 'कुंडली + पंचांग + गोचर',
  } : {
    title: 'Predictions',
    daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly',
    loading: 'Loading...', basedOn: 'Kundli + Panchang + Transits',
  };

  const fetchPrediction = async (type: string) => {
    if (predictions[type]) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-personalized-prediction', {
        body: { predictionType: type, language }
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
    if (userId) fetchPrediction(activeTab);
  }, [activeTab, userId]);

  const tabConfig = [
    { key: 'daily', label: t.daily, icon: Calendar },
    { key: 'weekly', label: t.weekly, icon: CalendarDays },
    { key: 'monthly', label: t.monthly, icon: CalendarRange },
    { key: 'yearly', label: t.yearly, icon: CalendarClock },
  ];

  const renderContent = (type: string) => {
    const pred = predictions[type];
    
    if (loading && !pred) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mb-3 text-primary" />
          <p className="text-sm">{t.loading}</p>
        </div>
      );
    }

    if (!pred) {
      return (
        <div className="py-12 text-center text-muted-foreground text-sm">
          <p>Tap to load prediction</p>
        </div>
      );
    }

    const content = language === 'hi' ? pred.content_hi : pred.content_en;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-medium">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
          <span className="text-[10px] text-muted-foreground">{t.basedOn}</span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
          {content || 'No prediction available.'}
        </p>
      </div>
    );
  };

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display">{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-muted/30 h-9">
            {tabConfig.map(({ key, label, icon: Icon }) => (
              <TabsTrigger
                key={key}
                value={key}
                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon className="w-3.5 h-3.5 mr-1 hidden sm:inline" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabConfig.map(({ key }) => (
            <TabsContent key={key} value={key} className="mt-4">
              {renderContent(key)}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PredictionTabs;
