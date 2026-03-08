import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, MicOff, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import SEOHead from '@/components/SEOHead';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTIONS_EN = [
  "How do I find peace in difficult times?",
  "What does my religion say about patience?",
  "Give me a prayer for strength",
  "How can I improve my focus?",
  "How to deal with anxiety spiritually?",
  "Share wisdom about gratitude",
];
const SUGGESTIONS_HI = [
  "कठिन समय में शांति कैसे पाएं?",
  "मेरा धर्म धैर्य के बारे में क्या कहता है?",
  "शक्ति के लिए प्रार्थना दें",
  "एकाग्रता कैसे बढ़ाएं?",
  "चिंता से आध्यात्मिक रूप से कैसे निपटें?",
  "कृतज्ञता पर ज्ञान साझा करें",
];

const SpiritualGuide = () => {
  const { user, language } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const suggestions = language === 'hi' ? SUGGESTIONS_HI : SUGGESTIONS_EN;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const { data, error } = await supabase.functions.invoke('spiritual-guide', {
        body: { question: text.trim(), language, conversationHistory: history }
      });
      if (error) throw error;
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(), role: 'assistant',
        content: data.response || 'Sorry, I could not respond.', timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e: any) {
      toast({ title: language === 'hi' ? 'त्रुटि' : 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast({ title: 'Not supported', description: 'Voice input not supported in this browser.', variant: 'destructive' });
      return;
    }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (e: any) => { setInput(prev => prev + e.results[0][0].transcript); setIsListening(false); };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <>
      <SEOHead title="Spiritual Guide - AstroAshi" description="AI-powered spiritual guidance personalized for your faith" />
      <Navigation />
      <main className="min-h-screen pt-16 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 max-w-2xl flex flex-col h-[calc(100vh-8rem)]">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary">
                {language === 'hi' ? 'AstroAshi आध्यात्मिक मार्गदर्शक' : 'AstroAshi Spiritual Guide'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'hi' ? 'आध्यात्मिक ज्ञान और जीवन मार्गदर्शन' : 'Spiritual wisdom & life guidance'}
            </p>
          </motion.div>

          {/* Messages */}
          <ScrollArea className="flex-1 pr-2" ref={scrollRef}>
            <div className="space-y-4 pb-4">
              {messages.length === 0 && (
                <div className="space-y-3 pt-4">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    {language === 'hi' ? 'कोई भी आध्यात्मिक प्रश्न पूछें' : 'Ask any spiritual or life question'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestions.map((s, i) => (
                      <motion.button key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => sendMessage(s)}
                        className="text-left text-sm p-3 rounded-xl bg-card/60 border border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-card/80 border border-border/40 rounded-bl-md'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-card/80 border border-border/40 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-2 h-2 rounded-full bg-primary/40"
                          animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="pt-3 pb-2 border-t border-border/30">
            <div className="flex gap-2 items-end">
              <Button variant="ghost" size="icon" onClick={toggleVoice}
                className={isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}>
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                placeholder={language === 'hi' ? 'अपना प्रश्न पूछें...' : 'Ask your question...'}
                className="min-h-[44px] max-h-[120px] resize-none text-sm" rows={1} />
              <Button size="icon" onClick={() => sendMessage(input)} disabled={!input.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SpiritualGuide;
