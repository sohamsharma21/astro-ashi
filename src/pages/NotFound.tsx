
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import StarBackground from "../components/StarBackground";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const NotFound = () => {
  const location = useLocation();
  const { language } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={150} />
      <Navigation />
      
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold mb-4 text-gradient-gold">404</h1>
          <div className="h-1 w-20 mx-auto bg-cosmic-gold opacity-50 mb-6"></div>
          <p className={`text-xl text-white mb-8 ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
            {language === 'en' 
              ? 'The stars couldn\'t align to find this page.' 
              : 'तारे इस पृष्ठ को खोजने के लिए संरेखित नहीं हो सके।'}
          </p>
          <Button className="cosmic-button" onClick={() => window.location.href = "/"}>
            {language === 'en' ? 'Return to Cosmos' : 'ब्रह्मांड पर वापस जाएं'}
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
