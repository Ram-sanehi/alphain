import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  LineChart, 
  ExternalLink, 
  Scale, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  Info
} from "lucide-react";

const Disclaimer = () => {
  const [activeSection, setActiveSection] = useState("general-disclaimer");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "general-disclaimer",
        "investment-risk",
        "market-data",
        "liability",
        "regulatory-compliance",
        "contact",
      ];
      
      const scrollPosition = window.scrollY + 250;
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { id: "general-disclaimer", label: "General Disclaimer" },
    { id: "investment-risk", label: "Investment Risk" },
    { id: "market-data", label: "Market Data" },
    { id: "liability", label: "Liability" },
    { id: "regulatory-compliance", label: "Regulatory Compliance" },
    { id: "contact", label: "Contact Information" },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F5F1E8] selection:bg-[#C9A24B]/30 selection:text-[#F5F1E8] overflow-x-hidden">
      <Navbar />
      <main>

      {/* Hero Section */}
      <section className="py-28 md:py-36 hero-gradient relative overflow-hidden border-b border-border/10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <span className="text-primary text-xs uppercase tracking-widest font-semibold bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              Legal & Compliance
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mt-4">
              <span className="gold-text">Disclaimer</span>
            </h1>
            <div className="h-[2px] w-12 bg-primary/40 mx-auto" />
            <p className="text-base md:text-lg text-muted-foreground/90 max-w-2xl mx-auto font-light leading-relaxed">
              Please review the following information carefully before using our services or relying on any investment-related content.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section with Sticky Sidebar Grid */}
      <section className="py-24 relative">
        {/* Ambient background glow */}
        <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Desktop Navigation Sidebar (Column 1-3) */}
            <aside className="lg:col-span-3 lg:sticky lg:top-28 space-y-2 hidden lg:block">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4 pl-3">Navigation</h4>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleSmoothScroll(e, item.id)}
                    className={`block px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
                      activeSection === item.id
                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                        : "text-muted-foreground/75 hover:text-foreground hover:bg-slate-900/40"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Content Container (Column 4-12) */}
            <div className="lg:col-span-9 space-y-8 max-w-3xl">
              
              {/* Premium Warning Alert Banner */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-primary/5 border border-primary/25 rounded-2xl p-6 flex gap-4 items-start shadow-sm shadow-primary/[0.01]"
              >
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-primary font-medium leading-relaxed">
                  <strong>IMPORTANT NOTICE:</strong> Please read this disclaimer carefully before using our website and services. By accessing and using this website, you acknowledge that you have read, understood, and agree to be bound by all the terms, conditions, and regulatory disclaimers contained herein.
                </p>
              </motion.div>

              {/* 1. General Disclaimer */}
              <motion.div
                id="general-disclaimer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden"
              >
                {/* Subtle animated border slide-across line on card bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">01.</span>
                    <h2 className="text-xl font-bold font-display text-foreground">General Disclaimer</h2>
                  </div>
                  <FileText className="h-4.5 w-4.5 text-primary/40" />
                </div>
                <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                  The information provided on this website is for general informational purposes only and should not be construed as professional financial, tax, or legal advice. Alpha Investment Management Services does not provide personalized wealth advisory services without a direct, private consultation and client registration.
                </p>
                <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                  The services, products, and information offered on this website are not intended for distribution to, or use by, any individual or entity in jurisdictions where such distribution would be contrary to local laws or regulations.
                </p>
              </motion.div>

              {/* 2. Investment Risk Disclaimer */}
              <motion.div
                id="investment-risk"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden"
              >
                {/* Subtle animated border slide-across line on card bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">02.</span>
                    <h2 className="text-xl font-bold font-display text-foreground">Investment Risk Disclaimer</h2>
                  </div>
                  <AlertTriangle className="h-4.5 w-4.5 text-primary/40" />
                </div>
                <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                  All investments in the securities market involve inherent risks, including the potential loss of principal capital. Past performance is in no way indicative of future results. The market value of portfolios and any income generated from them may fluctuate. Different asset classes involve varying risk factors, and there can be no assurance that any specific strategy will be suitable or profitable for your situation.
                </p>
                <div className="border-l-2 border-primary/30 pl-4 py-1.5 my-4 bg-primary/[0.02]">
                  <p className="text-sm text-foreground/90 font-medium leading-relaxed italic">
                    "Before executing any transaction based on market data shown here, consult with a qualified financial advisor who can assess your individual risk tolerance and milestones."
                  </p>
                </div>
              </motion.div>

              {/* 3. No Representation of Expertise */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden"
              >
                {/* Subtle animated border slide-across line on card bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">03.</span>
                    <h2 className="text-xl font-bold font-display text-foreground">No Representation of Expertise</h2>
                  </div>
                  <FileText className="h-4.5 w-4.5 text-primary/40" />
                </div>
                <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                  While we strive to compile accurate, reliable, and timely content, Alpha Investment Management Services makes no representations or warranties regarding the absolute completeness, accuracy, or current status of the information provided on this Site. The contents are subject to change without notice.
                </p>
              </motion.div>

              {/* 4. Market and Economic Data */}
              <motion.div
                id="market-data"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden"
              >
                {/* Subtle animated border slide-across line on card bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">04.</span>
                    <h2 className="text-xl font-bold font-display text-foreground">Market and Economic Data</h2>
                  </div>
                  <LineChart className="h-4.5 w-4.5 text-primary/40" />
                </div>
                <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                  The stock ticker updates, historical graphs, statistical models, and general economic analyses displayed here are sourced from third-party feeds believed to be reliable. However, they are not guaranteed for accuracy or completeness. All stock quotes and indexes are delayed and subject to change.
                </p>
              </motion.div>

              {/* 5. Third-Party Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden"
              >
                {/* Subtle animated border slide-across line on card bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">05.</span>
                    <h2 className="text-xl font-bold font-display text-foreground">Third-Party Links</h2>
                  </div>
                  <ExternalLink className="h-4.5 w-4.5 text-primary/40" />
                </div>
                <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                  This website contains hyperlinked portals to external websites. Alpha Investment Management Services does not review, verify, or monitor the content, compliance, or security of these third-party platforms. Accessing links is at the user's own risk, and you will be governed by their respective terms of service.
                </p>
              </motion.div>

              {/* 6. No Liability */}
              <motion.div
                id="liability"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden"
              >
                {/* Subtle animated border slide-across line on card bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">06.</span>
                    <h2 className="text-xl font-bold font-display text-foreground">No Liability</h2>
                  </div>
                  <Scale className="h-4.5 w-4.5 text-primary/40" />
                </div>
                <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                  Under no circumstances shall Alpha Investment Management Services, its founders, directors, employees, or registered partners be liable for any losses, direct or indirect, arising from reliance on the information, calculators, or materials of this Site.
                </p>
              </motion.div>

              {/* 7. Regulatory Compliance & Bodies */}
              <motion.div
                id="regulatory-compliance"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden"
              >
                {/* Subtle animated border slide-across line on card bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">07.</span>
                    <h2 className="text-xl font-bold font-display text-foreground">Regulatory Compliance & Status</h2>
                  </div>
                  <Shield className="h-4.5 w-4.5 text-primary/40" />
                </div>
                <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                  Alpha Investment Management Services operates in compliance with financial regulations in India. Fiduciary activities are registered and overseen by relevant boards. While we maintain compliance, regulatory guidelines change periodically; users must ensure their use of this Site matches their jurisdictional laws.
                </p>
              </motion.div>

              {/* 8. Changes to Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden"
              >
                {/* Subtle animated border slide-across line on card bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">08.</span>
                  <h2 className="text-xl font-bold font-display text-foreground">Changes to Disclaimer</h2>
                </div>
                <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                  Alpha Investment Management Services reserves the right to modify or replace this disclaimer at any time without notice. Your continued utilization of the site following updates signifies complete consensus to be bound by the modified terms.
                </p>
              </motion.div>

              {/* 9. Questions or Concerns */}
              <motion.div
                id="contact"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-gradient-to-b from-slate-900/40 via-slate-950/20 to-slate-950/10 space-y-6 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden"
              >
                {/* Subtle animated border slide-across line on card bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">09.</span>
                  <h2 className="text-xl font-bold font-display text-foreground">Questions or Concerns</h2>
                </div>
                <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                  If you have queries regarding this compliance notice or need clarification, please contact our support desk:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/25 flex items-center justify-center shrink-0">
                      <Mail className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75 mb-0.5">Email Inquiry</h4>
                      <a href="mailto:alphainvestmentmnt@gmail.com" className="text-xs md:text-sm text-foreground hover:text-primary transition-colors font-medium">
                        alphainvestmentmnt@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/25 flex items-center justify-center shrink-0">
                      <Phone className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75 mb-0.5">Direct Line & Hours</h4>
                      <a href="tel:+919607509586" className="text-xs md:text-sm text-foreground hover:text-primary transition-colors font-medium block">
                        +91 9607509586
                      </a>
                      <span className="text-[10px] text-muted-foreground/70 font-light block mt-0.5">
                        Mon-Fri 9am-6pm, Sat 10am-2pm
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/25 flex items-center justify-center shrink-0">
                      <MapPin className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75 mb-0.5">Office Address</h4>
                      <p className="text-xs md:text-sm text-muted-foreground/90 leading-tight font-light">
                        1st Floor, Mahalunge Complex, Chakan-Talegaon Highway, Pune 410501
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Last Updated */}
              <div className="mt-12 pt-8 border-t border-border/10 flex justify-between items-center text-xs text-muted-foreground/50 uppercase tracking-widest">
                <span>Alpha Investment Management</span>
                <span>Last Updated: January 28, 2026</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
};

export default Disclaimer;
