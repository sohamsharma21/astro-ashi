import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import { CompatibilityForm } from '@/components/compatibility/CompatibilityForm';
import { CompatibilityResult } from '@/components/compatibility/CompatibilityResult';
import { useCompatibility } from '@/hooks/useCompatibility';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Compatibility = () => {
  const { language } = useAuth();
  const { loading, result, calculateCompatibility, resetResult } = useCompatibility();

  return (
    <div className="cosmic-bg min-h-screen">
      <SEOHead title="Ashtakoot Milan | AstroAshi" description="Vedic 36-point Ashtakoot Kundli Milan compatibility analysis with Nadi, Bhakoot, Gana matching." />
      <StarBackground starCount={150} />
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-28 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4">
            <Sparkles className="h-3 w-3" /> {language === 'en' ? 'Vedic 36-Point System' : 'वैदिक 36-अंक प्रणाली'}
          </div>
          <h1 className={`text-3xl md:text-5xl font-bold text-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en' ? 'Ashtakoot Milan' : 'अष्टकूट मिलान'}
          </h1>
          <p className={`text-muted-foreground mt-3 max-w-lg mx-auto ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en'
              ? 'Nadi, Bhakoot, Gana, Maitri, Yoni, Tara, Vashya & Varna — complete Vedic compatibility'
              : 'नाड़ी, भकूट, गण, मैत्री, योनि, तारा, वश्य और वर्ण — पूर्ण वैदिक संगतता'}
          </p>
        </motion.div>

        <div className="max-w-lg mx-auto">
          {!result ? (
            <CompatibilityForm onSubmit={calculateCompatibility} loading={loading} />
          ) : (
            <CompatibilityResult result={result} onNewCalculation={resetResult} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Compatibility;
