
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';

const Sitemap = () => {
  const { language } = useAuth();

  const siteLinks = [
    { name: language === 'en' ? 'Home' : 'होम', path: '/' },
    { name: language === 'en' ? 'Daily Horoscope' : 'दैनिक राशिफल', path: '/daily-horoscope' },
    { name: language === 'en' ? 'Kundli Generator' : 'कुंडली जनरेटर', path: '/kundli-generator' },
    { name: language === 'en' ? 'Compatibility' : 'कुंडली मिलान', path: '/compatibility' },
    
    { name: language === 'en' ? 'AstroAshi AI' : 'AstroAshi AI', path: '/ask-astroashi' },
    { name: language === 'en' ? 'Cosmic Journal' : 'कॉस्मिक जर्नल', path: '/cosmic-journal' },
    { name: language === 'en' ? 'Reading History' : 'पठन इतिहास', path: '/reading-history' },
    { name: language === 'en' ? 'Predictions' : 'भविष्यफल', path: '/predictions' },
    { name: language === 'en' ? 'Panchang' : 'पंचांग', path: '/panchang' },
  ];

  const infoLinks = [
    { name: language === 'en' ? 'About Us' : 'हमारे बारे में', path: '/about-us' },
    { name: language === 'en' ? 'Contact Us' : 'संपर्क करें', path: '/contact-us' },
    { name: language === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति', path: '/privacy-policy' },
    { name: language === 'en' ? 'Terms of Service' : 'सेवा की शर्तें', path: '/terms-of-service' },
  ];

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={150} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-4xl md:text-5xl font-bold mb-12 text-center text-gradient-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en' ? 'Sitemap' : 'साइट मैप'}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg p-8 rounded-lg border border-cosmic-gold border-opacity-20">
              <h2 className={`text-2xl font-bold mb-6 text-cosmic-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                {language === 'en' ? 'Main Pages' : 'मुख्य पृष्ठ'}
              </h2>
              
              <ul className="space-y-3">
                {siteLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-white hover:text-cosmic-gold transition-colors duration-200 flex items-center"
                    >
                      <span className="inline-block w-2 h-2 bg-cosmic-gold rounded-full mr-3"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg p-8 rounded-lg border border-cosmic-gold border-opacity-20">
              <h2 className={`text-2xl font-bold mb-6 text-cosmic-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                {language === 'en' ? 'Information Pages' : 'जानकारी पृष्ठ'}
              </h2>
              
              <ul className="space-y-3">
                {infoLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-white hover:text-cosmic-gold transition-colors duration-200 flex items-center"
                    >
                      <span className="inline-block w-2 h-2 bg-cosmic-gold rounded-full mr-3"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sitemap;
