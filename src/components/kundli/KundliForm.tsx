
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';

interface KundliFormProps {
  onSubmit: (formData: KundliFormData) => void;
  loading: boolean;
}

export interface KundliFormData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: string;
  longitude: string;
}

export const KundliForm = ({ onSubmit, loading }: KundliFormProps) => {
  const { language } = useAuth();
  const [formData, setFormData] = useState<KundliFormData>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    latitude: '',
    longitude: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg p-8 rounded-lg border border-cosmic-gold border-opacity-20">
      <h2 className="text-2xl font-bold mb-6 text-cosmic-gold text-center">
        {language === 'en' ? 'Enter Your Birth Details' : 'अपना जन्म विवरण दर्ज करें'}
      </h2>
      
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
              {language === 'en' ? 'Full Name' : 'पूरा नाम'}
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-200 mb-1">
              {language === 'en' ? 'Birth Place' : 'जन्म स्थान'}
            </label>
            <Input
              id="birthPlace"
              name="birthPlace"
              value={formData.birthPlace}
              onChange={handleChange}
              required
              className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-200 mb-1">
              {language === 'en' ? 'Birth Date' : 'जन्म तिथि'}
            </label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="birthTime" className="block text-sm font-medium text-gray-200 mb-1">
              {language === 'en' ? 'Birth Time' : 'जन्म समय'}
            </label>
            <Input
              id="birthTime"
              name="birthTime"
              type="time"
              value={formData.birthTime}
              onChange={handleChange}
              required
              className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-200 mb-1">
              {language === 'en' ? 'Latitude (optional)' : 'अक्षांश (वैकल्पिक)'}
            </label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={handleChange}
              className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-200 mb-1">
              {language === 'en' ? 'Longitude (optional)' : 'देशांतर (वैकल्पिक)'}
            </label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={handleChange}
              className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="cosmic-button w-full"
        >
          {loading 
            ? (language === 'en' ? 'Generating...' : 'उत्पन्न कर रहा है...') 
            : (language === 'en' ? 'Generate Kundli' : 'कुंडली बनाएं')}
        </Button>
      </form>
    </div>
  );
};
