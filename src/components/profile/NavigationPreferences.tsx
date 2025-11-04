import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useNavPreference } from '@/hooks/useNavPreference';
import { NavDisplayMode } from '@/lib/navigationConfig';
import { Home, Calendar, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

export const NavigationPreferences = () => {
  const { language } = useAuth();
  const { navDisplayMode, updateNavPreference, loading } = useNavPreference();
  const [selectedMode, setSelectedMode] = useState<NavDisplayMode>(navDisplayMode);
  const [applying, setApplying] = useState(false);

  const handleModeChange = (value: string) => {
    setSelectedMode(value as NavDisplayMode);
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await updateNavPreference(selectedMode);
      toast.success(
        language === 'en' 
          ? 'Navigation preference updated successfully!' 
          : 'नेविगेशन प्राथमिकता सफलतापूर्वक अपडेट की गई!'
      );
    } catch (error) {
      toast.error(
        language === 'en' 
          ? 'Failed to update navigation preference' 
          : 'नेविगेशन प्राथमिकता अपडेट करने में विफल'
      );
    } finally {
      setApplying(false);
    }
  };

  const hasChanges = selectedMode !== navDisplayMode;

  if (loading) return null;

  return (
    <Card className="bg-cosmic-deep-space border-cosmic-gold border-opacity-30">
      <CardHeader>
        <CardTitle className={`text-cosmic-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' ? 'Navigation Display' : 'नेविगेशन प्रदर्शन'}
        </CardTitle>
        <CardDescription className={`text-cosmic-silver ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' 
            ? 'Choose how navigation items are displayed in the menu bar'
            : 'मेनू बार में नेविगेशन आइटम कैसे प्रदर्शित होते हैं यह चुनें'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selectedMode} onValueChange={handleModeChange}>
          <div className="flex items-center space-x-3 p-3 rounded-lg border border-cosmic-gold border-opacity-20 hover:border-opacity-40 transition-all">
            <RadioGroupItem value="icons" id="icons" />
            <Label 
              htmlFor="icons" 
              className={`flex-1 cursor-pointer ${language === 'hi' ? 'font-noto-devanagari' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Home className="h-4 w-4 text-cosmic-gold" />
                <Calendar className="h-4 w-4 text-cosmic-gold" />
                <Sparkles className="h-4 w-4 text-cosmic-gold" />
              </div>
              <div className="text-sm font-medium text-white">
                {language === 'en' ? 'Icons Only' : 'केवल आइकन'}
              </div>
              <div className="text-xs text-cosmic-silver">
                {language === 'en' 
                  ? 'Compact view with icons, labels appear on hover'
                  : 'आइकन के साथ कॉम्पैक्ट व्यू, होवर पर लेबल दिखते हैं'}
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg border border-cosmic-gold border-opacity-20 hover:border-opacity-40 transition-all">
            <RadioGroupItem value="both" id="both" />
            <Label 
              htmlFor="both" 
              className={`flex-1 cursor-pointer ${language === 'hi' ? 'font-noto-devanagari' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Home className="h-4 w-4 text-cosmic-gold" />
                <span className="text-xs text-cosmic-gold">{language === 'en' ? 'Home' : 'होम'}</span>
              </div>
              <div className="text-sm font-medium text-white">
                {language === 'en' ? 'Icons + Text' : 'आइकन + पाठ'}
              </div>
              <div className="text-xs text-cosmic-silver">
                {language === 'en' 
                  ? 'Icons with text labels for clarity'
                  : 'स्पष्टता के लिए पाठ लेबल के साथ आइकन'}
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg border border-cosmic-gold border-opacity-20 hover:border-opacity-40 transition-all">
            <RadioGroupItem value="text" id="text" />
            <Label 
              htmlFor="text" 
              className={`flex-1 cursor-pointer ${language === 'hi' ? 'font-noto-devanagari' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-cosmic-gold">
                  {language === 'en' ? 'Home  •  Horoscope  •  Kundli' : 'होम  •  राशिफल  •  कुंडली'}
                </span>
              </div>
              <div className="text-sm font-medium text-white">
                {language === 'en' ? 'Text Only' : 'केवल पाठ'}
              </div>
              <div className="text-xs text-cosmic-silver">
                {language === 'en' 
                  ? 'Classic text-based navigation'
                  : 'पारंपरिक पाठ-आधारित नेविगेशन'}
              </div>
            </Label>
          </div>
        </RadioGroup>

        <div className={`text-xs text-cosmic-silver bg-cosmic-violet bg-opacity-10 p-3 rounded-lg ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          💡 {language === 'en' 
            ? 'Tip: Icons Only mode provides a cleaner, more spacious interface'
            : 'सुझाव: केवल आइकन मोड एक साफ़, अधिक विशाल इंटरफ़ेस प्रदान करता है'}
        </div>

        <Button
          onClick={handleApply}
          disabled={!hasChanges || applying}
          className={`w-full bg-cosmic-gold hover:bg-cosmic-gold/90 text-cosmic-deep-space font-semibold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}
        >
          <Check className="h-4 w-4 mr-2" />
          {applying 
            ? (language === 'en' ? 'Applying...' : 'लागू हो रहा है...')
            : (language === 'en' ? 'Apply Changes' : 'परिवर्तन लागू करें')
          }
        </Button>
      </CardContent>
    </Card>
  );
};
