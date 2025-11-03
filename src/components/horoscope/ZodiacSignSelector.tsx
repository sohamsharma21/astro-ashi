
import { Button } from '@/components/ui/button';
import { zodiacSigns, ZodiacSign } from '@/lib/constants';
import { getZodiacSignName } from '@/lib/translations';
import { Star } from 'lucide-react';

interface ZodiacSignSelectorProps {
  selectedSign: ZodiacSign;
  onSelectSign: (sign: ZodiacSign) => void;
  language: 'en' | 'hi';
}

const ZodiacSignSelector = ({ 
  selectedSign, 
  onSelectSign, 
  language 
}: ZodiacSignSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
      {zodiacSigns.map((sign) => (
        <Button
          key={sign}
          variant={selectedSign === sign ? 'default' : 'outline'}
          className={`cosmic-button ${selectedSign === sign ? 'bg-cosmic-gold' : ''} flex items-center justify-center`}
          onClick={() => onSelectSign(sign)}
        >
          <Star className="mr-2 h-4 w-4" />
          {getZodiacSignName(sign, language)}
        </Button>
      ))}
    </div>
  );
};

export default ZodiacSignSelector;
