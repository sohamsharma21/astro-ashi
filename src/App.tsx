import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import FloatingPlanets from "./components/FloatingPlanets";
import ProtectedRoute from "./components/ProtectedRoute";

// Critical pages - loaded eagerly
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy-loaded pages for code splitting
const DailyHoroscope = lazy(() => import("./pages/DailyHoroscope"));
const ReadingHistory = lazy(() => import("./pages/ReadingHistory"));
const KundliGenerator = lazy(() => import("./pages/KundliGenerator"));
const Compatibility = lazy(() => import("./pages/Compatibility"));
const AstroLove = lazy(() => import("./pages/AstroLove"));
const CosmicJournal = lazy(() => import("./pages/CosmicJournal"));
const Profile = lazy(() => import("./pages/Profile"));
const Help = lazy(() => import("./pages/Help"));
const Panchang = lazy(() => import("./pages/Panchang"));
const Predictions = lazy(() => import("./pages/Predictions"));
const Settings = lazy(() => import("./pages/Settings"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const AskAstroAshi = lazy(() => import("./pages/AskAstroAshi"));
const Meditation = lazy(() => import("./pages/Meditation"));
const GratitudeJournal = lazy(() => import("./pages/GratitudeJournal"));
const DailyInspiration = lazy(() => import("./pages/DailyInspiration"));
const SpiritualRoutine = lazy(() => import("./pages/SpiritualRoutine"));
const SacredCalendar = lazy(() => import("./pages/SacredCalendar"));
const SpiritualGuide = lazy(() => import("./pages/SpiritualGuide"));
const KarmaTracker = lazy(() => import("./pages/KarmaTracker"));
const DevotionalMusic = lazy(() => import("./pages/DevotionalMusic"));
const SleepRelaxation = lazy(() => import("./pages/SleepRelaxation"));
const Community = lazy(() => import("./pages/Community"));
const SpiritualProgress = lazy(() => import("./pages/SpiritualProgress"));
const WorshipPlaces = lazy(() => import("./pages/WorshipPlaces"));
const LifePathPlanner = lazy(() => import("./pages/LifePathPlanner"));
const SpiritualKnowledge = lazy(() => import("./pages/SpiritualKnowledge"));
const AILifeInsights = lazy(() => import("./pages/AILifeInsights"));
const SpiritualChallenges = lazy(() => import("./pages/SpiritualChallenges"));
const SpiritualPersonalityTest = lazy(() => import("./pages/SpiritualPersonalityTest"));
const PalmReading = lazy(() => import("./pages/PalmReading"));
const FaceReading = lazy(() => import("./pages/FaceReading"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));

// Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen cosmic-bg flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <FloatingPlanets />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/daily-horoscope" element={<ProtectedRoute><DailyHoroscope /></ProtectedRoute>} />
              <Route path="/reading-history" element={<ProtectedRoute><ReadingHistory /></ProtectedRoute>} />
              <Route path="/kundli-generator" element={<ProtectedRoute><KundliGenerator /></ProtectedRoute>} />
              <Route path="/compatibility" element={<ProtectedRoute><Compatibility /></ProtectedRoute>} />
              <Route path="/astro-love" element={<ProtectedRoute><AstroLove /></ProtectedRoute>} />
              <Route path="/ask-astro" element={<Navigate to="/ask-astroashi" replace />} />
              <Route path="/cosmic-journal" element={<ProtectedRoute><CosmicJournal /></ProtectedRoute>} />
              <Route path="/help" element={<Help />} />
              <Route path="/panchang" element={<Panchang />} />
              <Route path="/predictions" element={<ProtectedRoute><Predictions /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/ask-astroashi" element={<ProtectedRoute><AskAstroAshi /></ProtectedRoute>} />
              <Route path="/meditation" element={<ProtectedRoute><Meditation /></ProtectedRoute>} />
              <Route path="/gratitude-journal" element={<ProtectedRoute><GratitudeJournal /></ProtectedRoute>} />
              <Route path="/daily-inspiration" element={<ProtectedRoute><DailyInspiration /></ProtectedRoute>} />
              <Route path="/spiritual-routine" element={<ProtectedRoute><SpiritualRoutine /></ProtectedRoute>} />
              <Route path="/sacred-calendar" element={<ProtectedRoute><SacredCalendar /></ProtectedRoute>} />
              <Route path="/spiritual-guide" element={<ProtectedRoute><SpiritualGuide /></ProtectedRoute>} />
              <Route path="/karma-tracker" element={<ProtectedRoute><KarmaTracker /></ProtectedRoute>} />
              <Route path="/devotional-music" element={<ProtectedRoute><DevotionalMusic /></ProtectedRoute>} />
              <Route path="/sleep-relaxation" element={<ProtectedRoute><SleepRelaxation /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="/spiritual-progress" element={<ProtectedRoute><SpiritualProgress /></ProtectedRoute>} />
              <Route path="/worship-places" element={<ProtectedRoute><WorshipPlaces /></ProtectedRoute>} />
              <Route path="/life-path" element={<ProtectedRoute><LifePathPlanner /></ProtectedRoute>} />
              <Route path="/spiritual-knowledge" element={<ProtectedRoute><SpiritualKnowledge /></ProtectedRoute>} />
              <Route path="/ai-life-insights" element={<ProtectedRoute><AILifeInsights /></ProtectedRoute>} />
              <Route path="/spiritual-challenges" element={<ProtectedRoute><SpiritualChallenges /></ProtectedRoute>} />
              <Route path="/personality-test" element={<ProtectedRoute><SpiritualPersonalityTest /></ProtectedRoute>} />
              <Route path="/palm-reading" element={<ProtectedRoute><PalmReading /></ProtectedRoute>} />
              <Route path="/consultations" element={<Navigate to="/ask-astroashi" replace />} />
              <Route path="/live-consultation" element={<Navigate to="/ask-astroashi" replace />} />
              <Route path="/verify-booking" element={<Navigate to="/" replace />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
