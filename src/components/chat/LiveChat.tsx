import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Send, MessageCircle, Loader2, User, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  session_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface LiveChatProps {
  sessionId?: string;
}

const LiveChat = ({ sessionId: propSessionId }: LiveChatProps) => {
  const { user, language } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionId, setSessionId] = useState(propSessionId || '');
  const [sessionStatus, setSessionStatus] = useState<string>('idle');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      title: 'Live Consultation Chat',
      requestSession: 'Request Live Session',
      waiting: 'Waiting for astrologer...',
      connected: 'Connected',
      ended: 'Session Ended',
      placeholder: 'Type your message...',
      send: 'Send',
      noSession: 'Start a live consultation session with our expert astrologers.',
      youLabel: 'You',
      astrologerLabel: 'Astrologer',
    },
    hi: {
      title: 'लाइव परामर्श चैट',
      requestSession: 'लाइव सत्र का अनुरोध करें',
      waiting: 'ज्योतिषी की प्रतीक्षा...',
      connected: 'जुड़ा हुआ',
      ended: 'सत्र समाप्त',
      placeholder: 'अपना संदेश लिखें...',
      send: 'भेजें',
      noSession: 'हमारे विशेषज्ञ ज्योतिषियों के साथ लाइव परामर्श सत्र शुरू करें।',
      youLabel: 'आप',
      astrologerLabel: 'ज्योतिषी',
    },
  };
  const tr = t[language] || t.en;

  // Subscribe to realtime messages
  useEffect(() => {
    if (!sessionId) return;

    // Load existing messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data as ChatMessage[]);
    };
    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `session_id=eq.${sessionId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();

    // Subscribe to session status changes
    const sessionChannel = supabase
      .channel(`session:${sessionId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'live_sessions',
        filter: `id=eq.${sessionId}`,
      }, (payload) => {
        setSessionStatus((payload.new as any).status);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(sessionChannel);
    };
  }, [sessionId]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const requestSession = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .insert({ user_id: user.id, status: 'pending' })
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
      setSessionStatus('pending');
      toast.success(language === 'hi' ? 'सत्र का अनुरोध भेजा गया!' : 'Session requested!');
    } catch (err) {
      console.error('Session request error:', err);
      toast.error(language === 'hi' ? 'सत्र अनुरोध विफल' : 'Failed to request session');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !sessionId) return;

    const content = newMessage.trim();
    setNewMessage('');

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          sender_id: user.id,
          content,
        });

      if (error) throw error;
    } catch (err) {
      console.error('Send message error:', err);
      toast.error(language === 'hi' ? 'संदेश भेजने में विफल' : 'Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20 h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b border-border/30">
        <CardTitle className="flex items-center justify-between font-cinzel">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            {tr.title}
          </div>
          {sessionStatus !== 'idle' && (
            <Badge
              variant={sessionStatus === 'active' ? 'default' : 'secondary'}
              className={sessionStatus === 'active' ? 'bg-green-500/20 text-green-400' : ''}
            >
              {sessionStatus === 'pending' ? tr.waiting :
               sessionStatus === 'active' ? tr.connected :
               sessionStatus === 'ended' ? tr.ended : sessionStatus}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {!sessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <MessageCircle className="w-16 h-16 text-primary/30 mb-4" />
            <p className="text-muted-foreground mb-6">{tr.noSession}</p>
            <Button onClick={requestSession} disabled={loading} className="cosmic-button">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {tr.requestSession}
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((msg) => {
                  const isOwn = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        isOwn
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                      }`}>
                        <div className="flex items-center gap-1 mb-1">
                          {isOwn ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                          <span className="text-xs opacity-70">
                            {isOwn ? tr.youLabel : tr.astrologerLabel}
                          </span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-50 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border/30">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={tr.placeholder}
                  disabled={sessionStatus === 'ended'}
                  className="bg-background/50 border-primary/20"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sessionStatus === 'ended'}
                  size="icon"
                  className="cosmic-button shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveChat;
