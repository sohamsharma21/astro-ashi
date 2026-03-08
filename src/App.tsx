
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import DailyHoroscope from "./pages/DailyHoroscope";
import ReadingHistory from "./pages/ReadingHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Sitemap from "./pages/Sitemap";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import KundliGenerator from "./pages/KundliGenerator";
import Compatibility from "./pages/Compatibility";
import AstroLove from "./pages/AstroLove";

import CosmicJournal from "./pages/CosmicJournal";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import Panchang from "./pages/Panchang";
import FloatingPlanets from "./components/FloatingPlanets";
import Predictions from "./pages/Predictions";
import Settings from "./pages/Settings";
import VerifyEmail from "./pages/VerifyEmail";
import AskAstroAshi from "./pages/AskAstroAshi";
import Meditation from "./pages/Meditation";
import GratitudeJournal from "./pages/GratitudeJournal";
import DailyInspiration from "./pages/DailyInspiration";
import SpiritualRoutine from "./pages/SpiritualRoutine";
import SacredCalendar from "./pages/SacredCalendar";

// Create a client for React Query
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
        {/* Add floating planets to the background */}
        <FloatingPlanets />
        
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/daily-horoscope" element={
              <ProtectedRoute>
                <DailyHoroscope />
              </ProtectedRoute>
            } />
            <Route path="/reading-history" element={
              <ProtectedRoute>
                <ReadingHistory />
              </ProtectedRoute>
            } />
            <Route path="/kundli-generator" element={
              <ProtectedRoute>
                <KundliGenerator />
              </ProtectedRoute>
            } />
            <Route path="/compatibility" element={
              <ProtectedRoute>
                <Compatibility />
              </ProtectedRoute>
            } />
            <Route path="/astro-love" element={
              <ProtectedRoute>
                <AstroLove />
              </ProtectedRoute>
            } />
            <Route path="/ask-astro" element={<Navigate to="/ask-astroashi" replace />} />
            <Route path="/cosmic-journal" element={
              <ProtectedRoute>
                <CosmicJournal />
              </ProtectedRoute>
            } />
            <Route path="/help" element={<Help />} />
            <Route path="/panchang" element={<Panchang />} />
            <Route path="/predictions" element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/ask-astroashi" element={
              <ProtectedRoute>
                <AskAstroAshi />
              </ProtectedRoute>
            } />
            <Route path="/meditation" element={
              <ProtectedRoute>
                <Meditation />
              </ProtectedRoute>
            } />
            <Route path="/gratitude-journal" element={
              <ProtectedRoute>
                <GratitudeJournal />
              </ProtectedRoute>
            } />
            <Route path="/daily-inspiration" element={
              <ProtectedRoute>
                <DailyInspiration />
              </ProtectedRoute>
            } />
            <Route path="/spiritual-routine" element={
              <ProtectedRoute>
                <SpiritualRoutine />
              </ProtectedRoute>
            } />
            <Route path="/sacred-calendar" element={
              <ProtectedRoute>
                <SacredCalendar />
              </ProtectedRoute>
            } />
            {/* Redirect old booking URLs */}
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
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
