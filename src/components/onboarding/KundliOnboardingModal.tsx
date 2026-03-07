import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Stars, Moon, Sun } from 'lucide-react';

interface KundliOnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

const KundliOnboardingModal = ({ open, onComplete }: KundliOnboardingModalProps) => {
  const { user, language } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    birth_time: '',
    birth_place: '',
    gender: '',
    preferred_language: language || 'en',
    latitude: null as number | null,
    longitude: null as number | null,
    religion: 'hindu',
    country: '',
    caste: '',
    birth_time_known: true,
  });

  const translations = {
    en: {
      title: 'Complete Your Cosmic Profile',
      subtitle: 'We need your birth details to create your personalized Kundli',
      step1: 'Personal Details',
      step2: 'Birth Information',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      gender: 'Gender',
      selectGender: 'Select gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      preferNotToSay: 'Prefer not to say',
      language: 'Preferred Language',
      next: 'Next',
      birthDate: 'Date of Birth',
      birthTime: 'Time of Birth',
      birthPlace: 'Place of Birth',
      birthPlacePlaceholder: 'City, Country',
      generating: 'Generating Your Kundli...',
      createKundli: 'Create My Kundli',
      back: 'Back',
      required: 'This field is required',
      whyNeeded: 'Your birth details are essential for accurate Vedic astrology predictions based on your unique planetary positions.',
    },
    hi: {
      title: 'अपनी कौस्मिक प्रोफाइल पूरी करें',
      subtitle: 'आपकी व्यक्तिगत कुंडली बनाने के लिए हमें आपके जन्म विवरण की आवश्यकता है',
      step1: 'व्यक्तिगत विवरण',
      step2: 'जन्म जानकारी',
      fullName: 'पूरा नाम',
      fullNamePlaceholder: 'अपना पूरा नाम दर्ज करें',
      gender: 'लिंग',
      selectGender: 'लिंग चुनें',
      male: 'पुरुष',
      female: 'महिला',
      other: 'अन्य',
      preferNotToSay: 'बताना नहीं चाहते',
      language: 'पसंदीदा भाषा',
      next: 'आगे',
      birthDate: 'जन्म तिथि',
      birthTime: 'जन्म समय',
      birthPlace: 'जन्म स्थान',
      birthPlacePlaceholder: 'शहर, देश',
      generating: 'आपकी कुंडली बन रही है...',
      createKundli: 'मेरी कुंडली बनाएं',
      back: 'पीछे',
      required: 'यह फ़ील्ड आवश्यक है',
      whyNeeded: 'आपके अद्वितीय ग्रह स्थितियों के आधार पर सटीक वैदिक ज्योतिष भविष्यवाणियों के लिए आपके जन्म विवरण आवश्यक हैं।',
    }
  };

  const t = translations[language] || translations.en;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const geocodePlace = async (place: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Geocode the birth place
      const coords = await geocodePlace(formData.birth_place);
      
      // Generate Kundli via edge function
      const { data: kundliData, error: kundliError } = await supabase.functions.invoke('generate-kundli', {
        body: {
          birthDate: formData.birth_date,
          birthTime: formData.birth_time,
          latitude: coords?.lat || 28.6139,
          longitude: coords?.lng || 77.2090,
          birthPlace: formData.birth_place,
        }
      });

      if (kundliError) throw kundliError;

      // Update profile with all data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          birth_date: formData.birth_date,
          birth_time: formData.birth_time_known ? formData.birth_time : '12:00',
          birth_place: formData.birth_place,
          gender: formData.gender,
          preferred_language: formData.preferred_language,
          latitude: coords?.lat || 28.6139,
          longitude: coords?.lng || 77.2090,
          lagna: kundliData?.ascendant?.sign || 'Aries',
          moon_sign: kundliData?.planets?.find((p: any) => p.name === 'Moon')?.sign || 'Aries',
          nakshatra: kundliData?.planets?.find((p: any) => p.name === 'Moon')?.nakshatra || 'Ashwini',
          kundli_generated: true,
          kundli_data: kundliData,
          religion: formData.religion,
          country: formData.country,
          caste: formData.caste || null,
          birth_time_known: formData.birth_time_known,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Store Mahadasha data if available
      if (kundliData?.mahadasha) {
        const { error: mahadashaError } = await supabase
          .from('user_mahadasha')
          .upsert({
            user_id: user.id,
            current_mahadasha: kundliData.mahadasha.current_mahadasha || 'Rahu',
            current_antardasha: kundliData.mahadasha.current_antardasha || 'Rahu',
            mahadasha_start: kundliData.mahadasha.mahadasha_start || new Date().toISOString().split('T')[0],
            mahadasha_end: kundliData.mahadasha.mahadasha_end || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            antardasha_start: kundliData.mahadasha.antardasha_start || new Date().toISOString().split('T')[0],
            antardasha_end: kundliData.mahadasha.antardasha_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            all_periods: kundliData.mahadasha.all_periods || [],
          }, { onConflict: 'user_id' });

        if (mahadashaError) console.error('Mahadasha save error:', mahadashaError);
      }

      toast.success(language === 'hi' ? 'कुंडली सफलतापूर्वक बनाई गई!' : 'Kundli generated successfully!');
      onComplete();
    } catch (error) {
      console.error('Kundli generation error:', error);
      toast.error(language === 'hi' ? 'कुंडली बनाने में त्रुटि' : 'Error generating Kundli');
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = formData.full_name.trim() !== '' && formData.religion !== '';
  const isStep2Valid = formData.birth_date !== '' && (formData.birth_time !== '' || !formData.birth_time_known) && formData.birth_place.trim() !== '';

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-background via-secondary/20 to-background border-primary/20 [&>button]:hidden">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/20 animate-pulse">
              <Stars className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-cinzel text-gradient-gold text-center">
            {t.title}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mt-2">
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 my-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              1
            </div>
            <span className="text-sm hidden sm:inline">{t.step1}</span>
          </div>
          <div className="w-8 h-0.5 bg-muted">
            <div className={`h-full bg-primary transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
          </div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              2
            </div>
            <span className="text-sm hidden sm:inline">{t.step2}</span>
          </div>
        </div>

        <div className="space-y-4 py-4">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-primary" />
                  {t.fullName} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="full_name"
                  placeholder={t.fullNamePlaceholder}
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="bg-background/50 border-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">{t.gender}</Label>
                <Select value={formData.gender} onValueChange={(val) => handleInputChange('gender', val)}>
                  <SelectTrigger className="bg-background/50 border-primary/20">
                    <SelectValue placeholder={t.selectGender} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t.male}</SelectItem>
                    <SelectItem value="female">{t.female}</SelectItem>
                    <SelectItem value="other">{t.other}</SelectItem>
                    <SelectItem value="prefer_not_to_say">{t.preferNotToSay}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">{t.language}</Label>
                <Select value={formData.preferred_language} onValueChange={(val) => handleInputChange('preferred_language', val)}>
                  <SelectTrigger className="bg-background/50 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="w-full cosmic-button"
              >
                {t.next}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <Label htmlFor="birth_date" className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-primary" />
                  {t.birthDate} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleInputChange('birth_date', e.target.value)}
                  className="bg-background/50 border-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth_time" className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-primary" />
                  {t.birthTime} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="birth_time"
                  type="time"
                  value={formData.birth_time}
                  onChange={(e) => handleInputChange('birth_time', e.target.value)}
                  className="bg-background/50 border-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth_place" className="flex items-center gap-2">
                  <Stars className="h-4 w-4 text-primary" />
                  {t.birthPlace} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="birth_place"
                  placeholder={t.birthPlacePlaceholder}
                  value={formData.birth_place}
                  onChange={(e) => handleInputChange('birth_place', e.target.value)}
                  className="bg-background/50 border-primary/20 focus:border-primary"
                />
              </div>

              <p className="text-xs text-muted-foreground text-center italic">
                {t.whyNeeded}
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                  disabled={loading}
                >
                  {t.back}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!isStep2Valid || loading}
                  className="flex-1 cosmic-button"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.generating}
                    </>
                  ) : (
                    t.createKundli
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KundliOnboardingModal;
