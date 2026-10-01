/**
 * Report Disclaimers & Statutory Compliance Constants
 * Reused word-for-word across downloadable PDF reports.
 */

export const REPORT_DISCLAIMERS = {
  illustrativeDisclaimer:
    "ILLUSTRATIVE PROJECTION ONLY: Investment returns, inflation rates, and projections depicted in this report are hypothetical assumptions used solely to illustrate compounding and financial modeling concepts. They do not reflect actual past performance or guarantee future outcomes. Actual returns, market conditions, inflation, and tax liabilities will fluctuate over time. This report does not constitute personal financial, tax, or legal advice, nor does it establish an advisory relationship without an executed investment advisory agreement with Alpha Investment Management.",
  riskProfileDisclaimer:
    "INDICATIVE RISK PROFILING MANDATE: This risk assessment questionnaire provides an indicative risk tolerance score and asset allocation framework based strictly on self-reported answers. It is intended for preliminary financial planning and does not constitute a customized investment recommendation or advisory engagement. Formal investor suitability is established only through a comprehensive fiduciary agreement under SEBI (Investment Advisers) Regulations, 2013, following independent verification of family liabilities, liquidity buffers, and financial objectives.",
  principalOfficer:
    "Principal Officer & CIO: Nageshwar Prasad. Grievance Officer: Advocate Rajat Diwan.",
  marketRisk:
    "Investments in securities market are subject to market risks. Read all the related documents carefully before investing.",
  guaranteeDisclaimer:
    "Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.",
  registrationLine:
    "SEBI Registered Investment Adviser · INA000017348",
  baslLine:
    "BASL Membership No. 1982",
  validityLine:
    "Registration validity: Perpetual",
  statutoryCombined:
    "ZERO DISTRIBUTOR KICKBACKS · SEBI REGISTRATION INA000017348 · STRICTLY FEE-ONLY",
  address:
    "Shop No 2, 1st Floor, Mahalungekar Complex, Chakan-Talegaon Highway, Chakan, Pune, Maharashtra 410501",
  consultationUrl:
    "https://alphaaim.in/contact",
} as const;

export const riskProfileDisclaimer = {
  sebiRegistration: "INA000017348",
  statutoryCaveat: REPORT_DISCLAIMERS.riskProfileDisclaimer,
  marketRisk: REPORT_DISCLAIMERS.marketRisk,
  guaranteeDisclaimer: REPORT_DISCLAIMERS.guaranteeDisclaimer,
  principalOfficer: REPORT_DISCLAIMERS.principalOfficer,
  address: REPORT_DISCLAIMERS.address,
} as const;
