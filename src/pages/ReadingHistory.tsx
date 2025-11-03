
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ReadingHistoryItem } from '@/hooks/useReadingHistory';
import ReadingHistoryFilters from '@/components/reading-history/ReadingHistoryFilters';
import ReadingHistoryDateGroup from '@/components/reading-history/ReadingHistoryDateGroup';
import EmptyReadingHistory from '@/components/reading-history/EmptyReadingHistory';

const ReadingHistory = () => {
  const { user, language } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<string>('all');

  const { data: readingHistory, isLoading, error } = useQuery({
    queryKey: ['readingHistory', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('reading_history')
        .select('*')
        .eq('user_id', user.id)
        .order('read_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 60000,
  });

  const filteredHistory = readingHistory?.filter(item => {
    // First filter by search query if it exists
    const matchesSearch = searchQuery 
      ? ((item.content_title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
         (item.content_type || '').toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
      
    // Then filter by tab selection
    if (selectedTab === 'all') return matchesSearch;
    return matchesSearch && item.content_type?.toLowerCase() === selectedTab;
  });

  // Group history by date
  const historyByDate = filteredHistory?.reduce((acc: Record<string, ReadingHistoryItem[]>, item) => {
    const date = new Date(item.read_at).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  if (error) {
    toast({
      title: language === 'en' ? 'Error' : 'त्रुटि',
      description: language === 'en' 
        ? 'Failed to load reading history' 
        : 'पढ़ने के इतिहास को लोड करने में विफल',
      variant: 'destructive'
    });
  }

  // Content type counts for filtering
  const contentTypeCounts = readingHistory?.reduce((acc: Record<string, number>, item) => {
    const type = item.content_type?.toLowerCase() || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {}) || {};

  // Get unique content types for tab filters
  const contentTypes = readingHistory 
    ? Array.from(new Set(readingHistory.map(item => item.content_type?.toLowerCase())))
        .filter(Boolean)
    : [];

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={150} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className={`text-4xl md:text-6xl font-bold mb-8 text-center text-gradient-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' ? 'Reading History' : 'पठन इतिहास'}
        </h1>

        <div className="max-w-4xl mx-auto">
          <ReadingHistoryFilters 
            contentTypes={contentTypes}
            contentTypeCounts={contentTypeCounts}
            selectedTab={selectedTab}
            searchQuery={searchQuery}
            onTabChange={setSelectedTab}
            onSearchChange={setSearchQuery}
            language={language}
          />

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cosmic-gold" />
            </div>
          ) : !readingHistory || readingHistory.length === 0 ? (
            <EmptyReadingHistory language={language} />
          ) : filteredHistory && filteredHistory.length === 0 ? (
            <EmptyReadingHistory language={language} isFiltered={true} />
          ) : (
            <div className="space-y-8">
              {historyByDate && Object.entries(historyByDate).map(([date, items]) => (
                <ReadingHistoryDateGroup 
                  key={date} 
                  date={date} 
                  items={items} 
                  language={language} 
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReadingHistory;
