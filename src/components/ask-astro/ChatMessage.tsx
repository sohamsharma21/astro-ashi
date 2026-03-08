
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '@/lib/auth';
import { ChatMessage as ChatMessageType } from '@/hooks/useAstroChat';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: ChatMessageType;
  userProfile: UserProfile | null;
  user: any;
}

const ChatMessage = ({ message, userProfile, user }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 mb-5 ${isUser ? 'justify-end' : ''}`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border border-primary/20 shrink-0 mt-1">
          <AvatarImage src="/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png" />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">AA</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] px-4 py-3 ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
        {isUser ? (
          <p className="text-sm text-foreground leading-relaxed">{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed
            prose-p:text-foreground/85 prose-p:mb-2 prose-p:last:mb-0
            prose-strong:text-primary prose-strong:font-semibold
            prose-headings:text-foreground prose-headings:font-heading prose-headings:font-bold
            prose-h3:text-sm prose-h3:mb-1.5 prose-h3:mt-3
            prose-ul:text-foreground/80 prose-ul:mb-2
            prose-li:mb-0.5
            prose-code:text-primary/80 prose-code:bg-primary/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        <p className="text-[10px] text-muted-foreground/60 mt-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0 mt-1">
          <AvatarImage src={userProfile?.avatar_url || ""} alt={userProfile?.full_name || 'User'} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
            {userProfile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
};

export default ChatMessage;
