import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompareKundliButtonProps {
  kundliData: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    ascendant: string;
  };
  language: 'en' | 'hi';
}

const CompareKundliButton = ({ kundliData, language }: CompareKundliButtonProps) => {
  const navigate = useNavigate();

  const handleCompareKundli = () => {
    // Navigate to AstroLove with pre-filled data
    navigate('/astro-love', {
      state: {
        person1: {
          name: kundliData.name,
          birthDate: kundliData.birthDate,
          birthTime: kundliData.birthTime,
          birthPlace: kundliData.birthPlace,
          sign: kundliData.ascendant
        }
      }
    });
  };

  return (
    <Button
      onClick={handleCompareKundli}
      className="w-full bg-gradient-to-r from-cosmic-pink to-cosmic-purple hover:from-cosmic-purple hover:to-cosmic-pink transition-all duration-300"
    >
      <Heart className="mr-2 h-5 w-5" />
      {language === 'en' ? 'Compare with Partner' : 'साथी के साथ तुलना करें'}
    </Button>
  );
};

export default CompareKundliButton;
