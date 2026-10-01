import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { FounderSplitSection } from "@/components/FounderSplitSection";
import { HorizontalTimeline } from "@/components/HorizontalTimeline";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { 
  Target, 
  Eye, 
  Award, 
  Users, 
  TrendingUp, 
  Shield, 
  Heart,
  Lightbulb,
  Linkedin,
  Facebook,
  Instagram,
  ArrowRight
} from "lucide-react";


// Counter component for animated statistics
const Counter = ({ value, duration = 2 }: { value: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Parse prefix, number, unit ("Cr"), and symbol ("+" or "%")
  const prefix = value.match(/^[^\d]+/)?.[0] || "";
  const numericPart = parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
  const hasCr = value.includes("Cr");
  const hasPlus = value.includes("+");
  const hasPercent = value.includes("%");

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = numericPart;
      if (start === end) return;

      const totalMiliseconds = duration * 1000;
      const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
      
      const timer = setInterval(() => {
        start += Math.ceil(end / (totalMiliseconds / incrementTime));
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        } else {
          setCount(start);
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, numericPart, duration]);

  return (
    <span
      ref={ref}
      className="font-serif font-normal text-4xl sm:text-5xl lg:text-[56px] text-[#C9A24B] tracking-tight leading-none inline-flex items-baseline justify-center tabular-nums lining-nums [font-variant-numeric:lining-nums_tabular-nums]"
    >
      {prefix && <span>{prefix}</span>}
      <span>{count.toLocaleString("en-IN")}</span>
      {hasCr && (
        <span className="font-serif text-[0.65em] font-normal leading-none inline-block">&thinsp;Cr</span>
      )}
      {hasPlus && <span className="font-serif font-normal leading-none">+</span>}
      {hasPercent && <span className="font-serif font-normal leading-none">%</span>}
    </span>
  );
};


const values = [
  { 
    icon: Shield, 
    title: "Integrity First", 
    description: "Our word is our bond. We hold ourselves to the highest fiduciary standards, ensuring our actions always mirror our promises." 
  },
  { 
    icon: Users, 
    title: "Client-Centricity", 
    description: "Your goals dictate our strategies. Every recommendation is crafted with your family's financial well-being as our absolute north star." 
  },
  { 
    icon: Lightbulb, 
    title: "Continuous Innovation", 
    description: "Dynamic strategies for evolving markets. We combine time-tested wisdom with modern analysis to navigate shifting economic landscapes." 
  },
  { 
    icon: Heart, 
    title: "Unwavering Trust", 
    description: "Forged through absolute transparency. We believe lasting wealth is built on a foundation of clear communication and no hidden agendas." 
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-[#070B14] text-foreground selection:bg-[#C9A24B]/30 selection:text-[#F5F1E8] overflow-x-clip">
      <Navbar />
      <main>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-24 lg:pb-32 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#C9A24B]/[0.04] rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Soft bottom edge fade into next section background */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#070B14]/60 to-[#070B14] pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <div>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-mono font-semibold text-[#DCB862] bg-[#C9A96E]/10 px-4 py-1.5 rounded-full border border-[#C9A96E]/30">
                Who We Are
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-serif font-normal leading-[1.08] tracking-tight [text-wrap:balance] text-[#F5F1E8] mt-4">
              Helping Families Build <br className="hidden md:inline" />
              <span className="italic text-[#C9A96E]">Financial Confidence</span> Since{" "}
              <span className="lining-nums [font-variant-numeric:lining-nums] font-serif">2019</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#A8B0BD] leading-[1.6] max-w-2xl mx-auto font-sans font-light [text-wrap:balance]">
              True wealth is not just about numbers; it is about the freedom, security, and peace of mind it brings. 
              We craft bespoke strategies designed to transform your life goals into an enduring financial legacy.
            </p>

            {/* Hero Ending Actions: Primary Gold-filled Consultation Button + Secondary Text Link (32px gap on desktop, stacked on mobile) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-4">
              <Link
                to="/contact"
                className="bg-[#C9A24B] hover:bg-[#DCB862] text-[#070B14] font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all duration-300 shadow-lg active:scale-[0.98] inline-flex items-center justify-center gap-2 group leading-none"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#approach"
                className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider font-sans font-semibold text-[#F5F1E8] hover:text-[#C9A96E] border-b border-[#C9A96E]/40 hover:border-[#C9A96E] py-1 transition-all duration-200 group leading-none"
              >
                <span>Our Approach</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A96E] transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Split Layout: Founder Portrait in Arched Frame with Parallax + Fiduciary Care Quote */}
      <FounderSplitSection borderTop={false} />


      {/* Institutional Statistics Banner */}
      <section className="w-full py-16 bg-[#0B1020] border-y border-white/[0.08] relative overflow-hidden flex justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A24B]/[0.03] to-transparent pointer-events-none" />
        <div className="w-full max-w-[1152px] mx-auto px-6 relative z-10 [margin-inline:auto] [padding-inline:24px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-center lining-nums [font-variant-numeric:lining-nums_tabular-nums]">
            {/* Stat 1 */}
            <div className="border-b sm:border-b sm:border-r lg:border-b-0 lg:border-r border-white/[0.08] py-6 lg:py-4 px-4 flex flex-col items-center justify-center">
              <div className="flex items-baseline justify-center">
                <Counter value="7+" />
              </div>
              <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#A8B0BD] font-medium mt-3 text-center">
                Years Experience
              </div>
            </div>

            {/* Stat 2 */}
            <div className="border-b sm:border-b sm:border-r-0 lg:border-b-0 lg:border-r border-white/[0.08] py-6 lg:py-4 px-4 flex flex-col items-center justify-center">
              <div className="flex items-baseline justify-center">
                <Counter value="3000+" />
              </div>
              <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#A8B0BD] font-medium mt-3 text-center">
                Happy Clients
              </div>
            </div>

            {/* Stat 3 */}
            <div className="border-b sm:border-b-0 sm:border-r lg:border-r border-white/[0.08] py-6 lg:py-4 px-4 flex flex-col items-center justify-center">
              <div className="flex items-baseline justify-center">
                <Counter value="₹300Cr+" />
              </div>
              <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#A8B0BD] font-medium mt-3 text-center">
                Assets Managed
              </div>
            </div>

            {/* Stat 4 */}
            <div className="py-6 lg:py-4 px-4 flex flex-col items-center justify-center">
              <div className="flex items-baseline justify-center">
                <Counter value="100%" />
              </div>
              <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#A8B0BD] font-medium mt-3 text-center">
                Compliance Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-24 lg:py-32 bg-[#070B14] relative border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20 space-y-4"
          >
            <span className="text-[#C9A96E] font-mono text-xs uppercase tracking-[0.25em] font-semibold">
              Advisory Leadership
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F5F1E8] font-normal tracking-tight">
              Experienced minds. <span className="italic text-[#C9A96E]">Singular focus.</span>
            </h2>
            <p className="text-[#A8B0BD] text-sm md:text-base max-w-2xl mx-auto font-sans font-light [text-wrap:balance] leading-[1.65]">
              Led by seasoned chartered financial analysts, risk managers, and regulatory specialists committed to fiduciary integrity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:[grid-template-rows:auto_auto_auto_auto_1fr]">
            {[
              {
                name: "Nageshwar Prasad",
                initials: "NP",
                role: "Founder & Chief Investment Officer",
                qualifications: [
                  "SEBI Registered Investment Advisor & Portfolio Manager",
                  "CFA Level II · Henley Business School (London) MSc Finance",
                  "AMFI & IRDA Approved Distributor",
                  "7+ Years Private Wealth Advisory Leadership",
                ],
                linkedin: "https://linkedin.com",
              },
              {
                name: "Sonali Malhotra",
                initials: "SM",
                role: "Head of Risk Management",
                qualifications: [
                  "Chartered Accountant (CA) & M.Com",
                  "NISM Certified Wealth & Derivatives Analyst",
                  "AMFI & IRDA Approved Risk Specialist",
                  "7+ Years Enterprise & Insurance Risk Advisory",
                ],
                linkedin: "https://linkedin.com",
              },
              {
                name: "Rahul Jain",
                initials: "RJ",
                role: "Relationship Director",
                qualifications: [
                  "Master of Commerce (M.Com)",
                  "NISM Certified Financial Planner",
                  "High Net\u2011Worth Client Portfolio Governance",
                  "5+ Years Tailored Multi\u2011Asset Strategy",
                ],
                linkedin: "https://linkedin.com",
              },
              {
                name: "Advocate Rajat Diwan",
                initials: "RD",
                role: "Legal & Compliance Officer",
                qualifications: [
                  "Bachelor of Laws (LLB) & Master of Arts (MA)",
                  "SEBI Regulatory Compliance & Audit Specialist",
                  "Statutory BASL & Prevention of Money Laundering",
                  "Fiduciary Charter Oversight & Legal Counsel",
                ],
                linkedin: "https://linkedin.com",
              },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative rounded-2xl border border-white/[0.08] bg-[#090E1C] p-6 shadow-xl flex flex-col lg:grid lg:row-span-5 lg:[grid-template-rows:subgrid] transition-all duration-200 hover:border-[#C9A96E]/60 hover:-translate-y-1 hover:shadow-2xl focus-within:ring-2 focus-within:ring-[#C9A96E]/50 focus-within:border-[#C9A96E] max-w-[420px] md:max-w-none mx-auto w-full outline-none"
              >
                {/* Row 1: Monogram Circle + LinkedIn Icon */}
                <div className="flex items-start justify-between gap-4">
                  {/* Monogram Circle: 92px circle, rgba(201,169,110,0.5) border, subtle inner gold glow, serif 42px */}
                  <div className="w-[92px] h-[92px] rounded-full border border-[#C9A96E]/50 bg-[#0B1020]/95 shadow-[inset_0_0_18px_rgba(201,169,110,0.18)] flex items-center justify-center shrink-0">
                    <span className="font-serif text-4xl sm:text-[42px] font-normal text-[#C9A96E] leading-none select-none">
                      {member.initials}
                    </span>
                  </div>

                  {/* LinkedIn Icon: Crisp 16px SVG inside 32px circle, brighter stroke, visible border, accessible label, gold hover */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-white/25 bg-[#0B1020]/90 flex items-center justify-center text-slate-100 hover:text-[#C9A96E] hover:border-[#C9A96E] hover:bg-[#C9A96E]/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <Linkedin className="w-4 h-4 stroke-[1.8]" />
                  </a>
                </div>

                {/* Row 2: Name (serif) */}
                <div className="mt-5 min-h-[56px] sm:min-h-[58px]">
                  <h3 className="font-serif text-xl sm:text-[22px] font-normal text-[#F5F1E8] group-hover:text-[#C9A96E] transition-colors duration-200 leading-snug">
                    {member.name}
                  </h3>
                </div>

                {/* Row 3: Role (small caps mono 12px, tracking-[0.1em], text-wrap: balance) */}
                <div className="mt-1.5 min-h-[38px] sm:min-h-[42px]">
                  <p className="text-xs font-mono text-[#C9A96E] uppercase tracking-[0.1em] [text-wrap:balance] font-medium leading-relaxed">
                    {member.role}
                  </p>
                </div>

                {/* Row 4: Hairline Divider */}
                <div className="h-[1px] w-full bg-white/[0.08] my-4 sm:my-5" />

                {/* Row 5: Credential Bullets (13.5-14px, line-height 1.55) */}
                <ul className="space-y-2.5 min-h-[160px] sm:min-h-[175px] flex-1">
                  {member.qualifications.map((qual, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13.5px] sm:text-[14px] text-[#A8B0BD] font-sans font-light leading-[1.55] [text-wrap:pretty]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]/80 mt-[7px] shrink-0" aria-hidden="true" />
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Soft bottom separation without harsh hairlines */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#070B14] pointer-events-none" aria-hidden="true" />
      </section>

      {/* Mission & Vision Section */}
      <section className="w-full py-24 bg-[#070B14] relative overflow-hidden flex justify-center">
        <div className="w-full max-w-[1152px] mx-auto px-6 relative z-10 [margin-inline:auto] [padding-inline:24px]">
          {/* Eyebrow */}
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-[#C9A96E] font-mono text-xs uppercase tracking-[0.25em] font-semibold inline-block">
              Purpose
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl bg-[#090E1C] border border-white/[0.08] p-8 md:p-10 shadow-xl flex flex-col justify-between transition-all duration-200 hover:border-[#C9A96E]/60 hover:-translate-y-1 hover:shadow-2xl focus-within:ring-2 focus-within:ring-[#C9A96E]/50 focus-within:border-[#C9A96E] outline-none"
            >
              <div>
                <div className="w-[52px] h-[52px] rounded-full border border-[#C9A96E]/35 bg-[#C9A96E]/10 flex items-center justify-center mb-6 shadow-[0_0_16px_rgba(201,169,110,0.15)]">
                  <Target className="h-6 w-6 text-[#DCB862]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-normal text-[#F5F1E8] mb-4">Our Mission</h3>
                <p className="text-[#A8B0BD] text-sm md:text-base leading-[1.7] [text-wrap:pretty] font-sans font-light">
                  To empower families and individuals with the fiduciary advice, robust tools, and disciplined investment strategies they require to master financial independence. We are committed to absolute transparency, creating long&#8209;term capital compounding and sustainable peace of mind for every legacy we help build.
                </p>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative rounded-2xl bg-[#090E1C] border border-white/[0.08] p-8 md:p-10 shadow-xl flex flex-col justify-between transition-all duration-200 hover:border-[#C9A96E]/60 hover:-translate-y-1 hover:shadow-2xl focus-within:ring-2 focus-within:ring-[#C9A96E]/50 focus-within:border-[#C9A96E] outline-none"
            >
              <div>
                <div className="w-[52px] h-[52px] rounded-full border border-[#C9A96E]/35 bg-[#C9A96E]/10 flex items-center justify-center mb-6 shadow-[0_0_16px_rgba(201,169,110,0.15)]">
                  <Eye className="h-6 w-6 text-[#DCB862]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-normal text-[#F5F1E8] mb-4">Our Vision</h3>
                <p className="text-[#A8B0BD] text-sm md:text-base leading-[1.7] [text-wrap:pretty] font-sans font-light">
                  To be recognized as India's premier boutique wealth advisory firm, respected for our absolute dedication to client success, uncompromising ethical frameworks, and cutting&#8209;edge market intelligence. We aim to construct a community of secure, informed, and confident investors who compound wealth across generations.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll-Driven Pinned Timeline */}
      <HorizontalTimeline />

      {/* Values Section */}
      <section className="w-full py-24 lg:py-32 bg-[#070B14] relative overflow-hidden">
        <div className="w-full max-w-[1152px] mx-auto px-6 [margin-inline:auto] [padding-inline:24px] relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20 space-y-4"
          >
            <span className="text-[#C9A96E] font-mono text-xs uppercase tracking-[0.25em] font-semibold block">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F5F1E8] font-normal tracking-tight">
              Our Core <span className="italic text-[#C9A96E]">Foundational Principles</span>
            </h2>
            <p className="text-[#A8B0BD] text-base md:text-[17px] leading-[1.65] max-w-[620px] mx-auto [margin-inline:auto] [text-wrap:balance] font-sans font-light">
              These shared values guide every strategic decision, analysis, and advisor conversation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch lg:[grid-template-rows:auto_auto_1fr]">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="group relative rounded-2xl bg-[#0B1220] border border-white/10 pt-8 px-8 pb-7 flex flex-col lg:grid lg:grid-rows-subgrid lg:row-span-3 h-full shadow-md transition-all duration-200 ease-out hover:border-[#C9A96E]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 focus-within:border-[#C9A96E]/50 focus-within:ring-2 focus-within:ring-[#C9A96E]/40 focus-within:-translate-y-1 focus-within:outline-none motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0 motion-reduce:transition-none max-w-[420px] md:max-w-none mx-auto w-full"
              >
                {/* Row 1: Icon (48px ring, border rgba(201,169,110,.4), fill rgba(201,169,110,.06), glyph 20px) */}
                <div className="w-12 h-12 rounded-full border border-[#C9A96E]/40 bg-[#C9A96E]/[0.06] flex items-center justify-center mb-6 shrink-0 transition-colors duration-200 group-hover:bg-[#C9A96E]/10">
                  <value.icon className="h-5 w-5 text-[#C9A96E]" />
                </div>

                {/* Row 2: Title (22px, text-wrap: balance, min-h-[58px] for equal 2-line baseline) */}
                <h3 className="text-[22px] font-serif font-medium text-[#F5F1E8] [text-wrap:balance] group-hover:text-[#C9A96E] transition-colors duration-200 leading-[1.3] min-h-[58px] flex items-start mb-3">
                  {value.title}
                </h3>

                {/* Row 3: Body text (15-16px, line-height 1.65, #A8B0BD, text-wrap: pretty) */}
                <p className="text-[#A8B0BD] text-[15px] sm:text-[16px] leading-[1.65] [text-wrap:pretty] font-sans font-light">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTA
        className="border-t-0"
        pill="ABOUT ALPHA · PUNE"
        headlineLead="Start a conversation with"
        headlineEmphasis="the people behind Alpha."
        subtitle="Meet our advisory team, share what matters to your family, and see how a fee‑only, SEBI‑registered process works in practice."
        buttonLabel="Book a Consultation"
      />
      </main>
      <Footer />
    </div>
  );
};

export default About;
