import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Shield, 
  DollarSign, 
  Building2, 
  TrendingUp, 
  ChevronDown, 
  Award, 
  Users, 
  Clock, 
  FileText 
} from "lucide-react";
import { useState } from "react";

const regulators = [
  { name: "SEBI", fullName: "Securities and Exchange Board of India", description: "Registered Investment Advisor" },
  { name: "AMFI", fullName: "Association of Mutual Funds in India", description: "Certified Mutual Fund Distributor" },
  { name: "IRDAI", fullName: "Insurance Regulatory and Development Authority of India", description: "Licensed Insurance Broker" },
  { name: "NSE", fullName: "National Stock Exchange", description: "Authorized Trading Member" },
  { name: "BSE", fullName: "Bombay Stock Exchange", description: "Registered Sub-Broker" },
];

const partnerCategories = [
  {
    title: "Mutual Fund Partners",
    icon: TrendingUp,
    description: "Alliances with India's premier asset management houses",
    partners: [
      "HDFC Mutual Fund",
      "SBI Mutual Fund",
      "ICICI Prudential",
      "Axis Mutual Fund",
      "Kotak Mahindra",
      "Aditya Birla Capital",
      "Nippon India",
      "UTI Mutual Fund",
      "Tata Mutual Fund",
      "DSP Mutual Fund",
      "Mirae Asset",
      "Sundaram Mutual Fund",
    ],
  },
  {
    title: "Banking & Finance Partners",
    icon: Building2,
    description: "Leading national banking and financial institutions",
    partners: [
      "IDFC First Bank",
      "Kotak Mahindra Bank",
      "Axis Finance",
      "Indel Money",
      "ICICI Bank",
      "HDFC Bank",
      "Aadhar Housing Finance",
      "Easy Loan",
    ],
  },
  {
    title: "Loan & Housing Finance Partners",
    icon: DollarSign,
    description: "Trusted mortgage and capital lending providers",
    partners: [
      "IDFC First Bank",
      "Kotak Mahindra Bank",
      "Axis Finance",
      "Indel Money",
      "ICICI Bank",
      "HDFC Bank",
    ],
  },
];

const trustIndicators = [
  {
    icon: Shield,
    title: "7+ Years Experience",
    description: "Deep expertise navigating diverse Indian market cycles with absolute compliance."
  },
  {
    icon: Users,
    title: "3,000+ Active Clients",
    description: "Honored to partner with retail and HNI investors to guide their capital objectives."
  },
  {
    icon: Award,
    title: "₹300+ Cr AUM Managed",
    description: "Substantial capital assets guided under institutional-grade risk models."
  },
  {
    icon: DollarSign,
    title: "100% Fee Transparency",
    description: "Strict fiduciary model with zero commissions, kickbacks, or hidden incentives."
  },
  {
    icon: TrendingUp,
    title: "Bespoke Portfolios",
    description: "Strategies engineered around your timeline, goals, and risk profiles."
  },
  {
    icon: Clock,
    title: "Continuous Vigilance",
    description: "Active monitoring of capital assets against shifting micro and macro indicators."
  },
  {
    icon: FileText,
    title: "Clear Audit Reports",
    description: "Frequent, comprehensive performance statements keeping you fully informed."
  },
  {
    icon: Check,
    title: "Dedicated Advisor",
    description: "A single-point certified financial planner assigned for personal accountability."
  }
];

export function Empanelment() {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Section: Licensed & Regulated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <span className="text-primary font-semibold text-xs tracking-wider uppercase">Fiduciary Standing</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Licensed &amp; <span className="gold-text">Regulated Frameworks</span>
          </h2>
          <div className="h-[2px] w-16 bg-primary/40 mx-auto" />
          <p className="text-muted-foreground/90 text-sm md:text-base leading-relaxed font-light">
            We strictly operate under the oversight of India's apex financial regulators. Our credentials verify our fiduciary alignment and commitment to complete compliance and investor protection.
          </p>
        </motion.div>

        {/* Regulatory Badges */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-24">
          {regulators.map((reg, index) => (
            <motion.div
              key={reg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="glass-card rounded-2xl p-4 md:p-6 text-center border border-border/30 hover:border-primary/40 hover:-translate-y-[2px] transition-all duration-300 relative group shadow-sm flex flex-col justify-between h-full overflow-hidden"
            >
              {/* Subtle animated border slide-across line on card bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
              <div>
                {/* Double-ringed badge */}
                <div className="w-16 h-16 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 shadow-[0_0_12px_rgba(218,165,32,0.04)]">
                  <span className="font-bold text-primary text-base font-display tracking-wider uppercase">{reg.name}</span>
                </div>
                <h4 className="text-xs font-bold text-foreground mb-1.5 tracking-wide uppercase leading-tight">{reg.fullName}</h4>
              </div>
              <p className="text-[10px] text-muted-foreground/80 font-light mt-2 border-t border-border/10 pt-2">{reg.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Section: Partner Categories Accordions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-semibold text-xs tracking-wider uppercase">Strategic Ecosystem</span>
            <h3 className="text-2xl md:text-3xl font-display font-bold">
              Our Institutional <span className="gold-text">Partnerships</span>
            </h3>
            <div className="h-[2px] w-16 bg-primary/40 mx-auto" />
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {partnerCategories.map((category, index) => {
              const isExpanded = expandedCategory === index;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className={`glass-card rounded-2xl overflow-hidden border transition-all duration-300 relative group ${
                    isExpanded 
                      ? "border-primary/30 bg-gradient-to-b from-slate-900/40 via-slate-950/20 to-slate-950/10 shadow-lg shadow-primary/[0.02]" 
                      : "border-border/30 hover:border-primary/20 hover:-translate-y-[2px] bg-slate-950/20 shadow-sm"
                  }`}
                >
                  {/* Subtle animated border slide-across line on card bottom */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
                  {/* Category Header */}
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : index)}
                    className="w-full p-4 md:p-8 flex items-center gap-4 md:gap-6 text-left transition-colors relative group"
                  >
                    {isExpanded && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] to-transparent pointer-events-none" />
                    )}

                    <div className="w-14 h-14 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(218,165,32,0.03)]">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <h3 className="text-lg md:text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors duration-300">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground/85 text-xs md:text-sm font-light leading-relaxed">
                        {category.description}
                      </p>
                    </div>

                    <div className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center shrink-0 group-hover:border-primary/45 transition-colors">
                      <ChevronDown 
                        className={`h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-primary" : ""
                        }`} 
                      />
                    </div>
                  </button>

                  {/* Expanded Content (Premium Chip Grid) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-border/10 bg-[#02050c]/25"
                      >
                        <div className="p-6 md:p-8">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {category.partners.map((partner, i) => (
                              <motion.div
                                key={partner}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.02 }}
                                className="w-full h-14 flex items-center justify-center px-4 rounded-xl bg-[#030712]/50 border border-border/40 hover:border-primary/30 hover:bg-primary/[0.02] hover:text-primary transition-all duration-300 text-center font-light tracking-wide text-xs text-muted-foreground/85 cursor-default shadow-sm"
                              >
                                {partner}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Section: Why Trust Us (Dynamic Credibility Cards) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card rounded-2xl p-8 md:p-12 border border-border/30 hover:border-primary/20 transition-all duration-500 shadow-xl relative overflow-hidden group"
        >
          {/* Subtle animated border slide-across line on card bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-500 z-10" />
          <div className="absolute top-0 right-0 w-44 h-44 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-12 border-b border-border/10 pb-5">
            <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center bg-primary/5">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span className="text-primary font-semibold text-xs tracking-wider uppercase">Strategic Integrity</span>
              <h3 className="text-2xl md:text-3xl font-display font-bold">Why Trust Alpha Investment Management?</h3>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={indicator.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04, duration: 0.5 }}
                className="relative overflow-hidden bg-slate-900/10 border border-border/40 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-300 group"
              >
                <div>
                  <div className="w-10 h-10 rounded-full border border-primary/20 group-hover:border-primary/40 flex items-center justify-center mb-5 bg-primary/5 transition-colors">
                    <indicator.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <h4 className="text-xs md:text-sm font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {indicator.title}
                  </h4>
                  <p className="text-[11px] leading-relaxed text-muted-foreground/85 font-light">
                    {indicator.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
