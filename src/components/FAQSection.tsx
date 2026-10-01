import { useState } from "react";
import { Link } from "react-router-dom";

export interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is a SEBI Registered Investment Adviser?",
    answer:
      "A SEBI Registered Investment Adviser (RIA) is licensed by the Securities and Exchange Board of India under the SEBI (Investment Advisers) Regulations, 2013. RIAs are required to act in the client's interest and to disclose fees and conflicts of interest. Alpha Investment Management holds SEBI Registration No. INA000017348.",
  },
  {
    question: "How do you charge for your advisory services?",
    answer:
      "We operate on a transparent, fee-only model. Our advisory fees are charged directly to you — either as a fixed annual retainer or as an agreed percentage of assets under advisory (AUA). We do not accept distributor commissions, trail fees, or referral incentives from product manufacturers, ensuring our recommendations are aligned with your family's objectives.",
  },
  {
    question: "What is the minimum portfolio size required to get started?",
    answer:
      "Our bespoke investment management services are typically tailored for portfolios starting at ₹25 Lakhs, allowing adequate multi-sector diversification and direct securities exposure. However, for comprehensive financial planning and estate advisory, we work with families at varying capital stages.",
  },
  {
    question: "Do you hold custody of client funds or securities?",
    answer:
      "No. We do not hold client assets or securities. Your investments remain securely in your own Demat and bank accounts with Tier-1 depositories (NSDL/CDSL). We operate purely on advisory mandates.",
  },
  {
    question: "How do you manage downside risk during volatile markets?",
    answer:
      "Our risk management framework aims to balance capital preservation with long-term compounding. We begin with a quantitative risk profile, then construct portfolios with non-correlated asset weights across equities, sovereign debt, and gold. We avoid leveraged speculation and use disciplined periodic rebalancing to manage volatility.",
  },
  {
    question: "How does tax-efficient planning improve returns?",
    answer:
      "Taxes represent a significant drag on net investment returns. We optimize asset location across taxable and tax-advantaged accounts, systematically execute tax-loss harvesting before fiscal year-end where suitable to offset capital gains, and align deductions under applicable sections of the Income Tax Act.",
  },
  {
    question: "How frequently will our family portfolio be reviewed?",
    answer:
      "You receive monthly snapshot updates, formal quarterly performance reviews with attribution analysis, and an annual financial review. In addition, our advisory desk reaches out proactively during significant macroeconomic developments.",
  },
  {
    question: "How does an RIA differ from a bank relationship manager?",
    answer:
      "Bank relationship managers are typically employed to distribute in-house proprietary products and financial instruments. As an independent SEBI Registered Investment Adviser, we do not sell proprietary products or receive distributor sales incentives, ensuring our advice remains focused on your objectives.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Synchronized FAQPage JSON-LD Structured Data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      id="faqs"
      className="py-24 lg:py-32 bg-[#050811] text-[#F5F1E8] relative overflow-hidden border-t border-white/[0.08]"
      aria-labelledby="faq-section-heading"
    >
      {/* Injected FAQPage JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl relative z-10">
        
        {/* EDITORIAL ACCORDION GRID: 360px left column + 64px min gap + flexible right column */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Fixed max-width 360px with 48px padding-right, sticky top 110px */}
          <div className="w-full lg:w-[360px] lg:max-w-[360px] lg:pr-12 lg:sticky lg:top-[110px] self-start space-y-6 shrink-0">
            
            {/* Eyebrow: Plain gold small-caps Inter style */}
            <span className="font-sans text-xs sm:text-[13px] font-semibold uppercase tracking-[0.25em] text-[#C9A24B] block">
              FAQS
            </span>

            {/* Heading: clamp(1.75rem, 2.6vw, 2.5rem), line-height 1.15, text-wrap: balance, overflow-wrap: break-word */}
            <h2
              id="faq-section-heading"
              className="font-serif text-[clamp(1.75rem,2.6vw,2.5rem)] font-normal leading-[1.15] tracking-tight [text-wrap:balance] [overflow-wrap:break-word] break-words text-[#F5F1E8]"
              style={{ textWrap: "balance", overflowWrap: "break-word" }}
            >
              <span>Questions, answered</span>{" "}
              <span className="italic text-[#C9A24B] block">plainly.</span>
            </h2>

            {/* Intro paragraph: Inter 16px/1.7, text-muted-text, max-width 40ch */}
            <p className="font-sans text-[16px] leading-[1.7] text-muted-text font-light max-w-[40ch]">
              Straight answers on our licence, fees, risk approach and data security.
            </p>

            {/* Text link to consultation: #C9A24B at full opacity, underline on hover */}
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-sans font-medium text-[#C9A24B] hover:underline transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B] rounded-sm"
              >
                <span>Still have a question? Book a consultation</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: Single column of 8 questions, separated by 1px hairlines, padding 28px 0 */}
          <div className="w-full min-w-0">
            <div className="border-y border-white/[0.12] divide-y divide-white/[0.12]">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className={`py-6 sm:py-7 px-4 sm:px-6 -mx-4 sm:-mx-6 rounded-xl transition-all duration-300 ${
                      isOpen ? "bg-white/[0.03]" : "hover:bg-white/[0.015]"
                    }`}
                  >
                    
                    {/* Question Button: Serif 24px ivory (20px on mobile), rotates gold plus to minus */}
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      className="w-full flex items-center justify-between text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050811] rounded-sm py-1"
                    >
                      <span
                        className={`font-serif text-[20px] sm:text-[24px] font-normal leading-[1.3] transition-colors duration-200 tracking-tight pr-6 ${
                          isOpen ? "text-[#C9A24B]" : "text-[#F5F1E8] group-hover:text-[#C9A24B]"
                        }`}
                      >
                        {faq.question}
                      </span>

                      {/* Plain 16px Gold Plus/Minus Icon with crisp gold minus state */}
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                        <svg
                          className="w-4 h-4 text-[#C9A24B] shrink-0"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          aria-hidden="true"
                        >
                          <line x1="3" y1="8" x2="13" y2="8" />
                          <line
                            x1="8"
                            y1="3"
                            x2="8"
                            y2="13"
                            className="origin-center transition-all duration-300 ease-out"
                            style={{
                              transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                              opacity: isOpen ? 0 : 1,
                            }}
                          />
                        </svg>
                      </div>
                    </button>

                    {/* Answer Container: Height animates 350ms ease-out via grid-template-rows (0fr to 1fr) */}
                    <div
                      id={`faq-answer-${index}`}
                      className={`grid transition-[grid-template-rows] duration-350 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="pt-4 font-sans text-[16px] sm:text-[16.5px] leading-[1.75] text-muted-text font-light max-w-[62ch]">
                          {faq.answer}
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Footnote: Aligned with the left edge of the questions (x = list container left) */}
            <div className="pt-8">
              <p className="font-sans text-[13px] text-muted-text font-light leading-relaxed">
                Investments are subject to market risks.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
