
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import AstroChat from '@/components/ask-astro/AstroChat';
import { useAstroChat, ChatMessage } from '@/hooks/useAstroChat';

const AskAstro = () => {
  const { language } = useAuth();
  const { conversation, setConversation, loading, setLoading } = useAstroChat();

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={150} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className={`text-4xl md:text-6xl font-bold mb-12 text-center text-gradient-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' ? 'Ask Astro' : 'ज्योतिषी से पूछें'}
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <AstroChat 
            conversation={conversation as any}
            setConversation={setConversation as any}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AskAstro;
