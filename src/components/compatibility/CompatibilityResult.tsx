
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { ZodiacSign } from '@/lib/constants';

export interface CompatibilityResultProps {
  result: {
    person1: { name: string; sign: ZodiacSign };
    person2: { name: string; sign: ZodiacSign };
    overallScore: number;
    compatibility: string;
    aspects: {
      name: string;
      score: number;
    }[];
  };
  onNewCalculation: () => void;
}

export const CompatibilityResult = ({ result, onNewCalculation }: CompatibilityResultProps) => {
  const { language } = useAuth();

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
    <div className="space-y-8">
      <div className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg p-8 rounded-lg border border-cosmic-gold border-opacity-20">
        <h2 className="text-2xl font-bold mb-6 text-cosmic-gold text-center">
          {language === 'en' ? 'Compatibility Results' : 'संगतता परिणाम'}
        </h2>
        
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="text-center px-4 py-2 bg-cosmic-violet bg-opacity-30 rounded-lg border border-cosmic-gold border-opacity-30">
            <p className="text-lg text-white">{result.person1.name}</p>
            <p className="text-cosmic-gold">{getZodiacSignName(result.person1.sign)}</p>
          </div>
          
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-cosmic-gold bg-opacity-20 flex items-center justify-center text-cosmic-gold text-2xl border border-cosmic-gold animate-pulse">
              ♥
            </div>
          </div>
          
          <div className="text-center px-4 py-2 bg-cosmic-violet bg-opacity-30 rounded-lg border border-cosmic-gold border-opacity-30">
            <p className="text-lg text-white">{result.person2.name}</p>
            <p className="text-cosmic-gold">{getZodiacSignName(result.person2.sign)}</p>
          </div>
        </div>
        
        <div className="mb-8 text-center">
          <div className="inline-block px-6 py-3 bg-cosmic-violet bg-opacity-40 rounded-lg border border-cosmic-gold">
            <h3 className="text-lg text-white mb-1">
              {language === 'en' ? 'Overall Compatibility' : 'समग्र संगतता'}
            </h3>
            <p className="text-2xl text-cosmic-gold font-bold">{result.compatibility}</p>
            <div className="w-full bg-cosmic-deep-space rounded-full h-2.5 mt-2">
              <div 
                className="bg-cosmic-gold h-2.5 rounded-full" 
                style={{ width: `${result.overallScore}%` }}
              ></div>
            </div>
            <p className="text-white mt-2">{result.overallScore}%</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {result.aspects.map((aspect, index) => (
            <Card key={index} className="bg-cosmic-deep-space border-cosmic-gold border-opacity-20">
              <CardHeader className="pb-2">
                <CardTitle className="text-cosmic-gold text-lg">{aspect.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-cosmic-violet bg-opacity-20 rounded-full h-2.5">
                  <div 
                    className="bg-cosmic-gold h-2.5 rounded-full" 
                    style={{ width: `${aspect.score}%` }}
                  ></div>
                </div>
                <p className="text-white text-right mt-1">{aspect.score}%</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={onNewCalculation} className="cosmic-button-outline">
          {language === 'en' ? 'Calculate New Compatibility' : 'नई संगतता की गणना करें'}
        </Button>
      </div>
    </div>
  );
};
