import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Trash2, History, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS_EN = [
  '💼 How will my career progress this year?',
  '❤️ What does my chart say about love and marriage?',
  '💰 Is this a good time for financial investments?',
  '🧘 What remedies can improve my health?',
];
const SUGGESTED_QUESTIONS_HI = [
  '💼 इस वर्ष मेरा करियर कैसा रहेगा?',
  '❤️ प्रेम और विवाह के बारे में कुंडली क्या कहती है?',
  '💰 क्या यह वित्तीय निवेश का अच्छा समय है?',
  '🧘 स्वास्थ्य सुधार के लिए कौन से उपाय करें?',
];

const AskAstroAshi = () => {
  const { user, language } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isHindi = language === 'hi';
  const suggestions = isHindi ? SUGGESTED_QUESTIONS_HI : SUGGESTED_QUESTIONS_EN;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('ai_questions' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    setHistory(data || []);
    setShowHistory(true);
  };

  const sendMessage = async (question: string) => {
    if (!question.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ask-astroashi', {
        body: { question: question.trim(), language },
      });

      if (error) throw error;

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to get response';
      toast.error(isHindi ? 'प्रतिक्रिया प्राप्त करने में विफल' : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      <SEOHead
        title="Ask AstroAshi AI - Personalized Vedic Astrology Guidance"
        description="Ask life questions and receive AI-powered Vedic astrology guidance based on your birth chart and current planetary positions."
      />
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold font-display text-primary">
                {isHindi ? 'AstroAshi AI से पूछें' : 'Ask AstroAshi AI'}
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isHindi
                ? 'अपनी कुंडली और ग्रह स्थिति के आधार पर जीवन के प्रश्नों का उत्तर पाएं'
                : 'Get personalized guidance based on your Kundli, planetary transits, and current Panchang'}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={loadHistory} className="border-border">
              <History className="h-4 w-4 mr-1" />
              {isHindi ? 'इतिहास' : 'History'}
            </Button>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearChat} className="border-border">
                <Trash2 className="h-4 w-4 mr-1" />
                {isHindi ? 'साफ़ करें' : 'Clear'}
              </Button>
            )}
          </div>

          {/* Chat Area */}
          <Card className="border-border bg-card/80 backdrop-blur-lg min-h-[500px] flex flex-col">
            <ScrollArea className="flex-1 p-4 md:p-6 max-h-[60vh]">
              {/* Welcome / Empty State */}
              {messages.length === 0 && !showHistory && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 space-y-6"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold text-foreground">
                      {isHindi ? 'नमस्ते! मैं AstroAshi AI हूं' : 'Namaste! I am AstroAshi AI'}
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-md">
                      {isHindi
                        ? 'करियर, रिश्ते, वित्त या जीवन के किसी भी विषय पर प्रश्न पूछें'
                        : 'Ask me about career, relationships, finance, or any life topic'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                    {suggestions.map((q, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="text-left text-sm h-auto py-3 px-4 border-border hover:bg-accent hover:text-accent-foreground whitespace-normal"
                        onClick={() => sendMessage(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* History Panel */}
              {showHistory && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">
                      {isHindi ? 'पिछले प्रश्न' : 'Past Questions'}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
                      {isHindi ? 'बंद करें' : 'Close'}
                    </Button>
                  </div>
                  {history.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      {isHindi ? 'कोई इतिहास नहीं' : 'No history yet'}
                    </p>
                  ) : (
                    history.map((item: any) => (
                      <Card key={item.id} className="border-border bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors"
                        onClick={() => {
                          setMessages([
                            { id: '1', role: 'user', content: item.question, timestamp: new Date(item.created_at) },
                            { id: '2', role: 'assistant', content: item.ai_response?.content || '', timestamp: new Date(item.created_at) },
                          ]);
                          setShowHistory(false);
                        }}
                      >
                        <CardContent className="p-3">
                          <p className="text-sm text-foreground font-medium truncate">{item.question}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </motion.div>
              )}

              {/* Messages */}
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-secondary/50 border border-border text-foreground rounded-bl-sm'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm prose-invert max-w-none [&_h2]:text-primary [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_p]:text-foreground [&_li]:text-foreground [&_strong]:text-primary">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                      <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading indicator */}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start mb-4">
                  <div className="bg-secondary/50 border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">
                        {isHindi ? 'ग्रहों की स्थिति देख रहा हूं...' : 'Reading the stars...'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={scrollRef} />
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2 items-end">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isHindi ? 'अपना प्रश्न यहाँ लिखें...' : 'Type your question here...'}
                  className="min-h-[44px] max-h-[120px] resize-none bg-muted border-border text-foreground placeholder:text-muted-foreground"
                  rows={1}
                  disabled={loading}
                />
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  size="icon"
                  className="shrink-0 h-11 w-11"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 text-center">
                {isHindi
                  ? 'यह AI-आधारित मार्गदर्शन है। महत्वपूर्ण निर्णयों के लिए पेशेवर ज्योतिषी से परामर्श करें।'
                  : 'AI-powered guidance. Consult a professional astrologer for important decisions.'}
              </p>
            </div>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AskAstroAshi;
