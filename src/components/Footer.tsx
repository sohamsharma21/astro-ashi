
import { Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

const Footer = () => {
  const { language } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30 mt-20 relative z-10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-primary/20">
                <img
                  src="/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png"
                  alt="AstroAshi Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-xl font-display font-bold text-gradient-gold">AstroAshi</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {language === 'en' 
                ? 'AI-powered Vedic astrology and spiritual guidance platform. Your cosmic journey starts here.'
                : 'AI-संचालित वैदिक ज्योतिष और आध्यात्मिक मार्गदर्शन मंच।'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              {language === 'en' ? 'Quick Links' : 'त्वरित लिंक'}
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/about-us', en: 'About Us', hi: 'हमारे बारे में' },
                { to: '/daily-horoscope', en: 'Daily Horoscope', hi: 'दैनिक राशिफल' },
                { to: '/kundli-generator', en: 'Kundli Generator', hi: 'कुंडली जनरेटर' },
                { to: '/compatibility', en: 'Compatibility', hi: 'संगतता' },
                { to: '/contact-us', en: 'Contact Us', hi: 'संपर्क करें' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                    {language === 'en' ? link.en : link.hi}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Services */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              {language === 'en' ? 'AI Services' : 'AI सेवाएँ'}
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/ask-astroashi', en: 'AstroAshi AI', hi: 'AstroAshi AI' },
                { to: '/predictions', en: 'Predictions', hi: 'भविष्यफल' },
                { to: '/panchang', en: 'Panchang', hi: 'पंचांग' },
                { to: '/ask-astro', en: 'Ask Astro', hi: 'एस्ट्रो से पूछें' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                    {language === 'en' ? link.en : link.hi}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              {language === 'en' ? 'Connect' : 'जुड़ें'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-muted-foreground" />
                <a href="mailto:astroashi@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  astroashi@gmail.com
                </a>
              </div>
              <div className="flex gap-3 mt-4">
                <a href="https://www.instagram.com/astro.ashi/" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <Instagram size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/20 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} AstroAshi. {language === 'en' ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}
            </p>
            <ul className="flex gap-6 text-xs">
              <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">{language === 'en' ? 'Privacy' : 'गोपनीयता'}</Link></li>
              <li><Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">{language === 'en' ? 'Terms' : 'शर्तें'}</Link></li>
              <li><Link to="/sitemap" className="text-muted-foreground hover:text-primary transition-colors">{language === 'en' ? 'Sitemap' : 'साइटमैप'}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
