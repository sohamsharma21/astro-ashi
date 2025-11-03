
import { Button } from '@/components/ui/button';

interface SavePreferenceButtonProps {
  onClick: () => void;
  isLoading: boolean;
  language: 'en' | 'hi';
}

const SavePreferenceButton = ({ onClick, isLoading, language }: SavePreferenceButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="cosmic-button-outline"
    >
      {isLoading ? (
        <span className="flex items-center">
          <span className="animate-spin inline-block h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
          {language === 'en' ? 'Saving...' : 'सहेज रहा है...'}
        </span>
      ) : (
        language === 'en' ? 'Save as Primary Sign' : 'प्राथमिक राशि के रूप में सहेजें'
      )}
    </Button>
  );
};

export default SavePreferenceButton;
