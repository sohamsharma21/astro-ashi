import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import { AstroLoveForm } from '@/components/astro-love/AstroLoveForm';
import { AstroLoveResultDisplay } from '@/components/astro-love/AstroLoveResult';
import { useAstroLove } from '@/hooks/useAstroLove';
import { SEOHead } from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const AstroLove = () => {
  const { language } = useAuth();
  const { loading, result, calculateCompatibility, resetResult } = useAstroLove();

  return (
    <div className="cosmic-bg min-h-screen">
      <SEOHead title="AstroLove Calculator | AstroAshi" description="Discover your love compatibility using zodiac, numerology, elements & planetary alignment." />
      <StarBackground starCount={200} />
      <Navigation />

      <main className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-24 lg:pb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-medium text-pink-400 mb-4">
            <Heart className="h-3 w-3" /> {language === 'en' ? '6-Dimension Love Analysis' : '6-आयामी प्रेम विश्लेषण'}
          </div>
          <h1 className={`text-2xl sm:text-3xl md:text-5xl font-bold text-foreground ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en' ? 'AstroLove Calculator' : 'एस्ट्रोलव कैलकुलेटर'}
          </h1>
          <p className={`text-muted-foreground mt-3 max-w-lg mx-auto ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en'
              ? 'Zodiac chemistry, element harmony, numerology, planetary love alignment & more'
              : 'राशि केमिस्ट्री, तत्व सामंजस्य, अंकशास्त्र, ग्रहीय प्रेम और अधिक'}
          </p>
        </motion.div>

        <div className="max-w-lg mx-auto">
          {!result ? (
            <AstroLoveForm onSubmit={calculateCompatibility} loading={loading} />
          ) : (
            <AstroLoveResultDisplay result={result} onNewCalculation={resetResult} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AstroLove;
