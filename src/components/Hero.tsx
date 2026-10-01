import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[700px] flex flex-col justify-between overflow-hidden bg-[#070B14]">
      {/* Background: Architectural Glass Towers at Dusk */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* GPU-composited pure CSS Ken Burns container */}
        <div className="hero-kenburns absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2560&q=80"
            srcSet="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1280&q=80 1280w, https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80 1920w, https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2560&q=80 2560w"
            sizes="100vw"
            alt="Low-angle upward view of architectural glass towers graded in dusk navy shadows with warm amber reflections"
            className="w-full h-full object-cover object-[center_30%] pointer-events-none select-none"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        </div>

        {/* Brand overlays: Balanced dark gradients ensuring crisp readability while architectural towers stay radiantly visible */}
        <div className="absolute inset-0 bg-[#070B14]/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/85 via-[#070B14]/45 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-36 sm:h-44 bg-gradient-to-t from-[#070B14] via-[#070B14]/80 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Top Spacer for fixed navbar */}
      <div className="h-20 sm:h-24 relative z-20" />

      {/* Main Content: Left-aligned with generous whitespace */}
      <div className="w-full max-w-[1280px] mx-auto px-[clamp(24px,4vw,48px)] relative z-20 my-auto">
        <div className="max-w-4xl text-left space-y-7 sm:space-y-9">
          
          {/* Small Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]" />
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#C9A24B]">
              SEBI Registered Investment Adviser · INA000017348
            </span>
          </motion.div>

          {/* Headline: 80-96px Serif with Line-by-Line Mask Reveal */}
          <div className="space-y-1">
            {/* Line 1 Mask Container */}
            <div className="overflow-hidden py-1">
              <motion.h1
                initial={{ y: "115%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="font-serif text-5xl sm:text-7xl lg:text-[84px] xl:text-[96px] leading-[1.02] tracking-tight text-[#F5F1E8] font-normal drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]"
              >
                Strategic wealth.
              </motion.h1>
            </div>

            {/* Line 2 Mask Container */}
            <div className="overflow-hidden py-1">
              <motion.h1
                initial={{ y: "115%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.36 }}
                className="font-serif text-5xl sm:text-7xl lg:text-[84px] xl:text-[96px] leading-[1.02] tracking-tight text-[#F5F1E8] font-normal drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]"
              >
                Secured <span className="text-[#C9A24B] italic">legacies.</span>
              </motion.h1>
            </div>
          </div>

          {/* Exact 20-word Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
            className="text-base sm:text-lg text-muted-text font-sans font-normal leading-relaxed max-w-2xl drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]"
          >
            Independent fiduciary advisory safeguarding capital, structuring multi-generational family estates, and engineering resilient investment portfolios with complete transparency and zero commissions.
          </motion.p>

          {/* Two CTAs: Primary and Ghost */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link
              to="/contact"
              className="bg-[#C9A24B] hover:bg-[#DCB862] text-[#070B14] font-sans font-semibold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 shadow-lg active:scale-[0.98] inline-flex items-center gap-2 group"
            >
              <span>Book a consultation</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/services"
              className="border border-white/20 hover:border-white/50 text-[#F5F1E8] hover:text-[#C9A24B] font-sans font-medium text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-sm active:scale-[0.98]"
            >
              Our approach
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Bottom: Small Scroll Indicator */}
      <div className="w-full max-w-[1280px] mx-auto px-[clamp(24px,4vw,48px)] relative z-20 pb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex items-center gap-3 text-slate-400 text-[10px] uppercase tracking-[0.25em] font-sans"
        >
          <div className="w-4 h-7 rounded-full border border-white/25 flex items-start justify-center p-1">
            <div className="hero-scroll-dot w-1 h-1.5 rounded-full bg-[#C9A24B]" />
          </div>
          <span>Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}
