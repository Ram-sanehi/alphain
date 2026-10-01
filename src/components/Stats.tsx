import { useEffect, useState, useRef } from "react";
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
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 1600;
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
      style={{ fontSize: "clamp(1.85rem, 2.75vw, 3.5rem)" }}
      className="font-serif leading-none text-[#070B14] font-normal tracking-tight tabular-nums whitespace-nowrap flex items-baseline"
    >
      <span>{prefix}</span>
      <span>{count.toLocaleString("en-IN")}</span>
      <span className="text-[#C9A24B] ml-1">{suffix}</span>
    </div>
  );
}

// Regulator & Accreditation Vector Badges (Official logo marks)
const regulatorBadges = [
  {
    name: "SEBI",
    subtext: "Registered Investment Adviser · INA000017348",
    logoSvg: (
      <svg viewBox="0 0 120 40" className="h-9 w-auto">
        <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M14 20 L20 14 L26 20 L20 26 Z" fill="currentColor" opacity="0.85" />
        <text x="44" y="27" fontFamily="serif" fontSize="21" fontWeight="700" letterSpacing="1.5" fill="currentColor">
          SEBI
        </text>
      </svg>
    ),
  },
  {
    name: "AMFI",
    subtext: "Mutual Fund Distributor · ARN Registered",
    logoSvg: (
      <svg viewBox="0 0 130 40" className="h-8 w-auto">
        <g fill="currentColor">
          <path d="M12 28 L20 10 L28 28 Z" opacity="0.85" />
          <path d="M20 10 L28 28 L36 10 Z" opacity="0.5" />
          <text x="44" y="27" fontFamily="sans-serif" fontSize="20" fontWeight="800" letterSpacing="1.5">
            AMFI
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "NISM",
    subtext: "Certified Research & Advisory Standards",
    logoSvg: (
      <svg viewBox="0 0 125 40" className="h-8 w-auto">
        <g fill="currentColor">
          <path d="M18 10 C14 16 14 24 18 30 C22 24 22 16 18 10 Z" opacity="0.85" />
          <path d="M12 20 C12 14 15 11 18 10 C21 11 24 14 24 20 C24 26 21 29 18 30 C15 29 12 26 12 20 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="36" y="27" fontFamily="sans-serif" fontSize="20" fontWeight="700" letterSpacing="2">
            NISM
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "IRDAI",
    subtext: "Corporate Agency License Compliance",
    logoSvg: (
      <svg viewBox="0 0 135 40" className="h-8 w-auto">
        <g fill="currentColor">
          <path d="M18 8 L28 12 L28 22 C28 28 23 32 18 34 C13 32 8 28 8 22 L8 12 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="18" cy="20" r="4" />
          <text x="38" y="27" fontFamily="sans-serif" fontSize="19" fontWeight="800" letterSpacing="1">
            IRDAI
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "NSE",
    subtext: "Direct Market Access Execution Partner",
    logoSvg: (
      <svg viewBox="0 0 125 40" className="h-8 w-auto">
        <g fill="currentColor">
          <circle cx="18" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M18 10 A 10 10 0 0 1 28 20 L 22 20 A 4 4 0 0 0 18 16 Z" opacity="0.9" />
          <text x="38" y="27" fontFamily="sans-serif" fontSize="22" fontWeight="900" letterSpacing="1">
            NSE
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "BSE",
    subtext: "BASL Membership Accreditation No. 1982",
    logoSvg: (
      <svg viewBox="0 0 125 40" className="h-8 w-auto">
        <g fill="currentColor">
          <rect x="10" y="10" width="16" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="14" y1="14" x2="22" y2="14" stroke="currentColor" strokeWidth="1.5" />
          <line x1="14" y1="19" x2="22" y2="19" stroke="currentColor" strokeWidth="1.5" />
          <line x1="14" y1="24" x2="22" y2="24" stroke="currentColor" strokeWidth="1.5" />
          <text x="36" y="27" fontFamily="serif" fontSize="22" fontWeight="700" letterSpacing="1.5">
            BSE
          </text>
        </g>
      </svg>
    ),
  },
];

export function Stats() {
  return (
    <section className="bg-[#F5F1E8] text-[#070B14] pt-24 lg:pt-32 pb-40 lg:pb-48 relative z-20 border-b border-black/[0.08]">
      {/* Soft gradient edge between cream and dark */}
      <div
        className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-black/[0.04] pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl space-y-16 sm:space-y-20 relative z-10">
        
        {/* TOP: 4 Large Animated Counters in Huge Serif Numerals with Fluid Clamp Scaling & Guaranteed No Truncation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-black/[0.12] divide-y sm:divide-y-0 divide-black/[0.12]">
          {metrics.map((m, idx) => (
            <div
              key={m.label}
              className={`py-8 sm:py-10 px-4 sm:px-6 lg:px-5 xl:px-8 flex flex-col justify-between min-w-0 ${
                idx !== 0 ? "lg:border-l lg:border-black/[0.12]" : ""
              } ${
                idx % 2 === 1 ? "sm:border-l sm:border-black/[0.12] lg:border-l" : ""
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
                <p className="text-xs text-[#334155] font-sans font-normal leading-relaxed">
                  {m.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM: Single Row of Regulator Logos — Visually Identical at Rest, Unified Gold Accent on Hover */}
        <div className="space-y-8">
          <div className="text-center space-y-1.5">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#936F1F] font-mono font-semibold block">
              Institutional Accreditation &amp; Regulatory Standing
            </span>
            <p className="text-xs text-slate-700 font-sans font-normal">
              Operating under strict regulatory compliance across India's premier statutory bodies
            </p>
          </div>

          {/* Clean hairline-bordered grid: All 6 cards identical at rest, unified gold duotone on hover */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
            {regulatorBadges.map((badge) => (
              <div
                key={badge.name}
                className="w-full flex flex-col items-center justify-between p-4 sm:p-5 rounded-xl border border-black/[0.08] bg-white/60 hover:bg-white hover:border-[#C9A24B]/40 hover:-translate-y-1 hover:shadow-[0_8px_20px_-4px_rgba(201,162,75,0.12)] transition-all duration-300 ease-out group cursor-default text-center min-h-[142px]"
                title={`${badge.name} — ${badge.subtext}`}
              >
                {/* Logo Mark: Fixed height box (h-12), greyscale neutral slate at rest, muted gold-tinted duotone on hover */}
                <div className="h-12 w-full flex items-center justify-center text-slate-500 opacity-60 filter grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:text-[#C9A24B] group-hover:scale-[1.03] transition-all duration-300 ease-out">
                  {badge.logoSvg}
                </div>

                {/* Single line role description underneath (NO duplicated name) */}
                <div className="pt-3 border-t border-black/[0.05] w-full min-h-[38px] flex items-center justify-center">
                  <span className="font-sans text-[11px] text-slate-700 font-medium group-hover:text-slate-900 leading-snug block line-clamp-2 transition-colors duration-300">
                    {badge.subtext}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Compliance Safe Legal Footnote */}
          <div className="text-center pt-2 max-w-2xl mx-auto">
            <p className="text-[11px] text-slate-600 font-sans font-normal leading-relaxed">
              Registered/compliant status is factual and does not imply endorsement by these bodies. Fiduciary claims are substantiated under SEBI (Investment Advisers) Regulations, 2013 (INA000017348).
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
