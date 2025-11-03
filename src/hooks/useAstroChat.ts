
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Json } from '@/integrations/supabase/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AstroConversation {
  id?: string;
  user_id: string;
  conversation: Json;
  created_at?: string;
  updated_at?: string;
}

export const useAstroChat = () => {
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Load previous conversation from storage on component mount
  useEffect(() => {
    if (user) {
      loadConversation();
    }
  }, [user]);

  // Save conversation to storage when it changes
  useEffect(() => {
    if (conversation.length > 0 && user) {
      saveConversation();
    }
  }, [conversation]);

  const loadConversation = async () => {
    try {
      // Load conversation from Supabase if user is logged in
      if (user) {
        const { data, error } = await supabase
          .from('astro_conversations')
          .select('conversation')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error loading conversation from Supabase:', error);
          throw error;
        }
        
        if (data?.conversation) {
          // Convert stored dates back to Date objects
          const convertedConversation = (data.conversation as any[]).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setConversation(convertedConversation);
          return;
        }
      }
      
      // Fallback to localStorage if not found in Supabase
      const savedConversation = localStorage.getItem('astro_conversation');
      if (savedConversation) {
        // Convert stored dates back to Date objects
        const parsedConversation = JSON.parse(savedConversation).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setConversation(parsedConversation);
      } else {
        // Initialize with a welcome message if no conversation exists
        const initialMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Greetings! I am your celestial guide. Ask me about astrology, your birth chart, or any cosmic questions you have.',
          timestamp: new Date()
        };
        setConversation([initialMessage]);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };
  
  const saveConversation = async () => {
    try {
      // Save to Supabase if user is logged in
      if (user) {
        // Convert ChatMessage[] to Json compatible format by converting Date to string
        const jsonCompatibleConversation = conversation.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        }));
        
        const { error } = await supabase
          .from('astro_conversations')
          .upsert({
            user_id: user.id,
            conversation: jsonCompatibleConversation as unknown as Json,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
          
        if (error) throw error;
      }
      
      // Also save to localStorage as backup
      localStorage.setItem('astro_conversation', JSON.stringify(conversation));
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };
  
  const clearConversation = async () => {
    try {
      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Greetings! I am your celestial guide. Ask me about astrology, your birth chart, or any cosmic questions you have.',
        timestamp: new Date()
      };
      
      setConversation([initialMessage]);
      
      // Clear from Supabase if user is logged in
      if (user) {
        // Convert to JSON compatible format by converting Date to string
        const jsonCompatibleMessage = {
          ...initialMessage,
          timestamp: initialMessage.timestamp.toISOString()
        };
        
        await supabase
          .from('astro_conversations')
          .upsert({
            user_id: user.id,
            conversation: [jsonCompatibleMessage] as unknown as Json,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
      }
      
      localStorage.setItem('astro_conversation', JSON.stringify([initialMessage]));
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  };

  return {
    conversation,
    setConversation,
    loading,
    setLoading,
    clearConversation
  };
};
