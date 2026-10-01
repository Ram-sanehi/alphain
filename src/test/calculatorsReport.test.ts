import { describe, it, expect } from "vitest";
import {
  serializeCalculatorParams,
  deserializeCalculatorParams,
  CALCULATOR_DEFAULTS,
  CalculatorStatePayload,
} from "@/utils/calculatorUrlParams";
import { calculateLoanAmortizationSchedule } from "@/utils/loanAmortization";
import { generateQrMatrix } from "@/utils/qrCode";
import { PdfEngine } from "@/components/calculators/pdf/pdfEngine";

describe("Calculator URL Params Engine", () => {
  it("serializes and deserializes SIP parameters correctly with clamping", () => {
    const state: CalculatorStatePayload = {
      ...CALCULATOR_DEFAULTS,
      activeCalc: "sip",
      sipMonthly: 35000,
      sipRate: 14.5,
      sipYears: 20,
    };

    const query = serializeCalculatorParams(state);
    expect(query).toContain("v=1");
    expect(query).toContain("calc=sip");
    expect(query).toContain("m=35000");

    const parsed = deserializeCalculatorParams(new URLSearchParams(query));
    expect(parsed.hasCalculationParams).toBe(true);
    expect(parsed.state.activeCalc).toBe("sip");
    expect(parsed.state.sipMonthly).toBe(35000);
    expect(parsed.state.sipRate).toBe(14.5);
    expect(parsed.state.sipYears).toBe(20);
  });

  it("clamps out-of-bound parameters within legal limits", () => {
    const maliciousParams = new URLSearchParams(
      "v=1&calc=sip&m=999999999&r=99&y=999"
    );
    const parsed = deserializeCalculatorParams(maliciousParams);
    expect(parsed.state.sipMonthly).toBe(500000); // max allowed
    expect(parsed.state.sipRate).toBe(25); // max allowed
    expect(parsed.state.sipYears).toBe(35); // max allowed
  });

  it("handles legacy URL query parameters gracefully", () => {
    const legacyParams = new URLSearchParams("type=lumpsum&lump_p=1000000&lump_r=11&lump_y=12");
    const parsed = deserializeCalculatorParams(legacyParams);
    expect(parsed.hasCalculationParams).toBe(true);
    expect(parsed.state.activeCalc).toBe("lumpsum");
    expect(parsed.state.lumpAmount).toBe(1000000);
    expect(parsed.state.lumpRate).toBe(11);
    expect(parsed.state.lumpYears).toBe(12);
  });
});

describe("Loan Amortization Engine", () => {
  it("generates a yearly schedule where closing balance approaches zero", () => {
    const principal = 5000000;
    const rate = 8.5;
    const tenureYears = 15;
    const schedule = calculateLoanAmortizationSchedule(principal, rate, tenureYears);

    expect(schedule).toHaveLength(15);
    expect(schedule[0].year).toBe(1);
    expect(schedule[0].principalPaid).toBeGreaterThan(0);
    expect(schedule[0].interestPaid).toBeGreaterThan(0);
    expect(schedule[14].closingBalance).toBe(0);
  });
});

describe("QR Code Generator", () => {
  it("generates a valid 2D boolean matrix with finder patterns", () => {
    const url = "https://alphaaim.in/calculators?v=1&calc=sip&m=25000&r=12.5&y=15";
    const matrix = generateQrMatrix(url);

    expect(matrix.length).toBeGreaterThan(25);
    expect(matrix[0].length).toBe(matrix.length);

    // Top-left finder pattern corner at (0, 0) should be true (black)
    expect(matrix[0][0]).toBe(true);
    // Center of top-left finder pattern at (3, 3) should be true (black)
    expect(matrix[3][3]).toBe(true);
  });
});

describe("PDF 1.4 Vector Engine", () => {
  it("compiles a valid binary PDF with header, body, xref, and trailer", () => {
    const pdf = new PdfEngine();
    pdf.text("ALPHA INVESTMENT MANAGEMENT", 40, 800, { font: "Times-Bold", size: 14 });
    pdf.rect(40, 750, 500, 40, { fill: [0.96, 0.94, 0.91] });
    pdf.amountWithRupee("1,23,45,678", 50, 760);
    pdf.addPage();
    pdf.text("Page 2", 40, 800);

    const bytes = pdf.build();
    const str = new TextDecoder("latin1").decode(bytes);

    expect(str.startsWith("%PDF-1.4")).toBe(true);
    expect(str).toContain("%%EOF");
    expect(str).toContain("xref");
    expect(str).toContain("/Type /Catalog");
    expect(str).toContain("/Type /Pages");
    expect(str).toContain("/Count 2");
  });
});

describe("Generate All 7 Calculator PDF Reports", () => {
  it("generates populated, non-zero PDF reports for all 7 calculators with valid filenames and no corrupted rupee glyphs", async () => {
    const { generateCalculatorPdf } = await import("@/components/calculators/pdf/generateReport");
    const shareUrl = "https://alphaaim.in/calculators";

    const testPayloads: CalculatorStatePayload[] = [
      { ...CALCULATOR_DEFAULTS, activeCalc: "sip", sipMonthly: 25000, sipRate: 12.5, sipYears: 15 },
      { ...CALCULATOR_DEFAULTS, activeCalc: "lumpsum", lumpAmount: 1000000, lumpRate: 12, lumpYears: 10 },
      { ...CALCULATOR_DEFAULTS, activeCalc: "step-up", stepMonthly: 20000, stepUpPercent: 10, stepRate: 12, stepYears: 15 },
      {
        ...CALCULATOR_DEFAULTS,
        activeCalc: "retirement",
        curAge: 32,
        retAge: 58,
        lifeExp: 85,
        monthlyExp: 75000,
        inflation: 6,
        preReturn: 12,
        postReturn: 8,
      },
      { ...CALCULATOR_DEFAULTS, activeCalc: "goal", goalCost: 2500000, goalYears: 10, goalInflation: 7, goalReturn: 12 },
      { ...CALCULATOR_DEFAULTS, activeCalc: "emi", loanPrincipal: 5000000, loanRate: 8.5, loanTenureYears: 20 },
      { ...CALCULATOR_DEFAULTS, activeCalc: "tax", taxSalary: 1800000, tax80C: 150000, tax80D: 25000, taxHra: 120000, tax24b: 200000 },
    ];

    for (const payload of testPayloads) {
      const result = await generateCalculatorPdf(payload, shareUrl);
      expect(result.blob).toBeDefined();
      expect(result.blob.size).toBeGreaterThan(2000);
      expect(result.filename).toMatch(/^Alpha-Investment-.*-Report-.*\.pdf$/);

      // Verify binary content: must not contain corrupted rupee characters "â‚¹"
      const textContent = new TextDecoder("latin1").decode(result.bytes);
      expect(textContent).not.toContain("â‚¹");
      expect(textContent).not.toContain("[ILLUSTRATIVE-PROJECTION DISCLAIMER");
      expect(textContent).toContain("ALPHA INVESTMENT MANAGEMENT");
      expect(textContent).toContain("INA000017348");
    }
  });

  it("produces exact expected on-screen numbers for Retirement Corpus (e.g. ₹8,60,00,577)", async () => {
    const { generateCalculatorPdf } = await import("@/components/calculators/pdf/generateReport");
    const payload: CalculatorStatePayload = {
      ...CALCULATOR_DEFAULTS,
      activeCalc: "retirement",
      curAge: 32,
      retAge: 58,
      lifeExp: 85,
      monthlyExp: 75000,
      inflation: 6,
      preReturn: 12,
      postReturn: 8,
    };

    const result = await generateCalculatorPdf(payload, "https://alphaaim.in/calculators");
    const text = new TextDecoder("latin1").decode(result.bytes);

    // Verify key formatted numbers appear in the generated PDF text
    // Target Corpus: 8,60,00,577
    expect(text).toContain("8,60,00,577");
    // Monthly SIP needed: 39,980
    expect(text).toContain("39,980");
    // Future Monthly Expense: 3,41,204
    expect(text).toContain("3,41,204");
  });
});
