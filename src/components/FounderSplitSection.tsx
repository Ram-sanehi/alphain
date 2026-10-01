import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function FounderSplitSection({ borderTop = true }: { borderTop?: boolean } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <section
      ref={containerRef}
      id="approach"
      className={`py-24 lg:py-32 bg-[#070B14] text-[#F5F1E8] relative overflow-hidden ${
        borderTop ? "border-t border-white/[0.08]" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* LEFT: Portrait Column (Sticky on desktop, stacked on mobile/tablet) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start lg:sticky lg:top-[120px] self-start w-full m-0 p-0">
            <div className="w-full max-w-[420px] m-0 p-0">
              
              {/* Clean Rectangular Frame: 16px corner radius, 1px gold hairline border, soft deep shadow */}
              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden border border-[#C9A24B]/30 bg-[#0B1020] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.85)] group">
                <motion.div
                  style={{ y: shouldReduceMotion ? 0 : imageY }}
                  className="w-full h-[116%] -top-[8%] relative"
                >
                  <picture className="w-full h-full block">
                    <source srcSet="/images/founder-nageshwar-prasad.webp" type="image/webp" />
                    <img
                      src="/images/founder-nageshwar-prasad.jpg"
                      alt="Nageshwar Prasad — Founder & Chief Investment Officer, Alpha Investment Management"
                      className="w-full h-full object-cover object-[center_20%] filter contrast-[1.04] brightness-[0.98] transition-all duration-700"
                      loading="lazy"
                      width="1600"
                      height="2142"
                    />
                  </picture>
                  {/* Subtle inner ambient gradient at bottom of frame */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#070B14]/80 via-[#070B14]/20 to-transparent pointer-events-none" />
                </motion.div>
              </div>

              {/* Photo Caption: Name & Role lockup together under portrait */}
              <div className="mt-5 pt-3.5 border-t border-white/[0.08] space-y-1">
                <div className="font-serif text-2xl sm:text-[26px] text-[#C9A24B] italic tracking-normal leading-tight">
                  Nageshwar Prasad
                </div>
                <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#9AA3B2] font-semibold">
                  Founder &amp; Chief Investment Officer
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT: Eyebrow, Serif Heading, 2 Body Paragraphs, Elevated Pull Quote, and CTA */}
          <div className="lg:col-span-7 space-y-7 text-left w-full max-w-[640px]">
            
            {/* Eyebrow */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C9A24B] block font-semibold">
                Heritage &amp; Leadership · Est. 2019
              </span>
              <div className="w-10 h-[1.5px] bg-[#C9A24B]" />
            </div>

            {/* Serif Heading: text-wrap: balance to prevent orphaning "care." */}
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] text-[#F5F1E8] font-normal tracking-tight [text-wrap:balance]">
              Built on trust and <br className="hidden sm:inline" />
              <span className="italic text-[#C9A24B]">fiduciary care.</span>
            </h2>

            {/* Two Secondary Body Paragraphs: #A8B0BD color, line-height 1.7 */}
            <div className="space-y-4 text-[#A8B0BD] text-sm sm:text-[15px] leading-[1.7] font-sans font-light">
              <p>
                Alpha Investment Management was founded in Pune with an unyielding conviction: true wealth stewardship cannot coexist with sales targets and commission-driven products. By establishing an independent SEBI Registered Investment Advisory practice, we eliminated the inherent conflict between investor outcomes and financial distributor kickbacks.
              </p>
              <p>
                Drawing upon advanced finance training from Henley Business School, London, and years navigating Indian macro regimes, our investment committee designs data-informed equity portfolios and family trust frameworks built to withstand shifting markets without forfeiting compounding power.
              </p>
            </div>

            {/* Emotional High Point: Pull Quote with Short Gold Dash above (no redundant full-width hairline), Bottom Border */}
            <div className="mt-8 mb-6 pb-7 border-b border-[#C9A24B]/30 space-y-5 w-full">
              <div className="w-12 h-[2px] bg-[#C9A24B]" />
              
              <blockquote className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-[#F5F1E8] italic font-normal leading-[1.35] tracking-tight [text-wrap:balance]">
                “True wealth management is never transactional. It is a generational pact between our analytical discipline and your family’s enduring peace of mind.”
              </blockquote>
              
              {/* Credentials Line under quote: #9AA3B2, 12-13px minimum, wraps on mobile */}
              <div className="pt-2 w-full">
                <div className="text-[12.5px] sm:text-[13px] font-mono text-[#9AA3B2] uppercase tracking-wider flex flex-wrap items-center gap-x-2.5 gap-y-1.5 leading-relaxed">
                  <span>CFA Level II</span>
                  <span className="text-[#C9A24B]/60 font-sans" aria-hidden="true">&bull;</span>
                  <span>MSc Finance (London)</span>
                  <span className="text-[#C9A24B]/60 font-sans" aria-hidden="true">&bull;</span>
                  <span>SEBI Registered Investment Adviser</span>
                </div>
              </div>
            </div>

            {/* Action Link: Reduced gap, right arrow, thin gold underline, gold hover/focus with 150-200ms transition */}
            <div className="pt-1">
              <Link
                to="/about"
                className="inline-flex items-center gap-2.5 text-xs uppercase tracking-wider font-sans font-semibold text-[#F5F1E8] hover:text-[#C9A24B] focus-visible:text-[#C9A24B] border-b border-[#C9A24B]/40 hover:border-[#C9A24B] pb-1 transition-all duration-200 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
              >
                <span>Read Full Investment Thesis &amp; Governance</span>
                <ArrowRight className="w-4 h-4 text-[#C9A24B] transition-transform duration-200 group-hover:translate-x-1.5" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
