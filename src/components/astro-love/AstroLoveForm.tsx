import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Sparkles, Loader2 } from 'lucide-react';
import { AstroLoveFormData } from '@/hooks/useAstroLove';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="glass rounded-2xl border border-primary/20 overflow-hidden">
        {/* Header */}
        <div className="relative p-6 pb-4 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-transparent" />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="relative"
          >
            <Heart className="mx-auto h-10 w-10 text-pink-400 fill-pink-400/30" />
          </motion.div>
          <h2 className={`relative text-xl font-bold mt-3 text-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en' ? 'Enter Your Birth Details' : 'अपना जन्म विवरण दर्ज करें'}
          </h2>
          <p className={`relative text-sm text-muted-foreground mt-1 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en' ? 'We analyze zodiac, numerology, elements & planets' : 'हम राशि, अंकशास्त्र, तत्व और ग्रहों का विश्लेषण करते हैं'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">
          {/* Person 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3 p-4 rounded-xl bg-pink-500/5 border border-pink-500/15"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-full bg-pink-500/20 flex items-center justify-center text-xs font-bold text-pink-400">1</div>
              <span className={`text-sm font-semibold text-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                {language === 'en' ? 'First Person' : 'पहला व्यक्ति'}
              </span>
            </div>
            <Input
              type="text"
              placeholder={language === 'en' ? 'Name' : 'नाम'}
              value={formData.person1.name}
              onChange={(e) => setFormData({ ...formData, person1: { ...formData.person1, name: e.target.value } })}
              required
              className="bg-background/50 border-border/50"
            />
            <Input
              type="date"
              value={formData.person1.birthDate}
              onChange={(e) => setFormData({ ...formData, person1: { ...formData.person1, birthDate: e.target.value } })}
              required
              className="bg-background/50 border-border/50"
            />
          </motion.div>

          {/* Heart Connector */}
          <div className="flex justify-center">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Sparkles className="h-6 w-6 text-pink-400" />
            </motion.div>
          </div>

          {/* Person 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 p-4 rounded-xl bg-purple-500/5 border border-purple-500/15"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">2</div>
              <span className={`text-sm font-semibold text-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                {language === 'en' ? 'Second Person' : 'दूसरा व्यक्ति'}
              </span>
            </div>
            <Input
              type="text"
              placeholder={language === 'en' ? 'Name' : 'नाम'}
              value={formData.person2.name}
              onChange={(e) => setFormData({ ...formData, person2: { ...formData.person2, name: e.target.value } })}
              required
              className="bg-background/50 border-border/50"
            />
            <Input
              type="date"
              value={formData.person2.birthDate}
              onChange={(e) => setFormData({ ...formData, person2: { ...formData.person2, birthDate: e.target.value } })}
              required
              className="bg-background/50 border-border/50"
            />
          </motion.div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 text-base font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{language === 'en' ? 'Analyzing Stars...' : 'सितारों का विश्लेषण...'}</>
            ) : (
              <><Heart className="mr-2 h-5 w-5" />{language === 'en' ? 'Calculate Love Compatibility' : 'प्रेम संगतता की गणना करें'}</>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};
