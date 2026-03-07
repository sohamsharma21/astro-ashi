import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import LiveChat from '@/components/chat/LiveChat';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';

const LiveConsultation = () => {
  const { language } = useAuth();

  return (
    <>
      <SEOHead
        title={language === 'hi' ? 'लाइव परामर्श - AstroAshi' : 'Live Consultation - AstroAshi'}
        description="Connect with expert Vedic astrologers for live text consultation. Get personalized guidance in real-time."
        canonical="/live-consultation"
      />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={100} />
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-cinzel text-gradient-gold mb-2">
                {language === 'hi' ? 'लाइव परामर्श' : 'Live Consultation'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'hi'
                  ? 'हमारे विशेषज्ञ ज्योतिषियों से सीधे जुड़ें'
                  : 'Connect directly with our expert astrologers'}
              </p>
            </div>
            <LiveChat />
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LiveConsultation;
