"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { 
  ArrowUpRight, 
  ShieldCheck, 
  Scale, 
  Compass, 
  Layers, 
  Building2, 
  Lock, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { AnimatedCounter } from "@/components/motion/counter";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { LiveMarketTicker } from "@/components/market/live-market-ticker";
import { InstitutionalCredentials } from "@/components/sections/institutional-credentials";

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 28 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    },
  };

  return (
    <main className="w-full overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Full-Viewport, Line-by-Line Mask Reveal, Generous Empty Space */}
      {/* ========================================================================= */}
      <section className="relative w-full h-screen min-h-[700px] flex flex-col justify-between overflow-hidden bg-ink">
        {/* Cinematic Dusk Architecture Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=85"
            alt="Cinematic architectural dusk twilight"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          {/* Navy Overlay 60% */}
          <div className="absolute inset-0 bg-[#070B14]/60 z-10" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent z-10" />
        </div>

        {/* Top spacer for navbar */}
        <div className="h-20 sm:h-24 relative z-20" />

        {/* Content: Left-aligned with lots of empty space */}
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl relative z-20 my-auto">
          <div className="max-w-4xl text-left space-y-7 sm:space-y-9">
            
            {/* Small Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-gold">
                SEBI Registered Investment Adviser · INA000017348
              </span>
            </motion.div>

            {/* Headline: 80-96px Serif with Line-by-Line Mask Reveal */}
            <div className="space-y-1">
              <div className="overflow-hidden py-1">
                <motion.h1
                  initial={{ y: "115%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="font-serif text-5xl sm:text-7xl lg:text-[84px] xl:text-[96px] leading-[1.02] tracking-tight text-ivory font-normal"
                >
                  Strategic wealth.
                </motion.h1>
              </div>

              <div className="overflow-hidden py-1">
                <motion.h1
                  initial={{ y: "115%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.36 }}
                  className="font-serif text-5xl sm:text-7xl lg:text-[84px] xl:text-[96px] leading-[1.02] tracking-tight text-ivory font-normal"
                >
                  Secured <span className="text-gold italic">legacies.</span>
                </motion.h1>
              </div>
            </div>

            {/* Exact 20-word Subline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
              className="text-base sm:text-lg text-slate-300/85 font-sans font-normal leading-relaxed max-w-2xl"
            >
              Independent fiduciary advisory safeguarding capital, structuring multi-generational family estates, and engineering resilient investment portfolios with complete transparency and zero commissions.
            </motion.p>

            {/* Two CTAs: Primary and Ghost */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                href="/contact"
                className="bg-gold hover:bg-gold-light text-ink font-sans font-semibold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 shadow-lg active:scale-[0.98] inline-flex items-center gap-2 group"
              >
                <span>Book a consultation</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/services"
                className="border border-white/20 hover:border-white/50 text-ivory hover:text-gold font-sans font-medium text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-sm active:scale-[0.98]"
              >
                Our approach
              </Link>
            </motion.div>

          </div>
        </div>

        {/* Small Scroll Indicator */}
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl relative z-20 pb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex items-center gap-3 text-slate-400 text-[10px] uppercase tracking-[0.25em] font-sans"
          >
            <div className="w-4 h-7 rounded-full border border-white/25 flex items-start justify-center p-1">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-1.5 rounded-full bg-gold"
              />
            </div>
            <span>Scroll</span>
          </motion.div>
        </div>
      </section>

      {/* Slim 40px Live Market Ticker Under Hero */}
      <LiveMarketTicker />

      {/* Ivory Section: 4 Large Animated Counters & Single Row of Regulator Logos */}
      <InstitutionalCredentials />

      {/* ========================================================================= */}
      {/* 2. THE FIDUCIARY MANDATE (Warm Ivory: #F5F1E8) */}
      {/* ========================================================================= */}
      <section className="bg-ivory text-ink py-28 lg:py-32 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Section Tagline */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans block">
                01 / Fiduciary Independence
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight font-normal text-ink">
                Capital stewardship without competing incentives.
              </h2>
            </div>

            {/* Editorial Manifesto */}
            <div className="lg:col-span-8 space-y-8">
              <p className="font-serif text-2xl sm:text-3xl text-slate-800 leading-snug font-normal">
                "The majority of wealth management is distributor-led distribution disguised as advice. We dismantled that paradigm."
              </p>
              
              <p className="text-base text-slate-600 leading-relaxed font-sans font-normal max-w-2xl">
                As a SEBI Registered Investment Advisor, Alpha Investment Management operates under statutory fiduciary accountability. We accept zero commissions, kickbacks, or placement fees from mutual funds, alternative funds, or insurance providers. When we advise an allocation, our singular metric of success is your long-term balance sheet health.
              </p>

              {/* 3 Pillars with Hairline Borders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div className="p-6 rounded-2xl bg-ivory-subtle border-hairline-light space-y-3">
                  <Scale className="w-5 h-5 text-gold" />
                  <h3 className="font-serif text-lg text-ink font-semibold">Zero Commission Conflict</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Direct mutual fund plans and direct market instruments only. Every cost reduction accrues to your compounding.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-ivory-subtle border-hairline-light space-y-3">
                  <Lock className="w-5 h-5 text-gold" />
                  <h3 className="font-serif text-lg text-ink font-semibold">Direct Segregated Custody</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Assets remain strictly in your demat and institutional accounts. We direct strategy; you retain absolute custody.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-ivory-subtle border-hairline-light space-y-3">
                  <Compass className="w-5 h-5 text-gold" />
                  <h3 className="font-serif text-lg text-ink font-semibold">Multi-Decade Horizon</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Insulated from quarterly hysteria. We build portfolios structured to endure shifting macro regimes.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INSTITUTIONAL SCALE & METRICS (Dark: #070B14) */}
      {/* ========================================================================= */}
      <section className="bg-ink text-ivory py-24 lg:py-28 border-y border-white/[0.06] relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans">
              02 / Institutional Standing
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory font-normal">
              A decade of measured consistency.
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Metric 1 */}
            <div className="p-8 rounded-2xl bg-ink-light/50 border-hairline-dark text-center space-y-2">
              <div className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ivory font-normal tracking-tight">
                <AnimatedCounter value={300} prefix="₹" suffix=" Cr+" duration={2} />
              </div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-sans">
                Advised & Managed Capital
              </p>
            </div>

            {/* Metric 2 */}
            <div className="p-8 rounded-2xl bg-ink-light/50 border-hairline-dark text-center space-y-2">
              <div className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ivory font-normal tracking-tight">
                <AnimatedCounter value={3000} suffix="+" duration={2} />
              </div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-sans">
                Client Families Stewarded
              </p>
            </div>

            {/* Metric 3 */}
            <div className="p-8 rounded-2xl bg-ink-light/50 border-hairline-dark text-center space-y-2">
              <div className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ivory font-normal tracking-tight">
                <AnimatedCounter value={7} suffix="+ Years" duration={1.5} />
              </div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-sans">
                Fiduciary Operating History
              </p>
            </div>

            {/* Metric 4 */}
            <div className="p-8 rounded-2xl bg-ink-light/50 border-hairline-dark text-center space-y-2">
              <div className="font-serif text-4xl sm:text-5xl lg:text-6xl text-gold font-normal tracking-tight">
                <AnimatedCounter value={100} suffix="%" duration={1.5} />
              </div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-sans">
                Statutory SEBI Compliance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FOUR DISCIPLINES (Warm Ivory: #F5F1E8) */}
      {/* ========================================================================= */}
      <section className="bg-ivory text-ink py-28 lg:py-32 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans">
                03 / Advisory Practices
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-normal leading-tight">
                Disciplines engineered for capital endurance.
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-ink hover:text-gold transition-colors font-sans"
            >
              Explore Full Practice Brief
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Discipline 1 */}
            <div className="p-10 rounded-3xl bg-ivory-subtle border-hairline-light hover:border-gold/50 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <span className="font-mono text-xs text-gold uppercase tracking-wider block">
                  Discipline 01
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal group-hover:text-slate-800 transition-colors">
                  Bespoke Portfolio & Equity Management
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-sans font-normal">
                  Data-driven asset allocation, direct equity portfolios, and debt structuring tailored to specific liquidity horizons and risk sensitivities.
                </p>
              </div>
              <div className="pt-8 border-t border-black/[0.06] flex items-center justify-between text-xs text-slate-500 font-sans mt-8">
                <span>Direct Equities · Fixed Income · Liquid Funds</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Discipline 2 */}
            <div className="p-10 rounded-3xl bg-ivory-subtle border-hairline-light hover:border-gold/50 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <span className="font-mono text-xs text-gold uppercase tracking-wider block">
                  Discipline 02
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal group-hover:text-slate-800 transition-colors">
                  Multi-Generational Succession & Trusts
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-sans font-normal">
                  Architecting legal family trust frameworks, succession roadmaps, and frictionless asset transitions across generations to safeguard dynastic continuity.
                </p>
              </div>
              <div className="pt-8 border-t border-black/[0.06] flex items-center justify-between text-xs text-slate-500 font-sans mt-8">
                <span>Private Family Trusts · Will Structuring · Estate Governance</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Discipline 3 */}
            <div className="p-10 rounded-3xl bg-ivory-subtle border-hairline-light hover:border-gold/50 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <span className="font-mono text-xs text-gold uppercase tracking-wider block">
                  Discipline 03
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal group-hover:text-slate-800 transition-colors">
                  Capital Preservation & Downside Hedging
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-sans font-normal">
                  Stress-testing assets against black-swan occurrences, liquidity crunches, and currency devaluation. We prioritize drawdown mitigation over reckless yield-seeking.
                </p>
              </div>
              <div className="pt-8 border-t border-black/[0.06] flex items-center justify-between text-xs text-slate-500 font-sans mt-8">
                <span>Risk Architecture · Sovereign Debt · Inflation Shields</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Discipline 4 */}
            <div className="p-10 rounded-3xl bg-ivory-subtle border-hairline-light hover:border-gold/50 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <span className="font-mono text-xs text-gold uppercase tracking-wider block">
                  Discipline 04
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal group-hover:text-slate-800 transition-colors">
                  Corporate Treasury & Executive Advisory
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-sans font-normal">
                  Strategic working capital management for privately held mid-market enterprises, ESOP monetization strategies, and tax-efficient corporate liquidity deployment.
                </p>
              </div>
              <div className="pt-8 border-t border-black/[0.06] flex items-center justify-between text-xs text-slate-500 font-sans mt-8">
                <span>Working Capital Optimization · ESOP Advisory · Tax Efficiency</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. LEADERSHIP & PEDIGREE (Dark: #070B14) */}
      {/* ========================================================================= */}
      <section className="bg-ink text-ivory py-28 lg:py-32 border-t border-white/[0.06] relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Visual Column */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden border border-white/[0.08] relative bg-ink-light aspect-[4/5]">
                <ParallaxImage
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
                  alt="Disciplined private wealth leadership and market intelligence"
                  containerClassName="w-full h-full"
                />
                <div className="absolute bottom-6 inset-x-6 p-4 rounded-xl bg-ink/90 backdrop-blur-md border border-white/[0.08]">
                  <p className="font-serif text-sm text-ivory">Nageshwar Prasad</p>
                  <p className="text-[10px] uppercase tracking-wider text-gold font-sans">
                    Founder & Chief Investment Officer
                  </p>
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans">
                  04 / Leadership & Pedigree
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory font-normal leading-tight">
                  Academic rigor meets ground-level market discernment.
                </h2>
              </div>

              <p className="text-base text-slate-300 leading-relaxed font-sans font-light">
                Founded in 2019 by Nageshwar Prasad, Alpha Investment Management was built to bring institutional portfolio discipline directly to private capital in Maharashtra and across India.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="p-6 rounded-2xl bg-ink-light/50 border-hairline-dark space-y-2">
                  <h4 className="font-serif text-lg text-ivory font-medium">Nageshwar Prasad</h4>
                  <p className="text-xs text-gold uppercase tracking-wider font-sans">
                    CFA Level II · MSc Finance (London)
                  </p>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed pt-1">
                    Master’s in Finance from Henley Business School, London, UK. 7+ years directing discretionary portfolios under SEBI RIA mandate.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-ink-light/50 border-hairline-dark space-y-2">
                  <h4 className="font-serif text-lg text-ivory font-medium">Sonali Malhotra</h4>
                  <p className="text-xs text-gold uppercase tracking-wider font-sans">
                    Chartered Accountant (CA)
                  </p>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed pt-1">
                    Head of Risk & Statutory Governance. NISM certified wealth analyst overseeing client audit, asset allocation controls, and tax alignment.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <MagneticButton href="/about" variant="secondary">
                  Read Full Leadership Profile
                </MagneticButton>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. EDITORIAL PERSPECTIVES (Warm Ivory: #F5F1E8) */}
      {/* ========================================================================= */}
      <section className="bg-ivory text-ink py-28 lg:py-32 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans">
              05 / Client Perspectives
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
              Trust forged through market turbulence.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-ivory-subtle border-hairline-light space-y-6">
              <p className="font-serif text-lg text-slate-800 leading-relaxed italic">
                "What stood out immediately was their refusal to push high-commission structured products. For the first time, our advisor was sitting on our side of the negotiation table."
              </p>
              <div className="pt-4 border-t border-black/[0.06]">
                <p className="font-serif text-sm text-ink font-semibold">Managing Director</p>
                <p className="text-xs text-slate-500 font-sans">Precision Engineering Enterprise, Pune</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-ivory-subtle border-hairline-light space-y-6">
              <p className="font-serif text-lg text-slate-800 leading-relaxed italic">
                "During market corrections, the natural impulse is panic. Nageshwar and his team’s calm, mathematical rebalancing methodology preserved our gains while others were withdrawing."
              </p>
              <div className="pt-4 border-t border-black/[0.06]">
                <p className="font-serif text-sm text-ink font-semibold">Senior Tech Executive</p>
                <p className="text-xs text-slate-500 font-sans">Global SaaS Founder & Angel Investor</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-ivory-subtle border-hairline-light space-y-6">
              <p className="font-serif text-lg text-slate-800 leading-relaxed italic">
                "They orchestrated our family trust and inter-generational estate transfer with exceptional precision. Fiduciary integrity is rare; they embody it."
              </p>
              <div className="pt-4 border-t border-black/[0.06]">
                <p className="font-serif text-sm text-ink font-semibold">Second-Generation Patriarch</p>
                <p className="text-xs text-slate-500 font-sans">Real Estate & Hospitality Group</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PRIVATE OFFICE INQUIRY (Dark: #070B14) */}
      {/* ========================================================================= */}
      <section className="bg-ink text-ivory py-28 lg:py-32 border-t border-white/[0.06] relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans">
                06 / Initiate Engagement
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ivory font-normal leading-[1.08]">
                Begin a deliberate conversation about your balance sheet.
              </h2>
              <p className="text-base text-slate-300 font-light leading-relaxed max-w-lg">
                We accept a limited roster of new client engagements each quarter to preserve our depth of advisory focus. Inquiries are handled directly by our senior leadership team in Pune.
              </p>

              <div className="space-y-3 pt-4 text-xs text-slate-400 font-sans">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Confidential initial portfolio diagnostics</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Strict zero-sales pitch protocol</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>SEBI compliance and privacy protected</span>
                </div>
              </div>
            </div>

            {/* Private Inquiry Form Card */}
            <div className="lg:col-span-6">
              <div className="p-8 sm:p-10 rounded-3xl bg-ink-light border-hairline-dark space-y-6">
                <h3 className="font-serif text-2xl text-ivory font-normal">
                  Schedule Private Consultation
                </h3>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Thank you. Our senior partner will review your inquiry and reach out within 24 business hours.");
                  }}
                  className="space-y-4 font-sans text-xs"
                >
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider text-[10px]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Singhania"
                      className="w-full bg-ink border border-white/[0.1] rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase tracking-wider text-[10px]">
                        Corporate / Personal Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="vikram@enterprise.com"
                        className="w-full bg-ink border border-white/[0.1] rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase tracking-wider text-[10px]">
                        Direct Contact Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        className="w-full bg-ink border border-white/[0.1] rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider text-[10px]">
                      Advisory Capital Allocation
                    </label>
                    <select className="w-full bg-ink border border-white/[0.1] rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none transition-colors">
                      <option value="50L-1Cr">₹50 Lakhs - ₹1 Crore</option>
                      <option value="1Cr-5Cr">₹1 Crore - ₹5 Crores</option>
                      <option value="5Cr-25Cr">₹5 Crores - ₹25 Crores</option>
                      <option value="25Cr+">₹25 Crores+ (Institutional / Family Office)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider text-[10px]">
                      Primary Financial Objective
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Briefly describe your portfolio structure, liquidity requirements, or succession priorities..."
                      className="w-full bg-ink border border-white/[0.1] rounded-xl px-4 py-3 text-ivory focus:border-gold focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-gold hover:bg-gold-light text-ink font-semibold uppercase tracking-wider text-xs py-4 rounded-xl transition-all duration-300 shadow-md active:scale-[0.99]"
                    >
                      Submit Confidential Request
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-500 text-center leading-relaxed pt-2">
                    We maintain strict non-disclosure. Your information is protected under SEBI fiduciary privacy covenants.
                  </p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
