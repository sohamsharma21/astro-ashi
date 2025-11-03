
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodiacSigns, ZodiacSign } from '@/lib/constants';
import { useAuth } from '@/lib/auth';

interface CompatibilityFormProps {
  onSubmit: (formData: CompatibilityFormData) => void;
  loading: boolean;
}

export interface CompatibilityFormData {
  person1: {
    name: string;
    sign: ZodiacSign;
  };
  person2: {
    name: string;
    sign: ZodiacSign;
  };
}

export const CompatibilityForm = ({ onSubmit, loading }: CompatibilityFormProps) => {
  const { language } = useAuth();
  const [formData, setFormData] = useState<CompatibilityFormData>({
    person1: {
      name: '',
      sign: 'aries' as ZodiacSign
    },
    person2: {
      name: '',
      sign: 'taurus' as ZodiacSign
    }
  });

  const handleChange = (person: 'person1' | 'person2', field: string, value: string) => {
    setFormData({
      ...formData,
      [person]: {
        ...formData[person],
        [field]: field === 'sign' ? value as ZodiacSign : value
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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

  return (
    <div className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg p-8 rounded-lg border border-cosmic-gold border-opacity-20">
      <h2 className="text-2xl font-bold mb-6 text-cosmic-gold text-center">
        {language === 'en' ? 'Enter Details' : 'विवरण दर्ज करें'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="p-6 border border-cosmic-gold border-opacity-30 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-white">
            {language === 'en' ? 'First Person' : 'पहला व्यक्ति'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="person1-name" className="block text-sm font-medium text-gray-200 mb-1">
                {language === 'en' ? 'Name' : 'नाम'}
              </label>
              <Input
                id="person1-name"
                value={formData.person1.name}
                onChange={(e) => handleChange('person1', 'name', e.target.value)}
                required
                className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
              />
            </div>
            
            <div>
              <label htmlFor="person1-sign" className="block text-sm font-medium text-gray-200 mb-1">
                {language === 'en' ? 'Zodiac Sign' : 'राशि'}
              </label>
              <select
                id="person1-sign"
                value={formData.person1.sign}
                onChange={(e) => handleChange('person1', 'sign', e.target.value)}
                required
                className="w-full bg-cosmic-deep-space bg-opacity-50 border border-cosmic-gold border-opacity-30 text-white rounded-md p-2"
              >
                {zodiacSigns.map((sign) => (
                  <option key={sign} value={sign}>
                    {getZodiacSignName(sign)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="p-6 border border-cosmic-gold border-opacity-30 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-white">
            {language === 'en' ? 'Second Person' : 'दूसरा व्यक्ति'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="person2-name" className="block text-sm font-medium text-gray-200 mb-1">
                {language === 'en' ? 'Name' : 'नाम'}
              </label>
              <Input
                id="person2-name"
                value={formData.person2.name}
                onChange={(e) => handleChange('person2', 'name', e.target.value)}
                required
                className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
              />
            </div>
            
            <div>
              <label htmlFor="person2-sign" className="block text-sm font-medium text-gray-200 mb-1">
                {language === 'en' ? 'Zodiac Sign' : 'राशि'}
              </label>
              <select
                id="person2-sign"
                value={formData.person2.sign}
                onChange={(e) => handleChange('person2', 'sign', e.target.value)}
                required
                className="w-full bg-cosmic-deep-space bg-opacity-50 border border-cosmic-gold border-opacity-30 text-white rounded-md p-2"
              >
                {zodiacSigns.map((sign) => (
                  <option key={sign} value={sign}>
                    {getZodiacSignName(sign)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="cosmic-button w-full"
        >
          {loading 
            ? (language === 'en' ? 'Calculating...' : 'गणना कर रहा है...') 
            : (language === 'en' ? 'Calculate Compatibility' : 'संगतता की गणना करें')}
        </Button>
      </form>
    </div>
  );
};
