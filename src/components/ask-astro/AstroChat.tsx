
import { useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { ChatMessage as ChatMessageType } from '@/hooks/useAstroChat';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import ChatMessage from '@/components/ask-astro/ChatMessage';
import ChatInput from '@/components/ask-astro/ChatInput';
import { getAstrologicalInsight } from '@/services/geminiService';

interface AstroChatProps {
  conversation: ChatMessageType[];
  setConversation: React.Dispatch<React.SetStateAction<ChatMessageType[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AstroChat = ({ conversation, setConversation, loading, setLoading }: AstroChatProps) => {
  const { language, user, userProfile } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { recordReading } = useReadingHistory();

  const handleSendMessage = async (query: string) => {
    if (!query.trim()) return;
    
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setLoading(true);
    
    // Get AI response
    try {
      const response = await getAstrologicalInsight(query, language, userProfile);
      
      const astrologerMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, astrologerMessage]);
      
      // Record the reading history
      if (user) {
        recordReading('ai-chat', Date.now().toString(), 
          language === 'en' ? 'Astrology Consultation' : 'ज्योतिष परामर्श',
          query.substring(0, 100)
        );
      }
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to get response' : 'प्रतिक्रिया प्राप्त करने में विफल');
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  return (
    <div className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg rounded-lg border border-cosmic-gold border-opacity-20 h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        {conversation.map((message) => (
          <ChatMessage 
            key={message.id}
            message={message}
            userProfile={userProfile}
            user={user}
          />
        ))}
        
        {loading && (
          <div className="flex gap-4 mb-6">
            <div className="h-10 w-10 border border-cosmic-gold rounded-full flex items-center justify-center">
              <div className="h-8 w-8 border border-cosmic-gold rounded-full flex items-center justify-center">
                <div className="h-6 w-6 bg-cosmic-gold rounded-full animate-ping"></div>
              </div>
            </div>
            
            <div className="bg-cosmic-violet bg-opacity-30 border border-cosmic-gold border-opacity-20 p-4 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-cosmic-gold animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-cosmic-gold animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-cosmic-gold animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-cosmic-gold border-opacity-20 p-4">
        <ChatInput 
          onSendMessage={handleSendMessage}
          loading={loading}
          language={language}
        />
      </div>
    </div>
  );
};

export default AstroChat;
