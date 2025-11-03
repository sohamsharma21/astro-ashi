
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export type ReadingHistoryItem = {
  id: string;
  content_type: string;
  content_id: string;
  content_title?: string;
  content_summary?: string;
  read_at: string;
  user_id: string;
};

export const useReadingHistory = () => {
  const { user, language } = useAuth();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);

  const recordReading = async (contentType: string, contentId: string, contentTitle?: string, contentSummary?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('reading_history')
        .insert({
          user_id: user.id,
          content_type: contentType,
          content_id: contentId,
          content_title: contentTitle,
          content_summary: contentSummary
        });

      if (error) {
        console.error('Error recording reading history:', error);
        throw error;
      }
    } catch (error: any) {
      console.error('Failed to record reading history:', error.message);
      // Don't show error toast to user as this is a background operation
    }
  };

  const getReadingHistory = async (): Promise<ReadingHistoryItem[]> => {
    if (!user) return [];
    
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('reading_history')
        .select('*')
        .eq('user_id', user.id)
        .order('read_at', { ascending: false });

      if (error) throw error;
      
      setHistory(data || []);
      return data || [];
    } catch (error: any) {
      console.error('Error fetching reading history:', error);
      toast.error(
        language === 'en'
          ? `Failed to load reading history: ${error.message}`
          : `पठन इतिहास लोड करने में विफल: ${error.message}`
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearReadingHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('reading_history')
        .delete()
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setHistory([]);
      toast.success(
        language === 'en'
          ? 'Reading history cleared successfully'
          : 'पठन इतिहास सफलतापूर्वक साफ किया गया'
      );
    } catch (error: any) {
      console.error('Error clearing reading history:', error);
      toast.error(
        language === 'en'
          ? `Failed to clear reading history: ${error.message}`
          : `पठन इतिहास साफ करने में विफल: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return { 
    recordReading, 
    getReadingHistory, 
    clearReadingHistory, 
    loading,
    history
  };
};
