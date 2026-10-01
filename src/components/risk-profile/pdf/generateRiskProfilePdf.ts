/**
 * Alpha Investment Management - Client-Side Vector Risk Profile PDF Generator
 * Generates an institutional, A4 2-page vector PDF report containing:
 * - Page 1: Branded header, Report ID, IST Timestamp, Risk Score Gauge, Archetype,
 *           Indicative Asset Allocation breakdown, Dimension breakdown, and Suitability status.
 * - Page 2: Complete 10-question audit trail table, statutory SEBI RIA disclosures,
 *           advisory consultation block, and vector QR code.
 */

import { PdfEngine, PDF_COLORS, RgbColor } from "@/components/calculators/pdf/pdfEngine";
import { generateQrMatrix } from "@/utils/qrCode";
import { REPORT_DISCLAIMERS } from "@/constants/reportDisclaimers";
import {
  RiskProfileResult,
  RISK_QUESTIONS,
  DIMENSION_METADATA,
  FIDUCIARY_POLICY_CONSTANTS,
} from "@/constants/riskProfileConfig";

export async function generateRiskProfilePdf(
  result: RiskProfileResult,
  consultationUrl: string = "https://alphaaim.in/contact"
): Promise<{ blob: Blob; filename: string; bytes: Uint8Array }> {
  if (!result || !result.archetype) {
    throw new Error("Invalid risk profile result: missing archetype or score data");
  }

  const pdf = new PdfEngine();

  // Date in Asia/Kolkata IST
  const now = new Date();
  const dateFormatted = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(now);

  const timeFormatted = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(now);

  const timestampIst = `${dateFormatted}, ${timeFormatted} IST`;

  // ISO date for filename: YYYY-MM-DD
  const isoDate = now.toISOString().split("T")[0];
  const filename = `Alpha-Investment-Risk-Profile-${isoDate}.pdf`;

  // Deterministic Report ID
  const hash = Math.abs(
    Array.from(result.completedAtIso).reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 17)
  )
    .toString(16)
    .toUpperCase()
    .padStart(4, "0")
    .substring(0, 4);
  const reportId = `AIM-RP-${isoDate.replace(/-/g, "")}-${hash}`;

  const left = 40;
  const right = 555.28;
  const contentWidth = right - left; // 515.28 pt

  // ==========================================================================
  // PAGE 1: EXECUTIVE MANDATE & SUITABILITY PROFILE
  // ==========================================================================

  // 1. Top Masthead (Dark Header Banner)
  pdf.rect(0, 755, 595.28, 86.89, { fill: PDF_COLORS.navy });
  pdf.text("ALPHA INVESTMENT MANAGEMENT", left, 804, {
    font: "Times-Bold",
    size: 15,
    color: PDF_COLORS.white,
  });
  pdf.text(`SEBI REGISTERED INVESTMENT ADVISER · RIA INA000017348 · ${FIDUCIARY_POLICY_CONSTANTS.baslLine}`, left, 790, {
    font: "Helvetica-Bold",
    size: 7.2,
    color: PDF_COLORS.gold,
  });
  pdf.text("STRICTLY FEE-ONLY · FIDUCIARY SUITABILITY MANDATE", left, 778, {
    font: "Helvetica",
    size: 6.8,
    color: PDF_COLORS.lightGray,
  });

  // Masthead right-aligned metadata
  pdf.text("RISK SUITABILITY REPORT", right, 804, {
    font: "Times-Bold",
    size: 11,
    color: PDF_COLORS.gold,
    align: "right",
  });
  pdf.text(`Report ID: ${reportId}`, right, 790, {
    font: "Helvetica",
    size: 7,
    color: PDF_COLORS.lightGray,
    align: "right",
  });
  pdf.text(`Generated: ${timestampIst}`, right, 778, {
    font: "Helvetica",
    size: 7,
    color: PDF_COLORS.lightGray,
    align: "right",
  });

  // Thin Gold Border Line under Masthead
  pdf.line(0, 755, 595.28, 755, { color: PDF_COLORS.gold, lineWidth: 1.5 });

  // 2. Archetype Hero Banner Card
  const heroY = 650;
  pdf.rect(left, heroY, contentWidth, 92, {
    fill: PDF_COLORS.creamAlt,
    stroke: PDF_COLORS.border,
    lineWidth: 1,
  });

  // Gold accent left bar
  pdf.rect(left, heroY, 4, 92, { fill: PDF_COLORS.gold });

  pdf.text("SCIENTIFIC INVESTOR ARCHETYPE", left + 14, heroY + 74, {
    font: "Helvetica-Bold",
    size: 7,
    color: PDF_COLORS.gold,
  });

  pdf.text(result.archetype.name, left + 14, heroY + 54, {
    font: "Times-Bold",
    size: 18,
    color: PDF_COLORS.navy,
  });

  pdf.text(`"${result.archetype.tagline}"`, left + 14, heroY + 38, {
    font: "Times-Roman",
    size: 9.5,
    color: PDF_COLORS.muted,
  });

  pdf.text(
    `Benchmark: ${result.archetype.benchmark}   |   Recommended Runway: ${result.archetype.recommendedHorizon}`,
    left + 14,
    heroY + 18,
    {
      font: "Helvetica",
      size: 7.2,
      color: PDF_COLORS.muted,
    }
  );

  // Score Badge in Hero (Right Side)
  const scoreBoxW = 90;
  const scoreBoxX = right - scoreBoxW - 14;
  pdf.rect(scoreBoxX, heroY + 14, scoreBoxW, 64, {
    fill: PDF_COLORS.navy,
    stroke: PDF_COLORS.gold,
    lineWidth: 1,
  });
  pdf.text("OVERALL SCORE", scoreBoxX + scoreBoxW / 2, heroY + 60, {
    font: "Helvetica-Bold",
    size: 6.5,
    color: PDF_COLORS.gold,
    align: "center",
  });
  pdf.text(`${result.normalizedScore}`, scoreBoxX + scoreBoxW / 2, heroY + 32, {
    font: "Times-Bold",
    size: 26,
    color: PDF_COLORS.white,
    align: "center",
  });
  pdf.text("OUT OF 100", scoreBoxX + scoreBoxW / 2, heroY + 22, {
    font: "Helvetica",
    size: 6.5,
    color: PDF_COLORS.lightGray,
    align: "center",
  });

  // 3. Fiduciary Override Alert if Time Horizon Capped
  let nextSectionY = heroY - 14;
  if (result.isHorizonCapped) {
    const alertReason =
      result.horizonCapReason || FIDUCIARY_POLICY_CONSTANTS.horizonCapReasonUnder1Yr;
    const alertInnerW = contentWidth - 20;

    // Dynamically calculate lines needed for alertReason
    const words = alertReason.split(" ");
    let lineCount = 1;
    let curLine = "";
    for (const w of words) {
      const test = curLine ? `${curLine} ${w}` : w;
      if (pdf.approxTextWidth(test, "Helvetica", 6.8) > alertInnerW) {
        lineCount++;
        curLine = w;
      } else {
        curLine = test;
      }
    }
    const alertLineHeight = 9.5;
    const alertH = 20 + lineCount * alertLineHeight + 6;
    nextSectionY -= alertH;

    pdf.rect(left, nextSectionY, contentWidth, alertH, {
      fill: [0.99, 0.96, 0.93],
      stroke: [0.85, 0.55, 0.25],
      lineWidth: 0.8,
    });
    pdf.text(FIDUCIARY_POLICY_CONSTANTS.overrideAlertTitle, left + 10, nextSectionY + alertH - 12, {
      font: "Helvetica-Bold",
      size: 7.2,
      color: [0.75, 0.35, 0.1],
    });
    pdf.textWrapped(
      alertReason,
      left + 10,
      nextSectionY + alertH - 22,
      alertInnerW,
      alertLineHeight,
      {
        font: "Helvetica",
        size: 6.8,
        color: PDF_COLORS.navy,
      }
    );
    nextSectionY -= 12;
  }

  // 4. Middle Section: Two Columns (Left: Indicative Allocation, Right: Dimension Breakdown)
  const colGap = 16;
  const colW = (contentWidth - colGap) / 2; // ~249.6 pt

  const colYTop = nextSectionY - 10;
  const colHeight = 220;

  // Left Box: Indicative Asset Allocation
  const leftColX = left;
  pdf.rect(leftColX, colYTop - colHeight, colW, colHeight, {
    fill: PDF_COLORS.white,
    stroke: PDF_COLORS.border,
    lineWidth: 0.8,
  });
  pdf.rect(leftColX, colYTop - 26, colW, 26, { fill: PDF_COLORS.cream });
  pdf.text("INDICATIVE ASSET ALLOCATION", leftColX + 12, colYTop - 17, {
    font: "Times-Bold",
    size: 8.5,
    color: PDF_COLORS.navy,
  });

  // Proportional Horizontal Bar in Left Box
  const barY = colYTop - 52;
  const barW = colW - 24;
  const barH = 14;
  let barCurrentX = leftColX + 12;

  const alloc = result.archetype.allocation;
  const assetSlices: { label: string; pct: number; color: RgbColor; range: string }[] = [
    { label: "Equity", pct: alloc.equity, color: PDF_COLORS.gold, range: alloc.equityRange },
    { label: "Debt", pct: alloc.debt, color: [0.39, 0.45, 0.55] as RgbColor, range: alloc.debtRange },
    { label: "Gold", pct: alloc.gold, color: [0.90, 0.75, 0.48] as RgbColor, range: alloc.goldRange },
    { label: "Cash", pct: alloc.cash, color: [0.06, 0.72, 0.51] as RgbColor, range: alloc.cashRange },
  ].filter((s) => s.pct > 0);

  for (const slice of assetSlices) {
    const sw = (slice.pct / 100) * barW;
    pdf.rect(barCurrentX, barY, sw, barH, { fill: slice.color });
    barCurrentX += sw;
  }

  // Asset Rows
  let assetRowY = barY - 26;
  for (const slice of assetSlices) {
    // Dot
    pdf.circle(leftColX + 18, assetRowY + 4, 4, { fill: slice.color });
    // Asset Name
    pdf.text(slice.label, leftColX + 30, assetRowY + 1, {
      font: "Helvetica-Bold",
      size: 8.5,
      color: PDF_COLORS.navy,
    });
    // Target Range
    pdf.text(`Target: ${slice.range}`, leftColX + 30, assetRowY - 10, {
      font: "Helvetica",
      size: 7,
      color: PDF_COLORS.muted,
    });
    // Percentage
    pdf.text(`${slice.pct}%`, leftColX + colW - 12, assetRowY + 1, {
      font: "Helvetica-Bold",
      size: 10,
      color: PDF_COLORS.navy,
      align: "right",
    });

    assetRowY -= 28;
  }

  // Volatility note at bottom of left box
  pdf.line(leftColX + 12, colYTop - colHeight + 36, leftColX + colW - 12, colYTop - colHeight + 36, {
    color: PDF_COLORS.border,
    lineWidth: 0.6,
  });
  pdf.text("EXPECTED DRAWDOWN ENVELOPE", leftColX + 12, colYTop - colHeight + 25, {
    font: "Helvetica-Bold",
    size: 6.5,
    color: PDF_COLORS.muted,
  });
  pdf.text(result.archetype.volatilityBand, leftColX + 12, colYTop - colHeight + 15, {
    font: "Helvetica",
    size: 6.8,
    color: PDF_COLORS.navy,
  });
  pdf.text(FIDUCIARY_POLICY_CONSTANTS.drawdownLabel, leftColX + 12, colYTop - colHeight + 6, {
    font: "Helvetica",
    size: 5.8,
    color: PDF_COLORS.muted,
  });

  // Right Box: 5 Suitability Dimensions
  const rightColX = left + colW + colGap;
  pdf.rect(rightColX, colYTop - colHeight, colW, colHeight, {
    fill: PDF_COLORS.white,
    stroke: PDF_COLORS.border,
    lineWidth: 0.8,
  });
  pdf.rect(rightColX, colYTop - 26, colW, 26, { fill: PDF_COLORS.cream });
  pdf.text("SUITABILITY DIMENSIONS", rightColX + 12, colYTop - 17, {
    font: "Times-Bold",
    size: 8.5,
    color: PDF_COLORS.navy,
  });

  let dimY = colYTop - 46;
  const dimBarW = colW - 24;
  for (const dim of result.dimensionScores) {
    pdf.text(dim.label, rightColX + 12, dimY, {
      font: "Helvetica-Bold",
      size: 7.2,
      color: PDF_COLORS.navy,
    });
    pdf.text(`${dim.score}/100 · ${dim.level}`, rightColX + colW - 12, dimY, {
      font: "Helvetica",
      size: 7,
      color: PDF_COLORS.muted,
      align: "right",
    });

    // Dim Progress Bar Track
    pdf.rect(rightColX + 12, dimY - 9, dimBarW, 5, { fill: PDF_COLORS.cream });
    // Fill
    const fillW = Math.max((dim.score / 100) * dimBarW, 2);
    pdf.rect(rightColX + 12, dimY - 9, fillW, 5, { fill: PDF_COLORS.gold });

    dimY -= 34;
  }

  // 5. Plain Language Summary Box
  const summaryY = colYTop - colHeight - 16;
  const summaryH = 88;
  pdf.rect(left, summaryY - summaryH, contentWidth, summaryH, {
    fill: PDF_COLORS.creamAlt,
    stroke: PDF_COLORS.border,
    lineWidth: 0.8,
  });
  pdf.text("EXECUTIVE FIDUCIARY SUMMARY", left + 14, summaryY - 16, {
    font: "Helvetica-Bold",
    size: 7.5,
    color: PDF_COLORS.gold,
  });
  pdf.textWrapped(
    result.archetype.description,
    left + 14,
    summaryY - 30,
    contentWidth - 28,
    11,
    {
      font: "Helvetica",
      size: 7.8,
      color: PDF_COLORS.navy,
    }
  );

  // Statutory Caveat Banner at bottom of page 1
  const caveatY = 56;
  pdf.rect(left, caveatY, contentWidth, 24, {
    fill: PDF_COLORS.cream,
    stroke: PDF_COLORS.border,
    lineWidth: 0.6,
  });
  pdf.text(
    FIDUCIARY_POLICY_CONSTANTS.statutoryCaveat,
    left + contentWidth / 2,
    caveatY + 9,
    {
      font: "Helvetica",
      size: 6.5,
      color: PDF_COLORS.muted,
      align: "center",
    }
  );

  // Page 1 Footer
  pdf.line(left, 42, right, 42, { color: PDF_COLORS.gold, lineWidth: 0.8 });
  pdf.text("ALPHA INVESTMENT MANAGEMENT · SEBI REGISTRATION INA000017348", left, 30, {
    font: "Helvetica",
    size: 6.8,
    color: PDF_COLORS.muted,
  });
  pdf.text("Page 1 of 2 · Confidential Client Risk Assessment", right, 30, {
    font: "Helvetica",
    size: 6.8,
    color: PDF_COLORS.muted,
    align: "right",
  });

  // ==========================================================================
  // PAGE 2: QUESTION & ANSWER AUDIT TRAIL & STATUTORY DISCLOSURES
  // ==========================================================================
  pdf.addPage();

  // Page 2 Header Bar
  pdf.rect(0, 785, 595.28, 56.89, { fill: PDF_COLORS.navy });
  pdf.text("ALPHA INVESTMENT MANAGEMENT", left, 818, {
    font: "Times-Bold",
    size: 12,
    color: PDF_COLORS.white,
  });
  pdf.text("QUESTIONNAIRE AUDIT TRAIL & STATUTORY COMPLIANCE", left, 804, {
    font: "Helvetica-Bold",
    size: 7,
    color: PDF_COLORS.gold,
  });
  pdf.text(`Report ID: ${reportId}`, right, 818, {
    font: "Helvetica",
    size: 7,
    color: PDF_COLORS.lightGray,
    align: "right",
  });
  pdf.text(`Assessment Date: ${timestampIst}`, right, 804, {
    font: "Helvetica",
    size: 7,
    color: PDF_COLORS.lightGray,
    align: "right",
  });

  pdf.line(0, 785, 595.28, 785, { color: PDF_COLORS.gold, lineWidth: 1.5 });

  // 10-Question Audit Table
  let tableY = 760;
  pdf.text("10-POINT SUITABILITY AUDIT RESPONSES", left, tableY, {
    font: "Times-Bold",
    size: 9,
    color: PDF_COLORS.navy,
  });
  tableY -= 14;

  // Table Header
  const colQNoW = 34;
  const colCatW = 86;
  const colAnsW = 335;
  const colScoreW = 60;

  pdf.rect(left, tableY - 14, contentWidth, 14, { fill: PDF_COLORS.navy });
  pdf.text("No.", left + 6, tableY - 10, { font: "Helvetica-Bold", size: 6.5, color: PDF_COLORS.white });
  pdf.text("Dimension", left + colQNoW + 6, tableY - 10, { font: "Helvetica-Bold", size: 6.5, color: PDF_COLORS.white });
  pdf.text("Selected Answer & Specific Option", left + colQNoW + colCatW + 6, tableY - 10, { font: "Helvetica-Bold", size: 6.5, color: PDF_COLORS.white });
  pdf.text("Weight", right - 10, tableY - 10, { font: "Helvetica-Bold", size: 6.5, color: PDF_COLORS.white, align: "right" });
  tableY -= 14;

  // Render Table Rows
  for (let i = 0; i < RISK_QUESTIONS.length; i++) {
    const q = RISK_QUESTIONS[i];
    const selectedOptId = result.answers[q.id];
    const selectedOption = q.options.find((o) => o.id === selectedOptId);
    const rowH = 26;
    const isEven = i % 2 === 0;

    pdf.rect(left, tableY - rowH, contentWidth, rowH, {
      fill: isEven ? PDF_COLORS.white : PDF_COLORS.creamAlt,
      stroke: PDF_COLORS.border,
      lineWidth: 0.4,
    });

    // No.
    pdf.text(`Q${q.number}`, left + 6, tableY - 15, {
      font: "Helvetica-Bold",
      size: 7,
      color: PDF_COLORS.navy,
    });

    // Dimension
    pdf.text(q.category, left + colQNoW + 6, tableY - 15, {
      font: "Helvetica",
      size: 7,
      color: PDF_COLORS.muted,
    });

    // Answer text + subtext
    if (selectedOption) {
      pdf.text(selectedOption.text, left + colQNoW + colCatW + 6, tableY - 11, {
        font: "Helvetica-Bold",
        size: 7,
        color: PDF_COLORS.navy,
      });
      if (selectedOption.subtext) {
        pdf.text(selectedOption.subtext, left + colQNoW + colCatW + 6, tableY - 21, {
          font: "Helvetica",
          size: 6.2,
          color: PDF_COLORS.muted,
        });
      }
    }

    // Weight points
    const pts = selectedOption?.weight ?? 0;
    pdf.text(`${pts} / 4`, right - 10, tableY - 15, {
      font: "Helvetica-Bold",
      size: 7,
      color: PDF_COLORS.gold,
      align: "right",
    });

    tableY -= rowH;
  }

  // Statutory Disclosures Card (Bottom Half)
  const statutoryCardY = tableY - 16;
  const statutoryCardH = 180;

  pdf.rect(left, statutoryCardY - statutoryCardH, contentWidth, statutoryCardH, {
    fill: PDF_COLORS.creamAlt,
    stroke: PDF_COLORS.border,
    lineWidth: 0.8,
  });

  // Top header in statutory card
  pdf.rect(left, statutoryCardY - 22, contentWidth, 22, { fill: PDF_COLORS.cream });
  pdf.text("STATUTORY FIDUCIARY DISCLOSURES & MANDATORY REGULATORY DETAILS", left + 12, statutoryCardY - 15, {
    font: "Times-Bold",
    size: 7.5,
    color: PDF_COLORS.navy,
  });

  // Legal Disclaimer Text
  const disclaimerStartY = statutoryCardY - 34;
  pdf.textWrapped(
    REPORT_DISCLAIMERS.riskProfileDisclaimer,
    left + 12,
    disclaimerStartY,
    contentWidth - 115,
    9.5,
    {
      font: "Helvetica",
      size: 6.2,
      color: PDF_COLORS.navy,
    }
  );

  // Key officers and compliance credentials
  const credsY = disclaimerStartY - 54;
  pdf.text(`1. Registration Credentials: ${REPORT_DISCLAIMERS.registrationLine} · ${FIDUCIARY_POLICY_CONSTANTS.baslLine} · Perpetual Validity`, left + 12, credsY, {
    font: "Helvetica",
    size: 6.2,
    color: PDF_COLORS.muted,
  });
  pdf.text(`2. Key Officers: ${REPORT_DISCLAIMERS.principalOfficer}`, left + 12, credsY - 11, {
    font: "Helvetica",
    size: 6.2,
    color: PDF_COLORS.muted,
  });
  pdf.text(`3. Registered Office: ${REPORT_DISCLAIMERS.address}`, left + 12, credsY - 22, {
    font: "Helvetica",
    size: 6.2,
    color: PDF_COLORS.muted,
  });
  pdf.textWrapped(
    `4. Statutory Caution: ${REPORT_DISCLAIMERS.guaranteeDisclaimer}`,
    left + 12,
    credsY - 33,
    contentWidth - 115,
    7.5,
    {
      font: "Helvetica",
      size: 5.6,
      color: PDF_COLORS.muted,
    }
  );

  // Schedule Consultation Box with Vector QR Code (Right Side of Disclosures Card)
  const qrBoxX = right - 95;
  const qrBoxY = statutoryCardY - statutoryCardH + 12;
  const qrBoxSize = 80;

  pdf.rect(qrBoxX, qrBoxY, qrBoxSize, statutoryCardH - 34, {
    fill: PDF_COLORS.white,
    stroke: PDF_COLORS.border,
    lineWidth: 0.6,
  });

  pdf.text("Schedule", qrBoxX + qrBoxSize / 2, qrBoxY + statutoryCardH - 46, {
    font: "Times-Bold",
    size: 7.5,
    color: PDF_COLORS.navy,
    align: "center",
  });
  pdf.text("Consultation", qrBoxX + qrBoxSize / 2, qrBoxY + statutoryCardH - 55, {
    font: "Times-Bold",
    size: 7.5,
    color: PDF_COLORS.navy,
    align: "center",
  });

  // Vector QR Code pointing to /contact with risk profile note
  const consultationTargetUrl = `${consultationUrl}?note=${encodeURIComponent(`RiskProfile:${result.archetype.name},Score:${result.normalizedScore}/100`)}`;
  const qrMatrix = generateQrMatrix(consultationTargetUrl);
  const qrSize = 52;
  const qrX = qrBoxX + (qrBoxSize - qrSize) / 2;
  const qrY = qrBoxY + 16;
  pdf.qrCode(qrMatrix, qrX, qrY, qrSize, PDF_COLORS.navy);

  pdf.text("Scan with Camera", qrBoxX + qrBoxSize / 2, qrBoxY + 8, {
    font: "Helvetica",
    size: 5.5,
    color: PDF_COLORS.muted,
    align: "center",
  });

  // Page 2 Footer
  pdf.line(left, 42, right, 42, { color: PDF_COLORS.gold, lineWidth: 0.8 });
  pdf.text("Strictly Fee-Only · Zero Distributor Kickbacks · Pune, Maharashtra", left, 30, {
    font: "Helvetica",
    size: 6.8,
    color: PDF_COLORS.muted,
  });
  pdf.text("Page 2 of 2 · Confidential Client Risk Assessment", right, 30, {
    font: "Helvetica",
    size: 6.8,
    color: PDF_COLORS.muted,
    align: "right",
  });

  // Build binary PDF
  const bytes = pdf.build();
  const blob = new Blob([bytes], { type: "application/pdf" });

  return { blob, filename, bytes };
}
