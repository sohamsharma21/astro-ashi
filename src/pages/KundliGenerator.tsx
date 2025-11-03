import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { KundliForm } from '@/components/kundli/KundliForm';
import KundliChartVisualization from '@/components/kundli/KundliChartVisualization';
import KundliTabs from '@/components/kundli/KundliTabs';
import CompareKundliButton from '@/components/kundli/CompareKundliButton';
import { useKundli } from '@/hooks/useKundli';
import { motion } from 'framer-motion';

const KundliGenerator = () => {
  const { language } = useAuth();
  const { loading, loadingInsights, kundliData, generateKundli, resetKundli } = useKundli();

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={150} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`text-4xl md:text-6xl font-bold mb-12 text-center text-gradient-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}
        >
          {language === 'en' ? 'Kundli Generator' : 'कुंडली जनरेटर'}
        </motion.h1>
        
        <div className="max-w-6xl mx-auto">
          {!kundliData ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <KundliForm onSubmit={generateKundli} loading={loading} />
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <KundliChartVisualization
                ascendant={kundliData.ascendant}
                houses={kundliData.houses}
                planetPositions={kundliData.planetPositions}
                language={language}
              />
              
              <KundliTabs
                name={kundliData.name}
                birthDate={kundliData.birthDate}
                birthTime={kundliData.birthTime}
                birthPlace={kundliData.birthPlace}
                ascendant={kundliData.ascendant}
                planetPositions={kundliData.planetPositions}
                houses={kundliData.houses}
                insights={kundliData.insights}
                language={language}
                loadingInsights={loadingInsights}
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <CompareKundliButton kundliData={kundliData} language={language} />
                
                <div className="flex justify-center">
                  <Button onClick={resetKundli} className="cosmic-button-outline">
                    {language === 'en' ? 'Generate Another Kundli' : 'एक और कुंडली बनाएं'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default KundliGenerator;
