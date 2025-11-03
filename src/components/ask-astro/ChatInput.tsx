
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  loading: boolean;
  language: 'en' | 'hi';
}

const ChatInput = ({ onSendMessage, loading, language }: ChatInputProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    await onSendMessage(query);
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <Textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={language === 'en' ? 'Type your question...' : 'अपना प्रश्न लिखें...'}
        className="flex-1 bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white resize-none"
        disabled={loading}
        rows={3}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (query.trim()) handleSubmit(e);
          }
        }}
      />
      <Button 
        type="submit" 
        className="cosmic-button self-end" 
        disabled={loading || !query.trim()}
      >
        {language === 'en' ? 'Send' : 'भेजें'}
      </Button>
    </form>
  );
};

export default ChatInput;
