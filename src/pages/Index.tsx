import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import StarBackground from '../components/StarBackground';
import Preloader from '../components/Preloader';
import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { AboutSection } from '@/components/home/AboutSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';
import { AnimatedSection } from '@/components/home/AnimatedSection';
import { useAuth } from '@/lib/auth';
import { SEOHead } from '@/components/SEOHead';
import PersonalizedDashboard from '@/components/dashboard/PersonalizedDashboard';
import KundliOnboardingModal from '@/components/onboarding/KundliOnboardingModal';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const { user, userProfile, needsKundliOnboarding, refetchProfile } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleLoaded = () => {
    setLoading(false);
  };

  // Show onboarding modal when needed
  useEffect(() => {
    if (needsKundliOnboarding && !loading) {
      setShowOnboarding(true);
    }
  }, [needsKundliOnboarding, loading]);

  const handleOnboardingComplete = async () => {
    await refetchProfile();
    setShowOnboarding(false);
  };

  // Effect to simulate some loading time but ensure not too long
  useEffect(() => {
    // Resources to preload
    const imagesToPreload = [
      '/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png'
    ];
    
    // Preload images
    const preloadImages = async () => {
      const imagePromises = imagesToPreload.map((src) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Continue even if image fails to load
          img.src = src;
        });
      });
      
      // Wait for all images or timeout after 2 seconds
      const timeout = new Promise<void>((resolve) => setTimeout(resolve, 2000));
      await Promise.race([Promise.all(imagePromises), timeout]);
      
      // Add a small delay for better UX
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };

    preloadImages();
    
    // Failsafe: if still loading after 3.5 seconds, force stop loading
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 3500);
    
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return <Preloader onLoaded={handleLoaded} />;
  }

  // Show personalized dashboard for logged-in users with Kundli
  const showDashboard = user && userProfile?.kundli_generated;

  return (
    <>
      <SEOHead 
        title="AstroAshi - Your Personal Vedic Astrology & Kundli Platform"
        description="Get personalized Kundli-based horoscopes, real-time Panchang, AI-powered Vedic astrology predictions. Your cosmic journey starts here with AstroAshi."
        keywords="astrology, horoscope, kundli, birth chart, zodiac signs, panchang, vedic astrology, jyotish, राशिफल, कुंडली, पंचांग, mahadasha"
        canonical="/"
      />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={150} />
        <Navigation />
        
        {/* Kundli Onboarding Modal */}
        <KundliOnboardingModal 
          open={showOnboarding} 
          onComplete={handleOnboardingComplete} 
        />

        <main>
          {showDashboard ? (
            // Personalized Kundli-based Dashboard for logged-in users
            <div className="pt-20 pb-10">
              <PersonalizedDashboard />
            </div>
          ) : (
            // Landing page for guests
            <>
              <HeroSection />
              <AnimatedSection>
                <AboutSection />
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <ServicesSection />
              </AnimatedSection>
              <AnimatedSection delay={0.3}>
                <TestimonialsSection />
              </AnimatedSection>
              <AnimatedSection delay={0.4}>
                <CTASection />
              </AnimatedSection>
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
