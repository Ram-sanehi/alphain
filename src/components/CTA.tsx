import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CTAProps {
  className?: string;
  pill?: string;
  headlineLead?: string;
  headlineEmphasis?: string;
  subtitle?: string;
  buttonLabel?: string;
}

export function CTA({
  className,
  pill = "Fiduciary Advisory · Pune · Est. 2019",
  headlineLead = "Let’s craft a",
  headlineEmphasis = "smarter wealth strategy.",
  subtitle = "Begin your journey towards conflict‑free compounding and multi‑generational security. Partner with our SEBI‑registered advisory committee.",
  buttonLabel = "Book a Consultation",
}: CTAProps = {}) {
  return (
    <section className={cn("relative w-full pt-20 lg:pt-28 pb-6 sm:pb-8 overflow-hidden border-t border-white/[0.1]", className)}>
      {/* Full-Bleed Cinematic Background Image (Neoclassical Colonnade at Dusk, Strictly Signage-Free) */}
      <div className="absolute inset-0 z-0">
        <picture className="w-full h-full block">
          <source
            type="image/webp"
            srcSet="/images/cta-colonnade.webp"
          />
          <img
            src="/images/cta-colonnade.jpg"
            alt="Signage-free neoclassical stone colonnade and grand architectural columns at quiet golden hour representing enduring wealth stewardship"
            className="w-full h-full object-cover object-[center_35%] filter contrast-[1.12] brightness-[0.90] sepia-[0.12] saturate-[1.05]"
            loading="lazy"
          />
        </picture>

        {/* Color Grade Layer 1: Warm Amber / Gold Highlights */}
        <div
          className="absolute inset-0 z-10 pointer-events-none mix-blend-color-dodge opacity-25"
          style={{
            background:
              "linear-gradient(135deg, rgba(201,162,75,0) 0%, rgba(201,162,75,0.15) 30%, rgba(201,162,75,0.4) 70%, rgba(220,184,98,0.55) 100%)",
          }}
        />

        {/* Color Grade Layer 2: Deep Navy Shadow Multiplier */}
        <div
          className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply opacity-45"
          style={{
            background:
              "linear-gradient(180deg, #070B14 0%, rgba(7,11,20,0.45) 50%, rgba(11,19,43,0.75) 100%)",
          }}
        />

        {/* Focused radial vignette behind text: Keeps colonnade columns radiant on sides while maintaining WCAG AA text contrast */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(7,11,20,0.85) 0%, rgba(7,11,20,0.55) 60%, rgba(7,11,20,0.25) 100%)",
          }}
        />

        {/* Seamless edge merges */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#070B14] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#070B14] via-[#070B14]/80 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Center Editorial Content */}
      <div className="w-full max-w-[1280px] mx-auto px-[clamp(24px,4vw,48px)] relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 max-w-4xl mx-auto"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A24B]/10 border border-[#C9A24B]/20 text-[11px] font-mono uppercase tracking-[0.25em] text-[#C9A24B]">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{pill}</span>
          </div>

          {/* Huge Serif Headline */}
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal leading-[1.06] tracking-tight text-[#F5F1E8] [text-wrap:balance]">
            {headlineLead.trimEnd()}{" "}
            {headlineEmphasis && (
              <span className="italic text-[#C9A24B]">{headlineEmphasis}</span>
            )}
          </h2>

          {/* Subline */}
          <p className="text-base sm:text-lg lg:text-xl text-[#A8B0BD] font-sans font-light max-w-2xl mx-auto leading-relaxed [text-wrap:balance]">
            {subtitle}
          </p>

          {/* EXACTLY ONE BUTTON */}
          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#C9A24B] hover:bg-[#d6af57] text-[#070B14] font-sans font-semibold text-sm px-10 py-7 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-[#C9A24B]/25 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <Link to="/contact" className="inline-flex items-center gap-3">
                <span>{buttonLabel}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Subtle Regulatory Verification Baseline with high contrast (minimum 12px) */}
          <p className="text-xs sm:text-xs text-[12px] font-mono uppercase tracking-widest text-[#A8B0BD] font-medium pt-4">
            Zero Distributor Kickbacks · SEBI Registration INA000017348 · Strictly Fee-Only
          </p>
        </motion.div>
      </div>
    </section>
  );
}
