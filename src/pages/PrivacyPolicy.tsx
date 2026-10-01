import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, Mail, Phone, MapPin } from "lucide-react";

const PrivacyPolicy = () => {
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
              Legal Disclosure
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mt-4">
              Privacy <span className="gold-text">Policy</span>
            </h1>
            <div className="h-[2px] w-12 bg-primary/40 mx-auto" />
            <p className="text-base md:text-lg text-muted-foreground/90 max-w-2xl mx-auto font-light leading-relaxed">
              At Alpha Investment Management Services, we are committed to protecting your privacy and ensuring transparency in how we collect, safeguard, and utilize your personal information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Compliance Strip */}
      <div className="border-b border-border/10 bg-slate-950/20 py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-[11px] font-semibold text-muted-foreground/80 tracking-wider uppercase">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>SEBI Registered Advisor</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-primary/40" />
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <span>Fiduciary Data Privacy</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-primary/40" />
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <span>Secure Data Standards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* 1. Introduction */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              {/* Subtle animated border slide-across line on card bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">01.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Introduction</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                Alpha Investment Management Services ("we," "our," or "us") operates the website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </div>

            {/* 2. Information We Collect */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              {/* Subtle animated border slide-across line on card bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">02.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Information We Collect</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                We may collect information about you in a variety of ways. The information we may collect on the Site includes:
              </p>
              <ul className="space-y-3 pl-2 pt-2">
                {[
                  { title: "Personal Data:", detail: "Name, email address, phone number, mailing address, and professional qualifications." },
                  { title: "Financial Information:", detail: "Investment preferences, asset ownership, and portfolio details (when provided voluntarily)." },
                  { title: "Device Information:", detail: "IP address, browser type, operating system, and access times." },
                  { title: "Usage Information:", detail: "Pages visited, time spent on the Site, and links clicked." }
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm text-muted-foreground/90 font-light leading-relaxed">
                      <strong className="text-foreground font-semibold">{item.title}</strong> {item.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Use of Your Information */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              {/* Subtle animated border slide-across line on card bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">03.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Use of Your Information</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
              </p>
              <ul className="space-y-3 pl-2 pt-2">
                {[
                  "Process request forms, schedule advisory consultations, and send related materials.",
                  "Email or call you regarding regulatory compliance updates or your account standings.",
                  "Fulfill and manage service portfolios and transactions related to the Site.",
                  "Create a secure personal profile to customize future interactions.",
                  "Improve the operational efficiency, speed, and safety of the Site.",
                  "Monitor and analyze usage trends to optimize website functionality and readability."
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm text-muted-foreground/90 font-light leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Disclosure of Your Information */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              {/* Subtle animated border slide-across line on card bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">04.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Disclosure of Your Information</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                We do not sell, trade, or rent your personal data. We may share your information with third parties in the following circumstances:
              </p>
              <ul className="space-y-3 pl-2 pt-2">
                {[
                  { title: "By Law or to Protect Rights:", detail: "If we believe the release of information is necessary to comply with legal actions or regulatory mandates." },
                  { title: "Third-Party Service Providers:", detail: "To trusted vendors, compliance consultants, and service providers who assist us in operating our site." },
                  { title: "Business Transfers:", detail: "In connection with a merger, regulatory reorganization, or asset transfer, where assets are governed under fiduciary care." }
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm text-muted-foreground/90 font-light leading-relaxed">
                      <strong className="text-foreground font-semibold">{item.title}</strong> {item.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. Security of Your Information */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              {/* Subtle animated border slide-across line on card bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">05.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Security of Your Information</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                We use administrative, technical, and physical security measures to protect your personal information. This includes secure database networks, SSL encryption, and restricted employee access protocols. However, please remember that no method of transmission over the Internet or method of electronic storage can be guaranteed 100% secure.
              </p>
            </div>

            {/* 6. DPDP Act, 2023 Compliance & Data Principal Rights */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">06.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Digital Personal Data Protection (DPDP) Act, 2023 Rights</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                In full alignment with the Digital Personal Data Protection Act, 2023 (DPDP Act, 2023), Alpha Investment Management acts as a Data Fiduciary. Users who submit inquiries via our Contact Form or engage our advisory desk are recognized as Data Principals and possess the following enforceable statutory rights:
              </p>
              <ul className="space-y-3 pl-2 pt-2">
                {[
                  { title: "Purpose Limitation:", detail: "Information collected through the website inquiry form (full name, email, phone, advisory objective, and context) is utilized exclusively to respond to your advisory consultation request and evaluate suitability." },
                  { title: "Right to Information & Access:", detail: "You may request a summary of the personal data collected, processing activities undertaken, and identity of any third-party processors." },
                  { title: "Right to Correction & Erasure:", detail: "You have the right to request correction of inaccurate or misleading data, and completion of incomplete data. Erasure requests are subject to mandatory statutory retention obligations." },
                  { title: "Right to Grievance Redressal:", detail: "You may register grievances regarding data processing directly with our designated Data Protection & Grievance Officer, who will respond within 15 calendar days." },
                  { title: "Right to Nominate:", detail: "In the event of death or incapacity, you have the right to nominate another individual to exercise your rights under the DPDP Act." }
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm text-muted-foreground/90 font-light leading-relaxed">
                      <strong className="text-foreground font-semibold">{item.title}</strong> {item.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 7. Data Retention & SEBI Statutory Recordkeeping */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">07.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Data Retention & Statutory Audits</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                Pursuant to Regulation 22 of the SEBI (Investment Advisers) Regulations, 2013 and anti-money laundering regulations (PMLA), all client inquiry records, risk profiling assessments, investment advice notes, and communications must be maintained in verifiable physical or electronic format for a <strong>minimum period of 5 years</strong>. Inactive prospect inquiries that do not culminate in an advisory engagement are securely purged after 12 months, unless retained for audit compliance.
              </p>
            </div>

            {/* 8. Designated Data Protection & Grievance Officer */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-gradient-to-b from-slate-900/40 via-slate-950/20 to-slate-950/10 space-y-6 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">08.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Designated Grievance & Compliance Officer</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                For grievances related to data privacy under the DPDP Act, 2023 or SEBI RIA compliance, please contact our designated officer:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/25 flex items-center justify-center shrink-0">
                    <Mail className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75 mb-0.5">Designated Officer</h4>
                    <p className="text-xs md:text-sm text-foreground font-medium">Advocate Rajat Diwan</p>
                    <a href="mailto:alphainvestmentmnt@gmail.com" className="text-xs text-primary hover:underline">
                      alphainvestmentmnt@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/25 flex items-center justify-center shrink-0">
                    <Phone className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75 mb-0.5">Advisory Helpline</h4>
                    <a href="tel:+919607509586" className="text-xs md:text-sm text-foreground hover:text-primary transition-colors font-medium">
                      +91 96075 09586
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/25 flex items-center justify-center shrink-0">
                    <MapPin className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75 mb-0.5">Registered Office</h4>
                    <p className="text-xs md:text-sm text-muted-foreground/90 leading-tight font-light">
                      Shop no 2, 1st Floor, Mahalungeker Complex, Chakan-Talegaon Highway, Pune 410501
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="mt-12 pt-8 border-t border-border/10 flex justify-between items-center text-xs text-muted-foreground/50 uppercase tracking-widest">
              <span>Alpha Investment Management · SEBI RIA INA000017348</span>
              <span>Updated: September 2026</span>
            </div>
          </motion.div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
