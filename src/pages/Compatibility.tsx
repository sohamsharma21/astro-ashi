
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import { CompatibilityForm } from '@/components/compatibility/CompatibilityForm';
import { CompatibilityResult } from '@/components/compatibility/CompatibilityResult';
import { useCompatibility } from '@/hooks/useCompatibility';

const Compatibility = () => {
  const { language } = useAuth();
  const { loading, result, calculateCompatibility, resetResult } = useCompatibility();

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={150} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className={`text-4xl md:text-6xl font-bold mb-12 text-center text-gradient-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' ? 'Compatibility Calculator' : 'संगतता कैलकुलेटर'}
        </h1>
        
        <div className="max-w-4xl mx-auto">
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
