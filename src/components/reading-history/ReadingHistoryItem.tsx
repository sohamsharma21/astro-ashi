
import { format } from 'date-fns';
import { hi, enUS } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ReadingHistoryItem as ReadingHistoryItemType } from '@/hooks/useReadingHistory';

interface ReadingHistoryItemProps {
  item: ReadingHistoryItemType;
  language: 'en' | 'hi';
  timeDisplay?: string;
}

const ReadingHistoryItem = ({ item, language, timeDisplay }: ReadingHistoryItemProps) => {
  const renderContentPreview = (item: ReadingHistoryItemType) => {
    switch (item.content_type?.toLowerCase()) {
      case 'horoscope':
        return (
          <p className="text-white text-opacity-80 line-clamp-2">
            {item.content_summary || (language === 'en' 
              ? 'Daily horoscope reading' 
              : 'दैनिक राशिफल पढ़ना')}
          </p>
        );
      case 'kundli':
        return (
          <p className="text-white text-opacity-80 line-clamp-2">
            {item.content_summary || (language === 'en' 
              ? 'Birth chart reading' 
              : 'जन्म कुंडली पढ़ना')}
          </p>
        );
      case 'compatibility':
        return (
          <p className="text-white text-opacity-80 line-clamp-2">
            {item.content_summary || (language === 'en' 
              ? 'Compatibility reading' 
              : 'संगतता पढ़ना')}
          </p>
        );
      case 'ai-chat':
        return (
          <p className="text-white text-opacity-80 line-clamp-2">
            {item.content_summary || (language === 'en' 
              ? 'Conversation with AI astrologer' 
              : 'एआई ज्योतिषी के साथ बातचीत')}
          </p>
        );
      default:
        return (
          <p className="text-white text-opacity-80 line-clamp-2">
            {item.content_summary || (language === 'en' 
              ? 'Content reading' 
              : 'सामग्री पढ़ना')}
          </p>
        );
    }
  };

  return (
    <Card className="bg-cosmic-deep-space bg-opacity-90 border-cosmic-gold hover:bg-opacity-80 transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-cosmic-gold flex items-center justify-between">
          <span>
            {item.content_title || (language === 'en' 
              ? `${item.content_type} Reading`
              : item.content_type === 'horoscope' ? 'राशिफल'
              : item.content_type === 'kundli' ? 'कुंडली'
              : item.content_type === 'compatibility' ? 'संगतता'
              : item.content_type === 'ai-chat' ? 'एआई चैट'
              : 'पठन')}
          </span>
          <span className="text-sm font-normal text-gray-400">
            {timeDisplay || new Date(item.read_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          {item.content_id}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContentPreview(item)}
      </CardContent>
    </Card>
  );
};

export default ReadingHistoryItem;
