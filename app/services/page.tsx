"use client";

import Link from "next/link";
import { CheckCircle2, Shield, ArrowUpRight, FileCheck, Layers, PieChart } from "lucide-react";
import { MagneticButton } from "@/components/motion/magnetic-button";

export default function ServicesPage() {
  const practices = [
    {
      num: "01",
      title: "Direct Equity & Portfolio Architecture",
      subtitle: "Bespoke Discretionary & Advisory Mandates",
      description:
        "We engineer high-conviction direct equity portfolios focused on durable cash flows, competitive moats, and disciplined valuation multiples. Rather than purchasing diluted index funds, our clients own sovereign quality businesses directly.",
      details: [
        "Rigorous quantitative & qualitative screening methodology",
        "Direct demat account custody with zero counterparty lock-in",
        "Dynamic macro rebalancing across market cycles",
        "Quarterly private performance audits and capital allocation reviews",
      ],
      idealFor: "Entrepreneurs, CXOs, and Family Offices with ₹1 Cr+ deployable capital.",
    },
    {
      num: "02",
      title: "Inter-Generational Succession & Private Trusts",
      subtitle: "Preserving Dynastic Capital Across Decades",
      description:
        "Wealth preservation is inherently more complex than wealth creation. We structure private family trusts, asset segregation vehicles, and succession deeds to ensure frictionless transition without probate disputes or excessive taxation.",
      details: [
        "Private Family Trust deed drafting & governance charters",
        "Asset ring-fencing against commercial liabilities",
        "Smooth succession planning across multiple generations",
        "Tax-efficient distribution mechanics for heirs",
      ],
      idealFor: "Business families seeking structured succession and liability protection.",
    },
    {
      num: "03",
      title: "Capital Preservation & Downside Hedging",
      subtitle: "Mitigating Regime Shift Drawdowns",
      description:
        "The cornerstone of long-term compounding is avoiding catastrophic drawdowns. We construct sovereign debt ladders, liquidity buffers, and non-correlated alternative allocations that safeguard purchasing power through inflation and volatility.",
      details: [
        "Sovereign Gold Bonds & high-grade government securities",
        "Fixed income ladders structured to liquidity demands",
        "Systematic risk profiling calibrated to true psychological drawdowns",
        "Complete insulation from speculative derivatives or unhedged credit",
      ],
      idealFor: "Retirees, conservative estates, and institutions requiring stable cash flows.",
    },
    {
      num: "04",
      title: "Corporate Treasury & Working Capital Deployment",
      subtitle: "Institutional Liquidity Optimization",
      description:
        "Idle corporate cash in current accounts erodes corporate enterprise value. We advise mid-market corporate balance sheets on compliant, tax-optimized treasury deployment to maximize yield while preserving instant liquidity.",
      details: [
        "Arbitrage funds, overnight allocations, and short-duration sovereign debt",
        "ESOP planning and founder equity realization roadmaps",
        "Tax harmonization between corporate profits and personal distributions",
        "Full corporate board reporting & statutory audit reconciliation",
      ],
      idealFor: "Profitable mid-market enterprises, tech scale-ups, and corporate treasuries.",
    },
  ];

  return (
    <main className="w-full bg-ink text-ivory">
      {/* Editorial Header */}
      <section className="pt-40 pb-24 border-b border-white/[0.06] relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans">
              Disciplines & Practices
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight">
              Strategic advisory engineered for enduring capital.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl font-sans">
              Each engagement is bespoke. We reject standardized retail products in favor of rigorous, mathematically sound capital stewardship.
            </p>
          </div>
        </div>
      </section>

      {/* Practices Deep Dive (Warm Ivory Section) */}
      <section className="bg-ivory text-ink py-28 lg:py-32">
        <div className="container mx-auto px-6 max-w-7xl space-y-16">
          {practices.map((practice, index) => (
            <div
              key={practice.num}
              className="p-10 sm:p-14 rounded-3xl bg-ivory-subtle border-hairline-light space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.06] pb-6">
                <div>
                  <span className="font-mono text-xs text-gold uppercase tracking-wider block">
                    Practice {practice.num}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
                    {practice.title}
                  </h2>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-sans mt-1">
                    {practice.subtitle}
                  </p>
                </div>
                <MagneticButton href="/contact" variant="ivory" className="self-start md:self-auto text-xs py-3 px-6">
                  Inquire For This Practice
                </MagneticButton>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <p className="text-base text-slate-700 leading-relaxed font-sans font-normal">
                    {practice.description}
                  </p>
                  <div className="p-4 rounded-xl bg-ivory border-hairline-light text-xs text-slate-600 font-sans">
                    <strong className="text-ink font-medium">Primary Focus: </strong>
                    {practice.idealFor}
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-ink font-semibold font-sans">
                    Core Capabilities
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-sans">
                    {practice.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transparent Fee Schedule (Dark Section) */}
      <section className="bg-ink text-ivory py-28 lg:py-32 border-y border-white/[0.06]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans">
              Statutory Transparency
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory font-normal">
              Clear, fee-only fiduciary model.
            </h2>
            <p className="text-sm text-slate-400 font-sans leading-relaxed">
              In accordance with SEBI (Investment Advisers) Regulations, 2013, our revenue is derived solely from transparent advisory fees agreed directly with you. Zero hidden margins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-2xl bg-ink-light border-hairline-dark space-y-4">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-sans block">
                Direct Portfolio Advisory
              </span>
              <div className="font-serif text-3xl text-ivory">0.50% – 1.00%</div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Annualized fee based on assets under advisory. Billed quarterly on average daily portfolio value.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-ink-light border-hairline-gold space-y-4 relative">
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gold text-ink text-[9px] font-bold uppercase tracking-wider">
                Comprehensive
              </div>
              <span className="text-xs uppercase tracking-wider text-gold font-sans block">
                Multi-Family Office Mandate
              </span>
              <div className="font-serif text-3xl text-ivory">Custom Retainer</div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Full-spectrum governance covering trust creation, succession, tax advisory, and private equity coordination.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-ink-light border-hairline-dark space-y-4">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-sans block">
                Comprehensive Financial Blueprint
              </span>
              <div className="font-serif text-3xl text-ivory">Fixed Engagement</div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                One-time exhaustive balance sheet audit, risk diagnostics, and asset restructuring roadmap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-ivory text-ink py-24 text-center">
        <div className="container mx-auto px-6 max-w-3xl space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
            Request a confidential discussion on your portfolio architecture.
          </h2>
          <MagneticButton href="/contact" variant="ivory">
            Initiate Consultation
          </MagneticButton>
        </div>
      </section>
    </main>
  );
}
