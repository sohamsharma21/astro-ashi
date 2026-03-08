import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Heart, Share2, RotateCcw, Sparkles } from 'lucide-react';
import { AstroLoveResult } from '@/hooks/useAstroLove';
import { getZodiacSignName } from '@/lib/translations';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface AstroLoveResultProps {
  result: AstroLoveResult;
  onNewCalculation: () => void;
}

export const AstroLoveResultDisplay = ({ result, onNewCalculation }: AstroLoveResultProps) => {
  const { language } = useAuth();

  const handleShare = () => {
    const shareText = `${result.person1.name} & ${result.person2.name} - Love Score: ${result.loveScore}% ${result.compatibility}\nCalculated on AstroAshi`;
    if (navigator.share) {
      navigator.share({ title: 'AstroLove', text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success(language === 'en' ? 'Copied!' : 'कॉपी किया!');
    }
  };

  const scoreColor = result.loveScore >= 72 ? 'text-pink-400' : result.loveScore >= 50 ? 'text-amber-400' : 'text-purple-400';

  return (
    <div className="space-y-6">
      {/* Floating hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-400/20"
            initial={{ y: '110vh', x: `${Math.random() * 100}%` }}
            animate={{ y: '-10vh' }}
            transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
          >
            <Heart size={16 + Math.random() * 16} />
          </motion.div>
        ))}
      </div>

      {/* Main Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-2xl border border-pink-500/20 p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5" />

        <div className="relative text-center space-y-4">
          {/* Names */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-lg font-bold text-pink-400">{result.person1.name}</span>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Heart className="h-6 w-6 text-pink-400 fill-pink-400" />
            </motion.div>
            <span className="text-lg font-bold text-purple-400">{result.person2.name}</span>
          </div>

          {/* Score Ring */}
          <div className="flex justify-center py-4">
            <div className="relative w-44 h-44">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
                <circle cx="96" cy="96" r="84" stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
                <motion.circle
                  cx="96" cy="96" r="84" fill="none"
                  stroke="url(#loveGradient)" strokeWidth="10" strokeLinecap="round"
                  initial={{ strokeDasharray: '0 528' }}
                  animate={{ strokeDasharray: `${(result.loveScore / 100) * 528} 528` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="loveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgb(236, 72, 153)" />
                    <stop offset="100%" stopColor="rgb(147, 51, 234)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className={`text-4xl font-bold ${scoreColor}`}
                >
                  {result.loveScore}%
                </motion.span>
                <span className={`text-xs text-muted-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                  {language === 'en' ? 'Love Score' : 'प्रेम स्कोर'}
                </span>
              </div>
            </div>
          </div>

          {/* Compatibility Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20"
          >
            <Sparkles className="h-4 w-4 text-pink-400" />
            <span className={`font-semibold text-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
              {language === 'en' ? result.compatibility : result.compatibilityHi}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Person Details */}
      <div className="grid grid-cols-2 gap-3">
        {[result.person1, result.person2].map((person, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="glass rounded-xl p-4 border border-border/30 text-center"
          >
            <div className={`text-sm font-bold ${i === 0 ? 'text-pink-400' : 'text-purple-400'}`}>{person.name}</div>
            <div className={`text-xs text-muted-foreground mt-1 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
              {getZodiacSignName(person.sign, language)} · {person.element}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {language === 'en' ? 'Life Path' : 'जीवन पथ'}: {person.lifePathNumber} · {person.rulingPlanet}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dimensions Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="glass rounded-2xl border border-border/20 p-5"
      >
        <h3 className={`text-sm font-semibold text-muted-foreground mb-4 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' ? 'LOVE DIMENSIONS' : 'प्रेम आयाम'}
        </h3>
        <div className="space-y-3">
          {result.dimensions.map((dim, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-lg w-7">{dim.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-medium text-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                    {language === 'en' ? dim.name : dim.nameHi}
                  </span>
                  <span className="text-xs font-bold text-foreground">{dim.score}%</span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{ duration: 1, delay: 1.6 + i * 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${dim.color}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Love Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="glass rounded-2xl border border-pink-500/15 p-5"
      >
        <h3 className={`text-sm font-semibold text-pink-400 mb-2 flex items-center gap-2 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          <Heart className="h-4 w-4" />
          {language === 'en' ? 'Your Love Story' : 'आपकी प्रेम कहानी'}
        </h3>
        <p className={`text-sm text-muted-foreground leading-relaxed ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' ? result.loveStory.en : result.loveStory.hi}
        </p>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4 }}
        className="glass rounded-2xl border border-border/20 p-5"
      >
        <h3 className={`text-sm font-semibold text-foreground mb-3 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          💡 {language === 'en' ? 'Love Tips' : 'प्रेम सुझाव'}
        </h3>
        <div className="space-y-2">
          {result.tips.map((tip, i) => (
            <div key={i} className={`flex items-start gap-2 text-sm text-muted-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
              <Sparkles className="h-3.5 w-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
              <span>{language === 'en' ? tip.en : tip.hi}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
        className="flex gap-3"
      >
        <Button onClick={onNewCalculation} variant="outline" className="flex-1 rounded-xl border-border/30 hover:bg-muted/50">
          <RotateCcw className="mr-2 h-4 w-4" />
          {language === 'en' ? 'Try Again' : 'फिर से'}
        </Button>
        <Button onClick={handleShare} className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
          <Share2 className="mr-2 h-4 w-4" />
          {language === 'en' ? 'Share' : 'शेयर करें'}
        </Button>
      </motion.div>
    </div>
  );
};
