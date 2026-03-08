
import { useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { ChatMessage as ChatMessageType } from '@/hooks/useAstroChat';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import ChatMessage from '@/components/ask-astro/ChatMessage';
import ChatInput from '@/components/ask-astro/ChatInput';
import { getAstrologicalInsight } from '@/services/geminiService';
import { BotMessageSquare } from 'lucide-react';

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
    
    try {
      const response = await getAstrologicalInsight(query, language, userProfile);
      
      const astrologerMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, astrologerMessage]);
      
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  return (
    <div className="cosmic-card-glow h-[calc(100vh-12rem)] md:h-[600px] flex flex-col rounded-2xl overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/30">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <BotMessageSquare className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-heading font-bold text-foreground">AstroAshi AI</h3>
          <p className="text-[10px] text-muted-foreground">
            {language === 'en' ? 'Vedic astrology assistant' : 'वैदिक ज्योतिष सहायक'}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-emerald-500/80">{language === 'en' ? 'Online' : 'ऑनलाइन'}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {conversation.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/[0.06] border border-primary/10 flex items-center justify-center mb-4">
              <BotMessageSquare className="w-6 h-6 text-primary/60" />
            </div>
            <h3 className="text-base font-heading font-bold text-foreground mb-1.5">
              {language === 'en' ? 'Ask AstroAshi AI' : 'AstroAshi AI से पूछें'}
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              {language === 'en' 
                ? 'Ask about your Kundli, career, relationships, health, or any spiritual guidance.' 
                : 'अपनी कुंडली, करियर, रिश्ते, स्वास्थ्य या किसी भी आध्यात्मिक मार्गदर्शन के बारे में पूछें।'}
            </p>
          </div>
        )}

        {conversation.map((message) => (
          <ChatMessage 
            key={message.id}
            message={message}
            userProfile={userProfile}
            user={user}
          />
        ))}
        
        {loading && (
          <div className="flex gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <BotMessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div className="chat-bubble-ai px-4 py-3.5">
              <div className="flex gap-1.5">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="border-t border-border/30 p-3.5">
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
