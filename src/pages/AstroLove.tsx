import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import { AstroLoveForm } from '@/components/astro-love/AstroLoveForm';
import { AstroLoveResultDisplay } from '@/components/astro-love/AstroLoveResult';
import { useAstroLove } from '@/hooks/useAstroLove';

const AstroLove = () => {
  const { language } = useAuth();
  const { loading, result, calculateCompatibility, resetResult } = useAstroLove();

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={200} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className={`text-4xl md:text-6xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-love-purple to-love-pink font-playfair`}>
          {language === 'en' ? 'AstroLove Calculator' : 'एस्ट्रोलव कैलकुलेटर'}
        </h1>
        <p className={`text-center text-cosmic-gold mb-12 text-lg ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' 
            ? '✨ Because love isn\'t random — it\'s written in the stars ✨' 
            : '✨ क्योंकि प्यार यादृच्छिक नहीं है — यह सितारों में लिखा है ✨'}
        </p>
        
        <div className="max-w-4xl mx-auto">
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
