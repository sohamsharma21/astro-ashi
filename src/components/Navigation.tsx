import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavLogo } from './navigation/NavLogo';
import { DesktopNav } from './navigation/DesktopNav';
import { NavActions } from './navigation/NavActions';
import { BottomTabBar } from './navigation/BottomTabBar';

const Navigation = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'glass shadow-lg shadow-background/50' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-14 lg:h-16">
            <NavLogo />
            <DesktopNav />
            <NavActions />
          </div>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <BottomTabBar />
    </>
  );
};

export default Navigation;
