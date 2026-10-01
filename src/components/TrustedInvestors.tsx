import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ProcessItem {
  number: string;
  timing: string;
  title: string;
  description: string;
  deliverables: [string, string];
}

const processSteps: ProcessItem[] = [
  {
    number: "01",
    timing: "WEEK 1",
    title: "Wealth audit",
    description:
      "A review of your holdings, debts, insurance cover and family goals to understand your starting point.",
    deliverables: [
      "Portfolio review and asset allocation summary",
      "Risk capacity and tolerance assessment",
    ],
  },
  {
    number: "02",
    timing: "WEEK 2",
    title: "Strategic blueprint",
    description:
      "Our investment committee prepares a written plan around your liquidity needs, tax position and long-term goals.",
    deliverables: [
      "Target asset allocation plan",
      "Tax-aware investment schedule",
    ],
  },
  {
    number: "03",
    timing: "WEEKS 3-4",
    title: "Phased deployment",
    description:
      "Investments are made through your own demat and bank accounts, in stages, to reduce the impact of market timing.",
    deliverables: [
      "Direct fund and security purchases in your name",
      "Consolidated family net-worth view",
    ],
  },
  {
    number: "04",
    timing: "ONGOING",
    title: "Continuous stewardship",
    description:
      "We review your portfolio regularly and rebalance as your goals and markets change.",
    deliverables: [
      "Quarterly portfolio review",
      "Annual estate and succession planning review with your legal advisors",
    ],
  },
];

export function TrustedInvestors() {
  const shouldReduceMotion = useReducedMotion();
  const [activeRow, setActiveRow] = useState<number>(0);
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Vertical gold progress line: 0 at top of row 01, 100% at bottom of row 04
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"],
  });
  const progressScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Active row detection (the one nearest viewport center) via IntersectionObserver (no scroll-jacking)
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    rowRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveRow(index);
            }
          });
        },
        {
          rootMargin: "-25% 0px -25% 0px",
          threshold: 0.35,
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <section
      id="how-we-work"
      className="py-24 lg:py-32 bg-[#070B14] text-[#F5F1E8] relative overflow-hidden border-t border-white/[0.08]"
      aria-labelledby="process-heading"
    >
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-6xl relative z-10">
        
        {/* HEADER: No Eyebrow, 2-Line Heading Left, Max-40ch Intro Right top-aligned with heading line 1 */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-16 lg:pb-20 border-b border-white/[0.08] max-w-[1020px] mx-auto">
          <h2
            id="process-heading"
            className="font-serif text-[clamp(2.25rem,3.6vw,3.25rem)] font-normal leading-[1.15] tracking-tight text-[#F5F1E8]"
          >
            How we work with you. <br />
            <span className="italic text-[#C9A24B]">Clear, disciplined, aligned.</span>
          </h2>

          <div className="lg:max-w-[40ch] lg:pt-1.5">
            <p className="font-sans text-[16px] leading-[1.7] text-muted-text font-light">
              We act solely in your interest. We do not hold client assets, and our advisory fees are disclosed upfront.
            </p>
          </div>
        </div>

        {/* PROCESS LIST: Max-width 1020px, 4 full-width rows with 1px hairlines, 56px 0 padding */}
        <div ref={listRef} className="relative max-w-[1020px] mx-auto">
          
          {/* 1px Vertical Progress Line: Single element pair with exact same top and bottom */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/[0.12] pointer-events-none">
            <motion.div
              style={{ scaleY: shouldReduceMotion ? 1 : progressScaleY }}
              className="w-full h-full bg-[#C9A24B] origin-top will-change-transform shadow-[0_0_10px_rgba(201,162,75,0.6)]"
            />
          </div>

          <div className="divide-y divide-white/[0.12]">
            {processSteps.map((step, index) => {
              const isActive = activeRow === index;

              return (
                <div
                  key={step.number}
                  ref={(el) => (rowRefs.current[index] = el)}
                  className="py-12 lg:py-14 pl-6 sm:pl-8 lg:pl-12 pr-0 group"
                >
                  {/* Strict grid with explicit column widths: NO justify-between.
                      Guarantees Column 2 (title, description, deliverables) starts at the EXACT same x-offset across all 4 rows */}
                  <div className="grid grid-cols-1 lg:grid-cols-[160px_minmax(0,54ch)_110px] gap-6 lg:gap-12 items-start">
                    
                    {/* LEFT: Large Serif Numeral (01-04), clamp(3.75rem, 6vw, 5.5rem)
                        Top aligned with title cap height (-mt-1 lg:-mt-2).
                        Active: 100% gold, Inactive: 55% gold, Hover: brightens to 100% gold */}
                    <div className="select-none -mt-1 lg:-mt-2">
                      <span
                        className={`font-serif text-[56px] lg:text-[clamp(3.75rem,6vw,5.5rem)] leading-[0.88] block text-[#C9A24B] transition-opacity duration-500 ease-out ${
                          isActive
                            ? "opacity-100"
                            : "opacity-55 group-hover:opacity-100"
                        }`}
                      >
                        {step.number}
                      </span>
                    </div>

                    {/* MIDDLE: Title in Serif 36px Ivory, Description in Inter 17px/1.7 muted-text (max 54ch), Deliverables Inter 14px muted-text
                        Active row: 100% opacity, Inactive rows: 55-60% opacity (>3.5:1 contrast on #070B14)
                        Zero x/translate or margin shifts between active/inactive states */}
                    <div
                      className={`space-y-3.5 transition-opacity duration-500 ease-out ${
                        isActive ? "opacity-100" : "opacity-60"
                      }`}
                    >
                      <h3 className="font-serif text-[28px] sm:text-[32px] lg:text-[36px] font-normal leading-[1.18] text-[#F5F1E8] tracking-tight">
                        {step.title}
                      </h3>

                      {/* Mobile Timing: sits under the title on mobile viewports */}
                      <span className="lg:hidden font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A24B] block">
                        {step.timing}
                      </span>

                      <p className="font-sans text-[16px] sm:text-[17px] leading-[1.7] text-muted-text font-light max-w-[52ch]">
                        {step.description}
                      </p>

                      {/* Deliverables: each deliverable on its own line, Inter 14px, muted-text, 6px gap, no separator */}
                      <div className="pt-2 flex flex-col gap-[6px]">
                        {step.deliverables.map((item, dIdx) => (
                          <span
                            key={dIdx}
                            className="font-sans text-[14px] leading-snug text-muted-text font-light block"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* RIGHT: Timing in gold font-mono small caps, right-aligned, baseline aligned with title baseline (pt-[18px])
                        Active: 100% opacity, Inactive: 60% opacity, sits within 48px from description column edge */}
                    <div
                      className={`hidden lg:block text-right pt-[18px] transition-opacity duration-500 ease-out ${
                        isActive ? "opacity-100" : "opacity-60"
                      }`}
                    >
                      <span className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A24B] block leading-none whitespace-nowrap">
                        {step.timing}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* FOOTNOTE: Inter 13px, text-muted-text on flat navy */}
        <div className="pt-10 border-t border-white/[0.06] text-center max-w-[1020px] mx-auto">
          <p className="font-sans text-[13px] text-muted-text font-light leading-relaxed">
            Investments are subject to market risks. Timelines are indicative and may vary.
          </p>
        </div>

      </div>
    </section>
  );
}

// Backward-compatible alias
export const HowWeWorkWithYou = TrustedInvestors;
