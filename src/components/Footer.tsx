
import { Mail, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

const Footer = () => {
  const { language } = useAuth();
  const y = new Date().getFullYear();

  return (
    <footer className="border-t border-border/20 mt-12 sm:mt-16 relative z-10 lg:pb-0 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl overflow-hidden border border-primary/15">
                <img src="/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png" alt="AstroAshi" className="h-full w-full object-cover" />
              </div>
              <span className="text-base sm:text-lg font-heading font-extrabold text-gradient-gold">AstroAshi</span>
            </Link>
            <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs text-muted-foreground leading-relaxed max-w-xs">
              {language === 'en' 
                ? 'AI-powered Vedic astrology and spiritual guidance platform.'
                : 'AI-संचालित वैदिक ज्योतिष और आध्यात्मिक मार्गदर्शन।'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-[10px] sm:text-[11px] font-bold text-foreground mb-2.5 sm:mb-3 uppercase tracking-wider font-heading">
              {language === 'en' ? 'Quick Links' : 'त्वरित लिंक'}
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { to: '/about-us', en: 'About', hi: 'हमारे बारे में' },
                { to: '/daily-horoscope', en: 'Horoscope', hi: 'राशिफल' },
                { to: '/kundli-generator', en: 'Kundli', hi: 'कुंडली' },
                { to: '/contact-us', en: 'Contact', hi: 'संपर्क' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[11px] sm:text-xs text-muted-foreground hover:text-primary transition-colors">
                    {language === 'en' ? link.en : link.hi}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Services */}
          <div>
            <h3 className="text-[10px] sm:text-[11px] font-bold text-foreground mb-2.5 sm:mb-3 uppercase tracking-wider font-heading">
              {language === 'en' ? 'AI Services' : 'AI सेवाएँ'}
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { to: '/ask-astroashi', en: 'AstroAshi AI', hi: 'AstroAshi AI' },
                { to: '/predictions', en: 'Predictions', hi: 'भविष्यफल' },
                { to: '/panchang', en: 'Panchang', hi: 'पंचांग' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[11px] sm:text-xs text-muted-foreground hover:text-primary transition-colors">
                    {language === 'en' ? link.en : link.hi}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] sm:text-[11px] font-bold text-foreground mb-2.5 sm:mb-3 uppercase tracking-wider font-heading">
              {language === 'en' ? 'Connect' : 'जुड़ें'}
            </h3>
            <div className="space-y-1.5 sm:space-y-2">
              <a href="mailto:astroashi@gmail.com" className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground hover:text-primary transition-colors">
                <Mail size={11} />
                astroashi@gmail.com
              </a>
              <a href="https://www.instagram.com/astro.ashi/" className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                <Instagram size={11} />
                @astro.ashi
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/15 mt-6 sm:mt-8 pt-4 sm:pt-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3">
            <p className="text-[9px] sm:text-[10px] text-muted-foreground/60">
              © {y} AstroAshi. {language === 'en' ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}
            </p>
            <ul className="flex gap-4 sm:gap-5 text-[9px] sm:text-[10px]">
              <li><Link to="/privacy-policy" className="text-muted-foreground/60 hover:text-primary transition-colors">{language === 'en' ? 'Privacy' : 'गोपनीयता'}</Link></li>
              <li><Link to="/terms-of-service" className="text-muted-foreground/60 hover:text-primary transition-colors">{language === 'en' ? 'Terms' : 'शर्तें'}</Link></li>
            </ul>
          </div>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground/40 text-center mt-3">
            Made with ❤️ by <span className="text-primary/60 font-semibold">ASA</span>
          </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
