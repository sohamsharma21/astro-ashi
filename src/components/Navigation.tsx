
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavLogo } from './navigation/NavLogo';
import { DesktopNav } from './navigation/DesktopNav';
import { MobileNav } from './navigation/MobileNav';
import { NavActions } from './navigation/NavActions';

const Navigation = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cosmic-deep-space bg-opacity-90 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <NavLogo />
          <DesktopNav />
          <NavActions menuOpen={menuOpen} onMenuToggle={toggleMenu} />
        </div>
      </div>
      <MobileNav isOpen={menuOpen} />
    </nav>
  );
};

export default Navigation;
