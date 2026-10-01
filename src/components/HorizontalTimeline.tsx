import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence, MotionValue } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { MilestoneThreeBackground } from "./MilestoneThreeBackground";

interface TimelineEvent {
  year: string;
  badge: string;
  title: string;
  description: string;
  highlight: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: "2019",
    badge: "Inception",
    title: "Founded in Pune",
    description: "Established as an independent advisory practice committed to zero-commission fiduciary counsel, offering institutional portfolio rigor directly to private families.",
    highlight: "Zero Commission Oath",
  },
  {
    year: "2020",
    badge: "Statutory Status",
    title: "SEBI Registered RIA",
    description: "Awarded statutory SEBI Registered Investment Advisor accreditation (INA000017348) and BASL compliance certification, codifying our duty of loyalty.",
    highlight: "INA000017348 Granted",
  },
  {
    year: "2021",
    badge: "Client Community",
    title: "1,000 Families Stewarded",
    description: "Welcomed over 1,000 client families across Maharashtra and international NRIs seeking transparent, fee-only wealth preservation.",
    highlight: "1,000+ Portfolios",
  },
  {
    year: "2023",
    badge: "Asset Scale",
    title: "₹100 Crores AUM",
    description: "Surpassed ₹100 Crores in assets under advisory, validating our conviction that mathematical discipline beats product distribution.",
    highlight: "₹100 Cr Milestone",
  },
  {
    year: "2025",
    badge: "Practice Expansion",
    title: "Family Office & Trust Desk",
    description: "Inaugurated dedicated estate planning, private family trust governance, and mid-market corporate treasury liquidity mandates.",
    highlight: "Trusts & Estates",
  },
  {
    year: "2026",
    badge: "Present Flagship",
    title: "₹300 Cr+ & 3,000+ Families",
    description: "Stewarding over ₹300 Crores in capital across 3,000+ client accounts with an unblemished 100% regulatory compliance record.",
    highlight: "₹300 Cr+ Stewarded",
  },
];

interface DesktopStackedCardProps {
  item: TimelineEvent;
  index: number;
  total: number;
  activeIdx: number;
  shouldReduceMotion: boolean | null;
}

function DesktopStackedCard({ item, index, total, activeIdx, shouldReduceMotion }: DesktopStackedCardProps) {
  const isActive = index === activeIdx;

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : 16,
        scale: isActive ? 1 : 0.96,
      }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
      }
      style={{
        visibility: isActive ? "visible" : "hidden",
        zIndex: isActive ? 20 : 0,
        pointerEvents: isActive ? "auto" : "none",
      }}
      className="absolute inset-0 w-full h-full rounded-[24px] bg-[#0B1220] border border-[#C9A96E]/[0.18] p-8 sm:p-9 lg:p-10 shadow-2xl shadow-black/80 flex flex-col justify-between overflow-hidden"
      role="tabpanel"
      aria-hidden={!isActive}
    >
      <div>
        {/* Top: Badge + Milestone Step */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-[0.2em] font-medium text-[#A8B0BD] px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
            {item.badge}
          </span>
          <span className="text-xs font-mono text-[#A8B0BD]">
            0{index + 1} / 0{total}
          </span>
        </div>

        {/* Title ~28px */}
        <h3 className="font-serif text-[26px] sm:text-[28px] text-[#F5F1E8] font-normal leading-snug mt-5">
          {item.title}
        </h3>

        {/* Body 16px, line-height 1.6 */}
        <p className="text-[#A8B0BD] text-base leading-[1.6] font-sans font-light mt-3.5 lining-nums [font-variant-numeric:lining-nums]">
          {item.description}
        </p>
      </div>

      {/* Hairline Divider & Outcome Line with Check Icon */}
      <div className="mt-8 pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs sm:text-sm font-mono text-[#C9A96E]">
        <span className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#C9A96E] shrink-0" />
          <span className="font-medium">{item.highlight}</span>
        </span>
        <span className="text-xs text-[#A8B0BD] font-mono">
          {item.year}
        </span>
      </div>
    </motion.div>
  );
}

export function HorizontalTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Direct calculation from DOM for bulletproof reliability across reloads, jumps, and resizes
  useEffect(() => {
    const syncActiveIndex = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      const total = timelineEvents.length;
      const idx = Math.min(total - 1, Math.max(0, Math.floor(progress * total)));
      setActiveIdx(idx);
    };

    syncActiveIndex();
    window.addEventListener("scroll", syncActiveIndex, { passive: true });
    window.addEventListener("resize", syncActiveIndex, { passive: true });
    return () => {
      window.removeEventListener("scroll", syncActiveIndex);
      window.removeEventListener("resize", syncActiveIndex);
    };
  }, []);

  // Also track scrollYProgress for frame-perfect reactive updates
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const total = timelineEvents.length;
      const idx = Math.min(total - 1, Math.max(0, Math.floor(latest * total)));
      setActiveIdx(idx);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const progressLineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Click-to-scroll to milestone
  const scrollToStep = (idx: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
    const total = timelineEvents.length;
    const targetProgress = (idx + 0.5) / total;
    const targetY = containerTop + targetProgress * totalScrollable;
    setActiveIdx(idx);
    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  // Accessibility Fallback or Mobile Viewport (below 768px): clean stacked list
  if (shouldReduceMotion || isMobile) {
    return (
      <section className="py-16 sm:py-20 bg-[#070B14] text-[#F5F1E8] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="space-y-3 pb-8 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#A8B0BD]">
                Chronology Record
              </span>
              <span className="text-white/20">·</span>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C9A96E] font-semibold">
                2019 to Present
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#F5F1E8] tracking-tight leading-[1.12]">
              Milestones of fiduciary growth.
            </h2>
          </div>

          {/* Vertical Mobile Timeline */}
          <div className="relative pl-6 sm:pl-8 border-l border-[#C9A96E]/30 space-y-10 my-10 ml-2 sm:ml-4">
            {timelineEvents.map((item, idx) => (
              <div
                key={item.year}
                className="relative"
              >
                {/* Timeline Dot on line */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#070B14] border-2 border-[#C9A96E]" />

                {/* Year heading above each card */}
                <span className="font-serif text-3xl font-normal text-[#C9A96E] lining-nums [font-variant-numeric:lining-nums] block mb-2">
                  {item.year}
                </span>

                {/* Card */}
                <div className="rounded-[24px] bg-[#0B1220] border border-[#C9A96E]/[0.18] p-6 sm:p-7 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] font-medium text-[#A8B0BD] px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
                      {item.badge}
                    </span>
                    <span className="text-xs font-mono text-[#A8B0BD]">
                      0{idx + 1} / 0{timelineEvents.length}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-normal leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-[#A8B0BD] text-base leading-[1.6] font-sans font-light lining-nums [font-variant-numeric:lining-nums]">
                    {item.description}
                  </p>

                  <div className="h-[1px] w-full bg-white/[0.08] pt-2" />

                  <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-[#C9A96E]">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A96E] shrink-0" />
                      <span>{item.highlight}</span>
                    </span>
                    <span className="text-xs text-[#A8B0BD] font-mono">
                      {item.year}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop (>= 768px): Pinned Scroll-Driven Stacked Cards
  return (
    <>
      <section
        ref={containerRef}
        className="relative bg-[#070B14] text-[#F5F1E8] h-[320vh]"
      >
        {/* Pinned Sticky Viewport Container */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-20">
          {/* Restrained Three.js Feathered Gold Ribbon & Faint Particles Background */}
          <MilestoneThreeBackground scrollYProgress={scrollYProgress} />

          {/* Main Pinned Center Area: Shared 1152px Container with align-items: center */}
          <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
            <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center w-full">
              
              {/* Left Column + Far Left Progress Line: vertically centered on same line */}
              <div className="col-span-12 lg:col-span-6 flex items-center gap-6 lg:gap-10">
                
                {/* Far Left: Vertical Progress Track + Interactive Dots with Year Labels */}
                <div className="hidden md:flex flex-col justify-between h-[320px] relative w-[90px] shrink-0">
                  {/* Connecting Line Track */}
                  <div className="absolute left-[6px] top-2 bottom-2 w-[2px] bg-white/[0.12] rounded-full pointer-events-none z-0">
                    <motion.div
                      style={{ height: progressLineHeight }}
                      className="w-full bg-[#C9A96E] rounded-full"
                    />
                  </div>

                  {/* 6 Interactive Dot Buttons with 12px Year Labels */}
                  {timelineEvents.map((event, idx) => {
                    const isActive = idx === activeIdx;
                    const isPassed = idx <= activeIdx;
                    return (
                      <button
                        type="button"
                        key={event.year}
                        onClick={() => scrollToStep(idx)}
                        className="group relative z-10 flex items-center gap-3.5 py-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B14] rounded-md transition-all cursor-pointer select-none"
                        aria-label={`Go to ${event.year}`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 shrink-0 ${
                            isActive
                              ? "bg-[#C9A96E] border-[#F5F1E8] shadow-[0_0_12px_rgba(201,169,110,0.9)] scale-125"
                              : isPassed
                              ? "bg-[#C9A96E]/70 border-[#C9A96E]"
                              : "bg-[#161F33] border-white/40 group-hover:border-[#C9A96E]/70"
                          }`}
                        />
                        <span
                          className={`text-xs font-mono transition-colors duration-300 lining-nums [font-variant-numeric:lining-nums] ${
                            isActive
                              ? "text-[#C9A96E] font-medium"
                              : "text-[#A8B0BD] group-hover:text-[#F5F1E8]"
                          }`}
                        >
                          {event.year}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Left Column Text: Large Serif Year Roll + Eyebrow + Heading */}
                <div className="space-y-6 flex-1 min-w-0">
                  {/* Large Serif Year (lining numerals, rgba(201,169,110,.42), smooth sync transition) */}
                  <div className="h-[120px] sm:h-[135px] lg:h-[145px] relative overflow-hidden flex items-end">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={timelineEvents[activeIdx].year}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[110px] sm:text-[130px] lg:text-[145px] font-serif font-normal text-[rgba(201,169,110,0.42)] leading-none select-none lining-nums [font-variant-numeric:lining-nums]"
                      >
                        {timelineEvents[activeIdx].year}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Eyebrow & Title: includes Chronology Record integrated with narrative */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#A8B0BD]">
                        Chronology Record
                      </span>
                      <span className="text-white/20">·</span>
                      <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C9A96E] font-semibold">
                        2019 to Present
                      </span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F5F1E8] tracking-tight leading-[1.12]">
                      Milestones of fiduciary growth.
                    </h2>
                  </div>
                </div>

              </div>

              {/* Right Column: Stacked Cards Container - all cards identical width */}
              <div className="col-span-12 lg:col-span-6 flex justify-center lg:justify-end items-center w-full">
                <div className="w-full max-w-[520px] h-[400px] sm:h-[420px] relative">
                  {timelineEvents.map((item, index) => (
                    <DesktopStackedCard
                      key={item.year}
                      item={item}
                      index={index}
                      total={timelineEvents.length}
                      activeIdx={activeIdx}
                      shouldReduceMotion={shouldReduceMotion}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}
