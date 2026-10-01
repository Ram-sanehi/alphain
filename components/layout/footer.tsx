"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Feature flag: Hide Insurance Mall until subdomain is live
const SHOW_INSURANCE_MALL = process.env.NEXT_PUBLIC_ENABLE_INSURANCE_MALL === "true";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-[#070B14] text-[#F5F1E8] relative select-none">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl">
        
        {/* ROW 1: Statement + Newsletter (Top-Aligned) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-20 lg:pt-24 pb-12 lg:pb-16 items-start">
          
          {/* Left: Statement */}
          <div className="lg:col-span-7">
            <h2 className="font-serif font-normal text-[clamp(2.1rem,3.6vw,3.25rem)] leading-[1.15] text-[#F5F1E8] [text-wrap:balance]">
              Independent advice, built for the long term.
            </h2>
          </div>

          {/* Right: Newsletter Block with Dedicated 50px Input Field & Gold Button */}
          <div className="lg:col-span-5 flex flex-col justify-start pt-1.5 lg:pt-2">
            <span className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#D0D7E2] font-semibold block mb-3.5">
              Investment notes
            </span>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="h-[50px] w-full px-4 rounded-md bg-white/[0.04] border border-white/15 text-[15px] font-sans font-light text-[#F5F1E8] placeholder:text-[#9AA3B2]/60 focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B] focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="h-[50px] px-6 rounded-md bg-[#C9A24B] hover:bg-[#DCB862] text-[#070B14] font-sans font-semibold text-xs uppercase tracking-[0.14em] transition-all duration-200 shadow-md flex items-center justify-center shrink-0 focus-visible:ring-2 focus-visible:ring-[#C9A24B] focus-visible:outline-none cursor-pointer"
                >
                  {subscribed ? "Subscribed ✓" : "Subscribe →"}
                </button>
              </div>
              <p className="font-sans text-[13px] text-[#A8B0BD] leading-[1.7]">
                We send periodic notes. Unsubscribe anytime. See our{" "}
                <Link
                  href="/disclaimer#privacy"
                  className="underline hover:text-[#F5F1E8] transition-colors focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </div>

        </div>

        {/* ROW 2: Restructured Link Area */}
        <div className="border-t border-white/10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 lg:gap-8 xl:gap-10 items-start">
            
            {/* Left Brand Block (at least 340px on desktop) */}
            <div className="w-full lg:w-[340px] space-y-4">
              <div className="flex items-center gap-3 h-[36px]">
                <Image
                  src="/logo-circular1.png"
                  alt="Alpha Investment Management"
                  width={36}
                  height={36}
                  className="w-[36px] h-[36px] object-contain shrink-0"
                />
                <span className="font-sans font-medium text-[17px] text-[#F5F1E8] tracking-tight leading-none whitespace-nowrap">
                  Alpha Investment Management
                </span>
              </div>

              <div className="font-sans text-[12.5px] sm:text-[13px] text-[#A8B0BD] leading-[1.7]">
                <div className="space-y-1.5">
                  <p className="whitespace-nowrap">
                    SEBI Registered Investment Adviser · INA000017348
                  </p>
                  <p>BASL Membership No. 1982</p>
                  <p>Registration validity: Perpetual</p>
                </div>
                <div className="mt-3.5 space-y-0.5">
                  <p>Shop No 2, 1st Floor, Mahalungekar Complex,</p>
                  <p>Chakan{'\u2011'}Talegaon Highway, Chakan, Pune, Maharashtra 410501</p>
                </div>
              </div>
            </div>

            {/* Right 4 Link Columns (single column mobile, 2x2 tablet, 4 equal columns desktop) */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 sm:gap-6 xl:gap-6 items-start">
                
                {/* Firm */}
                <div>
                  <div className="h-[36px] flex items-center mb-5">
                    <span className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#D0D7E2] font-semibold">
                      Firm
                    </span>
                  </div>
                  <ul className="flex flex-col gap-[14px]">
                    <li>
                      <Link
                        href="/about"
                        className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about#approach"
                        className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                      >
                        Our Approach
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about#team"
                        className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                      >
                        Team
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
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
                          className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] inline-flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
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

                {/* Advisory */}
                <div>
                  <div className="h-[36px] flex items-center mb-5">
                    <span className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#D0D7E2] font-semibold">
                      Advisory
                    </span>
                  </div>
                  <ul className="flex flex-col gap-[14px]">
                    <li>
                      <Link
                        href="/services"
                        className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                      >
                        All Capabilities
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/services#calculators"
                        className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                      >
                        Calculators
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/services#risk"
                        className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                      >
                        Risk Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/services#insights"
                        className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                      >
                        Insights
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <div className="h-[36px] flex items-center mb-5">
                    <span className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#D0D7E2] font-semibold">
                      Resources
                    </span>
                  </div>
                  <ul className="flex flex-col gap-[14px]">
                    <li>
                      <a
                        href="https://reporting.alphaaim.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] inline-flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                      >
                        <span>Client Reporting Portal</span>
                        <span className="text-[13px] text-[#C9A24B] font-medium leading-none" aria-hidden="true">
                          ↗
                        </span>
                      </a>
                    </li>
                    <li>
                      <Link
                        href="/disclaimer"
                        className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                      >
                        Investor Charter
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/services#downloads"
                        className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                      >
                        Downloads
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Governance */}
                <div>
                  <div className="h-[36px] flex items-center mb-5">
                    <span className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#D0D7E2] font-semibold">
                      Governance
                    </span>
                  </div>
                  <ul className="flex flex-col gap-[14px]">
                    <li>
                      <a
                        href="https://scores.sebi.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] inline-flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
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
                        className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] inline-flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                      >
                        <span>SMART ODR</span>
                        <span className="text-[13px] text-[#C9A24B] font-medium leading-none" aria-hidden="true">
                          ↗
                        </span>
                      </a>
                    </li>
                    <li>
                      <Link
                        href="/disclaimer#grievance"
                        className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                      >
                        Grievance Redressal
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/disclaimer#empanelment"
                        className="font-sans text-[14px] text-[#A8B0BD] hover:text-[#C9A24B] hover:underline underline-offset-4 transition-colors duration-200 leading-[1.5] whitespace-nowrap focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
                      >
                        Regulatory Empanelment
                      </Link>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ROW 3: Statutory Disclosure Card (Subtle Container, 24px Padding, 4px Radius, 2px Gold Left Border) */}
        <div className="border-t border-white/10 pt-10 pb-12">
          <div className="rounded-[4px] p-6 bg-white/[0.03] border border-white/[0.08] border-l-2 border-l-[#C9A24B]">
            <span className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#D0D7E2] font-semibold block mb-3">
              Statutory disclosure
            </span>
            <div className="font-sans text-[13px] text-[#A8B0BD] leading-[1.7] space-y-2">
              <p>
                Principal Officer &amp; CIO: Nageshwar Prasad. Grievance Officer: Advocate Rajat Diwan.
              </p>
              <p>
                <strong className="font-semibold text-[#F5F1E8]">
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

        {/* ROW 4: Bottom bar (Right-aligned to grid, generous spacing and clear separators) */}
        <div className="border-t border-white/10 py-8 pb-16 md:pb-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-[13px] font-sans text-[#A8B0BD] w-full">
            {/* Left: Copyright */}
            <p>© 2026 Alpha Investment Management. All rights reserved.</p>

            {/* Right: Text links right-aligned with clear separators */}
            <div className="flex flex-wrap items-center justify-start sm:justify-end gap-x-4 gap-y-2">
              <Link
                href="/disclaimer#privacy"
                className="hover:text-[#F5F1E8] transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
              >
                Privacy Policy
              </Link>
              <span className="text-white/45 select-none font-medium" aria-hidden="true">·</span>
              <Link
                href="/disclaimer#terms"
                className="hover:text-[#F5F1E8] transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-[#C9A24B] rounded-sm"
              >
                Terms
              </Link>
              <span className="text-white/45 select-none font-medium" aria-hidden="true">·</span>
              <Link
                href="/disclaimer"
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
