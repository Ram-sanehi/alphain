import { ShieldCheck, Award, Calendar, Users, Briefcase } from "lucide-react";

export function AuthorityStrip() {
  const items = [
    { icon: ShieldCheck, label: "SEBI Registered", desc: "Investment Advisor" },
    { icon: Award, label: "NISM Certified", desc: "Compliance Standards" },
    { icon: Calendar, label: "Since 2019", desc: "7+ Years Fiduciary" },
    { icon: Users, label: "3000+ Investors", desc: "Served Nationwide" },
    { icon: Briefcase, label: "₹300 Cr+ Assets", desc: "Guided Capital" },
  ];

  return (
    <div className="w-full border-y border-[#D4AF37]/15 bg-slate-950/35 relative z-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-y sm:divide-y-0 md:divide-y-0 md:divide-x divide-border/15 py-1">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-3 py-3.5 px-4 justify-center md:justify-start group"
              >
                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/5 border border-[#D4AF37]/15 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/40 transition-colors duration-300">
                  <Icon className="h-3.5 w-3.5 text-[#D4AF37]" />
                </div>
                <div className="text-left leading-none">
                  <p className="text-[11px] font-bold text-foreground tracking-wider uppercase">{item.label}</p>
                  <p className="text-[9px] text-muted-foreground/60 mt-1 font-light tracking-widest uppercase">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
