import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Share2, Sparkles, Moon, Star } from 'lucide-react';
import { AstroLoveResult } from '@/hooks/useAstroLove';
import { getZodiacSignName } from '@/lib/translations';
import { toast } from 'sonner';

interface AstroLoveResultProps {
  result: AstroLoveResult;
  onNewCalculation: () => void;
}

export const AstroLoveResultDisplay = ({ result, onNewCalculation }: AstroLoveResultProps) => {
  const { language } = useAuth();

  const handleShare = () => {
    const shareText = `${result.person1.name} & ${result.person2.name} - Love Score: ${result.loveScore}% ❤️\nCalculated on AstroAshi`;
    
    if (navigator.share) {
      navigator.share({
        title: 'AstroLove Compatibility',
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success(language === 'en' ? 'Copied to clipboard!' : 'क्लिपबोर्ड पर कॉपी किया गया!');
    }
  };

  const scoreColor = result.loveScore >= 75 ? 'text-love-pink' : 
                     result.loveScore >= 50 ? 'text-cosmic-gold' : 
                     'text-cosmic-purple';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Animated Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Heart className="text-love-pink" size={20 + Math.random() * 20} />
          </div>
        ))}
      </div>

      {/* Main Score Card */}
      <Card className="cosmic-card border-love-pink/50 bg-cosmic-deep-space/95 backdrop-blur relative overflow-hidden animate-scale-in">
        <div className="absolute inset-0 bg-gradient-to-br from-love-purple/20 to-love-pink/20" />
        
        <CardHeader className="relative">
          <CardTitle className={`text-3xl text-center font-playfair flex flex-col items-center gap-3`}>
            <div className="flex items-center gap-3">
              <Sparkles className="text-love-pink animate-spin-slow" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-love-purple to-love-pink">
                {result.person1.name} & {result.person2.name}
              </span>
              <Sparkles className="text-love-pink animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {/* Love Score Circle */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-cosmic-deep-space"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  className="love-score-circle"
                  style={{
                    strokeDasharray: `${(result.loveScore / 100) * 552} 552`,
                    animation: 'fillCircle 1.5s ease-out forwards'
                  }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(280, 87%, 65%)" />
                    <stop offset="100%" stopColor="hsl(330, 100%, 71%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-5xl font-bold ${scoreColor} animate-scale-in`} style={{ animationDelay: '0.5s' }}>
                  {result.loveScore}%
                </div>
                <div className={`text-sm text-cosmic-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                  {language === 'en' ? 'Love Score' : 'प्रेम स्कोर'}
                </div>
              </div>
            </div>
          </div>

          {/* Compatibility Status */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <h3 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-love-purple to-love-pink ${language === 'hi' ? 'font-noto-devanagari' : 'font-playfair'}`}>
              {result.compatibility}
            </h3>
          </div>

          {/* Detailed Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="text-center p-4 rounded-lg bg-cosmic-deep-space/50 border border-cosmic-gold/30 hover-scale">
              <Moon className="mx-auto mb-2 text-cosmic-purple" />
              <div className={`text-sm text-cosmic-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                {language === 'en' ? 'Zodiac Match' : 'राशि मिलान'}
              </div>
              <div className="text-2xl font-bold text-cosmic-purple">{result.zodiacScore}%</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-cosmic-deep-space/50 border border-love-pink/30 hover-scale">
              <Star className="mx-auto mb-2 text-love-pink" />
              <div className={`text-sm text-cosmic-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                {language === 'en' ? 'Numerology' : 'अंकशास्त्र'}
              </div>
              <div className="text-2xl font-bold text-love-pink">{result.numerologyScore}%</div>
            </div>

            <div className="text-center p-4 rounded-lg bg-cosmic-deep-space/50 border border-love-purple/30 hover-scale">
              <Sparkles className="mx-auto mb-2 text-love-purple" />
              <div className={`text-sm text-cosmic-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                {language === 'en' ? 'Planetary' : 'ग्रहों'}
              </div>
              <div className="text-2xl font-bold text-love-purple">{result.planetaryScore}%</div>
            </div>
          </div>

          {/* Person Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <div className="p-4 rounded-lg bg-gradient-to-br from-love-purple/20 to-transparent border border-love-purple/30 hover-scale">
              <div className="font-semibold text-love-purple">{result.person1.name}</div>
              <div className={`text-sm text-cosmic-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                {getZodiacSignName(result.person1.sign, language)}
              </div>
              <div className="text-xs text-white/70">
                {language === 'en' ? 'Life Path' : 'जीवन पथ'}: {result.person1.lifePathNumber}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-love-pink/20 to-transparent border border-love-pink/30 hover-scale">
              <div className="font-semibold text-love-pink">{result.person2.name}</div>
              <div className={`text-sm text-cosmic-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                {getZodiacSignName(result.person2.sign, language)}
              </div>
              <div className="text-xs text-white/70">
                {language === 'en' ? 'Life Path' : 'जीवन पथ'}: {result.person2.lifePathNumber}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '1.4s' }}>
            <h4 className={`text-lg font-semibold text-cosmic-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
              {language === 'en' ? 'Cosmic Insights' : 'ब्रह्मांडीय अंतर्दृष्टि'}
            </h4>
            {result.insights.map((insight, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 text-sm text-white/80 ${language === 'hi' ? 'font-noto-devanagari' : ''} animate-fade-in`}
                style={{ animationDelay: `${1.6 + index * 0.2}s` }}
              >
                <Star className="text-cosmic-gold mt-1 flex-shrink-0 animate-glow" size={16} />
                <span>{insight}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 animate-fade-in" style={{ animationDelay: '1.8s' }}>
            <Button
              onClick={onNewCalculation}
              className={`flex-1 bg-cosmic-purple hover:bg-cosmic-purple/80 transition-all hover-scale ${language === 'hi' ? 'font-noto-devanagari' : ''}`}
            >
              {language === 'en' ? 'Try Again' : 'फिर से प्रयास करें'}
            </Button>
            <Button
              onClick={handleShare}
              className={`flex-1 bg-gradient-to-r from-love-purple to-love-pink hover:from-love-purple/80 hover:to-love-pink/80 transition-all hover-scale ${language === 'hi' ? 'font-noto-devanagari' : ''}`}
            >
              <Share2 className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Share Result' : 'परिणाम साझा करें'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
