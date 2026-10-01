import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface PrinciplePoint {
  label: string;
  text: string;
}

interface Principle {
  number: string;
  title: string;
  statement: string;
  points: PrinciplePoint[];
}

const principles: Principle[] = [
  {
    number: "01",
    title: "Capital Preservation",
    statement: "Our first objective is protecting capital through disciplined risk management, not chasing windfalls.",
    points: [
      {
        label: "Downside awareness",
        text: "Stress-testing portfolios against severe market scenarios.",
      },
      {
        label: "Solvency focus",
        text: "Avoiding excessive leverage and illiquid structures.",
      },
      {
        label: "Liquidity planning",
        text: "Cash reserves earmarked for near-term needs.",
      },
    ],
  },
  {
    number: "02",
    title: "Risk-First Allocation",
    statement: "Risk is not short-term volatility; risk is permanent impairment of capital.",
    points: [
      {
        label: "Scenario modeling",
        text: "Stress-testing allocations across multi-decade rate and inflation cycles.",
      },
      {
        label: "Uncorrelated hedging",
        text: "Balancing sovereign debt, gold, and defensive equities.",
      },
      {
        label: "Tranche execution",
        text: "Phased capital entry aiming to reduce the risk of forced selling during corrections.",
      },
    ],
  },
  {
    number: "03",
    title: "Long-Term Compounding",
    statement: "Patience is an analytical edge. Enduring wealth is built through compounding.",
    points: [
      {
        label: "Low turnover mandate",
        text: "Protecting net returns from transaction friction and brokerage drag.",
      },
      {
        label: "Capital efficiency",
        text: "Allocating to market-leading enterprises with durable pricing power.",
      },
      {
        label: "Multi-decade horizons",
        text: "Aligning family wealth with secular long-term economic expansion.",
      },
    ],
  },
  {
    number: "04",
    title: "Tax-Efficient Planning",
    statement: "Gross returns are theoretical; only net post-tax compounding funds your goals.",
    points: [
      {
        label: "Capital gains harvesting",
        text: "Proactively offsetting realized capital gains before fiscal year-end.",
      },
      {
        label: "Asset location",
        text: "Structuring instrument placement across corporate, trust, and individual accounts.",
      },
      {
        label: "Statutory compliance",
        text: "Planning aligned with prevailing income-tax regulations.",
      },
    ],
  },
  {
    number: "05",
    title: "Generational Wealth",
    statement: "True stewardship extends beyond a lifetime, empowering heirs without dispute.",
    points: [
      {
        label: "Private family trusts",
        text: "Coordinating with your legal advisors on trust and succession structures.",
      },
      {
        label: "Succession planning",
        text: "Reviewing nominations and wills alongside your legal advisors.",
      },
      {
        label: "Heir stewardship",
        text: "Equipping the next generation with financial literacy and stewardship values.",
      },
    ],
  },
];

export function WhyChooseUs() {
  const [activePrinciple, setActivePrinciple] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const runwayRef = useRef<HTMLDivElement>(null);
  const tabButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Derived from scroll position on every update via requestAnimationFrame
  useEffect(() => {
    if (shouldReduceMotion) return;

    let rafId: number | null = null;

    const updateProgress = () => {
      rafId = null;
      const runway = runwayRef.current;
      if (!runway) return;

      const rect = runway.getBoundingClientRect();
      const scrollDistance = rect.height - window.innerHeight;
      if (scrollDistance <= 0) return;

      // progress = clamp(-rect.top / (rect.height - innerHeight), 0, 1)
      const rawProgress = -rect.top / scrollDistance;
      const clampedProgress = Math.min(1, Math.max(0, rawProgress));

      // index = min(4, floor(progress * 5))
      const newIndex = Math.min(4, Math.floor(clampedProgress * 5));

      setActivePrinciple(newIndex);
    };

    const onScrollOrResize = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    // Calculate immediately on mount
    updateProgress();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    if (document.fonts) {
      document.fonts.ready.then(updateProgress);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [shouldReduceMotion]);

  // Keep active mobile pill tab centered in view as scroll progresses
  useEffect(() => {
    const currentTab = tabButtonsRef.current[activePrinciple];
    if (currentTab && typeof currentTab.scrollIntoView === "function") {
      currentTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activePrinciple]);

  const handleSelectPrinciple = (index: number) => {
    if (shouldReduceMotion) {
      setActivePrinciple(index);
      const targetEl = document.getElementById(`principle-panel-${principles[index].number}`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    const runway = runwayRef.current;
    if (!runway) {
      setActivePrinciple(index);
      return;
    }

    const rect = runway.getBoundingClientRect();
    const runwayDocTop = rect.top + window.scrollY;
    const scrollDistance = rect.height - window.innerHeight;

    if (scrollDistance <= 0) {
      setActivePrinciple(index);
      return;
    }

    // Scroll to target principle slice [index/5, (index+1)/5)
    const targetProgress = index === 0 ? 0 : (index + 0.1) / 5;
    const targetScrollY = runwayDocTop + targetProgress * scrollDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });

    setActivePrinciple(index);
  };

  // Slow transform-only parallax for full-width architectural quote band (scale 1.0 to 1.05)
  const quoteBandRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: quoteScrollProgress } = useScroll({
    target: quoteBandRef,
    offset: ["start end", "end start"],
  });
  const quoteScale = useTransform(quoteScrollProgress, [0, 1], [1.0, 1.05]);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. PRINCIPLES SECTION (Scroll Runway & Sticky Pinned Viewport)            */}
      {/* ========================================================================= */}
      <section
        ref={runwayRef}
        id="fiduciary-philosophy"
        className={`relative w-full bg-[#050811] text-[#F5F1E8] border-t border-white/[0.08] ${
          shouldReduceMotion ? "py-20 lg:py-28" : ""
        }`}
        style={shouldReduceMotion ? undefined : { height: "500vh" }}
      >
        <div
          className={
            shouldReduceMotion
              ? "w-full"
              : "sticky top-0 h-screen h-[100dvh] h-[100svh] w-full flex items-center justify-center overflow-hidden"
          }
        >
          {/* MAIN 12-COLUMN EDITORIAL CONTAINER */}
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl w-full py-4 lg:py-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start lg:items-center relative">
              
              {/* LEFT 5 COLS: PERSISTENT COLUMN */}
              <div className="lg:col-span-5 flex flex-col justify-start">
                
                {/* 1. Eyebrow: Exact matching 20px height, leading-5, and 16px margin as right counter */}
                <span className="text-[12px] font-sans font-semibold uppercase tracking-[0.22em] text-[#C9A24B] leading-5 h-5 flex items-center mb-3 sm:mb-4">
                  THE FIDUCIARY PHILOSOPHY
                </span>

                {/* 2. Heading (3 lines max, explicit breaks, line-height 1.12, text-wrap: balance) */}
                <h2 className="font-serif text-[clamp(2.1rem,3.4vw,3.25rem)] font-normal leading-[1.12] [text-wrap:balance] text-[#F5F1E8] tracking-tight mb-6 lg:mb-8">
                  Five principles <br />
                  behind every <br />
                  <span className="italic text-[#C9A24B]">allocation.</span>
                </h2>

                {/* 3. TABLET & MOBILE HORIZONTAL TABS */}
                <div className="lg:hidden w-full mb-6 sm:mb-8">
                  <div
                    role="tablist"
                    aria-label="Investment Principles"
                    className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-white/[0.08]"
                  >
                    {principles.map((principle, index) => {
                      const isActive = activePrinciple === index;
                      return (
                        <button
                          key={principle.number}
                          ref={(el) => (tabButtonsRef.current[index] = el)}
                          role="tab"
                          type="button"
                          aria-selected={isActive}
                          aria-controls={`principle-panel-${principle.number}`}
                          onClick={() => handleSelectPrinciple(index)}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-sans whitespace-nowrap transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A24B] shrink-0 ${
                            isActive
                              ? "bg-[#C9A24B]/15 text-[#C9A24B] border border-[#C9A24B]/40 font-medium"
                              : "bg-white/[0.03] text-[#7C8596] hover:text-[#F5F1E8] border border-white/[0.06]"
                          }`}
                        >
                          <span className={isActive ? "text-[#C9A24B] font-semibold" : "text-[#7C8596]"}>
                            {principle.number}
                          </span>
                          <span>{principle.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. DESKTOP VERTICAL PROGRESS RAIL */}
                <div className="hidden lg:flex flex-col space-y-4 mb-8">
                  {principles.map((principle, index) => {
                    const isActive = activePrinciple === index;

                    return (
                      <button
                        key={principle.number}
                        type="button"
                        onClick={() => handleSelectPrinciple(index)}
                        className="flex items-center gap-3.5 text-left group transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm py-1.5"
                        aria-current={isActive ? "true" : undefined}
                        aria-label={`Principle ${principle.number}: ${principle.title}`}
                      >
                        {/* Hairline Tick: Fixed 32px slot, animated via scaleX/color, zero horizontal shift */}
                        <span className="w-8 h-[1.5px] relative flex items-center shrink-0" aria-hidden="true">
                          <span
                            className={`h-full w-full origin-left transition-all duration-300 ease-out ${
                              isActive
                                ? "scale-x-100 bg-[#C9A24B]"
                                : "scale-x-[0.375] bg-[#7C8596] group-hover:scale-x-75 group-hover:bg-[#E2E8F0]"
                            }`}
                          />
                        </span>

                        {/* Number & Name: Gold when active, #7C8596 when inactive, lighter on hover */}
                        <span
                          className={`text-sm font-sans transition-colors duration-200 ${
                            isActive
                              ? "text-[#C9A24B] font-medium"
                              : "text-[#7C8596] group-hover:text-[#F5F1E8]"
                          }`}
                        >
                          <span className="mr-2 text-xs">{principle.number}</span>
                          {principle.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 5. Text Link */}
                <div>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 text-sm font-sans font-medium text-slate-300 hover:text-[#C9A24B] transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    <span>Read our investment approach</span>
                    <span className="text-[#C9A24B] transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </Link>
                </div>

              </div>

              {/* RIGHT 7 COLS: PRINCIPLE DISPLAY PANEL */}
              <div className="lg:col-span-7 flex flex-col justify-start items-start lg:items-end w-full">
                {shouldReduceMotion ? (
                  <div className="flex flex-col space-y-12 sm:space-y-16 w-full max-w-[640px]">
                    {principles.map((principle) => (
                      <div
                        key={principle.number}
                        id={`principle-panel-${principle.number}`}
                        role="region"
                        aria-label={principle.title}
                        className="w-full pb-10 border-b border-white/[0.12] last:border-b-0"
                      >
                        {/* Eyebrow / Counter */}
                        <div className="flex items-center gap-3 h-5 mb-4">
                          <span className="text-[12px] font-sans font-semibold text-[#C9A24B] tracking-[0.22em] leading-5">
                            {principle.number} / 05
                          </span>
                          <span className="w-10 h-[1px] bg-[#C9A24B]" aria-hidden="true" />
                        </div>

                        {/* Title */}
                        <div className="min-h-[44px] sm:h-[52px] lg:h-[58px] flex items-center mb-4">
                          <h3 className="font-serif text-[28px] sm:text-[40px] lg:text-[44px] font-normal leading-tight text-[#F5F1E8] tracking-tight whitespace-normal sm:whitespace-nowrap">
                            {principle.title}
                          </h3>
                        </div>

                        {/* Lead statement */}
                        <div className="min-h-[52px] sm:min-h-[64px] flex items-center mb-6">
                          <p className="font-serif text-[16px] sm:text-[20px] lg:text-[21px] leading-[1.5] text-[#F5F1E8]/85 italic font-normal max-w-[60ch] [text-wrap:balance]">
                            “{principle.statement}”
                          </p>
                        </div>

                        {/* Detail table */}
                        <div className="border-t border-b border-white/[0.12] divide-y divide-white/[0.12]">
                          {principle.points.map((point, pIdx) => (
                            <div
                              key={pIdx}
                              className="py-3.5 sm:py-4.5 grid grid-cols-1 sm:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] gap-x-6 sm:gap-x-8 gap-y-1 items-baseline"
                            >
                              <span className="font-serif text-[17px] sm:text-[19px] font-normal text-[#F5F1E8] leading-normal whitespace-nowrap">
                                {point.label}
                              </span>
                              <p className="font-sans text-[14px] sm:text-[15.5px] leading-[1.6] text-[#CAD2DF] font-light [text-wrap:pretty]">
                                {point.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative w-full max-w-[640px] min-h-[380px] sm:min-h-[460px] lg:min-h-[480px]">
                    {principles.map((principle, index) => {
                      const isActive = activePrinciple === index;

                      return (
                        <div
                          key={principle.number}
                          id={`principle-panel-${principle.number}`}
                          role="region"
                          aria-label={principle.title}
                          aria-hidden={!isActive}
                          className={`w-full transition-all duration-300 ease-in-out ${
                            isActive
                              ? "opacity-100 pointer-events-auto relative z-10 translate-y-0 visible"
                              : "opacity-0 pointer-events-none absolute inset-0 z-0 translate-y-2 invisible"
                          }`}
                        >
                          {/* Small Inter label + 40px hairline: Exact matching 20px height, leading-5, and 16px margin as left eyebrow */}
                          <div className="flex items-center gap-3 h-5 mb-3 sm:mb-4">
                            <span className="text-[12px] font-sans font-semibold text-[#C9A24B] tracking-[0.22em] leading-5">
                              {principle.number} / 05
                            </span>
                            <span className="w-10 h-[1px] bg-[#C9A24B]" aria-hidden="true" />
                          </div>

                          {/* Title: Serif 44-48px, Ivory */}
                          <div className="min-h-[44px] sm:h-[52px] lg:h-[58px] flex items-center mb-3 sm:mb-4">
                            <h3 className="font-serif text-[28px] sm:text-[40px] lg:text-[44px] font-normal leading-tight text-[#F5F1E8] tracking-tight whitespace-normal sm:whitespace-nowrap">
                              {principle.title}
                            </h3>
                          </div>

                          {/* Lead statement: Italic serif 21-22px/1.5, Ivory at 85% opacity, text-wrap: balance, max-w-[60ch] */}
                          <div className="min-h-[52px] sm:min-h-[64px] flex items-center mb-4 sm:mb-7">
                            <p className="font-serif text-[16px] sm:text-[20px] lg:text-[21px] leading-[1.4] sm:leading-[1.5] text-[#F5F1E8]/85 italic font-normal max-w-[60ch] [text-wrap:balance]">
                              “{principle.statement}”
                            </p>
                          </div>

                          {/* Three-row list: CSS grid, 1px hairline dividers (white 12%), padding 18px 0 */}
                          <div className="border-t border-b border-white/[0.12] divide-y divide-white/[0.12]">
                            {principle.points.map((point, pIdx) => (
                              <div
                                key={pIdx}
                                className="py-3 sm:py-4.5 grid grid-cols-1 sm:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] gap-x-6 sm:gap-x-8 gap-y-0.5 sm:gap-y-1 items-baseline"
                              >
                                {/* Label: Serif 18-19px, sentence case, ivory, never wraps */}
                                <span className="font-serif text-[17px] sm:text-[19px] font-normal text-[#F5F1E8] leading-normal whitespace-nowrap">
                                  {point.label}
                                </span>

                                {/* Value: Inter 15.5px/1.6, text-[#CAD2DF], text-wrap: pretty */}
                                <p className="font-sans text-[13.5px] sm:text-[15.5px] leading-[1.5] sm:leading-[1.6] text-[#CAD2DF] font-light [text-wrap:pretty]">
                                  {point.text}
                                </p>
                              </div>
                            ))}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ARCHITECTURAL IMAGE QUOTE BAND (Separate section, soft 120px blend top) */}
      {/* ========================================================================= */}
      <section
        ref={quoteBandRef}
        id="alpha-approach"
        className="relative w-full h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden border-y border-white/[0.08] z-10"
      >
        {/* Soft 120px gradient at top fading from #050811 page background to transparent */}
        <div
          className="absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-[#050811] via-[#050811]/60 to-transparent pointer-events-none z-20"
          aria-hidden="true"
        />

        {/* Parallax Transform Image Container (transform-only, will-change: transform, disabled under prefers-reduced-motion) */}
        <motion.div
          style={{ scale: shouldReduceMotion ? 1 : quoteScale }}
          className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
        >
          {/* Blurred Placeholder Background while High-Res loads */}
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-md scale-105"
            style={{
              backgroundImage: `url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAPABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDnfOk5+YflSrO5xl1Gcn7vSohGxGCw/KgW5/v9qepOhat5HmLEkY3KowB3oqvGHQfI+BkHp3FFS+boy049Uf/Z")`,
            }}
          />

          <picture className="w-full h-full block">
            <source type="image/webp" srcSet="/images/philosophy-quote-band.webp" />
            <img
              src="/images/philosophy-quote-band.jpg"
              alt="Limestone facade with long diagonal shadows"
              className="w-full h-full object-cover object-center filter contrast-[1.05] brightness-[0.92] saturate-[0.90]"
              loading="lazy"
              width="2000"
              height="1329"
            />
          </picture>

          {/* Color Grade: Subtle Warm Gold Highlights */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-15"
            style={{
              background:
                "linear-gradient(130deg, rgba(201,162,75,0) 0%, rgba(201,162,75,0.08) 40%, rgba(201,162,75,0.2) 100%)",
            }}
          />

          {/* Dedicated radial vignette focused behind quote only for superior text legibility */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 50% 55%, rgba(5,8,17,0.78) 0%, rgba(5,8,17,0.45) 55%, rgba(5,8,17,0) 100%)",
            }}
          />

          {/* Light overall tint (20% instead of old heavy multi-layer stack) */}
          <div className="absolute inset-0 bg-[#070B14]/20 pointer-events-none" />
        </motion.div>

        {/* Vertically & Optically Centered Quote Block */}
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-4xl relative z-10 text-center">
          {/* 48px Gold Hairline above Eyebrow */}
          <div className="w-12 h-[1px] bg-[#C9A24B] mx-auto mb-6" />

          {/* Eyebrow: "THE ALPHA APPROACH", Inter small caps, gold, letter-spaced, no monospace */}
          <span className="font-sans text-xs sm:text-[13px] font-semibold uppercase tracking-[0.25em] text-[#C9A24B] block mb-5">
            THE ALPHA APPROACH
          </span>

          {/* Quote: Ivory #F5F1E8, italic serif, clamp(2rem, 3.4vw, 2.75rem), line-height 1.3, text-wrap: balance, max 2 lines */}
          <blockquote className="font-serif text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.3] text-[#F5F1E8] italic font-normal tracking-tight [text-wrap:balance] max-w-[28ch] mx-auto">
            “Compounding rewards patience. Our job is to protect it.”
          </blockquote>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. STATUTORY DISCLAIMER BAR BELOW BAND */}
      {/* ========================================================================= */}
      <div className="bg-[#050811] py-5 px-6 text-center border-b border-white/[0.04]">
        <p className="font-sans text-[13px] text-muted-text font-normal leading-relaxed">
          Investments are subject to market risks. Principles describe our process, not guaranteed outcomes.
        </p>
      </div>
    </>
  );
}
