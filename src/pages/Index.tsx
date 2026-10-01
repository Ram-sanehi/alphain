import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LiveMarketTicker } from "@/components/LiveMarketTicker";
import { Stats } from "@/components/Stats";
import { AboutPreview } from "@/components/AboutPreview";
import { Services } from "@/components/Services";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { TrustedInvestors } from "@/components/TrustedInvestors";
import { FAQSection } from "@/components/FAQSection";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#070B14] text-foreground selection:bg-[#C9A24B]/30 selection:text-[#F5F1E8]">
      <Navbar />
      <main>
        {/* Full-Viewport Hero */}
        <Hero />
        {/* Slim 40px Live Market Ticker (Under Hero, Not Stuck at Bottom) */}
        <LiveMarketTicker />
        {/* Ivory Background Section: Huge Serif Counters & Regulator Logos */}
        <Stats />
        <AboutPreview />
        <Services />
        <WhyChooseUs />
        <TrustedInvestors />
        <FAQSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
