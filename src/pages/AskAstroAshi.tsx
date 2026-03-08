import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Trash2, History, Bot, User, Mic, MicOff, Copy, Share2, Volume2, VolumeX, CheckCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  followUpQuestions?: string[];
}

const SUGGESTED_QUESTIONS_EN = [
  '💼 How will my career progress this year?',
  '❤️ What does my chart say about love and marriage?',
  '💰 Is this a good time for financial investments?',
  '🧘 What remedies can improve my health?',
  '🏠 Should I buy property this year?',
  '✈️ Is foreign travel in my stars?',
];
const SUGGESTED_QUESTIONS_HI = [
  '💼 इस वर्ष मेरा करियर कैसा रहेगा?',
  '❤️ प्रेम और विवाह के बारे में कुंडली क्या कहती है?',
  '💰 क्या यह वित्तीय निवेश का अच्छा समय है?',
  '🧘 स्वास्थ्य सुधार के लिए कौन से उपाय करें?',
  '🏠 क्या इस साल प्रॉपर्टी खरीदनी चाहिए?',
  '✈️ क्या विदेश यात्रा का योग है?',
];

const AskAstroAshi = () => {
  const { user, language } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isHindi = language === 'hi';
  const suggestions = isHindi ? SUGGESTED_QUESTIONS_HI : SUGGESTED_QUESTIONS_EN;

  // Auto-scroll to bottom
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

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

  // Build conversation history for RAG context
  const getConversationHistory = useCallback(() => {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  }, [messages]);

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
        body: { 
          question: question.trim(), 
          language,
          conversationHistory: getConversationHistory(),
        },
      });

      if (error) throw error;

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        followUpQuestions: data.followUpQuestions || [],
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
    window.speechSynthesis?.cancel();
    setSpeakingMsgId(null);
  };

  // ===== Voice Input (Speech-to-Text) =====
  const toggleVoiceInput = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error(isHindi ? 'आपका ब्राउज़र वॉइस इनपुट सपोर्ट नहीं करता' : 'Your browser does not support voice input');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = isHindi ? 'hi-IN' : 'en-IN';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      if (finalTranscript) {
        setInput(prev => prev + finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        toast.error(isHindi ? 'माइक्रोफ़ोन की अनुमति दें' : 'Please allow microphone access');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    toast.success(isHindi ? '🎤 बोलना शुरू करें...' : '🎤 Start speaking...');
  }, [isListening, isHindi]);

  // ===== Text-to-Speech =====
  const toggleSpeak = useCallback((msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    
    // Strip markdown for cleaner speech
    const cleanText = text
      .replace(/#{1,3}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/- /g, '')
      .replace(/\d+\.\s/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeakingMsgId(msgId);
  }, [speakingMsgId, isHindi]);

  // ===== Copy to Clipboard =====
  const copyMessage = useCallback(async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsgId(msgId);
      toast.success(isHindi ? 'कॉपी हो गया!' : 'Copied!');
      setTimeout(() => setCopiedMsgId(null), 2000);
    } catch {
      toast.error(isHindi ? 'कॉपी नहीं हो सका' : 'Failed to copy');
    }
  }, [isHindi]);

  // ===== Share =====
  const shareMessage = useCallback(async (text: string) => {
    const shareText = `🔮 AstroAshi AI ${isHindi ? 'का उत्तर' : 'Response'}:\n\n${text.substring(0, 500)}...\n\n${isHindi ? 'अपनी कुंडली का विश्लेषण पाएं:' : 'Get your Kundli analysis at:'} ${window.location.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'AstroAshi AI', text: shareText });
      } catch {
        // User cancelled share
      }
    } else {
      // Fallback to WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    }
  }, [isHindi]);

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
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-primary">
                {isHindi ? 'AstroAshi AI से पूछें' : 'Ask AstroAshi AI'}
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
              {isHindi
                ? 'अपनी कुंडली और ग्रह स्थिति के आधार पर जीवन के प्रश्नों का उत्तर पाएं — बातचीत की याद रखने वाला AI'
                : 'Get personalized guidance based on your Kundli — AI that remembers your conversation context'}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mb-3">
            <Button variant="outline" size="sm" onClick={loadHistory} className="border-border text-xs">
              <History className="h-3.5 w-3.5 mr-1" />
              {isHindi ? 'इतिहास' : 'History'}
            </Button>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearChat} className="border-border text-xs">
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                {isHindi ? 'साफ़ करें' : 'Clear'}
              </Button>
            )}
          </div>

          {/* Chat Card */}
          <Card className="border-border bg-card/80 backdrop-blur-lg flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
            {/* Scrollable Messages Area */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--muted)) transparent' }}
            >
              {/* Welcome / Empty State */}
              {messages.length === 0 && !showHistory && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 space-y-6"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-12 w-12 text-primary" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse scale-125" />
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold text-foreground">
                      {isHindi ? 'नमस्ते! मैं AstroAshi AI हूं 🙏' : 'Namaste! I am AstroAshi AI 🙏'}
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-md">
                      {isHindi
                        ? 'मैं आपकी पूरी बातचीत याद रखता हूं। वॉइस से बोलें या टाइप करें!'
                        : 'I remember your full conversation. Speak via voice or type your question!'}
                    </p>
                  </div>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    {[
                      { icon: '🎤', text: isHindi ? 'वॉइस इनपुट' : 'Voice Input' },
                      { icon: '🧠', text: isHindi ? 'बातचीत की याद' : 'Conversation Memory' },
                      { icon: '🔊', text: isHindi ? 'जवाब सुनें' : 'Listen to Answers' },
                      { icon: '📤', text: isHindi ? 'शेयर करें' : 'Share Responses' },
                    ].map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {f.icon} {f.text}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                    {suggestions.map((q, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <Button
                          variant="outline"
                          className="text-left text-sm h-auto py-3 px-4 border-border hover:bg-primary/10 hover:border-primary/30 hover:scale-[1.02] transition-all duration-200 whitespace-normal w-full"
                          onClick={() => sendMessage(q)}
                        >
                          {q}
                        </Button>
                      </motion.div>
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
                      <Card
                        key={item.id}
                        className="border-border bg-secondary/30 cursor-pointer hover:bg-secondary/50 hover:scale-[1.01] transition-all duration-200"
                        onClick={() => {
                          setMessages([
                            { id: '1', role: 'user', content: item.question, timestamp: new Date(item.created_at) },
                            { id: '2', role: 'assistant', content: item.ai_response?.content || '', timestamp: new Date(item.created_at), followUpQuestions: item.ai_response?.followUpQuestions },
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
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: index === messages.length - 1 ? 0.05 : 0 }}
                    className={`mb-4 flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary/15 text-primary border border-primary/30'
                    }`}>
                      {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    {/* Bubble */}
                    <div className="max-w-[80%] space-y-2">
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                            : 'bg-secondary/50 border border-border text-foreground rounded-tl-sm'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <div className="prose prose-sm prose-invert max-w-none [&_h2]:text-primary [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1.5 [&_h3]:text-primary [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:text-foreground [&_p]:text-sm [&_p]:leading-relaxed [&_li]:text-foreground [&_li]:text-sm [&_strong]:text-primary [&_ul]:my-1 [&_ol]:my-1">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        )}
                        <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-primary-foreground/50' : 'text-muted-foreground/70'}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {/* Action buttons for assistant messages */}
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1 pl-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                            onClick={() => copyMessage(msg.id, msg.content)}
                            title={isHindi ? 'कॉपी करें' : 'Copy'}
                          >
                            {copiedMsgId === msg.id ? <CheckCheck className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                            onClick={() => toggleSpeak(msg.id, msg.content)}
                            title={isHindi ? 'सुनें' : 'Listen'}
                          >
                            {speakingMsgId === msg.id ? <VolumeX className="h-3.5 w-3.5 text-primary" /> : <Volume2 className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                            onClick={() => shareMessage(msg.content)}
                            title={isHindi ? 'शेयर करें' : 'Share'}
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}

                      {/* Follow-up Questions */}
                      {msg.role === 'assistant' && msg.followUpQuestions && msg.followUpQuestions.length > 0 && index === messages.length - 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex flex-col gap-1.5 mt-2"
                        >
                          <p className="text-xs text-muted-foreground font-medium pl-1">
                            {isHindi ? '🔮 आगे पूछें:' : '🔮 Follow-up:'}
                          </p>
                          {msg.followUpQuestions.map((q, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className="text-left text-xs h-auto py-2 px-3 border-border hover:bg-primary/10 hover:border-primary/30 whitespace-normal justify-start"
                              onClick={() => sendMessage(q)}
                              disabled={loading}
                            >
                              {q}
                            </Button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 mb-4"
                >
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/15 text-primary border border-primary/30 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-secondary/50 border border-border rounded-2xl rounded-tl-sm px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {isHindi ? 'ग्रहों की स्थिति देख रहा हूं...' : 'Reading the stars...'}
                    </p>
                  </div>
                </motion.div>
              )}

              <div ref={scrollEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-3 md:p-4 bg-card/50">
              {/* Voice Recording Indicator */}
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20"
                >
                  <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                  <span className="text-xs text-destructive font-medium">
                    {isHindi ? '🎤 सुन रहा हूं... बोलें' : '🎤 Listening... speak now'}
                  </span>
                  <Button variant="ghost" size="sm" onClick={toggleVoiceInput} className="ml-auto h-6 text-xs text-destructive">
                    {isHindi ? 'रोकें' : 'Stop'}
                  </Button>
                </motion.div>
              )}

              <div className="flex gap-2 items-end">
                {/* Voice Input Button */}
                <Button
                  variant={isListening ? 'destructive' : 'outline'}
                  size="icon"
                  className={`shrink-0 h-11 w-11 rounded-xl transition-all duration-200 ${isListening ? 'animate-pulse' : ''}`}
                  onClick={toggleVoiceInput}
                  title={isHindi ? 'वॉइस इनपुट' : 'Voice Input'}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isHindi ? 'अपना प्रश्न यहाँ लिखें या 🎤 बोलें...' : 'Type your question or 🎤 speak...'}
                  className="flex-1 min-h-[44px] max-h-[120px] resize-none rounded-xl bg-muted border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all disabled:opacity-50"
                  rows={1}
                  disabled={loading}
                />
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  size="icon"
                  className={`shrink-0 h-11 w-11 rounded-xl transition-all duration-200 ${
                    input.trim() ? 'shadow-md shadow-primary/25' : ''
                  }`}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
                {isHindi
                  ? 'AI-आधारित मार्गदर्शन। महत्वपूर्ण निर्णयों के लिए पेशेवर ज्योतिषी से परामर्श करें।'
                  : 'AI-powered guidance with conversation memory. Consult a professional astrologer for important decisions.'}
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
