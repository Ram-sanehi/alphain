import { motion } from "framer-motion";
import { ShieldCheck, CalendarDays, Users, TrendingUp, HeartHandshake } from "lucide-react";

export function TrustCredibility() {
  const items = [
    { icon: ShieldCheck, text: "SEBI Registered" },
    { icon: CalendarDays, text: "Trusted Since 2019" },
    { icon: Users, text: "500+ Happy Clients" },
    { icon: TrendingUp, text: "₹100Cr+ Assets Managed" },
    { icon: HeartHandshake, text: "Personalized Advisory" },
  ];

  return (
    <section className="relative z-20 -mt-8 py-6 max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card bg-slate-900/40 backdrop-blur-md border border-white/5 shadow-2xl rounded-2xl py-5 px-6 md:px-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 items-center justify-items-center divide-y md:divide-y-0 md:divide-x divide-border/30">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 w-full justify-center md:px-2 ${
                idx >= 2 ? "pt-4 md:pt-0" : ""
              } ${idx === 1 ? "pt-0" : ""}`}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-300">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
