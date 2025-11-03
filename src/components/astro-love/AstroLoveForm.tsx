import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { AstroLoveFormData } from '@/hooks/useAstroLove';

interface AstroLoveFormProps {
  onSubmit: (data: AstroLoveFormData) => void;
  loading: boolean;
}

export const AstroLoveForm = ({ onSubmit, loading }: AstroLoveFormProps) => {
  const { language } = useAuth();
  const [formData, setFormData] = useState<AstroLoveFormData>({
    person1: { name: '', birthDate: '' },
    person2: { name: '', birthDate: '' }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="cosmic-card border-love-pink/30 bg-cosmic-deep-space/90 backdrop-blur">
      <CardHeader>
        <CardTitle className={`text-2xl text-center flex items-center justify-center gap-2 ${language === 'hi' ? 'font-noto-devanagari' : 'font-playfair'}`}>
          <Heart className="text-love-pink" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-love-purple to-love-pink">
            {language === 'en' ? 'Enter Your Details' : 'अपना विवरण दर्ज करें'}
          </span>
          <Heart className="text-love-pink" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold text-cosmic-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
              {language === 'en' ? 'First Person' : 'पहला व्यक्ति'}
            </h3>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder={language === 'en' ? 'Enter name' : 'नाम दर्ज करें'}
                value={formData.person1.name}
                onChange={(e) => setFormData({ ...formData, person1: { ...formData.person1, name: e.target.value } })}
                required
                className={`bg-cosmic-deep-space/50 border-cosmic-gold/30 text-white ${language === 'hi' ? 'font-noto-devanagari' : ''}`}
              />
              <Input
                type="date"
                value={formData.person1.birthDate}
                onChange={(e) => setFormData({ ...formData, person1: { ...formData.person1, birthDate: e.target.value } })}
                required
                className={`bg-cosmic-deep-space/50 border-cosmic-gold/30 text-white ${language === 'hi' ? 'font-noto-devanagari' : ''}`}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className={`text-lg font-semibold text-cosmic-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
              {language === 'en' ? 'Second Person' : 'दूसरा व्यक्ति'}
            </h3>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder={language === 'en' ? 'Enter name' : 'नाम दर्ज करें'}
                value={formData.person2.name}
                onChange={(e) => setFormData({ ...formData, person2: { ...formData.person2, name: e.target.value } })}
                required
                className={`bg-cosmic-deep-space/50 border-cosmic-gold/30 text-white ${language === 'hi' ? 'font-noto-devanagari' : ''}`}
              />
              <Input
                type="date"
                value={formData.person2.birthDate}
                onChange={(e) => setFormData({ ...formData, person2: { ...formData.person2, birthDate: e.target.value } })}
                required
                className={`bg-cosmic-deep-space/50 border-cosmic-gold/30 text-white ${language === 'hi' ? 'font-noto-devanagari' : ''}`}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-love-purple to-love-pink hover:from-love-purple/80 hover:to-love-pink/80 text-white font-semibold py-6 text-lg transition-all duration-300 hover:scale-105 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}
          >
            {loading ? (
              language === 'en' ? 'Calculating...' : 'गणना हो रही है...'
            ) : (
              <>
                <Heart className="mr-2 h-5 w-5" />
                {language === 'en' ? 'Calculate Love Compatibility' : 'प्रेम संगतता की गणना करें'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
