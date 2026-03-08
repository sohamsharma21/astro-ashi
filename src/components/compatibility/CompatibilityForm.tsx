import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodiacSigns, ZodiacSign } from '@/lib/constants';
import { useAuth } from '@/lib/auth';
import { Users, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { CompatibilityFormData } from '@/hooks/useCompatibility';

interface CompatibilityFormProps {
  onSubmit: (formData: CompatibilityFormData) => void;
  loading: boolean;
}

export { type CompatibilityFormData };

export const CompatibilityForm = ({ onSubmit, loading }: CompatibilityFormProps) => {
  const { language } = useAuth();
  const [formData, setFormData] = useState<CompatibilityFormData>({
    person1: { name: '', sign: 'aries' as ZodiacSign, birthDate: '' },
    person2: { name: '', sign: 'taurus' as ZodiacSign, birthDate: '' }
  });

  const handleChange = (person: 'person1' | 'person2', field: string, value: string) => {
    setFormData({
      ...formData,
      [person]: { ...formData[person], [field]: field === 'sign' ? value as ZodiacSign : value }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getSignName = (sign: ZodiacSign) => {
    const names: Record<ZodiacSign, { en: string; hi: string }> = {
      aries: { en: 'Aries ♈', hi: 'मेष ♈' }, taurus: { en: 'Taurus ♉', hi: 'वृषभ ♉' },
      gemini: { en: 'Gemini ♊', hi: 'मिथुन ♊' }, cancer: { en: 'Cancer ♋', hi: 'कर्क ♋' },
      leo: { en: 'Leo ♌', hi: 'सिंह ♌' }, virgo: { en: 'Virgo ♍', hi: 'कन्या ♍' },
      libra: { en: 'Libra ♎', hi: 'तुला ♎' }, scorpio: { en: 'Scorpio ♏', hi: 'वृश्चिक ♏' },
      sagittarius: { en: 'Sagittarius ♐', hi: 'धनु ♐' }, capricorn: { en: 'Capricorn ♑', hi: 'मकर ♑' },
      aquarius: { en: 'Aquarius ♒', hi: 'कुंभ ♒' }, pisces: { en: 'Pisces ♓', hi: 'मीन ♓' }
    };
    return language === 'en' ? names[sign].en : names[sign].hi;
  };

  const PersonSection = ({ person, index, color }: { person: 'person1' | 'person2'; index: number; color: string }) => (
    <motion.div
      initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className={`space-y-3 p-4 rounded-xl bg-${color}-500/5 border border-${color}-500/15`}
      style={{ background: `hsl(${index === 0 ? '280' : '200'} 60% 50% / 0.05)`, borderColor: `hsl(${index === 0 ? '280' : '200'} 60% 50% / 0.15)` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-foreground"
          style={{ background: `hsl(${index === 0 ? '280' : '200'} 60% 50% / 0.2)` }}>
          {index + 1}
        </div>
        <span className={`text-sm font-semibold text-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' ? (index === 0 ? 'First Person' : 'Second Person') : (index === 0 ? 'पहला व्यक्ति' : 'दूसरा व्यक्ति')}
        </span>
      </div>
      <Input
        placeholder={language === 'en' ? 'Name' : 'नाम'}
        value={formData[person].name}
        onChange={(e) => handleChange(person, 'name', e.target.value)}
        required
        className="bg-background/50 border-border/50"
      />
      <select
        value={formData[person].sign}
        onChange={(e) => handleChange(person, 'sign', e.target.value)}
        required
        className="w-full h-10 px-3 rounded-md bg-background/50 border border-border/50 text-foreground text-sm"
      >
        {zodiacSigns.map((sign) => (
          <option key={sign} value={sign}>{getSignName(sign)}</option>
        ))}
      </select>
      <Input
        type="date"
        value={formData[person].birthDate}
        onChange={(e) => handleChange(person, 'birthDate', e.target.value)}
        className="bg-background/50 border-border/50"
      />
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="glass rounded-2xl border border-primary/20 overflow-hidden">
        <div className="relative p-6 pb-4 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="relative">
            <Users className="mx-auto h-10 w-10 text-primary" />
          </motion.div>
          <h2 className={`relative text-xl font-bold mt-3 text-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en' ? 'Vedic Ashtakoot Milan' : 'वैदिक अष्टकूट मिलान'}
          </h2>
          <p className={`relative text-sm text-muted-foreground mt-1 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en' ? '36-point Vedic compatibility analysis' : '36 अंकीय वैदिक संगतता विश्लेषण'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">
          <PersonSection person="person1" index={0} color="purple" />

          <div className="flex justify-center">
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
          </div>

          <PersonSection person="person2" index={1} color="blue" />

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{language === 'en' ? 'Analyzing Gunas...' : 'गुणों का विश्लेषण...'}</>
            ) : (
              <><Sparkles className="mr-2 h-5 w-5" />{language === 'en' ? 'Calculate Ashtakoot Score' : 'अष्टकूट स्कोर की गणना करें'}</>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};
