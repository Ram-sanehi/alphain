import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { servicesData, ServiceItem } from "@/data/servicesData";

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);
  const [isInside, setIsInside] = useState(false);

  const [isNearTop, setIsNearTop] = useState(false);

  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs to avoid jerky movements
  const springX = useSpring(mouseX, { damping: 24, stiffness: 180 });
  const springY = useSpring(mouseY, { damping: 24, stiffness: 180 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    // Clamp X so 340px preview stays nicely inside container (half-width 170px + margin)
    const clampedX = Math.max(180, Math.min(relX, rect.width - 180));
    mouseX.set(clampedX);
    mouseY.set(relY);
    setIsNearTop(relY < 110);
  };

  const handleMouseEnter = () => {
    setIsInside(true);
  };

  const handleMouseLeave = () => {
    setIsInside(false);
    setActiveService(null);
  };

  return (
    <section className="py-24 lg:py-32 bg-[#070B14] text-[#F5F1E8] relative overflow-hidden border-t border-white/[0.08]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C9A24B]/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-16 border-b border-white/[0.08]">
          <div className="space-y-4 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C9A24B] block font-semibold">
              Capabilities &amp; Fiduciary Mandates
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[50px] leading-[1.12] text-[#F5F1E8] font-normal tracking-tight">
              Comprehensive wealth solutions, <br className="hidden sm:inline" />
              <span className="italic text-[#C9A24B]">engineered for compounding.</span>
            </h2>
          </div>

          <div className="md:text-right">
            <p className="text-muted-text text-sm font-sans font-light max-w-xs leading-relaxed">
              SEBI-registered conflict-free advisory tailored to private families, trusts, and corporate treasuries.
            </p>
          </div>
        </div>

        {/* Full-Width Editorial List Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative mt-2"
        >
          {/* Floating Cinematic Image Cursor Reveal — Offset vertically above/below the row so it never covers title or right label */}
          <motion.div
            style={{
              left: springX,
              top: springY,
              x: "-50%",
            }}
            animate={{
              y: isNearTop ? "18%" : "-115%",
              opacity: isInside && activeService ? 1 : 0,
              scale: isInside && activeService ? 1 : 0.85,
            }}
            className="pointer-events-none absolute z-30 hidden lg:block w-[340px] aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-white/20 bg-[#0B1020]"
            initial={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            {activeService && (
              <div className="relative w-full h-full">
                <img
                  src={activeService.hoverImage}
                  alt={activeService.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-[#F5F1E8]">
                  <span className="text-[#C9A24B]">{activeService.number}</span>
                  <span className="text-slate-300 font-sans normal-case text-xs">Explore Capability ↗</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Service Rows */}
          <div className="divide-y divide-white/[0.08]">
            {servicesData.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                onMouseEnter={() => setActiveService(service)}
                className="group relative flex flex-col md:flex-row md:items-center justify-between py-7 sm:py-9 lg:py-11 px-4 sm:px-6 rounded-2xl transition-all duration-300 hover:bg-white/[0.02]"
              >
                {/* Left: Number & Serif Title */}
                <div className="flex items-baseline gap-6 sm:gap-10 lg:gap-14">
                  <span className="font-mono text-xs sm:text-sm text-[#C9A24B]/70 group-hover:text-[#C9A24B] transition-colors font-medium">
                    {service.number}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-[38px] font-normal text-[#F5F1E8] group-hover:text-[#C9A24B] transition-colors duration-300 tracking-tight">
                    {service.title}
                  </h3>
                </div>

                {/* Right: Teaser Tag & Arrow */}
                <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10 lg:gap-14 mt-4 md:mt-0 pl-12 md:pl-0">
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#C9A24B] group-hover:text-[#DCB862] transition-colors hidden sm:inline-block">
                    {service.teaserTag}
                  </span>

                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/10 group-hover:border-[#C9A24B] group-hover:bg-[#C9A24B] group-hover:text-[#070B14] text-slate-300 flex items-center justify-center transition-all duration-300 shrink-0">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom hairline slide accent */}
                <div className="absolute bottom-0 left-6 right-6 h-[1.5px] bg-[#C9A24B] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Teaser CTA */}
        <div className="pt-14 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/[0.08] mt-8">
          <p className="text-xs font-mono text-muted-text uppercase tracking-widest text-center sm:text-left">
            Institutional Rigor · Fiduciary Standard · Zero Commissions
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-3 px-7 py-3 rounded-full bg-[#C9A24B] text-[#070B14] font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-[#d8b15a] transition-all duration-300 shadow-[0_0_20px_rgba(201,162,75,0.2)] group"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
