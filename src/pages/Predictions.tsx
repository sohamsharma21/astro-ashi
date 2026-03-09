import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import PredictionTabs from '@/components/dashboard/PredictionTabs';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';

const Predictions = () => {
  const { user, language } = useAuth();

  return (
    <>
      <SEOHead
        title={language === 'hi' ? 'भविष्यफल - AstroAshi' : 'Predictions - AstroAshi'}
        description="Get personalized daily, weekly, monthly and yearly predictions based on your Kundli, transits, and Panchang."
        canonical="/predictions"
      />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={100} />
        <Navigation />
        <main className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-24 lg:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-cinzel text-gradient-gold mb-2">
                {language === 'hi' ? 'आपका भविष्यफल' : 'Your Predictions'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'hi'
                  ? 'कुंडली + गोचर + पंचांग पर आधारित व्यक्तिगत भविष्यवाणी'
                  : 'Personalized predictions based on Kundli + Transits + Panchang'}
              </p>
            </div>
            <PredictionTabs userId={user?.id || ''} />
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Predictions;
