import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Understand Your Goals",
    description:
      "We begin with a comprehensive discovery conversation — your life stage, income, financial commitments, aspirations, and time horizons. No assumptions. Every strategy starts with listening.",
    detail: "60-90 minute discovery session",
  },
  {
    number: "02",
    title: "Assess Your Risk Profile",
    description:
      "A structured behavioural and quantitative risk questionnaire determines your true risk tolerance — not just your theoretical preference, but how you actually respond to volatility.",
    detail: "Behavioural + quantitative assessment",
  },
  {
    number: "03",
    title: "Build Your Strategy",
    description:
      "We construct a custom asset allocation blueprint — fund selection, equity-debt balance, SIP schedule, and tax optimisation — tailored entirely to your profile. Zero template strategies.",
    detail: "Personalised Investment Policy Statement",
  },
  {
    number: "04",
    title: "Monitor & Optimise",
    description:
      "Markets evolve. Life changes. We conduct quarterly portfolio reviews, regulatory compliance updates, and proactive rebalancing — ensuring your strategy stays aligned to your goals.",
    detail: "Quarterly reviews + annual rebalancing",
  },
];

export function ProcessSection() {
  return (
    <section className="py-24 bg-background border-t border-border/20" aria-labelledby="process-heading">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <span className="section-rule mb-3" />
          <span className="section-label block mb-3">How We Work</span>
          <h2 id="process-heading" className="font-display font-bold leading-tight mb-4">
            A Transparent{" "}
            <span className="gold-text">4-Step Advisory Process</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-light">
            Every client relationship follows a structured, proven process — so you always
            know where you stand and what comes next.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connector line on desktop */}
          <div
            className="hidden lg:block absolute left-[2.35rem] top-6 bottom-6 w-px bg-border/30"
            aria-hidden="true"
          />

          <ol className="space-y-0 divide-y divide-border/20 lg:divide-y-0 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.li
                key={step.number}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="lg:flex lg:items-start lg:gap-8 py-8 lg:py-10 group"
              >
                {/* Step number circle */}
                <div className="flex-shrink-0 flex items-center gap-4 mb-4 lg:mb-0">
                  <div className="relative">
                    <div className="w-[4.7rem] h-[4.7rem] rounded-full border border-border/40 group-hover:border-primary/50 bg-background flex items-center justify-center transition-colors duration-200 z-10 relative">
                      <span className="font-display font-bold text-lg text-primary/80 group-hover:text-primary transition-colors duration-200">
                        {step.number}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step content */}
                <div className="flex-grow lg:pt-4 space-y-2">
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      {step.title}
                    </h3>
                    <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider border border-border/30 px-2 py-0.5 rounded-sm">
                      {step.detail}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed font-light max-w-2xl">
                    {step.description}
                  </p>
                </div>

                {/* Connector arrow on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block flex-shrink-0 self-center ml-4 text-border/30" aria-hidden="true">
                  </div>
                )}
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
