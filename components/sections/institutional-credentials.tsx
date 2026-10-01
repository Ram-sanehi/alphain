"use client";

import React, { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface StatMetric {
  prefix?: string;
  value: number;
  suffix: string;
  label: string;
  detail: string;
}

const metrics: StatMetric[] = [
  {
    value: 7,
    suffix: "+",
    label: "Years of Excellence",
    detail: "Operating under continuous fiduciary standards since 2019",
  },
  {
    value: 3000,
    suffix: "+",
    label: "Clients Stewarded",
    detail: "High-net-worth families, entrepreneurs & institutions",
  },
  {
    prefix: "₹",
    value: 300,
    suffix: " Cr+",
    label: "AUM & Advised Capital",
    detail: "Disciplined allocation across equity and debt portfolios",
  },
  {
    value: 15,
    suffix: "+",
    label: "Institutional Partners",
    detail: "Tier-1 custodians, depositories & execution platforms",
  },
];

function HugeSerifCounter({
  prefix = "",
  value,
  suffix = "",
}: {
  prefix?: string;
  value: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 1800;
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const stepIncrement = end / totalSteps;

    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div
      ref={ref}
      className="font-serif text-5xl sm:text-6xl lg:text-[76px] xl:text-[84px] leading-none text-[#070B14] font-normal tracking-tight"
    >
      {prefix}
      {count.toLocaleString("en-IN")}
      <span className="text-[#C9A24B]">{suffix}</span>
    </div>
  );
}

const regulatorBadges = [
  {
    name: "SEBI",
    category: "Securities & Exchange Board of India",
    subtext: "RIA Registration No. INA000017348",
    colorHex: "#0F3A8A",
    logoSvg: (
      <svg viewBox="0 0 100 32" className="h-8 w-auto fill-current">
        <text x="0" y="24" fontFamily="serif" fontSize="24" fontWeight="bold" letterSpacing="2">SEBI</text>
      </svg>
    )
  },
  {
    name: "AMFI",
    category: "Association of Mutual Funds in India",
    subtext: "ARN Registered Distributor",
    colorHex: "#2E7D32",
    logoSvg: (
      <svg viewBox="0 0 100 32" className="h-8 w-auto fill-current">
        <text x="0" y="24" fontFamily="sans-serif" fontSize="22" fontWeight="800" letterSpacing="1.5">AMFI</text>
      </svg>
    )
  },
  {
    name: "NISM",
    category: "National Institute of Securities Markets",
    subtext: "Certified Research & Wealth Analyst",
    colorHex: "#B8860B",
    logoSvg: (
      <svg viewBox="0 0 100 32" className="h-8 w-auto fill-current">
        <text x="0" y="24" fontFamily="sans-serif" fontSize="22" fontWeight="700" letterSpacing="2">NISM</text>
      </svg>
    )
  },
  {
    name: "IRDAI",
    category: "Insurance Regulatory & Development Authority",
    subtext: "Approved Life & Risk Advisor",
    colorHex: "#0D6E6E",
    logoSvg: (
      <svg viewBox="0 0 110 32" className="h-8 w-auto fill-current">
        <text x="0" y="24" fontFamily="sans-serif" fontSize="22" fontWeight="800" letterSpacing="1">IRDAI</text>
      </svg>
    )
  },
  {
    name: "NSE",
    category: "National Stock Exchange of India",
    subtext: "Authorized Direct Market Access",
    colorHex: "#D83A00",
    logoSvg: (
      <svg viewBox="0 0 95 32" className="h-8 w-auto fill-current">
        <text x="0" y="24" fontFamily="sans-serif" fontSize="24" fontWeight="900" letterSpacing="1">NSE</text>
      </svg>
    )
  },
  {
    name: "BSE",
    category: "Bombay Stock Exchange / BASL",
    subtext: "BASL Membership Accreditation",
    colorHex: "#1A5276",
    logoSvg: (
      <svg viewBox="0 0 95 32" className="h-8 w-auto fill-current">
        <text x="0" y="24" fontFamily="serif" fontSize="24" fontWeight="bold" letterSpacing="2">BSE</text>
      </svg>
    )
  },
];

export function InstitutionalCredentials() {
  return (
    <section className="bg-[#F5F1E8] text-[#070B14] py-24 sm:py-28 relative z-20">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl">
        
        {/* TOP: 4 Large Animated Counters in Huge Serif Numerals with Thin Dividers, NO Cards, NO Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-black/[0.1] border-y border-black/[0.1]">
          {metrics.map((m, idx) => (
            <div
              key={m.label}
              className={`py-8 sm:py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between ${
                idx % 2 === 1 ? "sm:border-l sm:border-black/[0.1] lg:border-l-0" : ""
              }`}
            >
              <HugeSerifCounter
                prefix={m.prefix}
                value={m.value}
                suffix={m.suffix}
              />
              <div className="pt-4 space-y-1">
                <h3 className="font-serif text-lg sm:text-xl font-medium text-[#070B14]">
                  {m.label}
                </h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  {m.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM: Single Row of Regulator Logos in Greyscale, Colour on Hover */}
        <div className="pt-16 sm:pt-20">
          <div className="text-center mb-10">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C9A24B] font-mono font-semibold">
              Statutory Accreditation & Regulatory Oversight
            </span>
            <p className="text-xs text-slate-600 font-sans mt-1">
              Registered and compliant with primary financial supervisory authorities in India
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-center justify-items-center">
            {regulatorBadges.map((badge) => (
              <div
                key={badge.name}
                className="w-full flex flex-col items-center justify-center p-4 rounded-xl border border-black/[0.05] bg-black/[0.015] hover:bg-white/60 hover:shadow-sm transition-all duration-300 group cursor-default"
                title={`${badge.name} — ${badge.subtext}`}
              >
                <div
                  className="transition-all duration-300 filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                  style={{ color: badge.colorHex }}
                >
                  {badge.logoSvg}
                </div>
                <div className="text-center mt-2.5 space-y-0.5">
                  <span className="font-sans font-bold text-[11px] text-[#070B14] tracking-wider block">
                    {badge.name}
                  </span>
                  <span className="font-sans text-[9px] text-slate-500 leading-tight block line-clamp-1">
                    {badge.subtext}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center max-w-3xl mx-auto">
            <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
              * Fiduciary claims substantiated under SEBI (Investment Advisers) Regulations, 2013 · Registration No. INA000017348 · BASL Membership ID verified · Past performance metrics are strictly informational.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
