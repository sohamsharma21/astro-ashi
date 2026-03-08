import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { RotateCcw, Share2, Sparkles, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { CompatibilityResult as CompatibilityResultType } from '@/hooks/useCompatibility';
import { getZodiacSignName } from '@/lib/translations';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface CompatibilityResultProps {
  result: CompatibilityResultType;
  onNewCalculation: () => void;
}

export const CompatibilityResult = ({ result, onNewCalculation }: CompatibilityResultProps) => {
  const { language } = useAuth();

  const handleShare = () => {
    const text = `${result.person1.name} & ${result.person2.name} - Ashtakoot: ${result.overallScore}/${result.maxScore} (${result.percentage}%)\n${result.compatibility}\nAnalyzed on AstroAshi`;
    if (navigator.share) {
      navigator.share({ title: 'Compatibility', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success(language === 'en' ? 'Copied!' : 'कॉपी किया!');
    }
  };

  const scoreColor = result.percentage >= 65 ? 'text-emerald-400' : result.percentage >= 45 ? 'text-amber-400' : 'text-red-400';
  const ringColor = result.percentage >= 65 ? 'rgb(52, 211, 153)' : result.percentage >= 45 ? 'rgb(251, 191, 36)' : 'rgb(248, 113, 113)';

  return (
    <div className="space-y-5">
      {/* Main Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl border border-primary/20 p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />

        <div className="relative text-center space-y-4">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">{result.person1.name}</div>
              <div className={`text-xs text-muted-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                {getZodiacSignName(result.person1.sign, language)} · {result.person1.element}
              </div>
            </div>
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">{result.person2.name}</div>
              <div className={`text-xs text-muted-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                {getZodiacSignName(result.person2.sign, language)} · {result.person2.element}
              </div>
            </div>
          </div>

          {/* Score Ring */}
          <div className="flex justify-center py-3">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
                <circle cx="96" cy="96" r="80" stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
                <motion.circle
                  cx="96" cy="96" r="80" fill="none"
                  stroke={ringColor} strokeWidth="10" strokeLinecap="round"
                  initial={{ strokeDasharray: '0 503' }}
                  animate={{ strokeDasharray: `${(result.percentage / 100) * 503} 503` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className={`text-3xl font-bold ${scoreColor}`}
                >
                  {result.overallScore}/{result.maxScore}
                </motion.span>
                <span className="text-xs text-muted-foreground">{result.percentage}%</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <span className={`font-semibold text-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
              {language === 'en' ? result.compatibility : result.compatibilityHi}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Ashtakoot Gunas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="glass rounded-2xl border border-border/20 p-5"
      >
        <h3 className={`text-sm font-semibold text-muted-foreground mb-4 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          🕉️ {language === 'en' ? 'ASHTAKOOT GUNA ANALYSIS' : 'अष्टकूट गुण विश्लेषण'}
        </h3>
        <div className="space-y-3">
          {result.aspects.map((aspect, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 + i * 0.08 }}
              className="p-3 rounded-xl bg-muted/20 border border-border/10"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{aspect.icon}</span>
                  <span className={`text-sm font-semibold text-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                    {language === 'en' ? aspect.name : aspect.nameHi}
                  </span>
                </div>
                <span className={`text-sm font-bold ${aspect.score >= aspect.maxScore * 0.6 ? 'text-emerald-400' : aspect.score > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                  {aspect.score}/{aspect.maxScore}
                </span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-1.5 mb-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(aspect.score / aspect.maxScore) * 100}%` }}
                  transition={{ duration: 0.8, delay: 1.4 + i * 0.08 }}
                  className={`h-full rounded-full ${aspect.score >= aspect.maxScore * 0.6 ? 'bg-emerald-400' : aspect.score > 0 ? 'bg-amber-400' : 'bg-red-400'}`}
                />
              </div>
              <p className={`text-xs text-muted-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                {language === 'en' ? aspect.description : aspect.descriptionHi}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Strengths & Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.2 }}
          className="glass rounded-2xl border border-emerald-500/15 p-5"
        >
          <h3 className={`text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            <CheckCircle2 className="h-4 w-4" />
            {language === 'en' ? 'Strengths' : 'ताकत'}
          </h3>
          <div className="space-y-2">
            {result.strengths.map((s, i) => (
              <div key={i} className={`text-sm text-muted-foreground flex items-start gap-2 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>{language === 'en' ? s.en : s.hi}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.3 }}
          className="glass rounded-2xl border border-amber-500/15 p-5"
        >
          <h3 className={`text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            <AlertTriangle className="h-4 w-4" />
            {language === 'en' ? 'Challenges' : 'चुनौतियाँ'}
          </h3>
          <div className="space-y-2">
            {result.challenges.map((c, i) => (
              <div key={i} className={`text-sm text-muted-foreground flex items-start gap-2 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                <span className="text-amber-400 mt-0.5">!</span>
                <span>{language === 'en' ? c.en : c.hi}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Advice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        className="glass rounded-2xl border border-primary/15 p-5"
      >
        <h3 className={`text-sm font-semibold text-primary mb-2 flex items-center gap-2 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          <Info className="h-4 w-4" />
          {language === 'en' ? 'Astrologer\'s Advice' : 'ज्योतिषी की सलाह'}
        </h3>
        <p className={`text-sm text-muted-foreground leading-relaxed ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' ? result.advice.en : result.advice.hi}
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7 }}
        className="flex gap-3"
      >
        <Button onClick={onNewCalculation} variant="outline" className="flex-1 rounded-xl border-border/30 hover:bg-muted/50">
          <RotateCcw className="mr-2 h-4 w-4" />
          {language === 'en' ? 'New Analysis' : 'नया विश्लेषण'}
        </Button>
        <Button onClick={handleShare} className="flex-1 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground">
          <Share2 className="mr-2 h-4 w-4" />
          {language === 'en' ? 'Share' : 'शेयर करें'}
        </Button>
      </motion.div>
    </div>
  );
};
