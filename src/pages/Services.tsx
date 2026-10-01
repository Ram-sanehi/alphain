import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StockTicker } from "@/components/StockTicker";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { servicesData } from "@/data/servicesData";
import { cn } from "@/lib/utils";

export default function ServicesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F5F1E8] selection:bg-[#C9A24B]/30 selection:text-[#F5F1E8] overflow-x-hidden">
      <Navbar />
      <StockTicker />

      <main>
        {/* Editorial Hero Header (Shared section spacing ~96-128px, no hairline, no min-height) */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#C9A96E]/[0.03] rounded-full blur-[140px] pointer-events-none" />

          <div className="w-full max-w-[1152px] mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-3xl space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C9A96E] font-semibold">
                  Institutional Capabilities
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] leading-[1.12] text-[#F5F1E8] font-normal tracking-tight">
                Comprehensive wealth solutions, <br />
                <span className="italic text-[#C9A96E]">engineered for compounding.</span>
              </h1>

              <p className="text-[#A8B0BD] text-sm sm:text-base font-sans font-light max-w-2xl leading-relaxed [text-wrap:pretty]">
                Six specialized fiduciary disciplines delivered under strict SEBI-registered oversight. 
                Direct access to investment leadership, institutional execution rigor, and absolute zero distributor commissions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Numbered List & Detail Accordion Section (Shared container: max-width 1152px, margin-inline:auto, 24px side padding) */}
        <section className="pb-24 lg:pb-32 relative">
          <div className="w-full max-w-[1152px] mx-auto px-6 relative z-10">
            <div className="border-t border-white/[0.08]">
              {servicesData.map((service) => {
                const isExpanded = expandedId === service.id;

                return (
                  <div
                    key={service.id}
                    className={cn(
                      "group relative transition-all duration-300",
                      isExpanded
                        ? "bg-[#0B1020] border border-[#C9A96E]/30 rounded-2xl shadow-xl my-4 overflow-hidden"
                        : "border-b border-white/[0.08] hover:border-b-[rgba(201,169,110,0.5)] focus-within:border-b-[rgba(201,169,110,0.5)] hover:bg-white/[0.02]"
                    )}
                    onMouseEnter={() => setHoveredId(service.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Top Clickable Row Header: 48px index | title block | description | 48px chevron */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(service.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`service-detail-${service.id}`}
                      className="w-full text-left py-7 lg:py-8 px-6 sm:px-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B14] rounded-2xl cursor-pointer"
                    >
                      <div className="grid grid-cols-[48px_1fr_48px] md:grid-cols-[48px_300px_1fr_48px] lg:grid-cols-[48px_360px_1fr_48px] items-center gap-4 sm:gap-6 lg:gap-8">
                        {/* 1. 48px Index */}
                        <span className="font-mono text-xs sm:text-sm text-[#C9A96E]/80 group-hover:text-[#C9A96E] font-medium w-12 text-left shrink-0">
                          {service.number}
                        </span>

                        {/* 2. Title Block: title on first line, tag ALWAYS on own line below */}
                        <div className="flex flex-col justify-center min-w-0">
                          <h2 className="font-serif text-2xl lg:text-[28px] font-normal text-[#F5F1E8] group-hover:text-white transition-colors duration-200 tracking-tight leading-snug [text-wrap:balance]">
                            {service.title}
                          </h2>
                          <span className="block text-[11px] font-mono uppercase tracking-[0.2em] text-[#C9A96E] mt-1 font-medium">
                            {service.teaserTag}
                          </span>
                        </div>

                        {/* 3. Description Column starting at the same x in every row */}
                        <div className="min-w-0 col-span-full md:col-span-1 md:col-start-3">
                          <p className="text-xs sm:text-[14px] text-[#A8B0BD] font-sans font-light leading-relaxed">
                            {service.shortDesc}
                          </p>
                        </div>

                        {/* 4. 48px Chevron Button */}
                        <div className="flex justify-end col-start-3 md:col-start-4">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0",
                              isExpanded
                                ? "bg-[#C9A96E] text-[#070B14] border-[#C9A96E] shadow-[0_0_18px_rgba(201,169,110,0.35)]"
                                : "border-white/15 text-slate-300 group-hover:border-[#C9A96E] group-hover:text-[#C9A96E]"
                            )}
                          >
                            <ChevronDown
                              className={cn(
                                "w-5 h-5 transition-transform duration-300 motion-reduce:duration-0",
                                isExpanded ? "rotate-180" : ""
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Hover preview in right gutter: viewports >= 1440px only, fixed 280x180, never overlaps text */}
                    <div
                      className="pointer-events-none hidden min-[1440px]:block absolute left-[calc(50%+576px+24px)] top-1/2 -translate-y-1/2 w-[280px] h-[180px] rounded-xl overflow-hidden border border-white/15 bg-[#0B1020] shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-30 transition-opacity duration-150 motion-reduce:transition-none"
                      style={{
                        opacity: hoveredId === service.id && !isExpanded ? 1 : 0,
                      }}
                    >
                      <img
                        src={service.hoverImage}
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/85 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-[#F5F1E8]">
                        <span className="text-[#C9A96E] font-medium">{service.number}</span>
                        <span className="text-[#A8B0BD] font-sans normal-case text-xs">
                          {service.teaserTag}
                        </span>
                      </div>
                    </div>

                    {/* Merged Detail Panel (Single card with header, subtle divider inside) */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          id={`service-detail-${service.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="overflow-hidden motion-reduce:transition-none"
                        >
                          {/* Subtle Internal Divider */}
                          <div className="border-t border-white/[0.08] mx-6 sm:mx-8" />

                          {/* Expanded Content Grid: 1fr 1.3fr 0.8fr with 48px gap (lg:), 1 column stacked below 1024px */}
                          <div className="px-6 sm:px-8 pt-6 pb-8">
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr_0.8fr] gap-y-10 lg:gap-x-12 items-start">
                              {/* Column 1: Key Fiduciary Benefits */}
                              <div className="space-y-4">
                                <h4 className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#C9A96E] border-b border-white/[0.08] pb-3 font-semibold">
                                  Key Fiduciary Benefits
                                </h4>
                                <ul className="space-y-3 pt-1">
                                  {service.keyBenefits.map((benefit, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-3"
                                    >
                                      <Check className="h-4 w-4 text-[#C9A96E] shrink-0 mt-1" />
                                      <span className="text-[15px] sm:text-[16px] text-[#E6E9EF] font-sans font-light leading-relaxed">
                                        {benefit}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Column 2: Our 5-Step Process */}
                              <div className="space-y-4">
                                <h4 className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#C9A96E] border-b border-white/[0.08] pb-3 font-semibold">
                                  Our 5-Step Process
                                </h4>
                                <ol className="relative border-l border-[#C9A96E]/25 pl-5 ml-3 space-y-2.5 pt-1">
                                  {service.process.map((step, i) => (
                                    <li
                                      key={i}
                                      className="relative pl-3"
                                    >
                                      <span className="absolute -left-[32px] top-0 w-[24px] h-[24px] rounded-full bg-[#070B14] border border-[#C9A96E] flex items-center justify-center text-[12px] text-[#C9A96E] font-mono font-semibold [font-variant-numeric:lining-nums] shadow-[0_0_8px_rgba(201,169,110,0.2)]">
                                        {step.step}
                                      </span>
                                      <h5 className="text-[16px] font-semibold text-white leading-snug [text-wrap:balance]">
                                        {step.title}
                                      </h5>
                                      <p className="text-[14px] leading-[1.55] text-[#A8B0BD] font-sans font-light mt-1">
                                        {step.description}
                                      </p>
                                    </li>
                                  ))}
                                </ol>
                              </div>

                              {/* Column 3: Offerings / Asset Classes */}
                              <div className="space-y-4">
                                <h4 className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#C9A96E] border-b border-white/[0.08] pb-3 font-semibold">
                                  {service.assetClasses ? "Asset Classes & Structuring" : "Our Offerings"}
                                </h4>
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {(service.assetClasses || service.offerings || []).map((offering, i) => (
                                    <span
                                      key={i}
                                      className="h-[34px] px-3.5 inline-flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#C9A96E]/40 hover:bg-[#C9A96E]/[0.05] hover:text-[#C9A96E] transition-all text-[13px] text-[#E6E9EF] font-sans font-light tracking-wide cursor-default"
                                    >
                                      {offering}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Bottom Action Bar */}
                            <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                              <Link
                                to="/contact"
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#C9A96E] text-[#070B14] font-medium text-xs uppercase tracking-wider hover:bg-[#d8b15a] transition-all duration-300 shadow-[0_0_20px_rgba(201,169,110,0.2)] group shrink-0"
                              >
                                <span>Book a Consultation for this Service</span>
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                              </Link>

                              <Link
                                to={`/services/${service.slug}`}
                                className="inline-flex items-center justify-center sm:justify-start gap-2 text-sm font-sans font-medium text-[#C9A96E] hover:underline underline-offset-4 transition-all group"
                              >
                                <span>Explore In-Depth Whitepaper &amp; Methodology</span>
                                <ArrowRight className="w-4 h-4 text-[#C9A96E] transition-transform group-hover:translate-x-1" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <CTA
          pill="OUR SERVICES"
          headlineLead="Find the advisory that"
          headlineEmphasis="fits your goals."
          subtitle="Tell us where you are today and we will outline which of our services suit your situation, with the fee structure explained upfront."
          buttonLabel="Book a Consultation"
        />
      </main>

      <Footer />
    </div>
  );
}
