
import { Heart, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

const Footer = () => {
  const { language } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cosmic-deep-space border-t border-cosmic-gold border-opacity-20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center">
              <div className="h-12 w-12 rounded-full overflow-hidden border border-cosmic-gold/30">
                <img
                  src="/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png"
                  alt="AstroAshi Logo"
                  className="h-full w-full object-cover glow-effect"
                />
              </div>
              <span className="ml-3 text-2xl font-bold text-cosmic-gold font-cinzel">AstroAshi</span>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              {language === 'en' 
                ? 'Decode your destiny through the stars. AstroAshi provides personalized Vedic readings, cosmic compatibility, and emotional alignment — all in one sacred space.'
                : 'तारों के माध्यम से अपने भाग्य को समझें। AstroAshi व्यक्तिगत वैदिक पठन, ब्रह्मांडीय संगतता और भावनात्मक संरेखण प्रदान करता है — सभी एक पवित्र स्थान पर।'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-cosmic-gold mb-4">
              {language === 'en' ? 'Quick Links' : 'त्वरित लिंक'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about-us" className="text-gray-300 hover:text-cosmic-gold transition-colors duration-200">
                  {language === 'en' ? 'About Us' : 'हमारे बारे में'}
                </Link>
              </li>
              <li>
                <Link to="/daily-horoscope" className="text-gray-300 hover:text-cosmic-gold transition-colors duration-200">
                  {language === 'en' ? 'Daily Horoscope' : 'दैनिक राशिफल'}
                </Link>
              </li>
              <li>
                <Link to="/kundli-generator" className="text-gray-300 hover:text-cosmic-gold transition-colors duration-200">
                  {language === 'en' ? 'Kundli Generator' : 'कुंडली जनरेटर'}
                </Link>
              </li>
              <li>
                <Link to="/compatibility" className="text-gray-300 hover:text-cosmic-gold transition-colors duration-200">
                  {language === 'en' ? 'Compatibility' : 'कुंडली मिलान'}
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-gray-300 hover:text-cosmic-gold transition-colors duration-200">
                  {language === 'en' ? 'Contact Us' : 'संपर्क करें'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-cosmic-gold mb-4">
              {language === 'en' ? 'Our Services' : 'हमारी सेवाएँ'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/daily-horoscope" className="text-gray-300 hover:text-cosmic-gold transition-colors duration-200">
                  {language === 'en' ? 'Personal Horoscopes' : 'व्यक्तिगत राशिफल'}
                </Link>
              </li>
              <li>
                <Link to="/kundli-generator" className="text-gray-300 hover:text-cosmic-gold transition-colors duration-200">
                  {language === 'en' ? 'Birth Chart Analysis' : 'जन्म कुंडली विश्लेषण'}
                </Link>
              </li>
              <li>
                <Link to="/compatibility" className="text-gray-300 hover:text-cosmic-gold transition-colors duration-200">
                  {language === 'en' ? 'Relationship Compatibility' : 'रिश्तों की संगतता'}
                </Link>
              </li>
              <li>
                <Link to="/daily-horoscope" className="text-gray-300 hover:text-cosmic-gold transition-colors duration-200">
                  {language === 'en' ? 'Transit Predictions' : 'ग्रह संक्रमण भविष्यवाणी'}
                </Link>
              </li>
              <li>
                <Link to="/consultations" className="text-gray-300 hover:text-cosmic-gold transition-colors duration-200">
                  {language === 'en' ? 'Consultations' : 'परामर्श'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-cosmic-gold mb-4">
              {language === 'en' ? 'Get In Touch' : 'संपर्क में रहें'}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail size={18} className="text-cosmic-gold mr-2" />
                <a href="mailto:info@astroashi.com" className="text-gray-300 hover:text-cosmic-gold">
                  info@astroashi.com
                </a>
              </div>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/astro.ashi/"
                  className="text-gray-300 hover:text-cosmic-gold"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-cosmic-gold"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-cosmic-gold"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} AstroAshi. {language === 'en' ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6 text-sm">
                <li>
                  <Link to="/privacy-policy" className="text-gray-400 hover:text-cosmic-gold">
                    {language === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-gray-400 hover:text-cosmic-gold">
                    {language === 'en' ? 'Terms of Service' : 'सेवा की शर्तें'}
                  </Link>
                </li>
                <li>
                  <Link to="/sitemap" className="text-gray-400 hover:text-cosmic-gold">
                    {language === 'en' ? 'Sitemap' : 'साइट मैप'}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
