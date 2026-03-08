
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1 relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={language === 'en' ? 'Ask anything about your stars...' : 'अपने सितारों के बारे में कुछ भी पूछें...'}
          className="w-full resize-none rounded-xl bg-muted/40 border border-border/50 text-foreground text-sm px-4 py-3 pr-4 
            placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30
            transition-all duration-200 min-h-[44px] max-h-[120px]"
          disabled={loading}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (query.trim()) handleSubmit(e);
            }
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 120) + 'px';
          }}
        />
      </div>
      <Button 
        type="submit" 
        disabled={loading || !query.trim()}
        className="h-11 w-11 rounded-xl p-0 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 transition-all duration-200 disabled:opacity-30"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
