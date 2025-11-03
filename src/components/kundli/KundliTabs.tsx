import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface PlanetPosition {
  planet: string;
  sign: string;
  degree: number;
}

interface House {
  house: number;
  sign: string;
  planets: string[];
}

interface KundliTabsProps {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  ascendant: string;
  planetPositions: PlanetPosition[];
  houses: House[];
  insights?: string;
  language: 'en' | 'hi';
  loadingInsights?: boolean;
}

const KundliTabs = ({
  name,
  birthDate,
  birthTime,
  birthPlace,
  ascendant,
  planetPositions,
  houses,
  insights,
  language,
  loadingInsights
}: KundliTabsProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4 cosmic-card">
        <TabsTrigger value="overview" className="cosmic-button-outline">
          {language === 'en' ? 'Overview' : 'अवलोकन'}
        </TabsTrigger>
        <TabsTrigger value="planets" className="cosmic-button-outline">
          {language === 'en' ? 'Planets' : 'ग्रह'}
        </TabsTrigger>
        <TabsTrigger value="houses" className="cosmic-button-outline">
          {language === 'en' ? 'Houses' : 'भाव'}
        </TabsTrigger>
        <TabsTrigger value="insights" className="cosmic-button-outline">
          {language === 'en' ? 'AI Insights' : 'AI अंतर्दृष्टि'}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <Card className="cosmic-card p-6">
          <h3 className="text-2xl font-bold text-gradient-gold mb-6">
            {language === 'en' ? 'Birth Details' : 'जन्म विवरण'}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-cosmic-text/60">
                  {language === 'en' ? 'Name' : 'नाम'}
                </p>
                <p className="text-lg font-semibold text-cosmic-gold">{name}</p>
              </div>
              <div>
                <p className="text-sm text-cosmic-text/60">
                  {language === 'en' ? 'Date of Birth' : 'जन्म तिथि'}
                </p>
                <p className="text-lg font-semibold text-cosmic-text">{formatDate(birthDate)}</p>
              </div>
              <div>
                <p className="text-sm text-cosmic-text/60">
                  {language === 'en' ? 'Time of Birth' : 'जन्म समय'}
                </p>
                <p className="text-lg font-semibold text-cosmic-text">{birthTime}</p>
              </div>
              <div>
                <p className="text-sm text-cosmic-text/60">
                  {language === 'en' ? 'Place of Birth' : 'जन्म स्थान'}
                </p>
                <p className="text-lg font-semibold text-cosmic-text">{birthPlace}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-cosmic-gold/20">
              <p className="text-sm text-cosmic-text/60 mb-2">
                {language === 'en' ? 'Ascendant (Lagna)' : 'लग्न'}
              </p>
              <p className="text-2xl font-bold text-gradient-gold">{ascendant}</p>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="planets" className="mt-6">
        <Card className="cosmic-card p-6">
          <h3 className="text-2xl font-bold text-gradient-gold mb-6">
            {language === 'en' ? 'Planetary Positions' : 'ग्रह स्थिति'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planetPositions.map((planet) => (
              <div
                key={planet.planet}
                className="p-4 bg-cosmic-purple/10 rounded-lg border border-cosmic-gold/20 hover:border-cosmic-gold/40 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-cosmic-gold">
                    {planet.planet}
                  </span>
                  <span className="text-sm text-cosmic-text/60">
                    {planet.degree.toFixed(2)}°
                  </span>
                </div>
                <p className="text-cosmic-pink mt-1">{planet.sign}</p>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="houses" className="mt-6">
        <Card className="cosmic-card p-6">
          <h3 className="text-2xl font-bold text-gradient-gold mb-6">
            {language === 'en' ? 'House Details' : 'भाव विवरण'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {houses.map((house) => (
              <div
                key={house.house}
                className="p-4 bg-cosmic-purple/10 rounded-lg border border-cosmic-gold/20"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-cosmic-gold">
                    {language === 'en' ? `House ${house.house}` : `भाव ${house.house}`}
                  </span>
                  <span className="text-sm text-cosmic-pink">{house.sign}</span>
                </div>
                {house.planets.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-cosmic-text/60 mb-1">
                      {language === 'en' ? 'Planets:' : 'ग्रह:'}
                    </p>
                    <p className="text-sm text-cosmic-text">
                      {house.planets.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="insights" className="mt-6">
        <Card className="cosmic-card p-6">
          <h3 className="text-2xl font-bold text-gradient-gold mb-6">
            {language === 'en' ? 'AI-Powered Astrological Insights' : 'AI-संचालित ज्योतिषीय अंतर्दृष्टि'}
          </h3>
          {loadingInsights ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cosmic-gold" />
              <span className="ml-3 text-cosmic-text/60">
                {language === 'en' ? 'Generating insights...' : 'अंतर्दृष्टि उत्पन्न की जा रही है...'}
              </span>
            </div>
          ) : insights ? (
            <div className="prose prose-invert max-w-none">
              <div className="text-cosmic-text whitespace-pre-wrap leading-relaxed">
                {insights}
              </div>
            </div>
          ) : (
            <p className="text-cosmic-text/60 text-center py-12">
              {language === 'en' 
                ? 'AI insights will appear here once generated.' 
                : 'एक बार उत्पन्न होने के बाद AI अंतर्दृष्टि यहां दिखाई देगी।'}
            </p>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default KundliTabs;
