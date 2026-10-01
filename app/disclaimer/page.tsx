import Link from "next/link";
import { ShieldCheck, AlertCircle, Scale, FileText } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <main className="w-full bg-ink text-ivory">
      {/* Editorial Header */}
      <section className="pt-40 pb-20 border-b border-white/[0.06] relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans">
              Regulatory Disclosure
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl font-normal leading-[1.05] tracking-tight">
              Statutory Governance & Disclaimers.
            </h1>
            <p className="text-base text-slate-300 font-light leading-relaxed max-w-2xl font-sans">
              Alpha Investment Management operates under the regulatory supervision of the Securities and Exchange Board of India (SEBI) and BSE Administration & Supervision Ltd (BASL).
            </p>
          </div>
        </div>
      </section>

      {/* Disclosures Content (Warm Ivory Section for high legibility) */}
      <section className="bg-ivory text-ink py-24 lg:py-28">
        <div className="container mx-auto px-6 max-w-5xl space-y-12 font-sans">
          
          {/* Statutory Alert Card */}
          <div className="p-8 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2.5 text-amber-900 font-semibold text-sm">
              <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <span>Mandatory SEBI Investor Warning</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed font-sans">
              "Investment in securities market are subject to market risks. Read all the related documents carefully before investing. Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors."
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-ink font-semibold">
              1. Fiduciary Entity & Registration Status
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Alpha Investment Management is a professional investment advisory entity established in Pune, Maharashtra in 2019, operating as a SEBI Registered Investment Advisor (RIA) pursuant to the Securities and Exchange Board of India (Investment Advisers) Regulations, 2013. The entity is further accredited by BSE Administration & Supervision Limited (BASL).
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-ink font-semibold">
              2. Fee-Only Fiduciary Model & Zero Commission Policy
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              In rigorous adherence to SEBI norms, Alpha Investment Management accepts strictly no commissions, distribution incentives, referral kickbacks, or retrocessions from asset management companies, mutual funds, insurance houses, or depository participants. Our remuneration is derived entirely from transparent advisory fees agreed in writing with our clients prior to commencement of services.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-ink font-semibold">
              3. Absence of Guaranteed Returns
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              All financial strategies, asset allocations, model portfolios, and financial plans provided by Alpha Investment Management are opinions based on quantitative analysis and financial theory. Under no circumstances do we guarantee or assure specific return targets, capital protection, or immunity from market losses. Past performance metrics are informational only and cannot be construed as predictive of future performance.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-ink font-semibold">
              4. Client Demat & Custody Segregation
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Alpha Investment Management does not hold custody of client funds or securities. All execution of investment advice occurs directly within client-owned demat and bank accounts held with SEBI-registered custodians and banks. Clients retain absolute and unilateral ownership and withdrawal rights at all times.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-ink font-semibold">
              5. Grievance Redressal & Regulatory Recourse
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Client satisfaction and compliance integrity are our highest priority. In case of any query or unresolved grievance, clients may write directly to our principal compliance officer at <a href="mailto:alphainvestmentmnt@gmail.com" className="text-gold font-medium underline">alphainvestmentmnt@gmail.com</a>. If the grievance is not addressed satisfactorily within 30 days, clients may lodge a dispute through the SEBI Complaints Redress System (SCORES) at <span className="font-mono text-xs">scores.gov.in</span> or through the SEBI SMART ODR Portal at <span className="font-mono text-xs">smartodr.in</span>.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-4 pt-4 border-t border-black/[0.08]" id="privacy">
            <h2 className="font-serif text-2xl text-ink font-semibold">
              6. Privacy & Non-Disclosure Covenants
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              We strictly maintain confidentiality regarding all personal, demographic, and financial information disclosed by prospective or active clients. Client financial data is never sold, leased, or distributed to any third-party marketing entities, and is accessed exclusively by authorized investment advisory personnel for the purpose of financial analysis and portfolio stewardship.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
