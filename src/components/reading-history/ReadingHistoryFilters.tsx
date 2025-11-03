
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReadingHistoryFiltersProps {
  contentTypes: string[];
  contentTypeCounts: Record<string, number>;
  selectedTab: string;
  searchQuery: string;
  onTabChange: (tab: string) => void;
  onSearchChange: (query: string) => void;
  language: 'en' | 'hi';
}

const ReadingHistoryFilters = ({
  contentTypes,
  contentTypeCounts,
  selectedTab,
  searchQuery,
  onTabChange,
  onSearchChange,
  language
}: ReadingHistoryFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <Tabs defaultValue="all" value={selectedTab} className="w-full" onValueChange={onTabChange}>
        <TabsList className="bg-cosmic-deep-space border border-cosmic-gold border-opacity-30">
          <TabsTrigger value="all" className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-deep-space">
            {language === 'en' ? 'All' : 'सभी'}
          </TabsTrigger>
          {contentTypes.map(type => (
            <TabsTrigger 
              key={type} 
              value={type}
              className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-deep-space"
            >
              {language === 'en' 
                ? `${type.charAt(0).toUpperCase() + type.slice(1)} (${contentTypeCounts[type] || 0})` 
                : `${type === 'horoscope' ? 'राशिफल' : 
                   type === 'kundli' ? 'कुंडली' : 
                   type === 'compatibility' ? 'संगतता' : 
                   type === 'ai-chat' ? 'एआई चैट' : type} (${contentTypeCounts[type] || 0})`}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          type="text" 
          placeholder={language === 'en' ? 'Search history...' : 'इतिहास खोजें...'}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
        />
      </div>
    </div>
  );
};

export default ReadingHistoryFilters;
