
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface KundliChartProps {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  ascendant: string;
  houses: House[];
  planetPositions?: PlanetPosition[];
  language: 'en' | 'hi';
}

const KundliChart = ({ 
  name, 
  birthDate, 
  birthTime, 
  birthPlace, 
  ascendant, 
  houses,
  planetPositions,
  language 
}: KundliChartProps) => {
  return (
    <div className="space-y-8">
      <div className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg p-8 rounded-lg border border-cosmic-gold border-opacity-20">
        <h2 className="text-2xl font-bold mb-6 text-cosmic-gold text-center">
          {language === 'en' ? 'Your Birth Chart' : 'आपकी जन्म कुंडली'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-2 text-white">
              {language === 'en' ? 'Personal Details' : 'व्यक्तिगत विवरण'}
            </h3>
            <p className="text-gray-300"><span className="text-cosmic-gold">{language === 'en' ? 'Name:' : 'नाम:'}</span> {name}</p>
            <p className="text-gray-300"><span className="text-cosmic-gold">{language === 'en' ? 'Birth Date:' : 'जन्म तिथि:'}</span> {new Date(birthDate).toLocaleDateString()}</p>
            <p className="text-gray-300"><span className="text-cosmic-gold">{language === 'en' ? 'Birth Time:' : 'जन्म समय:'}</span> {birthTime}</p>
            <p className="text-gray-300"><span className="text-cosmic-gold">{language === 'en' ? 'Birth Place:' : 'जन्म स्थान:'}</span> {birthPlace}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-white">
              {language === 'en' ? 'Key Information' : 'मुख्य जानकारी'}
            </h3>
            <p className="text-gray-300"><span className="text-cosmic-gold">{language === 'en' ? 'Ascendant:' : 'लग्न:'}</span> {ascendant}</p>
            <p className="text-gray-300">
              <span className="text-cosmic-gold">{language === 'en' ? 'Moon Sign:' : 'चंद्र राशि:'}</span> 
              {houses.find((h: any) => h.planets.includes('Moon'))?.sign || 'N/A'}
            </p>
            <p className="text-gray-300">
              <span className="text-cosmic-gold">{language === 'en' ? 'Sun Sign:' : 'सूर्य राशि:'}</span> 
              {houses.find((h: any) => h.planets.includes('Sun'))?.sign || 'N/A'}
            </p>
          </div>
        </div>
        
        {/* Planetary positions */}
        {planetPositions && planetPositions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3 text-white">
              {language === 'en' ? 'Planetary Positions' : 'ग्रहों की स्थिति'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {planetPositions.map((position, index) => (
                <div key={index} className="text-gray-300 border border-cosmic-gold border-opacity-20 p-2 rounded">
                  <span className="text-cosmic-gold">{position.planet}:</span> {position.sign} ({position.degree.toFixed(2)}°)
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {houses.map((house: any) => (
            <Card key={house.house} className="bg-cosmic-violet bg-opacity-20 border-cosmic-gold border-opacity-20">
              <CardHeader className="p-4">
                <CardTitle className="text-sm text-cosmic-gold">
                  {language === 'en' ? `House ${house.house}` : `भाव ${house.house}`}: {house.sign}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-white">
                  {house.planets.length > 0 
                    ? (language === 'en' ? 'Planets: ' : 'ग्रह: ') + house.planets.join(', ')
                    : (language === 'en' ? 'No planets' : 'कोई ग्रह नहीं')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-xs text-cosmic-gold text-center mt-6">
          {language === 'en' 
            ? 'Calculated using Swiss Ephemeris astronomical algorithms' 
            : 'स्विस एफेमेरिस खगोलीय एल्गोरिदम का उपयोग करके गणना की गई'}
        </div>
      </div>
    </div>
  );
};

export default KundliChart;
