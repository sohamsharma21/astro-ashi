
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { hi, enUS } from 'date-fns/locale';
import { ReadingHistoryItem as ReadingHistoryItemType } from '@/hooks/useReadingHistory';
import ReadingHistoryItem from './ReadingHistoryItem';

interface ReadingHistoryDateGroupProps {
  date: string;
  items: ReadingHistoryItemType[];
  language: 'en' | 'hi';
}

const ReadingHistoryDateGroup = ({ date, items, language }: ReadingHistoryDateGroupProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: language === 'en' ? enUS : hi });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <Calendar className="h-5 w-5 text-cosmic-gold" />
        <h3 className="text-lg font-medium text-cosmic-gold">
          {formatDate(date)}
        </h3>
      </div>
      
      {items.map((item) => (
        <ReadingHistoryItem 
          key={item.id} 
          item={item} 
          language={language}
        />
      ))}
    </div>
  );
};

export default ReadingHistoryDateGroup;
