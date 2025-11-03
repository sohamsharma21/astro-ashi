
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '@/lib/auth';
import { ChatMessage as ChatMessageType } from '@/hooks/useAstroChat';

interface ChatMessageProps {
  message: ChatMessageType;
  userProfile: UserProfile | null;
  user: any;
}

const ChatMessage = ({ message, userProfile, user }: ChatMessageProps) => {
  return (
    <div 
      className={`flex gap-4 mb-6 ${message.role === 'user' ? 'justify-end' : ''}`}
    >
      {message.role === 'assistant' && (
        <Avatar className="h-10 w-10 border border-cosmic-gold">
          <AvatarImage src="/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png" />
          <AvatarFallback className="bg-cosmic-gold text-cosmic-deep-space">AA</AvatarFallback>
        </Avatar>
      )}
      
      <div 
        className={`max-w-[80%] p-4 rounded-lg ${
          message.role === 'user' 
            ? 'bg-cosmic-gold bg-opacity-20 border border-cosmic-gold border-opacity-30' 
            : 'bg-cosmic-violet bg-opacity-30 border border-cosmic-gold border-opacity-20'
        }`}
      >
        <p className="text-white whitespace-pre-wrap">{message.content}</p>
        <p className="text-xs text-gray-400 mt-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      {message.role === 'user' && (
        <Avatar className="h-10 w-10 bg-cosmic-gold text-cosmic-deep-space">
          <AvatarImage src={userProfile?.avatar_url || ""} alt={userProfile?.full_name || 'User'} />
          <AvatarFallback>
            {userProfile?.full_name?.[0].toUpperCase() || user?.email?.[0].toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
