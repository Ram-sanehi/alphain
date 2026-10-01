import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Feature flag: Hide Insurance Mall until subdomain is live
const SHOW_INSURANCE_MALL =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_ENABLE_INSURANCE_MALL === "true"
    : false;

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Please enter a valid email",
        description: "We require a valid address to deliver advisory notes.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toast({
        title: "Subscribed to Investment Notes",
        description: "You will receive our periodic investment committee notes.",
      });
    }, 600);
  };

  return (
    <footer className="bg-[#070B14] text-[#F5F1E8] relative select-none w-full overflow-hidden">
      {/* Shared Container Token: max-width 1280px, margin-inline:auto, padding-inline: clamp(24px, 4vw, 48px) */}
      <div className="w-full max-w-[1280px] mx-auto px-[clamp(24px,4vw,48px)]">
        
        {/* ROW 1: Statement + Newsletter (Reduced top padding ~40-48px, headline 40px Cormorant 2-line break, vertically aligned, ~40px gap below before divider) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-10 sm:pt-12 pb-10 items-center">
          
          {/* Left: Statement */}
          <div className="lg:col-span-7">
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] leading-[1.15] text-[#F5F1E8] [text-wrap:balance]">
              Independent advice, <br className="hidden sm:inline" />
              built for the long term.
            </h2>
          </div>

          {/* Right: Newsletter Block with Dedicated Input Field & Gold Button */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#D0D7E2] font-semibold block mb-2.5">
              Investment notes
            </span>

            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  disabled={isSubmitting}
                  className="h-[48px] w-full px-4 rounded-md bg-white/[0.04] border border-white/15 text-[15px] font-sans font-light text-[#F5F1E8] placeholder:text-[#9AA3B2]/60 focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B] focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-[48px] px-6 rounded-md bg-[#C9A24B] hover:bg-[#DCB862] text-[#070B14] font-sans font-semibold text-xs uppercase tracking-[0.14em] transition-all duration-200 shadow-md flex items-center justify-center shrink-0 focus-visible:ring-2 focus-visible:ring-[#C9A24B] focus-visible:outline-none cursor-pointer"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe →"}
                </button>
              </div>
              <p className="font-sans text-[13px] text-[#A8B0BD] leading-[1.6]">
                We send periodic notes. Unsubscribe anytime. See our{" "}
                <Link
                  to="/privacy"
                  className="underline hover:text-[#F5F1E8] transition-colors focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </div>

        </div>

        {/* DIVIDER 1: Single 1px hairline under newsletter row */}
        <div className="border-t border-white/10" />

        {/* ROW 2: Link Block (5-column grid: brand block 1.4fr, then Firm / Advisory / Resources / Governance 1fr each, 40px gap, link row pitch ~30px, 40px spacing) */}
        <div className="pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-8 xl:gap-10 items-start">
            
            {/* Brand Block (1.4fr on desktop) */}
            <div className="space-y-3.5 sm:col-span-2 lg:col-span-3 xl:col-span-1">
              {/* Exact Header Logo Lockup */}
              <Link to="/" className="flex items-center gap-3 group focus:outline-none flex-shrink-0">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#C9A24B]/35 flex-shrink-0 bg-[#070B14] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/logo-circular1.png"
                    alt="Alpha Investment Management"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-base tracking-tight font-medium text-[#F5F1E8] group-hover:text-[#C9A24B] transition-colors duration-200">
                    Alpha Investment
                  </span>
                  <span className="text-[9px] font-sans uppercase tracking-widest text-[#A8B0BD]">
                    SEBI RIA · INA000017348
                  </span>
                </div>
              </Link>

              {/* Three registration lines together at 13px / line-height 1.5, color #A8B0BD */}
              <div className="font-sans text-[13px] text-[#A8B0BD] leading-[1.5] space-y-0.5">
                <p className="whitespace-nowrap">
                  SEBI Registered Investment Adviser · INA000017348
                </p>
                <p>BASL Membership No. 1982</p>
                <p>Registration validity: Perpetual</p>
              </div>

              {/* Address: max-width ~280px, text-wrap: balance, 13px / line-height 1.5, color #A8B0BD */}
              <div className="pt-1 font-sans text-[13px] text-[#A8B0BD] leading-[1.5] max-w-[280px] [text-wrap:balance]">
                <p>Shop No 2, 1st Floor, Mahalungekar Complex, Chakan{'\u2011'}Talegaon Highway, Chakan, Pune, Maharashtra 410501</p>
              </div>
            </div>

            {/* Column 1: Firm */}
            <div>
              <span className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#D0D7E2] font-semibold block mb-3.5">
                Firm
              </span>
              <ul className="flex flex-col gap-[9px]">
                <li>
                  <Link
                    to="/about"
                    className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about#approach"
                    className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    Our Approach
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about#team"
                    className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    Team
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    Contact
                  </Link>
                </li>
                {SHOW_INSURANCE_MALL && (
                  <li>
                    <a
                      href="https://insurancemall.alphaaim.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] inline-flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                    >
                      <span>Insurance Mall</span>
                      <span className="text-[13px] text-[#C9A24B] font-medium leading-none" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Column 2: Advisory */}
            <div>
              <span className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#D0D7E2] font-semibold block mb-3.5">
                Advisory
              </span>
              <ul className="flex flex-col gap-[9px]">
                <li>
                  <Link
                    to="/services"
                    className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    All Capabilities
                  </Link>
                </li>
                <li>
                  <Link
                    to="/calculators"
                    className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    Calculators
                  </Link>
                </li>
                <li>
                  <Link
                    to="/risk-profile"
                    className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    Risk Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/insights"
                    className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    Insights
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <span className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#D0D7E2] font-semibold block mb-3.5">
                Resources
              </span>
              <ul className="flex flex-col gap-[9px]">
                <li>
                  <a
                    href="https://reporting.alphaaim.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] inline-flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    <span>Client Reporting Portal</span>
                    <span className="text-[13px] text-[#C9A24B] font-medium leading-none" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
                <li>
                  <Link
                    to="/disclaimer"
                    className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    Investor Charter
                  </Link>
                </li>
                <li>
                  <Link
                    to="/downloads"
                    className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    Downloads
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Governance */}
            <div>
              <span className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#D0D7E2] font-semibold block mb-3.5">
                Governance
              </span>
              <ul className="flex flex-col gap-[9px]">
                <li>
                  <a
                    href="https://scores.sebi.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] inline-flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    <span>SEBI SCORES</span>
                    <span className="text-[13px] text-[#C9A24B] font-medium leading-none" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://smartodr.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] inline-flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    <span>SMART ODR</span>
                    <span className="text-[13px] text-[#C9A24B] font-medium leading-none" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
                <li>
                  <Link
                    to="/disclaimer#grievance"
                    className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    Grievance Redressal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/empanelment"
                    className="font-sans text-[15px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.4] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                  >
                    Regulatory Empanelment
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ROW 3: Statutory Disclosure Card (Spacing 40px, NO hairline above, padding 20-24px, body 13px / line-height 1.55 / #A8B0BD, gap ~8px, gold left accent, text-wrap pretty) */}
        <div className="mt-10">
          <div className="rounded-[4px] p-5 sm:p-6 bg-white/[0.03] border border-white/[0.08] border-l-2 border-l-[#C9A24B]">
            <span className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#D0D7E2] font-semibold block mb-2.5">
              Statutory disclosure
            </span>
            <div className="font-sans text-[13px] text-[#A8B0BD] leading-[1.55] space-y-2 max-w-[880px] [text-wrap:pretty]">
              <p>
                Principal Officer &amp; CIO: Nageshwar Prasad. Grievance Officer: Advocate Rajat Diwan.
              </p>
              <p>
                <strong className="font-semibold text-white">
                  Investments in securities market are subject to market risks.
                </strong>{" "}
                Read all the related documents carefully before investing.
              </p>
              <p>
                Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.
              </p>
            </div>
          </div>
        </div>

        {/* DIVIDER 2 + ROW 4: Bottom bar (Single 1px hairline above bottom bar, padding ~20-24px, one line at 13px, copyright & credit left, links right) */}
        <div className="border-t border-white/10 py-5 sm:py-6 mt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] font-sans text-[#A8B0BD] w-full">
            {/* Left: Copyright & Studio Credit */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
              <p>© 2026 Alpha Investment Management. All rights reserved.</p>
              <span className="hidden sm:inline text-white/20 select-none" aria-hidden="true">·</span>
              <a
                href="https://scalvex.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8E97A6] hover:text-[#C9A24B] transition-colors duration-200 text-xs sm:text-[13px]"
              >
                Designed by <span className="text-[#D0D7E2] hover:text-[#C9A24B] font-medium transition-colors">Scalvex</span>
              </a>
            </div>

            {/* Right: Text links right-aligned with consistent spacing */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2">
              <Link
                to="/privacy"
                className="hover:text-[#F5F1E8] transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
              >
                Privacy Policy
              </Link>
              <span className="text-white/45 select-none font-medium" aria-hidden="true">·</span>
              <Link
                to="/terms"
                className="hover:text-[#F5F1E8] transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
              >
                Terms
              </Link>
              <span className="text-white/45 select-none font-medium" aria-hidden="true">·</span>
              <Link
                to="/disclaimer"
                className="hover:text-[#F5F1E8] transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
              >
                Regulatory Disclosures
              </Link>
              <span className="text-white/45 select-none font-medium" aria-hidden="true">·</span>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F5F1E8] transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
              >
                LinkedIn
              </a>
              <span className="text-white/45 select-none font-medium" aria-hidden="true">·</span>
              <a
                href="https://www.instagram.com/alphainvestmentmanagement"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F5F1E8] transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
