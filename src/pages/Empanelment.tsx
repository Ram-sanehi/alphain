import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { StockTicker } from "@/components/StockTicker";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { Empanelment as EmpanelmentSection } from "@/components/Empanelment";

const EmpanelmentPage = () => {
  return (
    <div className="min-h-screen bg-[#070B14] text-[#F5F1E8] selection:bg-[#C9A24B]/30 selection:text-[#F5F1E8] overflow-x-hidden">
      <Navbar />
      <StockTicker />

      <main>
      {/* Hero Section */}
      <section className="py-28 md:py-36 hero-gradient relative overflow-hidden border-b border-border/10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <span className="text-primary text-xs uppercase tracking-widest font-semibold bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              Institutional Alliances
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mt-4">
              Strategic Alliances Across <br className="hidden md:inline" />
              <span className="gold-text">India's Financial Ecosystem</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground/90 max-w-2xl mx-auto font-light leading-relaxed">
              Alpha Investment Management partners with India's premier banking institutions, asset managers, and insurance providers. Supported by robust relationships and registered under national regulatory frameworks, we offer a comprehensive gateway to strategic capital growth.
            </p>
          </motion.div>
        </div>
      </section>

      <EmpanelmentSection />
      <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default EmpanelmentPage;
