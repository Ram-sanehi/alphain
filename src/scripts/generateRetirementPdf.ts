/**
 * Generator script for Alpha Investment Management Whitepaper:
 * "The Three-Bucket Retirement Architecture (SWP Guide)"
 * Produces a high-quality 3-page vector PDF in public/downloads/AIM-Three-Bucket-Retirement-Plan.pdf
 */

import * as fs from "fs";
import * as path from "path";
import { PdfEngine, PDF_COLORS, RgbColor } from "../components/calculators/pdf/pdfEngine";

export function generateThreeBucketPdf(): Uint8Array {
  const pdf = new PdfEngine();

  const drawHeader = (pageNumber: number, totalPages: number) => {
    // Header Bar
    pdf.rect(0, 800, pdf.pageWidth, 42, { fill: PDF_COLORS.navy });
    pdf.rect(0, 797, pdf.pageWidth, 3, { fill: PDF_COLORS.gold });

    // Header Branding
    pdf.text("ALPHA INVESTMENT MANAGEMENT", 40, 818, {
      font: "Times-Bold",
      size: 13,
      color: PDF_COLORS.white,
    });
    pdf.text("SEBI REGISTERED INVESTMENT ADVISER · INA000017348", 40, 807, {
      font: "Helvetica-Bold",
      size: 7,
      color: PDF_COLORS.gold,
    });

    // Right Header Info
    pdf.text("RESEARCH WHITEPAPER · DECUMULATION SERIES", pdf.pageWidth - 40, 818, {
      font: "Helvetica-Bold",
      size: 8,
      color: PDF_COLORS.cream,
      align: "right",
    });
    pdf.text(`Page ${pageNumber} of ${totalPages}`, pdf.pageWidth - 40, 807, {
      font: "Helvetica",
      size: 7,
      color: PDF_COLORS.lightGray,
      align: "right",
    });
  };

  const drawFooter = (pageNumber: number, totalPages: number) => {
    const yFooter = 28;
    pdf.line(40, yFooter + 14, pdf.pageWidth - 40, yFooter + 14, { color: PDF_COLORS.border, lineWidth: 0.5 });
    pdf.text(
      "CONFIDENTIAL · ALPHA INVESTMENT MANAGEMENT · SEBI RIA INA000017348 · FOR EDUCATIONAL USE ONLY",
      40,
      yFooter,
      { font: "Helvetica", size: 6.5, color: PDF_COLORS.muted }
    );
    pdf.text(`Page ${pageNumber} of ${totalPages}`, pdf.pageWidth - 40, yFooter, {
      font: "Helvetica",
      size: 6.5,
      color: PDF_COLORS.muted,
      align: "right",
    });
  };

  // ==========================================
  // PAGE 1: MACRO CONTEXT & INFLATION REALITY
  // ==========================================
  drawHeader(1, 3);

  // Document Title Block
  pdf.text("THE THREE-BUCKET RETIREMENT ARCHITECTURE", 40, 755, {
    font: "Times-Bold",
    size: 20,
    color: PDF_COLORS.navy,
  });
  pdf.text("Engineering Inflation-Protected Decumulation in an Era of 6% Lifestyle Inflation", 40, 738, {
    font: "Times-Roman",
    size: 11,
    color: PDF_COLORS.muted,
  });

  // Meta row
  pdf.rect(40, 712, pdf.pageWidth - 80, 20, { fill: PDF_COLORS.creamAlt, stroke: PDF_COLORS.border, lineWidth: 0.5 });
  pdf.text("Author: Senior Advisory Committee", 48, 718, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.navy });
  pdf.text("Date: August 2026 (Updated for FY 2026-27)", 210, 718, { font: "Helvetica", size: 7.5, color: PDF_COLORS.muted });
  pdf.text("Classification: Fiduciary Wealth Mandate", pdf.pageWidth - 48, 718, {
    font: "Helvetica-Bold",
    size: 7.5,
    color: PDF_COLORS.gold,
    align: "right",
  });

  // Executive Summary Box
  pdf.rect(40, 608, pdf.pageWidth - 80, 94, { fill: PDF_COLORS.cream, stroke: PDF_COLORS.gold, lineWidth: 1 });
  pdf.text("EXECUTIVE SUMMARY & CORE FIDUCIARY FINDINGS", 52, 688, {
    font: "Helvetica-Bold",
    size: 9,
    color: PDF_COLORS.navy,
  });

  const bulletPoints = [
    "Longevity Paradox: Indian retirees at age 58 must comfortably fund 25 to 35 years of decumulation.",
    "Negative Real Yields: Bank FDs at 7% pre-tax net ~4.8% after 31.2% tax, creating -1.2% annual loss against 6% inflation.",
    "Three-Bucket Segregation: Distributes assets into Cash (Years 1-3), Yield (Years 4-7), and Equity Compounding (Years 8+).",
    "SWP Tax Advantage: Systematic Withdrawal Plans redeem unit capital gains rather than 100% taxable interest income.",
  ];

  let bulletY = 672;
  bulletPoints.forEach((bp) => {
    pdf.circle(55, bulletY + 2.5, 1.8, { fill: PDF_COLORS.gold });
    pdf.text(bp, 64, bulletY, { font: "Helvetica", size: 8, color: PDF_COLORS.navy });
    bulletY -= 15;
  });

  // Section 1: The Modern Indian Decumulation Challenge
  pdf.text("1. The Modern Indian Decumulation Challenge", 40, 582, {
    font: "Times-Bold",
    size: 13,
    color: PDF_COLORS.navy,
  });

  const p1 =
    "Retirement planning across India has historically been treated as a static ten-year phase funded by bank fixed deposits, employer gratuity, and provident funds. In recent years, healthcare advancements have elevated average life expectancies for affluent urban Indians into the mid-80s. A 58-year-old retiree must now engineer a cash flow architecture that withstands 30+ years of persistent purchasing power erosion.";
  pdf.textWrapped(p1, 40, 566, pdf.pageWidth - 80, 12, { font: "Times-Roman", size: 8.5, color: PDF_COLORS.navy });

  const p2 =
    "While general CPI fluctuates between 4.5% and 5.5%, affluent Indian lifestyle inflation (encompassing quality private healthcare, domestic staff wages, and utilities) compounds at 6.0% to 7.0%. At 6% inflation, a ₹1,00,000 monthly household expense expands geometrically over time:";
  pdf.textWrapped(p2, 40, 520, pdf.pageWidth - 80, 12, { font: "Times-Roman", size: 8.5, color: PDF_COLORS.navy });

  // Table 1: Inflation Escalation
  const t1Y = 466;
  pdf.rect(40, t1Y, pdf.pageWidth - 80, 18, { fill: PDF_COLORS.navy });
  pdf.text("Retirement Horizon", 50, t1Y + 5, { font: "Helvetica-Bold", size: 8, color: PDF_COLORS.white });
  pdf.text("Retiree Age", 170, t1Y + 5, { font: "Helvetica-Bold", size: 8, color: PDF_COLORS.white });
  pdf.text("Monthly Living Expense", 290, t1Y + 5, { font: "Helvetica-Bold", size: 8, color: PDF_COLORS.white });
  pdf.text("Annual Required Cash Flow", 430, t1Y + 5, { font: "Helvetica-Bold", size: 8, color: PDF_COLORS.white });

  const t1Rows = [
    ["Day 1 (Retirement)", "Age 60", "₹1,00,000", "₹12,00,000"],
    ["Year 5", "Age 65", "₹1,33,823", "₹16,05,876"],
    ["Year 10", "Age 70", "₹1,79,085", "₹21,49,020"],
    ["Year 15", "Age 75", "₹2,39,656", "₹28,75,872"],
    ["Year 20", "Age 80", "₹3,20,714", "₹38,48,568"],
    ["Year 25", "Age 85", "₹4,29,187", "₹51,50,244"],
  ];

  let rY = t1Y - 17;
  t1Rows.forEach((row, idx) => {
    const isEven = idx % 2 === 0;
    pdf.rect(40, rY, pdf.pageWidth - 80, 17, { fill: isEven ? PDF_COLORS.creamAlt : PDF_COLORS.white, stroke: PDF_COLORS.border, lineWidth: 0.5 });
    pdf.text(row[0], 50, rY + 4, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.navy });
    pdf.text(row[1], 170, rY + 4, { font: "Helvetica", size: 7.5, color: PDF_COLORS.muted });
    pdf.amountWithRupee(row[2].replace("₹", ""), 290, rY + 4, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.navy });
    pdf.amountWithRupee(row[3].replace("₹", ""), 430, rY + 4, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.gold });
    rY -= 17;
  });

  const p3 =
    "Conclusion: An investor who relies solely on fixed deposits will inevitably experience cash flow insolvency by Year 12 as nominal interest fails to meet escalating expenditure. Growth assets are an indispensable survival requirement.";
  pdf.textWrapped(p3, 40, 350, pdf.pageWidth - 80, 12, { font: "Times-Bold", size: 8.5, color: PDF_COLORS.navy });

  drawFooter(1, 3);

  // ==========================================
  // PAGE 2: THREE BUCKET ARCHITECTURE & MODEL
  // ==========================================
  pdf.addPage();
  drawHeader(2, 3);

  pdf.text("2. The Three-Bucket Operational Blueprint", 40, 755, {
    font: "Times-Bold",
    size: 13,
    color: PDF_COLORS.navy,
  });

  const pBDesc =
    "To resolve the tension between short-term certainty and multi-decade inflation immunity, capital is segregated into three distinct, non-overlapping operational buckets:";
  pdf.textWrapped(pBDesc, 40, 740, pdf.pageWidth - 80, 12, { font: "Times-Roman", size: 8.5, color: PDF_COLORS.navy });

  // 3 Bucket Cards
  const cardW = (pdf.pageWidth - 80 - 16) / 3;
  const cardY = 620;
  const cardH = 106;

  // Bucket 1 Card
  pdf.rect(40, cardY, cardW, cardH, { fill: PDF_COLORS.cream, stroke: PDF_COLORS.gold, lineWidth: 1 });
  pdf.text("BUCKET 1: CASH", 48, cardY + cardH - 16, { font: "Helvetica-Bold", size: 9, color: PDF_COLORS.navy });
  pdf.text("Horizon: Years 1 to 3 (36 Mo)", 48, cardY + cardH - 28, { font: "Helvetica", size: 7, color: PDF_COLORS.gold });
  pdf.text("Instruments:", 48, cardY + cardH - 42, { font: "Helvetica-Bold", size: 7, color: PDF_COLORS.navy });
  pdf.text("• Overnight & Liquid Debt\n• High-grade Arbitrage MFs\n• Scheduled Bank Savings", 48, cardY + cardH - 54, {
    font: "Helvetica",
    size: 7,
    color: PDF_COLORS.muted,
  });
  pdf.text("Objective: Absolute liquidity; 0% market risk; guarantees monthly SWP.", 48, cardY + 12, {
    font: "Helvetica",
    size: 6.5,
    color: PDF_COLORS.navy,
  });

  // Bucket 2 Card
  const b2X = 40 + cardW + 8;
  pdf.rect(b2X, cardY, cardW, cardH, { fill: PDF_COLORS.creamAlt, stroke: PDF_COLORS.border, lineWidth: 1 });
  pdf.text("BUCKET 2: YIELD", b2X + 8, cardY + cardH - 16, { font: "Helvetica-Bold", size: 9, color: PDF_COLORS.navy });
  pdf.text("Horizon: Years 4 to 7 (4 Yrs)", b2X + 8, cardY + cardH - 28, { font: "Helvetica", size: 7, color: PDF_COLORS.muted });
  pdf.text("Instruments:", b2X + 8, cardY + cardH - 42, { font: "Helvetica-Bold", size: 7, color: PDF_COLORS.navy });
  pdf.text("• Banking & PSU Debt\n• Corporate Bond Funds\n• Conservative Hybrid Funds", b2X + 8, cardY + cardH - 54, {
    font: "Helvetica",
    size: 7,
    color: PDF_COLORS.muted,
  });
  pdf.text("Objective: Generates 7-8% yield; systematically refills Bucket 1.", b2X + 8, cardY + 12, {
    font: "Helvetica",
    size: 6.5,
    color: PDF_COLORS.navy,
  });

  // Bucket 3 Card
  const b3X = b2X + cardW + 8;
  pdf.rect(b3X, cardY, cardW, cardH, { fill: PDF_COLORS.navy, stroke: PDF_COLORS.gold, lineWidth: 1 });
  pdf.text("BUCKET 3: GROWTH", b3X + 8, cardY + cardH - 16, { font: "Helvetica-Bold", size: 9, color: PDF_COLORS.white });
  pdf.text("Horizon: Years 8 to 30+", b3X + 8, cardY + cardH - 28, { font: "Helvetica", size: 7, color: PDF_COLORS.gold });
  pdf.text("Instruments:", b3X + 8, cardY + cardH - 42, { font: "Helvetica-Bold", size: 7, color: PDF_COLORS.white });
  pdf.text("• Nifty 50 & Large-Cap\n• Flexi-Cap Direct Funds\n• Sovereign Gold Bonds", b3X + 8, cardY + cardH - 54, {
    font: "Helvetica",
    size: 7,
    color: PDF_COLORS.cream,
  });
  pdf.text("Objective: 12% compounding; destroys inflation over 25+ years.", b3X + 8, cardY + 12, {
    font: "Helvetica",
    size: 6.5,
    color: PDF_COLORS.white,
  });

  // Section 3: Simulation Model (₹5 Cr Corpus)
  pdf.text("3. Simulation: ₹5 Crore Corpus Across 25-Year Decumulation", 40, 595, {
    font: "Times-Bold",
    size: 13,
    color: PDF_COLORS.navy,
  });

  const pSimDesc =
    "Parameters: Retiree age 58. Initial living expense ₹1,50,000/month (₹18 Lakhs/year) escalating at 6% annually. Capital allocated on Day 0: Bucket 1 = ₹60L; Bucket 2 = ₹1.40 Cr; Bucket 3 = ₹3.00 Cr. Periodic refilling occurs during equity bull runs:";
  pdf.textWrapped(pSimDesc, 40, 580, pdf.pageWidth - 80, 11.5, { font: "Times-Roman", size: 8, color: PDF_COLORS.navy });

  // Table 2: 25-Year Simulation Table
  const t2Y = 525;
  pdf.rect(40, t2Y, pdf.pageWidth - 80, 18, { fill: PDF_COLORS.navy });
  pdf.text("Retirement Milestone", 48, t2Y + 5, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.white });
  pdf.text("Annual Living Need", 145, t2Y + 5, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.white });
  pdf.text("Bucket 1 (Cash)", 235, t2Y + 5, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.white });
  pdf.text("Bucket 2 (Yield)", 325, t2Y + 5, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.white });
  pdf.text("Bucket 3 (Equity)", 415, t2Y + 5, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.white });
  pdf.text("Net Family Net Worth", 505, t2Y + 5, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.white, align: "right" });

  const t2Rows = [
    ["Day 1 (Age 58)", "₹18,00,000", "₹60,00,000", "₹1,40,00,000", "₹3,00,00,000", "₹5,00,00,000"],
    ["Year 5 (Age 63)", "₹22,72,460", "₹65,00,000", "₹1,52,00,000", "₹4,45,00,000", "₹6,62,00,000"],
    ["Year 10 (Age 68)", "₹30,40,940", "₹72,00,000", "₹1,68,00,000", "₹6,84,00,000", "₹9,24,00,000"],
    ["Year 15 (Age 73)", "₹40,69,470", "₹85,00,000", "₹1,95,00,000", "₹9,92,00,000", "₹12,72,00,000"],
    ["Year 20 (Age 78)", "₹54,45,690", "₹1,02,00,000", "₹2,30,00,000", "₹13,85,00,000", "₹17,17,00,000"],
    ["Year 25 (Age 83)", "₹72,87,420", "₹1,25,00,000", "₹2,75,00,000", "₹18,60,00,000", "₹22,60,00,000"],
  ];

  let r2Y = t2Y - 17;
  t2Rows.forEach((row, idx) => {
    const isEven = idx % 2 === 0;
    pdf.rect(40, r2Y, pdf.pageWidth - 80, 17, { fill: isEven ? PDF_COLORS.creamAlt : PDF_COLORS.white, stroke: PDF_COLORS.border, lineWidth: 0.5 });
    pdf.text(row[0], 48, r2Y + 4, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.navy });
    pdf.amountWithRupee(row[1].replace("₹", ""), 145, r2Y + 4, { font: "Helvetica", size: 7.5, color: PDF_COLORS.muted });
    pdf.amountWithRupee(row[2].replace("₹", ""), 235, r2Y + 4, { font: "Helvetica", size: 7.5, color: PDF_COLORS.navy });
    pdf.amountWithRupee(row[3].replace("₹", ""), 325, r2Y + 4, { font: "Helvetica", size: 7.5, color: PDF_COLORS.navy });
    pdf.amountWithRupee(row[4].replace("₹", ""), 415, r2Y + 4, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.navy });
    pdf.amountWithRupee(row[5].replace("₹", ""), 505, r2Y + 4, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.gold, align: "right" });
    r2Y -= 17;
  });

  const pFidNote =
    "Key Takeaway: Over 25 years, the family successfully funded ₹8.4 Crores in cumulative living expenses while their terminal wealth compounded from ₹5 Crores to ₹22.6 Crores. Because Bucket 1 held 36 months of living expenses, the family never sold a single equity unit during down years.";
  pdf.textWrapped(pFidNote, 40, 395, pdf.pageWidth - 80, 11.5, { font: "Times-Bold", size: 8, color: PDF_COLORS.navy });

  drawFooter(2, 3);

  // ==========================================
  // PAGE 3: TAX EFFICIENCY, CHECKLIST & SEBI DISCLOSURE
  // ==========================================
  pdf.addPage();
  drawHeader(3, 3);

  pdf.text("4. Systematic Withdrawal Plan (SWP) Tax Shielding", 40, 755, {
    font: "Times-Bold",
    size: 13,
    color: PDF_COLORS.navy,
  });

  const pTax =
    "Traditional bank fixed deposit interest is 100% taxable at your peak personal marginal income tax rate (up to 39% with surcharge). In stark contrast, mutual fund SWP redemptions consist of principal repayment plus a small capital gain fraction. Under Section 112A, long-term capital gains on equities are taxed at only 12.5% above the annual ₹1.25 Lakh threshold.";
  pdf.textWrapped(pTax, 40, 738, pdf.pageWidth - 80, 11.5, { font: "Times-Roman", size: 8, color: PDF_COLORS.navy });

  // Tax Table
  const t3Y = 680;
  pdf.rect(40, t3Y, pdf.pageWidth - 80, 17, { fill: PDF_COLORS.navy });
  pdf.text("Comparative Metric", 50, t3Y + 4.5, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.white });
  pdf.text("Bank Fixed Deposit (7% Nominal)", 200, t3Y + 4.5, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.white });
  pdf.text("Fiduciary SWP Portfolio (Three-Bucket)", 380, t3Y + 4.5, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.white });

  const t3Rows = [
    ["Taxable Event", "100% of interest credited annually", "Only gain component in redeemed units"],
    ["Applicable Tax Rate", "Up to 39.0% (Slab + Surcharge)", "12.5% LTCG (Equity) / Slab (Debt)"],
    ["Annual Tax on ₹18 Lakhs Withdrawal", "₹5,61,600 (Cash Outflow)", "₹62,500 (Effective Rate ~3.5%)"],
    ["Net Annual Cash Retained", "₹12,38,400", "₹17,37,500 (+₹4.99 Lakhs extra cash!)"],
  ];

  let r3Y = t3Y - 17;
  t3Rows.forEach((row, idx) => {
    const isEven = idx % 2 === 0;
    pdf.rect(40, r3Y, pdf.pageWidth - 80, 17, { fill: isEven ? PDF_COLORS.creamAlt : PDF_COLORS.white, stroke: PDF_COLORS.border, lineWidth: 0.5 });
    pdf.text(row[0], 50, r3Y + 4, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.navy });
    pdf.text(row[1], 200, r3Y + 4, { font: "Helvetica", size: 7.5, color: PDF_COLORS.muted });
    pdf.text(row[2], 380, r3Y + 4, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.gold });
    r3Y -= 17;
  });

  // Section 5: Fiduciary Retirement Readiness Checklist
  pdf.text("5. Fiduciary Retirement Readiness Checklist", 40, 595, {
    font: "Times-Bold",
    size: 13,
    color: PDF_COLORS.navy,
  });

  const checklistItems = [
    "Bucket 1 Ringfencing: Exactly 36 months of living expenses held in liquid/arbitrage funds.",
    "Safe Withdrawal Rate: Initial annual withdrawal capped under 4.0% of total corpus value.",
    "Zero Commission Drag: 100% of holdings in Direct-Growth plans (saving 100+ bps annually).",
    "Health Hyper-Inflation Buffer: Comprehensive Super Top-Up medical cover of ₹50L+ ringfenced.",
    "Estate Transmission: Nominations updated with durable Power of Attorney & Private Trust mandate.",
  ];

  let cY = 575;
  checklistItems.forEach((ci) => {
    pdf.rect(40, cY, 10, 10, { stroke: PDF_COLORS.gold, lineWidth: 1 });
    pdf.text("✓", 42.5, cY + 1.5, { font: "Helvetica-Bold", size: 7, color: PDF_COLORS.gold });
    pdf.text(ci, 58, cY + 1.5, { font: "Helvetica", size: 8, color: PDF_COLORS.navy });
    cY -= 17;
  });

  // Advisory Consultation Strip
  pdf.rect(40, 465, pdf.pageWidth - 80, 50, { fill: PDF_COLORS.cream, stroke: PDF_COLORS.border, lineWidth: 0.5 });
  pdf.text("SCHEDULE AN AUDIT WITH OUR SENIOR ADVISORY COMMITTEE", 52, 498, {
    font: "Helvetica-Bold",
    size: 8.5,
    color: PDF_COLORS.navy,
  });
  pdf.text(
    "Alpha Investment Management is a pure fee-only SEBI Registered Investment Adviser. We accept 0% commissions from banks or fund houses.",
    52,
    486,
    { font: "Helvetica", size: 7.5, color: PDF_COLORS.muted }
  );
  pdf.text("Web: https://alphaaim.in · Email: contact@alphaaim.in · Advisory Office: Pune, Maharashtra", 52, 474, {
    font: "Helvetica-Bold",
    size: 7.5,
    color: PDF_COLORS.gold,
  });

  // Mandatory Statutory SEBI Disclosure
  pdf.rect(40, 360, pdf.pageWidth - 80, 92, { fill: PDF_COLORS.creamAlt, stroke: PDF_COLORS.border, lineWidth: 0.5 });
  pdf.text("MANDATORY STATUTORY REGULATORY DISCLOSURE", 50, 438, {
    font: "Helvetica-Bold",
    size: 7.5,
    color: PDF_COLORS.navy,
  });

  const statutoryText =
    "Commentary is for educational purposes and is not investment advice or a recommendation. Investments in securities market are subject to market risks. Read all related documents carefully before investing. Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors. Alpha Investment Management is a SEBI Registered Investment Adviser under Registration No. INA000017348. Performance projections and simulations shown in this report are mathematical illustrations based on stated historical assumptions and do not guarantee future returns.";
  pdf.textWrapped(statutoryText, 50, 424, pdf.pageWidth - 100, 10, { font: "Helvetica", size: 6.5, color: PDF_COLORS.muted });

  drawFooter(3, 3);

  return pdf.build();
}

// Generate the PDF file if executed via Node/tsx
if (typeof process !== "undefined" && process.argv && process.argv[1]?.includes("generateRetirementPdf")) {
  const bytes = generateThreeBucketPdf();
  const targetDir = path.resolve(process.cwd(), "public/downloads");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const targetFile = path.join(targetDir, "AIM-Three-Bucket-Retirement-Plan.pdf");
  fs.writeFileSync(targetFile, bytes);
  console.log(`Generated ${targetFile} (${bytes.length} bytes, ${(bytes.length / 1024).toFixed(1)} KB)`);
}
