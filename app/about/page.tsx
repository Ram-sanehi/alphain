"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Award, GraduationCap, Building2, CheckCircle, ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { AnimatedCounter } from "@/components/motion/counter";
import { ParallaxImage } from "@/components/motion/parallax-image";

export default function AboutPage() {
  const milestones = [
    { year: "2019", title: "Inception in Pune", description: "Established as an independent capital advisory practice with a conviction for pure fiduciary counsel." },
    { year: "2020", title: "SEBI RIA Registration", description: "Earned statutory SEBI Registered Investment Advisor status, legally codifying our duty of loyalty to clients." },
    { year: "2022", title: "1,000 Families Stewarded", description: "Achieved the trust of over 1,000 high-net-worth families across Maharashtra and greater India." },
    { year: "2024", title: "₹200 Crores Milestone", description: "Surpassed ₹200 Crores in private assets under strategic advisory and asset allocation governance." },
    { year: "2026", title: "Institutional Flagship", description: "Stewarding over ₹300 Crores across 3,000+ client accounts with an unblemished compliance track record." },
  ];

  return (
    <main className="w-full bg-ink text-ivory">
      {/* Editorial Header */}
      <section className="pt-40 pb-24 border-b border-white/[0.06] relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans">
              Heritage & Ethos
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight">
              A private practice founded on absolute alignment.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl font-sans">
              Founded in Pune in 2019, Alpha Investment Management was conceived as an antidote to conflicted product-selling in Indian financial services.
            </p>
          </div>
        </div>
      </section>

      {/* Narrative & Architectural Photography (Warm Ivory Section) */}
      <section className="bg-ivory text-ink py-28 lg:py-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans">
                The Origin
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-ink leading-tight">
                Institutional discipline for private balance sheets.
              </h2>
              <div className="space-y-4 text-sm text-slate-700 leading-relaxed font-sans">
                <p>
                  For decades, Indian wealth management operated as an opaque brokerage machine—incentivized by upfront commissions, churn, and high-margin products that depleted client compounding.
                </p>
                <p>
                  Alpha Investment Management was formed with a singular oath: we act as fiduciaries. We do not distribute products for financial institutions; we represent our clients against market noise, excessive fees, and cognitive biases.
                </p>
                <p>
                  Headquartered in Pune, our practice blends the analytical rigor of global business school education with boots-on-the-ground understanding of Indian business cycles.
                </p>
              </div>

              <div className="pt-4">
                <div className="p-6 rounded-2xl bg-ivory-subtle border-hairline-light">
                  <p className="font-serif text-lg text-slate-900 italic">
                    "Our duty is not to predict the unpredictable, but to architect portfolios resilient enough to prosper through every economic regime."
                  </p>
                  <p className="text-xs font-semibold text-gold uppercase tracking-wider mt-3 font-sans">
                    — Nageshwar Prasad, Founder
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                alt="Institutional architecture symbolizing financial stability"
                containerClassName="aspect-[4/5] rounded-3xl border-hairline-light"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Chronology & Milestones (Dark Section) */}
      <section className="bg-ink text-ivory py-28 lg:py-32 border-y border-white/[0.06]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-2xl mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans">
              Chronology
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory font-normal">
              A timeline of disciplined growth.
            </h2>
          </div>

          <div className="space-y-6">
            {milestones.map((m, idx) => (
              <div
                key={m.year}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 p-8 rounded-2xl bg-ink-light/50 border-hairline-dark items-center hover:border-gold/30 transition-colors"
              >
                <div className="md:col-span-2">
                  <span className="font-serif text-3xl text-gold font-normal">{m.year}</span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-serif text-xl text-ivory font-normal">{m.title}</h3>
                </div>
                <div className="md:col-span-6">
                  <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Profile (Warm Ivory Section) */}
      <section className="bg-ivory text-ink py-28 lg:py-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-2xl mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans">
              Investment Committee
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-normal">
              Stewards of your capital.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Founder Profile */}
            <div className="p-10 rounded-3xl bg-ivory-subtle border-hairline-light space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-gold font-mono">
                  Founder & Chief Investment Officer
                </span>
                <h3 className="font-serif text-3xl text-ink font-normal">Nageshwar Prasad</h3>
                <p className="text-xs text-slate-600 font-mono">
                  CFA Level II · Master’s in Finance (Henley Business School, London, UK)
                </p>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed font-sans">
                Nageshwar brings global academic training and deep institutional capital experience to private portfolios. He directs macro strategy, equity screening models, and asset allocation policies across all client accounts.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-black/[0.06] text-xs text-slate-600 font-sans">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Master of Science in Finance – Henley Business School, UK</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>CFA Institute Candidate Level II Passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>SEBI Registered Investment Advisor & Portfolio Strategist</span>
                </div>
              </div>
            </div>

            {/* Risk Head Profile */}
            <div className="p-10 rounded-3xl bg-ivory-subtle border-hairline-light space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-gold font-mono">
                  Head of Risk & Governance
                </span>
                <h3 className="font-serif text-3xl text-ink font-normal">Sonali Malhotra</h3>
                <p className="text-xs text-slate-600 font-mono">
                  Chartered Accountant (CA) · NISM Certified Wealth Analyst
                </p>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed font-sans">
                Sonali heads statutory risk management, portfolio compliance auditing, and tax structuring. Her analytical rigor guarantees that every asset strategy remains optimized for tax efficiency and legal protection.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-black/[0.06] text-xs text-slate-600 font-sans">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Fellow Chartered Accountant (ICAI)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Master of Commerce (M.Com)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>7+ Years Risk & Fiduciary Advisory Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct CTA */}
      <section className="bg-ink text-ivory py-24 border-t border-white/[0.06] text-center">
        <div className="container mx-auto px-6 max-w-4xl space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl text-ivory font-normal">
            Ready to explore independent fiduciary wealth management?
          </h2>
          <div className="pt-2">
            <MagneticButton href="/contact" variant="primary">
              Schedule Confidential Conversation
            </MagneticButton>
          </div>
        </div>
      </section>
    </main>
  );
}
