
interface HoroscopeDisplayProps {
  horoscope: any | null;
  loading: boolean;
  language: 'en' | 'hi';
}

const HoroscopeDisplay = ({ horoscope, loading, language }: HoroscopeDisplayProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cosmic-gold"></div>
      </div>
    );
  }
  
  if (!horoscope) {
    return (
      <p className="text-center text-white">
        {language === 'en' 
          ? 'No horoscope available for today' 
          : 'आज का राशिफल उपलब्ध नहीं है'}
      </p>
    );
  }
  
  return (
    <div className="space-y-4">
      <p className="text-white text-lg">
        {language === 'en' ? horoscope.content_en : horoscope.content_hi}
      </p>
      
      <div className="text-sm text-cosmic-gold text-right italic mt-4">
        {language === 'en' 
          ? 'Generated using Swiss Ephemeris astronomical calculations' 
          : 'स्विस एफेमेरिस खगोलीय गणनाओं का उपयोग करके उत्पन्न'}
      </div>
    </div>
  );
};

export default HoroscopeDisplay;
