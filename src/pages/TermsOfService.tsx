import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StockTicker } from "@/components/StockTicker";
import { Shield, Scale, FileText, CheckCircle, Mail, Phone, MapPin, Clock } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#070B14] text-[#F5F1E8] selection:bg-[#C9A24B]/30 selection:text-[#F5F1E8] overflow-x-hidden">
      <Navbar />
      <StockTicker />
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
              Terms & Conditions
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mt-4">
              Terms of <span className="gold-text">Service</span>
            </h1>
            <div className="h-[2px] w-12 bg-primary/40 mx-auto" />
            <p className="text-base md:text-lg text-muted-foreground/90 max-w-2xl mx-auto font-light leading-relaxed">
              Please read these terms and conditions carefully before accessing or using our wealth management website and advisory services.
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
              <span>SEBI Registered Advisory</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-primary/40" />
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              <span>Transparent Practices</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-primary/40" />
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>Secure Communication</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-primary/40" />
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Ethical Standards</span>
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
            {/* 1. Agreement to Terms */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              {/* Subtle animated border slide-across line on card bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">01.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Agreement to Terms</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this website or access our advisory services.
              </p>
            </div>

            {/* 2. Use License */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              {/* Subtle animated border slide-across line on card bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">02.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Use License</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                Permission is granted to temporarily download one copy of the materials (information or software) on Alpha Investment Management Services' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="space-y-3 pl-2 pt-2">
                {[
                  "Modify or copy the materials.",
                  "Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).",
                  "Attempt to decompile or reverse engineer any software contained on Alpha Investment Management Services' website.",
                  "Remove any copyright or other proprietary notations from the materials.",
                  "Transfer the materials to another person or 'mirror' the materials on any other server."
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm text-muted-foreground/90 font-light leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Disclaimer */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              {/* Subtle animated border slide-across line on card bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">03.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Disclaimer</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                The materials on Alpha Investment Management Services' website are provided on an 'as is' basis. Alpha Investment Management Services makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </div>

            {/* 4. Limitations */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              {/* Subtle animated border slide-across line on card bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">04.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Limitations</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                In no event shall Alpha Investment Management Services or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the website, even if Alpha Investment Management Services or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>

            {/* 5. Accuracy of Materials */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              {/* Subtle animated border slide-across line on card bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">05.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Accuracy of Materials</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                The materials appearing on the website could include technical, typographical, or photographic errors. Alpha Investment Management Services does not warrant that any of the materials on its website are accurate, complete, or current. Alpha Investment Management Services may make changes to the materials contained on its website at any time without notice.
              </p>
            </div>

            {/* 6. Links */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              {/* Subtle animated border slide-across line on card bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">06.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Links</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                Alpha Investment Management Services has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Alpha Investment Management Services of the site. Use of any such linked website is at the user's own risk.
              </p>
            </div>

            {/* 7. Modifications */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              {/* Subtle animated border slide-across line on card bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">07.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Modifications</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                Alpha Investment Management Services may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </div>

            {/* 8. Governing Law */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-[#030712]/30 space-y-4 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              {/* Subtle animated border slide-across line on card bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">08.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Governing Law</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Pune, Maharashtra.
              </p>
            </div>

            {/* 9. Contact Information */}
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border/30 bg-gradient-to-b from-slate-900/40 via-slate-950/20 to-slate-950/10 space-y-6 hover:border-primary/20 transition-all duration-300 shadow-sm group relative overflow-hidden">
              {/* Subtle animated border slide-across line on card bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-display text-primary uppercase tracking-wider">09.</span>
                <h2 className="text-xl font-bold font-display text-foreground">Contact Information</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light">
                If you have questions, comments, or regulatory inquiries regarding these Terms of Service, please contact us at:
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
                    <Phone className="h-4.5 w-4.5 text-primary" strokeWidth={2} />
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
            </div>

            {/* Last Updated */}
            <div className="mt-12 pt-8 border-t border-border/10 flex justify-between items-center text-xs text-muted-foreground/50 uppercase tracking-widest">
              <span>Alpha Investment Management</span>
              <span>Last Updated: January 28, 2026</span>
            </div>
          </motion.div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
