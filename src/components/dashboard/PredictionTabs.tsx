import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  const tabs = [
    { key: 'daily', label: t.daily, icon: Calendar },
    { key: 'weekly', label: t.weekly, icon: CalendarDays },
    { key: 'monthly', label: t.monthly, icon: CalendarRange },
    { key: 'yearly', label: t.yearly, icon: CalendarClock },
  ];

  const renderContent = (type: string) => {
    const pred = predictions[type];
    if (loading && !pred) {
      return (
        <div className="flex flex-col items-center justify-center py-14 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mb-2.5 text-primary" />
          <p className="text-xs">{t.loading}</p>
        </div>
      );
    }
    if (!pred) {
      return (
        <div className="py-10 text-center text-muted-foreground text-xs">
          <p>{language === 'en' ? 'Tap to load prediction' : 'भविष्यफल लोड करने के लिए टैप करें'}</p>
        </div>
      );
    }
    const content = language === 'hi' ? pred.content_hi : pred.content_en;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider font-semibold text-primary/60 bg-primary/[0.06] px-2 py-0.5 rounded-full">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
          <span className="text-[10px] text-muted-foreground">{t.basedOn}</span>
        </div>
        <p className="text-[13px] text-foreground/80 leading-relaxed whitespace-pre-line">
          {content || 'No prediction available.'}
        </p>
      </div>
    );
  };

  return (
    <Card className="border-border/40 bg-card">
      <CardHeader className="pb-3 px-5 pt-5">
        <CardTitle className="text-sm font-heading font-bold">{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {/* Custom tab bar */}
        <div className="flex bg-muted/20 rounded-xl p-1 mb-4">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5 hidden sm:block" />
              {label}
            </button>
          ))}
        </div>
        {renderContent(activeTab)}
      </CardContent>
    </Card>
  );
};

export default PredictionTabs;
