
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodiacSigns, ZodiacSign } from '@/lib/constants';
import { Loader2 } from 'lucide-react';
import { UserProfile } from '@/lib/auth';

interface ProfileFormProps {
  userProfile: UserProfile | null;
  language: 'en' | 'hi';
  isMobile: boolean;
  onSubmit: (formData: ProfileFormData) => Promise<void>;
}

export interface ProfileFormData {
  full_name: string;
  birth_date: string;
  birth_place: string;
  primary_zodiac_sign: ZodiacSign | '';
}

const ProfileForm = ({ userProfile, language, isMobile, onSubmit }: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    birth_date: '',
    birth_place: '',
    primary_zodiac_sign: '' as ZodiacSign | '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        birth_date: userProfile.birth_date ? new Date(userProfile.birth_date).toISOString().split('T')[0] : '',
        birth_place: userProfile.birth_place || '',
        primary_zodiac_sign: userProfile.primary_zodiac_sign as ZodiacSign || '',
      });
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const getZodiacSignName = (sign: ZodiacSign) => {
    const signNames = {
      aries: language === 'en' ? 'Aries' : 'मेष',
      taurus: language === 'en' ? 'Taurus' : 'वृषभ',
      gemini: language === 'en' ? 'Gemini' : 'मिथुन',
      cancer: language === 'en' ? 'Cancer' : 'कर्क',
      leo: language === 'en' ? 'Leo' : 'सिंह',
      virgo: language === 'en' ? 'Virgo' : 'कन्या',
      libra: language === 'en' ? 'Libra' : 'तुला',
      scorpio: language === 'en' ? 'Scorpio' : 'वृश्चिक',
      sagittarius: language === 'en' ? 'Sagittarius' : 'धनु',
      capricorn: language === 'en' ? 'Capricorn' : 'मकर',
      aquarius: language === 'en' ? 'Aquarius' : 'कुंभ',
      pisces: language === 'en' ? 'Pisces' : 'मीन'
    };
    
    return signNames[sign];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSubmit(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-200 mb-1">
          {language === 'en' ? 'Full Name' : 'पूरा नाम'}
        </label>
        <Input
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className={`bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white ${
            isMobile ? 'text-base' : ''
          }`}
        />
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'}`}>
        <div>
          <label htmlFor="birth_date" className="block text-sm font-medium text-gray-200 mb-1">
            {language === 'en' ? 'Birth Date' : 'जन्म तिथि'}
          </label>
          <Input
            id="birth_date"
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
          />
        </div>
        
        <div>
          <label htmlFor="birth_place" className="block text-sm font-medium text-gray-200 mb-1">
            {language === 'en' ? 'Birth Place' : 'जन्म स्थान'}
          </label>
          <Input
            id="birth_place"
            name="birth_place"
            value={formData.birth_place}
            onChange={handleChange}
            className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="primary_zodiac_sign" className="block text-sm font-medium text-gray-200 mb-1">
          {language === 'en' ? 'Primary Zodiac Sign' : 'प्राथमिक राशि'}
        </label>
        <Select
          value={formData.primary_zodiac_sign}
          onValueChange={(value) => handleSelectChange('primary_zodiac_sign', value)}
        >
          <SelectTrigger className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white">
            <SelectValue placeholder={language === 'en' ? 'Select your sign' : 'अपनी राशि चुनें'} />
          </SelectTrigger>
          <SelectContent className="bg-cosmic-deep-space border-cosmic-gold">
            {zodiacSigns.map((sign) => (
              <SelectItem key={sign} value={sign} className="text-white hover:bg-cosmic-violet">
                {getZodiacSignName(sign)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={isSaving}
        className="cosmic-button w-full"
      >
        {isSaving 
          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {language === 'en' ? 'Saving...' : 'सहेज रहा है...'}
            </> 
          : (language === 'en' ? 'Save Profile' : 'प्रोफ़ाइल सहेजें')}
      </Button>
    </form>
  );
};

export default ProfileForm;
