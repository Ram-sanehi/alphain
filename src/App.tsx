import { lazy, Suspense, useEffect } from "react";
import { useLocation, BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsent } from "@/components/CookieConsent";
import { FloatingChat } from "@/components/FloatingChat";
import { SEO } from "@/components/SEO";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initializeUtmTracking } from "@/utils/utmTracker";

// Critical core pages imported directly (zero secondary chunk delay or suspense blank screen)
import Index from "./pages/Index";

// Deferred pages loaded dynamically
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Calculators = lazy(() => import("./pages/Calculators"));
const RiskProfile = lazy(() => import("./pages/RiskProfile"));
const Insights = lazy(() => import("./pages/Insights"));
const InsightDetail = lazy(() => import("./pages/InsightDetail"));
const Downloads = lazy(() => import("./pages/Downloads"));
const Empanelment = lazy(() => import("./pages/Empanelment"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Branded fallback with subtle indicator so screen is never blank
const PageFallback = () => (
  <div
    style={{ minHeight: "100vh", background: "#070B14" }}
    className="flex items-center justify-center"
    aria-label="Loading page"
  >
    <div className="w-8 h-8 rounded-full border-2 border-[#C9A24B]/30 border-t-[#C9A24B] animate-spin" />
  </div>
);

const queryClient = new QueryClient();

// Scroll to top and initialize UTM tracking
function AppLifecycle() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    initializeUtmTracking();
  }, []);

  return null;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AppLifecycle />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/calculators" element={<Calculators />} />
        <Route path="/risk-profile" element={<RiskProfile />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/insights/:slug" element={<InsightDetail />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/empanelment" element={<Empanelment />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <BrowserRouter>
            <SEO />
            <Toaster />
            <Sonner />
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
            <FloatingChat />
            <CookieConsent />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
