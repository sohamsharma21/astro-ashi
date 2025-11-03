
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface PreloaderProps {
  onLoaded: () => void;
}

const Preloader = ({ onLoaded }: PreloaderProps) => {
  const [progress, setProgress] = useState(0);
  const [quote, setQuote] = useState('');

  // Astrological quotes
  const quotes = [
    { en: "The cosmos is within us. We are made of star-stuff.", hi: "ब्रह्मांड हमारे भीतर है। हम तारों से बने हैं।" },
    { en: "As above, so below. As within, so without.", hi: "जैसा ऊपर, वैसा नीचे। जैसा अंदर, वैसा बाहर।" },
    { en: "The universe speaks to us through signs.", hi: "ब्रह्मांड हमसे संकेतों के माध्यम से बात करता है।" },
    { en: "We are not just observers of the cosmos, but participants.", hi: "हम ब्रह्मांड के केवल दर्शक नहीं, बल्कि प्रतिभागी हैं।" },
    { en: "The stars guide our path, but we choose our steps.", hi: "तारे हमारा मार्ग दिखाते हैं, लेकिन हम अपने कदम चुनते हैं।" }
  ];

  useEffect(() => {
    // Select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    
    // Determine which language version to use based on localStorage
    const language = localStorage.getItem('preferred_language') === 'hi' ? 'hi' : 'en';
    setQuote(selectedQuote[language]);

    // Simulate loading progress with variable speed
    const timer = setTimeout(() => {
      let lastUpdate = Date.now();
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastUpdate;
        lastUpdate = now;
        
        // Speed varies based on current progress
        const increment = Math.max(1, Math.floor(5 * (1 - progress / 100)));
        
        setProgress((prevProgress) => {
          const newProgress = Math.min(100, prevProgress + increment);
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onLoaded();
            }, 700); // Slightly longer delay for better transition
            return 100;
          }
          return newProgress;
        });
      }, 90);

      return () => {
        clearInterval(interval);
      };
    }, 500); // Initial delay

    return () => clearTimeout(timer);
  }, [onLoaded, quotes]);

  return (
    <div className="preloader">
      <div className="cosmic-system">
        <div className="orbit orbit-1">
          <div className="planet planet-1"></div>
        </div>
        <div className="orbit orbit-2">
          <div className="planet planet-2"></div>
        </div>
        <div className="orbit orbit-3">
          <div className="planet planet-3"></div>
        </div>
        
        {/* Shooting stars animation */}
        <div className="shooting-star shooting-star-1"></div>
        <div className="shooting-star shooting-star-2"></div>
        
        <div className="preloader-logo-container">
          <img 
            src="/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png" 
            alt="AstroAshi Logo" 
            className="preloader-logo rounded-full"
          />
        </div>
      </div>
      
      <h2 className="font-cinzel text-2xl text-cosmic-gold mb-2">AstroAshi</h2>
      <div className="preloader-text mb-4">
        {progress < 30 ? "Connecting to the Cosmos..." : 
         progress < 60 ? "Aligning with the Stars..." : 
         progress < 90 ? "Revealing Celestial Insights..." :
         "Preparing Your Cosmic Journey..."}
      </div>
      
      {/* Inspirational quote */}
      <div className="max-w-md text-center italic text-cosmic-silver opacity-80 mb-6 px-4">
        "{quote}"
      </div>
      
      <div className="preloader-progress-container">
        <div 
          className="preloader-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 text-sm text-cosmic-silver flex items-center justify-center">
        <Star className="h-3 w-3 mr-1 text-cosmic-gold" fill="#ffd700" />
        {progress}%
        <Star className="h-3 w-3 ml-1 text-cosmic-gold" fill="#ffd700" />
      </div>
    </div>
  );
};

export default Preloader;
