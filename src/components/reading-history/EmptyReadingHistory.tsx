
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyReadingHistoryProps {
  language: 'en' | 'hi';
  isFiltered?: boolean;
}

const EmptyReadingHistory = ({ language, isFiltered = false }: EmptyReadingHistoryProps) => {
  if (isFiltered) {
    return (
      <Card className="bg-cosmic-deep-space bg-opacity-90 border-cosmic-gold">
        <CardContent className="py-8 text-center">
          <p className="text-white">
            {language === 'en' 
              ? 'No results found for your search' 
              : 'आपकी खोज के लिए कोई परिणाम नहीं मिला'}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-cosmic-deep-space bg-opacity-90 border-cosmic-gold text-center py-12">
      <CardContent>
        <p className="text-white mb-6">
          {language === 'en' 
            ? 'No reading history found' 
            : 'कोई पठन इतिहास नहीं मिला'}
        </p>
        <Button className="cosmic-button" asChild>
          <a href="/daily-horoscope">
            {language === 'en' ? 'Read Your Daily Horoscope' : 'अपना दैनिक राशिफल पढ़ें'}
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyReadingHistory;
