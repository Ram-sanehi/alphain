import { describe, it, expect } from "vitest";
import {
  RISK_QUESTIONS,
  calculateRiskProfile,
  ARCHETYPES,
  DIMENSION_METADATA,
  FIDUCIARY_POLICY_CONSTANTS,
} from "@/constants/riskProfileConfig";
import { generateRiskProfilePdf } from "@/components/risk-profile/pdf/generateRiskProfilePdf";
import { riskProfileDisclaimer } from "@/constants/reportDisclaimers";

describe("Risk Profile Scoring & Suitability Engine", () => {
  it("defines compliance constants and documented scoring rule in config", () => {
    expect(FIDUCIARY_POLICY_CONSTANTS.scoringRule).toContain("Archetype Category = min");
    expect(FIDUCIARY_POLICY_CONSTANTS.drawdownLabel).toBe("Illustrative historical range, not a forecast");
    expect(FIDUCIARY_POLICY_CONSTANTS.baslLine).toBe("BASL Membership No. 1982");
    expect(FIDUCIARY_POLICY_CONSTANTS.statutoryCaveat).toContain("Indicative profile based on your answers");
  });

  it("contains exactly 10 questions with valid option weights", () => {
    expect(RISK_QUESTIONS).toHaveLength(10);

    RISK_QUESTIONS.forEach((q, idx) => {
      expect(q.number).toBe(idx + 1);
      expect(q.options.length).toBeGreaterThanOrEqual(4);
      expect(q.whyItMatters).toBeTruthy();
      expect(q.dimension).toBeTruthy();

      q.options.forEach((opt) => {
        expect(opt.id).toBeTruthy();
        expect(opt.text).toBeTruthy();
        expect(opt.weight).toBeGreaterThanOrEqual(1);
        expect(opt.weight).toBeLessThanOrEqual(4);
      });
    });
  });

  // =========================================================================
  // ANSWER SET 1: ALL FIRST OPTIONS (CONSERVATIVE)
  // =========================================================================
  it("processes Answer Set 1 (All first options): produces Conservative Fiduciary and valid PDF", async () => {
    const allFirstAnswers: Record<string, string> = {
      q1: "q1_o1", // Weight 1 -> Time Horizon 0/100
      q2: "q2_o1",
      q3: "q3_o1",
      q4: "q4_o1",
      q5: "q5_o1",
      q6: "q6_o1",
      q7: "q7_o1",
      q8: "q8_o1",
      q9: "q9_o1",
      q10: "q10_o1",
    };

    const result = calculateRiskProfile(allFirstAnswers);
    expect(result.rawScore).toBe(10);
    expect(result.normalizedScore).toBe(0);
    expect(isNaN(result.normalizedScore)).toBe(false);
    expect(result.archetype.name).toBe("Conservative Fiduciary");
    expect(result.archetype.allocation.equity).toBe(15);
    expect(result.archetype.allocation.debt).toBe(65);
    expect(result.archetype.allocation.gold).toBe(15);
    expect(result.archetype.allocation.cash).toBe(5);

    // Verify dimension score normalization: Q1 weight 1 evaluates to 0/100 via (1-1)/3*100
    const timeHorizonDim = result.dimensionScores.find((d) => d.dimension === "timeHorizon");
    expect(timeHorizonDim).toBeDefined();
    expect(timeHorizonDim?.score).toBe(0);
    expect(timeHorizonDim?.rawScore).toBe(1);

    // Verify PDF report generation for Answer Set 1
    const pdf = await generateRiskProfilePdf(result, "https://alphaaim.in/contact");
    expect(pdf.filename).toContain("Alpha-Investment-Risk-Profile-");
    expect(pdf.bytes.byteLength).toBeGreaterThan(15000);
    const pdfText = new TextDecoder("latin1").decode(pdf.bytes);
    expect(pdfText).toContain("Conservative Fiduciary");
    expect(pdfText).toContain("Crisil Composite Bond Index");
    expect(pdfText).toContain("Illustrative historical range, not a forecast");
    expect(pdfText).toContain("BASL Membership No. 1982");
  });

  // =========================================================================
  // ANSWER SET 2: ALL LAST OPTIONS (AGGRESSIVE)
  // =========================================================================
  it("processes Answer Set 2 (All last options): produces Aggressive Wealth Accumulator and valid PDF", async () => {
    const allLastAnswers: Record<string, string> = {
      q1: "q1_o4", // Weight 4 -> Time Horizon 100/100
      q2: "q2_o4",
      q3: "q3_o4",
      q4: "q4_o4",
      q5: "q5_o4",
      q6: "q6_o4",
      q7: "q7_o4",
      q8: "q8_o4",
      q9: "q9_o4",
      q10: "q10_o4",
    };

    const result = calculateRiskProfile(allLastAnswers);
    expect(result.rawScore).toBe(40);
    expect(result.normalizedScore).toBe(100);
    expect(isNaN(result.normalizedScore)).toBe(false);
    expect(result.archetype.name).toBe("Aggressive Wealth Accumulator");
    expect(result.archetype.allocation.equity).toBe(85);
    expect(result.archetype.allocation.debt).toBe(10);
    expect(result.archetype.allocation.gold).toBe(5);
    expect(result.isHorizonCapped).toBe(false);

    // Verify dimension score normalization: Q1 weight 4 evaluates to 100/100 via (4-1)/3*100
    const timeHorizonDim = result.dimensionScores.find((d) => d.dimension === "timeHorizon");
    expect(timeHorizonDim).toBeDefined();
    expect(timeHorizonDim?.score).toBe(100);

    // Verify PDF report generation for Answer Set 2
    const pdf = await generateRiskProfilePdf(result, "https://alphaaim.in/contact");
    expect(pdf.bytes.byteLength).toBeGreaterThan(15000);
    const pdfText = new TextDecoder("latin1").decode(pdf.bytes);
    expect(pdfText).toContain("Aggressive Wealth Accumulator");
    expect(pdfText).toContain("Nifty MidSmallcap 400 TRI");
    expect(pdfText).toContain("Illustrative historical range, not a forecast");
    expect(pdfText).toContain("BASL Membership No. 1982");
  });

  // =========================================================================
  // ANSWER SET 3: BALANCED MIXED OPTIONS
  // =========================================================================
  it("processes Answer Set 3 (Mixed options): produces Balanced Wealth Builder and valid PDF", async () => {
    const mixedAnswers: Record<string, string> = {
      q1: "q1_o3", // 3
      q2: "q2_o3", // 3
      q3: "q3_o2", // 2
      q4: "q4_o3", // 3
      q5: "q5_o3", // 3
      q6: "q6_o3", // 3
      q7: "q7_o3", // 3
      q8: "q8_o3", // 3
      q9: "q9_o3", // 3
      q10: "q10_o3", // 3
    };

    const result = calculateRiskProfile(mixedAnswers);
    expect(result.rawScore).toBe(29);
    expect(result.normalizedScore).toBe(63);
    expect(isNaN(result.normalizedScore)).toBe(false);
    expect(result.archetype.name).toBe("Balanced Wealth Builder");
    expect(result.archetype.allocation.equity).toBe(55);
    expect(result.archetype.allocation.debt).toBe(35);
    expect(result.archetype.allocation.gold).toBe(8);

    // Verify PDF report generation for Answer Set 3
    const pdf = await generateRiskProfilePdf(result, "https://alphaaim.in/contact");
    expect(pdf.bytes.byteLength).toBeGreaterThan(15000);
    const pdfText = new TextDecoder("latin1").decode(pdf.bytes);
    expect(pdfText).toContain("Balanced Wealth Builder");
    expect(pdfText).toContain("Nifty 500 Multicap 50:50");
    expect(pdfText).toContain("Illustrative historical range, not a forecast");
    expect(pdfText).toContain("BASL Membership No. 1982");
  });

  // =========================================================================
  // SEBI HORIZON GUARD ENFORCEMENT & OVERRIDE PDF AUDIT
  // =========================================================================
  it("enforces SEBI Time Horizon override guard when Q1 < 1 year even with otherwise aggressive answers", async () => {
    const horizonCappedAnswers: Record<string, string> = {
      q1: "q1_o1", // Less than 1 year (Weight 1) -> TRIGGER
      q2: "q2_o4", // Aggressive
      q3: "q3_o4", // Fortress cash
      q4: "q4_o4", // Deploy additional cash
      q5: "q5_o4", // Passive family wealth
      q6: "q6_o4", // PMS/Derivatives
      q7: "q7_o4", // Heavy equity
      q8: "q8_o4", // No dependents
      q9: "q9_o4", // Zero liquidation
      q10: "q10_o4", // Highest return
    };

    const result = calculateRiskProfile(horizonCappedAnswers);
    expect(result.rawScore).toBe(37);
    expect(result.normalizedScore).toBe(90);
    // Archetype MUST be capped at Conservative Fiduciary (Index 0, max 15% equity)
    expect(result.isHorizonCapped).toBe(true);
    expect(result.archetype.id).toBe("conservative");
    expect(result.archetype.name).toBe("Conservative Fiduciary");
    expect(result.archetype.allocation.equity).toBe(15);
    expect(result.horizonCapReason).toContain("under 12 months");

    // Verify PDF report contains complete, untruncated override text
    const pdf = await generateRiskProfilePdf(result, "https://alphaaim.in/contact");
    const pdfText = new TextDecoder("latin1").decode(pdf.bytes);
    expect(pdfText).toContain("FIDUCIARY SUITABILITY OVERRIDE APPLIED");
    expect(pdfText).toContain("under 12 months");
    expect(pdfText).toContain("capping your allocation at Conservative Fiduciary.");
  });

  it("enforces horizon cap for 1 to 3 years when score suggests growth/aggressive", () => {
    const mediumHorizonAnswers: Record<string, string> = {
      q1: "q1_o2", // 1 to 3 years (cap at index 1: Moderately Conservative, max 35% equity)
      q2: "q2_o4",
      q3: "q3_o4",
      q4: "q4_o4",
      q5: "q5_o4",
      q6: "q6_o4",
      q7: "q7_o4",
      q8: "q8_o4",
      q9: "q9_o4",
      q10: "q10_o4",
    };

    const result = calculateRiskProfile(mediumHorizonAnswers);
    expect(result.isHorizonCapped).toBe(true);
    expect(result.archetype.id).toBe("mod-conservative");
    expect(result.archetype.allocation.equity).toBeLessThanOrEqual(35);
  });

  it("breaks down all 5 suitability dimensions with 0-100 scores", () => {
    const sampleAnswers: Record<string, string> = {
      q1: "q1_o3",
      q2: "q2_o3",
      q3: "q3_o3",
      q4: "q4_o2",
      q5: "q5_o3",
      q6: "q6_o3",
      q7: "q7_o2",
      q8: "q8_o3",
      q9: "q9_o4",
      q10: "q10_o3",
    };

    const result = calculateRiskProfile(sampleAnswers);
    expect(result.dimensionScores).toHaveLength(5);

    const dimKeys = result.dimensionScores.map((d) => d.dimension);
    expect(dimKeys).toContain("timeHorizon");
    expect(dimKeys).toContain("riskTolerance");
    expect(dimKeys).toContain("riskCapacity");
    expect(dimKeys).toContain("liquidityNeeds");
    expect(dimKeys).toContain("investmentExperience");

    result.dimensionScores.forEach((d) => {
      expect(d.score).toBeGreaterThanOrEqual(0);
      expect(d.score).toBeLessThanOrEqual(100);
      expect(["Conservative", "Moderate", "Balanced", "Growth", "High"]).toContain(d.level);
    });
  });

  // =========================================================================
  // CORRUPTED / INCOMPLETE ANSWERS PROTECTION
  // =========================================================================
  it("throws a clear error if any required question is missing", () => {
    const incompleteAnswers: Record<string, string> = {
      q1: "q1_o2",
      q2: "q2_o2",
    };

    expect(() => calculateRiskProfile(incompleteAnswers)).toThrow(/Incomplete assessment: Question/);
  });

  it("safely rejects corrupted legacy answers schema (numbers instead of string option IDs)", () => {
    const legacyCorruptedAnswers: any = {
      1: 3,
      2: 4,
      3: 2,
    };

    expect(() => calculateRiskProfile(legacyCorruptedAnswers)).toThrow(/Incomplete assessment: Question 1/);
  });
});

describe("Risk Profile PDF Report Generator", () => {
  it("generates a valid, non-empty 2-page A4 vector PDF with proper metadata", async () => {
    const sampleAnswers: Record<string, string> = {
      q1: "q1_o3",
      q2: "q2_o3",
      q3: "q3_o3",
      q4: "q4_o3",
      q5: "q5_o3",
      q6: "q6_o3",
      q7: "q7_o3",
      q8: "q8_o3",
      q9: "q9_o3",
      q10: "q10_o3",
    };

    const result = calculateRiskProfile(sampleAnswers);
    const pdfReport = await generateRiskProfilePdf(result, "https://alphaaim.in/contact");

    expect(pdfReport.filename).toMatch(/^Alpha-Investment-Risk-Profile-\d{4}-\d{2}-\d{2}\.pdf$/);
    expect(pdfReport.bytes.byteLength).toBeGreaterThan(15000); // 2 full vector pages with tables & QR
    expect(pdfReport.blob).toBeInstanceOf(Blob);

    // Verify PDF header format
    const headerString = new TextDecoder().decode(pdfReport.bytes.slice(0, 8));
    expect(headerString).toContain("%PDF-1.4");
  });

  it("includes regulatory disclaimer mentioning SEBI RIA INA000017348", () => {
    expect(riskProfileDisclaimer.sebiRegistration).toBe("INA000017348");
    expect(riskProfileDisclaimer.statutoryCaveat).toContain("SEBI (Investment Advisers) Regulations");
  });
});
