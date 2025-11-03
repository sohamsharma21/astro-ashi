
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export const NavLogo = () => {
  const { language } = useAuth();
  
  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <div className="relative h-10 w-10 rounded-full overflow-hidden border border-cosmic-gold group-hover:scale-110 transition-all duration-300">
        <div className="absolute inset-0 bg-cosmic-violet opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
        <img
          src="/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png"
          alt="AstroAshi Logo"
          className="h-full w-full object-cover"
        />
      </div>
      <span className="text-cosmic-gold font-cinzel text-xl hidden sm:block group-hover:text-white transition-colors">
        {language === 'en' ? 'AstroAshi' : 'एस्ट्रोआशी'}
      </span>
    </Link>
  );
};
