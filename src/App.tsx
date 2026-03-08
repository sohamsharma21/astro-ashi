
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
import AskAstro from "./pages/AskAstro";
import Consultations from "./pages/Consultations";
import CosmicJournal from "./pages/CosmicJournal";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import VerifyBooking from "./pages/VerifyBooking";
import Panchang from "./pages/Panchang";
import FloatingPlanets from "./components/FloatingPlanets";
import LiveConsultation from "./pages/LiveConsultation";
import Predictions from "./pages/Predictions";
import Settings from "./pages/Settings";
import VerifyEmail from "./pages/VerifyEmail";

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
            <Route path="/ask-astro" element={
              <ProtectedRoute>
                <AskAstro />
              </ProtectedRoute>
            } />
            <Route path="/consultations" element={
              <ProtectedRoute>
                <Consultations />
              </ProtectedRoute>
            } />
            <Route path="/cosmic-journal" element={
              <ProtectedRoute>
                <CosmicJournal />
              </ProtectedRoute>
            } />
            <Route path="/help" element={<Help />} />
            <Route path="/panchang" element={<Panchang />} />
            <Route path="/live-consultation" element={
              <ProtectedRoute>
                <LiveConsultation />
              </ProtectedRoute>
            } />
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
            <Route path="/verify-booking" element={<VerifyBooking />} />
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
