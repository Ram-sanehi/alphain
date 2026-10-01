/**
 * Alpha Investment Management - Client-Side Vector PDF Report Generator
 * Generates high-fidelity, vector-based, multi-page (≤ 2 pages) A4 PDF reports
 * with vector charts, typography, tables, disclaimers, and vector QR codes.
 * Client-side only. Zero telemetry, zero server dependencies.
 */

import { PdfEngine, PDF_COLORS } from "./pdfEngine";
import { generateQrMatrix } from "@/utils/qrCode";
import { REPORT_DISCLAIMERS } from "@/constants/reportDisclaimers";
import { CalculatorStatePayload } from "@/utils/calculatorUrlParams";
import {
  calculateSip,
  calculateLumpsum,
  calculateStepUpSip,
  calculateRetirement,
  calculateGoal,
  calculateLoanEmi,
  calculateIncomeTax,
} from "@/utils/calculators";
import { calculateLoanAmortizationSchedule } from "@/utils/loanAmortization";

export function formatIndianCurrency(num: number): string {
  if (isNaN(num) || num === undefined || num === null) return "0";
  const isNegative = num < 0;
  const abs = Math.round(Math.abs(num));
  const s = abs.toString();
  if (s.length <= 3) {
    return (isNegative ? "-" : "") + s;
  }
  const last3 = s.substring(s.length - 3);
  const rest = s.substring(0, s.length - 3);
  const formattedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return (isNegative ? "-" : "") + formattedRest + "," + last3;
}

export function formatAxisCurrency(val: number): string {
  if (val >= 10000000) {
    const cr = val / 10000000;
    return `${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)} Cr`;
  }
  if (val >= 100000) {
    const l = val / 100000;
    return `${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)} L`;
  }
  if (val >= 1000) {
    return `${Math.round(val / 1000)} k`;
  }
  return Math.round(val).toString();
}

interface TableRowData {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5?: string;
}

export async function generateCalculatorPdf(
  state: CalculatorStatePayload,
  shareUrl: string
): Promise<{ blob: Blob; filename: string; bytes: Uint8Array }> {
  if (!state || !state.activeCalc) {
    throw new Error("Invalid calculator state: active calculator is required.");
  }

  const pdf = new PdfEngine();

  // Date and report metadata in Asia/Kolkata timezone
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(now);

  const isoDate = now.toISOString().split("T")[0];
  const randSuffix = Math.floor(1000 + Math.random() * 9000);

  let calcTitle = "Investment Projection Report";
  let reportId = `AIM-CALC-${randSuffix}`;
  let filename = `Alpha-Investment-Report-${isoDate}.pdf`;

  let inputs: { label: string; value: string }[] = [];
  let summaryCards: { label: string; value: string; isAmount?: boolean }[] = [];
  let tableHeaders: string[] = [];
  let tableColWidths: number[] = [];
  let allRows: TableRowData[] = [];
  let chartPointsInvested: { x: number; y: number }[] = [];
  let chartPointsTotal: { x: number; y: number }[] = [];
  let chartMaxVal = 1000000;
  let chartLegendInvested = "Invested Capital";
  let chartLegendTotal = "Maturity Value";

  // Process data per calculator type with exact state mappings and validated calculations
  switch (state.activeCalc) {
    case "sip": {
      calcTitle = "SIP Wealth Projection Report";
      reportId = `AIM-SIP-${randSuffix}`;
      filename = `Alpha-Investment-SIP-Report-${isoDate}.pdf`;

      const res = calculateSip({
        monthlyInvestment: state.sipMonthly,
        expectedReturnRate: state.sipRate,
        timePeriodYears: state.sipYears,
      });

      if (isNaN(res.totalValue) || res.totalValue <= 0) {
        throw new Error("SIP calculation produced an invalid result.");
      }

      chartMaxVal = Math.max(...res.breakdown.map((d) => d.totalValue), 100000);
      chartLegendInvested = "Invested Capital";
      chartLegendTotal = "Maturity Value";

      inputs = [
        { label: "Monthly Investment", value: `₹${formatIndianCurrency(state.sipMonthly)}` },
        { label: "Expected Annual Return", value: `${state.sipRate.toFixed(1)}% p.a.` },
        { label: "Investment Horizon", value: `${state.sipYears} Years (${state.sipYears * 12} Mos)` },
      ];

      summaryCards = [
        { label: "TOTAL INVESTED", value: formatIndianCurrency(res.investedAmount), isAmount: true },
        { label: "ESTIMATED RETURNS", value: formatIndianCurrency(res.estimatedReturns), isAmount: true },
        { label: "MATURITY VALUE", value: formatIndianCurrency(res.totalValue), isAmount: true },
      ];

      tableHeaders = ["Year", "Invested Capital", "Estimated Returns", "Maturity Value"];
      tableColWidths = [60, 145, 145, 165];

      allRows = res.breakdown.map((d) => ({
        col1: `Year ${d.year}`,
        col2: `₹${formatIndianCurrency(d.investedAmount)}`,
        col3: `₹${formatIndianCurrency(d.wealthGained)}`,
        col4: `₹${formatIndianCurrency(d.totalValue)}`,
      }));

      chartPointsInvested = res.breakdown.map((d) => ({ x: d.year, y: d.investedAmount }));
      chartPointsTotal = res.breakdown.map((d) => ({ x: d.year, y: d.totalValue }));
      break;
    }

    case "lumpsum": {
      calcTitle = "Lumpsum Growth Projection Report";
      reportId = `AIM-LUMP-${randSuffix}`;
      filename = `Alpha-Investment-Lumpsum-Report-${isoDate}.pdf`;

      const res = calculateLumpsum({
        totalInvestment: state.lumpAmount,
        expectedReturnRate: state.lumpRate,
        timePeriodYears: state.lumpYears,
      });

      if (isNaN(res.totalValue) || res.totalValue <= 0) {
        throw new Error("Lumpsum calculation produced an invalid result.");
      }

      chartMaxVal = Math.max(...res.breakdown.map((d) => d.totalValue), 100000);
      chartLegendInvested = "Initial Principal";
      chartLegendTotal = "Total Compounded";

      inputs = [
        { label: "Initial Investment", value: `₹${formatIndianCurrency(state.lumpAmount)}` },
        { label: "Expected Annual Return", value: `${state.lumpRate.toFixed(1)}% p.a.` },
        { label: "Investment Horizon", value: `${state.lumpYears} Years` },
      ];

      summaryCards = [
        { label: "TOTAL INVESTED", value: formatIndianCurrency(res.investedAmount), isAmount: true },
        { label: "ESTIMATED RETURNS", value: formatIndianCurrency(res.estimatedReturns), isAmount: true },
        { label: "MATURITY VALUE", value: formatIndianCurrency(res.totalValue), isAmount: true },
      ];

      tableHeaders = ["Year", "Invested Capital", "Estimated Returns", "Maturity Value"];
      tableColWidths = [60, 145, 145, 165];

      allRows = res.breakdown.map((d) => ({
        col1: `Year ${d.year}`,
        col2: `₹${formatIndianCurrency(d.investedAmount)}`,
        col3: `₹${formatIndianCurrency(d.wealthGained)}`,
        col4: `₹${formatIndianCurrency(d.totalValue)}`,
      }));

      chartPointsInvested = res.breakdown.map((d) => ({ x: d.year, y: d.investedAmount }));
      chartPointsTotal = res.breakdown.map((d) => ({ x: d.year, y: d.totalValue }));
      break;
    }

    case "step-up": {
      calcTitle = "Step-Up SIP Projection Report";
      reportId = `AIM-STEP-${randSuffix}`;
      filename = `Alpha-Investment-Step-Up-Report-${isoDate}.pdf`;

      const res = calculateStepUpSip({
        initialMonthlyInvestment: state.stepMonthly,
        annualStepUpPercent: state.stepUpPercent,
        expectedReturnRate: state.stepRate,
        timePeriodYears: state.stepYears,
      });

      if (isNaN(res.totalValue) || res.totalValue <= 0) {
        throw new Error("Step-Up SIP calculation produced an invalid result.");
      }

      chartMaxVal = Math.max(...res.breakdown.map((d) => d.totalValue), 100000);
      chartLegendInvested = "Invested Capital";
      chartLegendTotal = "Maturity Value";

      inputs = [
        { label: "Starting Monthly SIP", value: `₹${formatIndianCurrency(state.stepMonthly)}` },
        { label: "Annual Step-Up Increment", value: `${state.stepUpPercent}% yearly` },
        { label: "Expected Annual Return", value: `${state.stepRate.toFixed(1)}% p.a.` },
        { label: "Investment Horizon", value: `${state.stepYears} Years` },
      ];

      summaryCards = [
        { label: "TOTAL INVESTED", value: formatIndianCurrency(res.investedAmount), isAmount: true },
        { label: "ESTIMATED RETURNS", value: formatIndianCurrency(res.estimatedReturns), isAmount: true },
        { label: "MATURITY VALUE", value: formatIndianCurrency(res.totalValue), isAmount: true },
      ];

      tableHeaders = ["Year", "Invested Capital", "Estimated Returns", "Maturity Value"];
      tableColWidths = [60, 145, 145, 165];

      allRows = res.breakdown.map((d) => ({
        col1: `Year ${d.year}`,
        col2: `₹${formatIndianCurrency(d.investedAmount)}`,
        col3: `₹${formatIndianCurrency(d.wealthGained)}`,
        col4: `₹${formatIndianCurrency(d.totalValue)}`,
      }));

      chartPointsInvested = res.breakdown.map((d) => ({ x: d.year, y: d.investedAmount }));
      chartPointsTotal = res.breakdown.map((d) => ({ x: d.year, y: d.totalValue }));
      break;
    }

    case "retirement": {
      calcTitle = "Retirement Planning Assessment Report";
      reportId = `AIM-RET-${randSuffix}`;
      filename = `Alpha-Investment-Retirement-Report-${isoDate}.pdf`;

      const res = calculateRetirement({
        currentAge: state.curAge,
        retirementAge: state.retAge,
        lifeExpectancy: state.lifeExp,
        currentMonthlyExpense: state.monthlyExp,
        expectedInflationRate: state.inflation,
        preRetirementReturn: state.preReturn,
        postRetirementReturn: state.postReturn,
      });

      if (isNaN(res.requiredCorpus) || res.requiredCorpus <= 0) {
        throw new Error("Retirement calculation produced an invalid result.");
      }

      inputs = [
        { label: "Current / Retirement Age", value: `${state.curAge} Yrs / ${state.retAge} Yrs` },
        { label: "Life Expectancy", value: `${state.lifeExp} Years (${res.yearsInRetirement} Yrs in Ret)` },
        { label: "Current Living Expense", value: `₹${formatIndianCurrency(state.monthlyExp)}/mo` },
        {
          label: "Inflation & Returns",
          value: `Inflation ${state.inflation}% · Pre-Ret ${state.preReturn}% · Post-Ret ${state.postReturn}%`,
        },
      ];

      summaryCards = [
        { label: "TARGET CORPUS NEEDED", value: formatIndianCurrency(res.requiredCorpus), isAmount: true },
        { label: "MONTHLY SAVINGS NEEDED", value: formatIndianCurrency(res.monthlySipRequired), isAmount: true },
        { label: "FUTURE MONTHLY EXPENSE", value: formatIndianCurrency(res.monthlyExpenseAtRetirement), isAmount: true },
      ];

      tableHeaders = ["Stage / Year", "Age", "Monthly Cash Flow", "Corpus Valuation"];
      tableColWidths = [120, 80, 155, 160];

      // Build complete chronological timeline of accumulation & distribution phases
      const yearsToRet = res.yearsToRetirement;
      const monthlyPreRate = state.preReturn / 12 / 100;
      const retirementTimeline: { age: number; stage: string; cashflow: string; corpus: number; invested: number }[] = [];

      let accumCorpus = 0;
      let totalSaved = 0;
      for (let y = 1; y <= yearsToRet; y++) {
        for (let m = 1; m <= 12; m++) {
          totalSaved += res.monthlySipRequired;
          accumCorpus = (accumCorpus + res.monthlySipRequired) * (1 + monthlyPreRate);
        }
        retirementTimeline.push({
          age: state.curAge + y,
          stage: `Accumulation Yr ${y}`,
          cashflow: `₹${formatIndianCurrency(res.monthlySipRequired)} (SIP)`,
          corpus: Math.round(accumCorpus),
          invested: Math.round(totalSaved),
        });
      }

      let distCorpus = res.requiredCorpus;
      const postMonthlyRate = state.postReturn / 12 / 100;
      const monthlyInflation = state.inflation / 12 / 100;
      let currentWithdrawal = res.monthlyExpenseAtRetirement;

      for (let y = 1; y <= res.yearsInRetirement; y++) {
        for (let m = 1; m <= 12; m++) {
          distCorpus = (distCorpus - currentWithdrawal) * (1 + postMonthlyRate);
          currentWithdrawal *= (1 + monthlyInflation);
        }
        retirementTimeline.push({
          age: state.retAge + y,
          stage: `Distribution Yr ${y}`,
          cashflow: `₹${formatIndianCurrency(Math.round(currentWithdrawal))} (Expense)`,
          corpus: Math.max(0, Math.round(distCorpus)),
          invested: Math.round(totalSaved),
        });
      }

      // Sample rows evenly across both pages without orphan headers
      const totalSteps = retirementTimeline.length;
      const stepInterval = Math.max(1, Math.floor(totalSteps / 20));
      const sampledRows: TableRowData[] = [];
      for (let i = 0; i < totalSteps; i += stepInterval) {
        const item = retirementTimeline[i];
        sampledRows.push({
          col1: item.stage,
          col2: `Age ${item.age}`,
          col3: item.cashflow,
          col4: `₹${formatIndianCurrency(item.corpus)}`,
        });
      }

      const finalItem = retirementTimeline[totalSteps - 1];
      if (sampledRows[sampledRows.length - 1]?.col2 !== `Age ${finalItem.age}`) {
        sampledRows.push({
          col1: finalItem.stage,
          col2: `Age ${finalItem.age}`,
          col3: finalItem.cashflow,
          col4: `₹${formatIndianCurrency(finalItem.corpus)}`,
        });
      }
      allRows = sampledRows;

      chartMaxVal = Math.max(...retirementTimeline.map((d) => d.corpus), res.requiredCorpus, 100000);
      chartLegendInvested = "Cumulative Saved";
      chartLegendTotal = "Corpus Valuation";
      chartPointsInvested = retirementTimeline.map((d) => ({ x: d.age, y: d.invested }));
      chartPointsTotal = retirementTimeline.map((d) => ({ x: d.age, y: d.corpus }));
      break;
    }

    case "goal": {
      const goalLabels: Record<string, string> = {
        "higher-education": "Higher Education",
        marriage: "Child Marriage",
        "luxury-home": "Real Estate / Home",
      };
      calcTitle = `${goalLabels[state.goalType] || "Milestone"} Goal Projection Report`;
      reportId = `AIM-GOAL-${randSuffix}`;
      filename = `Alpha-Investment-Goal-Report-${isoDate}.pdf`;

      const res = calculateGoal({
        goalType: state.goalType,
        currentCost: state.goalCost,
        yearsToGoal: state.goalYears,
        expectedInflation: state.goalInflation,
        expectedReturn: state.goalReturn,
      });

      if (isNaN(res.futureCost) || res.futureCost <= 0) {
        throw new Error("Goal calculation produced an invalid result.");
      }

      inputs = [
        { label: "Milestone Goal", value: goalLabels[state.goalType] || "Life Goal" },
        { label: "Current Cost", value: `₹${formatIndianCurrency(state.goalCost)}` },
        { label: "Time Horizon", value: `${state.goalYears} Years` },
        { label: "Inflation & Returns", value: `Inflation ${state.goalInflation}% · Return ${state.goalReturn}%` },
      ];

      summaryCards = [
        { label: "INFLATION-ADJUSTED COST", value: formatIndianCurrency(res.futureCost), isAmount: true },
        { label: "MONTHLY SIP REQUIRED", value: formatIndianCurrency(res.monthlySipNeeded), isAmount: true },
        { label: "ONE-TIME LUMPSUM NEEDED", value: formatIndianCurrency(res.lumpsumNeededToday), isAmount: true },
      ];

      tableHeaders = ["Timeline", "Target Progress", "Inflation Impact", "Corpus Required"];
      tableColWidths = [100, 130, 140, 145];

      const goalTimeline: { year: number; cost: number; accumulated: number }[] = [];
      const monthlyRate = state.goalReturn / 12 / 100;
      let accumGoal = 0;

      for (let y = 1; y <= state.goalYears; y++) {
        const infFactor = Math.pow(1 + state.goalInflation / 100, y);
        const yCost = Math.round(state.goalCost * infFactor);
        for (let m = 1; m <= 12; m++) {
          accumGoal = (accumGoal + res.monthlySipNeeded) * (1 + monthlyRate);
        }
        goalTimeline.push({ year: y, cost: yCost, accumulated: Math.round(accumGoal) });
        allRows.push({
          col1: `Year ${y} of ${state.goalYears}`,
          col2: `${Math.round((y / state.goalYears) * 100)}% Duration`,
          col3: `+₹${formatIndianCurrency(yCost - state.goalCost)}`,
          col4: `₹${formatIndianCurrency(yCost)}`,
        });
      }

      chartMaxVal = Math.max(res.futureCost, ...goalTimeline.map((d) => d.accumulated), 100000);
      chartLegendInvested = "Target Goal Cost";
      chartLegendTotal = "SIP Accumulated";
      chartPointsInvested = goalTimeline.map((d) => ({ x: d.year, y: d.cost }));
      chartPointsTotal = goalTimeline.map((d) => ({ x: d.year, y: d.accumulated }));
      break;
    }

    case "emi": {
      calcTitle = "Loan EMI & Amortization Report";
      reportId = `AIM-EMI-${randSuffix}`;
      filename = `Alpha-Investment-Loan-EMI-Report-${isoDate}.pdf`;

      const res = calculateLoanEmi({
        loanAmount: state.loanPrincipal,
        interestRate: state.loanRate,
        tenureYears: state.loanTenureYears,
      });

      const schedule = calculateLoanAmortizationSchedule(state.loanPrincipal, state.loanRate, state.loanTenureYears);

      if (isNaN(res.monthlyEmi) || res.monthlyEmi <= 0) {
        throw new Error("Loan EMI calculation produced an invalid result.");
      }

      chartMaxVal = res.totalPayment;
      chartLegendInvested = "Principal Repaid";
      chartLegendTotal = "Total Payment";

      inputs = [
        { label: "Principal Loan Amount", value: `₹${formatIndianCurrency(state.loanPrincipal)}` },
        { label: "Annual Interest Rate", value: `${state.loanRate.toFixed(2)}% p.a.` },
        { label: "Loan Tenure", value: `${state.loanTenureYears} Years (${state.loanTenureYears * 12} Mos)` },
      ];

      summaryCards = [
        { label: "MONTHLY EMI", value: formatIndianCurrency(res.monthlyEmi), isAmount: true },
        { label: "TOTAL INTEREST PAYABLE", value: formatIndianCurrency(res.totalInterest), isAmount: true },
        { label: "TOTAL PAYMENT (P + I)", value: formatIndianCurrency(res.totalPayment), isAmount: true },
      ];

      tableHeaders = ["Year", "Principal Paid", "Interest Paid", "Total Paid", "Closing Balance"];
      tableColWidths = [50, 115, 115, 115, 120];

      allRows = schedule.map((s) => ({
        col1: `Year ${s.year}`,
        col2: `₹${formatIndianCurrency(s.principalPaid)}`,
        col3: `₹${formatIndianCurrency(s.interestPaid)}`,
        col4: `₹${formatIndianCurrency(s.totalPaid)}`,
        col5: `₹${formatIndianCurrency(s.closingBalance)}`,
      }));

      let cumP = 0;
      let cumTot = 0;
      chartPointsInvested = schedule.map((s) => {
        cumP += s.principalPaid;
        return { x: s.year, y: cumP };
      });
      chartPointsTotal = schedule.map((s) => {
        cumTot += s.totalPaid;
        return { x: s.year, y: cumTot };
      });
      break;
    }

    case "tax": {
      calcTitle = "Income Tax Regime Analysis Report (FY 2025-26)";
      reportId = `AIM-TAX-${randSuffix}`;
      filename = `Alpha-Investment-Tax-Report-${isoDate}.pdf`;

      const res = calculateIncomeTax({
        grossAnnualSalary: state.taxSalary,
        deduction80C: state.tax80C,
        deduction80D: state.tax80D,
        hraExemption: state.taxHra,
        homeLoanInterest24b: state.tax24b,
        otherDeductions: 0,
      });

      inputs = [
        { label: "Gross Annual Income", value: `₹${formatIndianCurrency(state.taxSalary)}` },
        { label: "Section 80C Deductions", value: `₹${formatIndianCurrency(state.tax80C)}` },
        { label: "Health Insurance (80D)", value: `₹${formatIndianCurrency(state.tax80D)}` },
        { label: "HRA / Sec 24(b)", value: `₹${formatIndianCurrency(state.taxHra)} / ₹${formatIndianCurrency(state.tax24b)}` },
      ];

      const recLabel = res.recommendedRegime === "new" ? "NEW REGIME" : res.recommendedRegime === "old" ? "OLD REGIME" : "EQUAL TAX";
      const recTax = res.recommendedRegime === "new" ? res.newRegime.totalTaxLiability : res.oldRegime.totalTaxLiability;

      summaryCards = [
        { label: "RECOMMENDED REGIME", value: recLabel, isAmount: false },
        { label: "ESTIMATED TAX SAVINGS", value: formatIndianCurrency(res.taxSavings), isAmount: true },
        { label: "TAX PAYABLE (RECOMMENDED)", value: formatIndianCurrency(recTax), isAmount: true },
      ];

      tableHeaders = ["Tax Parameter / Head", "Old Tax Regime", "New Tax Regime (FY 25-26)", "Comparison Variance"];
      tableColWidths = [160, 120, 120, 115];

      allRows = [
        {
          col1: "Gross Annual Salary",
          col2: `₹${formatIndianCurrency(state.taxSalary)}`,
          col3: `₹${formatIndianCurrency(state.taxSalary)}`,
          col4: "Identical",
        },
        {
          col1: "Standard Deduction",
          col2: "₹50,000",
          col3: "₹75,000",
          col4: "+₹25,000 in New",
        },
        {
          col1: "Total Deductions (80C/80D/HRA)",
          col2: `₹${formatIndianCurrency(res.oldRegime.totalDeductions)}`,
          col3: "₹75,000 (Std only)",
          col4: `Old saves ₹${formatIndianCurrency(Math.max(0, res.oldRegime.totalDeductions - 75000))}`,
        },
        {
          col1: "Net Taxable Income",
          col2: `₹${formatIndianCurrency(res.oldRegime.taxableIncome)}`,
          col3: `₹${formatIndianCurrency(res.newRegime.taxableIncome)}`,
          col4: res.oldRegime.taxableIncome < res.newRegime.taxableIncome ? "Old is lower" : "New is lower",
        },
        {
          col1: "Slab Tax Before Rebate",
          col2: `₹${formatIndianCurrency(res.oldRegime.slabTax)}`,
          col3: `₹${formatIndianCurrency(res.newRegime.slabTax)}`,
          col4: `Variance ₹${formatIndianCurrency(Math.abs(res.oldRegime.slabTax - res.newRegime.slabTax))}`,
        },
        {
          col1: "Section 87A Tax Rebate",
          col2: `₹${formatIndianCurrency(res.oldRegime.rebate87A)}`,
          col3: `₹${formatIndianCurrency(res.newRegime.rebate87A)}`,
          col4: res.newRegime.rebate87A > 0 ? "Full rebate in New" : "No rebate",
        },
        {
          col1: "Health & Education Cess (4%)",
          col2: `₹${formatIndianCurrency(res.oldRegime.cess)}`,
          col3: `₹${formatIndianCurrency(res.newRegime.cess)}`,
          col4: "4% of Net Tax",
        },
        {
          col1: "Final Tax Payable",
          col2: `₹${formatIndianCurrency(res.oldRegime.totalTaxLiability)}`,
          col3: `₹${formatIndianCurrency(res.newRegime.totalTaxLiability)}`,
          col4: `Savings: ₹${formatIndianCurrency(res.taxSavings)}`,
        },
        {
          col1: "Net Take-Home Annual Salary",
          col2: `₹${formatIndianCurrency(res.oldRegime.takeHomeIncome)}`,
          col3: `₹${formatIndianCurrency(res.newRegime.takeHomeIncome)}`,
          col4: res.recommendedRegime === "new" ? `+₹${formatIndianCurrency(res.taxSavings)} in New` : `+₹${formatIndianCurrency(res.taxSavings)} in Old`,
        },
      ];

      // Side-by-side progression points for Tax comparison
      chartLegendInvested = "Old Regime Liability";
      chartLegendTotal = "New Regime Liability";
      chartPointsInvested = [
        { x: 1, y: res.oldRegime.taxableIncome },
        { x: 2, y: res.oldRegime.totalTaxLiability },
        { x: 3, y: res.oldRegime.takeHomeIncome },
      ];
      chartPointsTotal = [
        { x: 1, y: res.newRegime.taxableIncome },
        { x: 2, y: res.newRegime.totalTaxLiability },
        { x: 3, y: res.newRegime.takeHomeIncome },
      ];
      chartMaxVal = Math.max(state.taxSalary, res.oldRegime.takeHomeIncome, res.newRegime.takeHomeIncome, 100000);
      break;
    }
  }

  // Generate QR Code matrix for the verified shareable calculation link
  const qrMatrix = generateQrMatrix(shareUrl);

  // ----------------------------------------------------
  // PAGE 1 RENDERING
  // ----------------------------------------------------

  // Header band
  // Left: Brand Lockup
  pdf.text("ALPHA", 40, 796, { font: "Times-Bold", size: 18, color: PDF_COLORS.navy });
  pdf.text("INVESTMENT MANAGEMENT", 40, 784, { font: "Helvetica-Bold", size: 6.5, color: PDF_COLORS.muted });
  pdf.text("SEBI REGISTERED INVESTMENT ADVISER · INA000017348", 40, 774, { font: "Helvetica", size: 6.5, color: PDF_COLORS.gold });

  // Right: Document Title & Metadata
  pdf.text(calcTitle, 555.28, 796, { font: "Times-Bold", size: 12.5, color: PDF_COLORS.navy, align: "right" });
  pdf.text(`Generated on ${dateStr} · Asia/Kolkata`, 555.28, 784, { font: "Helvetica", size: 7.5, color: PDF_COLORS.muted, align: "right" });
  pdf.text(`Report ID: ${reportId}`, 555.28, 774, { font: "Courier", size: 7.5, color: PDF_COLORS.muted, align: "right" });

  // Gold header divider
  pdf.line(40, 764, 555.28, 764, { color: PDF_COLORS.gold, lineWidth: 1.5 });

  // Section 1: Inputs & Assumptions Table
  pdf.text("INPUT PARAMETERS & ASSUMPTIONS", 40, 748, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.muted });

  const inputPanelHeight = 44;
  pdf.rect(40, 696, 515.28, inputPanelHeight, { fill: PDF_COLORS.cream, stroke: PDF_COLORS.border, lineWidth: 0.8 });

  const colWidth = 515.28 / inputs.length;
  inputs.forEach((inp, idx) => {
    const colX = 40 + idx * colWidth + 12;
    pdf.text(inp.label.toUpperCase(), colX, 726, { font: "Helvetica", size: 6.8, color: PDF_COLORS.muted });
    pdf.text(inp.value, colX, 709, { font: "Helvetica-Bold", size: 9, color: PDF_COLORS.navy });

    if (idx > 0) {
      pdf.line(40 + idx * colWidth, 696, 40 + idx * colWidth, 740, { color: PDF_COLORS.border, lineWidth: 0.6 });
    }
  });

  // Section 2: Key Results Cards
  pdf.text("KEY PROJECTION RESULTS", 40, 680, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.muted });

  const cardWidth = (515.28 - (summaryCards.length - 1) * 8) / summaryCards.length;
  const cardHeight = 46;
  const cardY = 624;

  summaryCards.forEach((card, idx) => {
    const cx = 40 + idx * (cardWidth + 8);
    const isHighlight = idx === summaryCards.length - 1;

    pdf.rect(cx, cardY, cardWidth, cardHeight, {
      fill: PDF_COLORS.cream,
      stroke: isHighlight ? PDF_COLORS.gold : PDF_COLORS.border,
      lineWidth: isHighlight ? 1.2 : 0.8,
    });

    pdf.text(card.label, cx + 12, cardY + 31, {
      font: "Helvetica-Bold",
      size: 7.2,
      color: isHighlight ? PDF_COLORS.gold : PDF_COLORS.muted,
    });

    if (card.isAmount) {
      pdf.amountWithRupee(card.value, cx + 12, cardY + 12, {
        font: "Helvetica-Bold",
        size: 13,
        color: PDF_COLORS.navy,
      });
    } else {
      pdf.text(card.value, cx + 12, cardY + 12, {
        font: "Helvetica-Bold",
        size: 12.5,
        color: PDF_COLORS.navy,
      });
    }
  });

  // Section 3: Visual Projection Breakdown
  pdf.text("CAPITAL APPRECIATION & PROJECTION DYNAMICS", 40, 608, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.muted });

  const chartBoxY = 465;
  const chartBoxHeight = 134;
  pdf.rect(40, chartBoxY, 515.28, chartBoxHeight, { fill: PDF_COLORS.cream, stroke: PDF_COLORS.border, lineWidth: 0.8 });

  // Legend
  const legendY = chartBoxY + chartBoxHeight - 16;
  if (chartPointsInvested.length > 0) {
    pdf.rect(320, legendY - 3, 12, 6, { fill: PDF_COLORS.muted });
    pdf.text(chartLegendInvested, 336, legendY - 2, { font: "Helvetica", size: 7.2, color: PDF_COLORS.muted });

    pdf.rect(430, legendY - 3, 12, 6, { fill: PDF_COLORS.gold });
    pdf.text(chartLegendTotal, 446, legendY - 2, { font: "Helvetica-Bold", size: 7.2, color: PDF_COLORS.navy });
  }

  // Draw Vector Chart
  const plotLeft = 85;
  const plotRight = 535;
  const plotWidth = plotRight - plotLeft;
  const plotBottom = chartBoxY + 24;
  const plotTop = chartBoxY + chartBoxHeight - 28;
  const plotHeight = plotTop - plotBottom;

  // Gridlines & Y-Axis Labels
  const yTicks = 4;
  for (let i = 0; i <= yTicks; i++) {
    const ty = plotBottom + (i / yTicks) * plotHeight;
    const tickVal = (i / yTicks) * chartMaxVal;
    pdf.line(plotLeft, ty, plotRight, ty, { color: PDF_COLORS.border, lineWidth: 0.5, dash: [2, 2] });
    pdf.text(formatAxisCurrency(tickVal), plotLeft - 6, ty - 3, {
      font: "Helvetica",
      size: 7,
      color: PDF_COLORS.muted,
      align: "right",
    });
  }

  // Draw Curves / Shaded Polygons
  if (chartPointsInvested.length > 1 && chartPointsTotal.length > 1) {
    const totalPoints = chartPointsTotal.length;

    // Invested Polygon
    const investedPoly: { x: number; y: number }[] = [{ x: plotLeft, y: plotBottom }];
    for (let i = 0; i < totalPoints; i++) {
      const pt = chartPointsInvested[i];
      const px = plotLeft + (i / (totalPoints - 1)) * plotWidth;
      const py = plotBottom + Math.min(1, pt.y / chartMaxVal) * plotHeight;
      investedPoly.push({ x: px, y: py });
    }
    investedPoly.push({ x: plotRight, y: plotBottom });
    pdf.polygon(investedPoly, { fill: PDF_COLORS.goldSoft, stroke: PDF_COLORS.muted, lineWidth: 1 });

    // Maturity Polygon / Line
    const totalPoly: { x: number; y: number }[] = [{ x: plotLeft, y: plotBottom }];
    for (let i = 0; i < totalPoints; i++) {
      const pt = chartPointsTotal[i];
      const px = plotLeft + (i / (totalPoints - 1)) * plotWidth;
      const py = plotBottom + Math.min(1, pt.y / chartMaxVal) * plotHeight;
      totalPoly.push({ x: px, y: py });
    }
    totalPoly.push({ x: plotRight, y: plotBottom });
    pdf.polygon(totalPoly, { fill: [0.93, 0.88, 0.80], stroke: PDF_COLORS.gold, lineWidth: 1.8 });

    // X-Axis tick labels
    const stepCount = Math.min(6, totalPoints - 1);
    for (let s = 0; s <= stepCount; s++) {
      const idx = Math.round((s / stepCount) * (totalPoints - 1));
      const px = plotLeft + (idx / (totalPoints - 1)) * plotWidth;
      const labelVal = chartPointsTotal[idx].x;
      const yearLabel = state.activeCalc === "retirement" ? `Age ${labelVal}` : state.activeCalc === "tax" ? (idx === 0 ? "Taxable" : idx === 1 ? "Tax" : "In-Hand") : `Yr ${labelVal}`;
      pdf.text(yearLabel, px, plotBottom - 11, {
        font: "Helvetica",
        size: 7,
        color: PDF_COLORS.muted,
        align: "center",
      });
    }
  }

  // Section 4: Schedule Table (Page 1 segment)
  const p1TableY = 448;
  pdf.text("YEAR-BY-YEAR PROJECTION SCHEDULE", 40, p1TableY, {
    font: "Helvetica-Bold",
    size: 7.5,
    color: PDF_COLORS.muted,
  });

  // Table Header
  const thY = p1TableY - 18;
  const thHeight = 18;
  pdf.rect(40, thY, 515.28, thHeight, { fill: PDF_COLORS.cream, stroke: PDF_COLORS.border, lineWidth: 0.8 });

  let curX = 40;
  tableHeaders.forEach((th, idx) => {
    const w = tableColWidths[idx];
    const align = idx === 0 ? "left" : "right";
    const tx = idx === 0 ? curX + 10 : curX + w - 10;
    pdf.text(th.toUpperCase(), tx, thY + 5, { font: "Helvetica-Bold", size: 6.8, color: PDF_COLORS.navy, align });
    curX += w;
  });

  // Page 1 Rows: up to 16 rows
  const p1RowsCount = Math.min(allRows.length, 16);
  let rowY = thY - 17;
  for (let r = 0; r < p1RowsCount; r++) {
    const row = allRows[r];
    const isAlt = r % 2 === 1;

    pdf.rect(40, rowY, 515.28, 17, {
      fill: isAlt ? PDF_COLORS.creamAlt : PDF_COLORS.white,
      stroke: PDF_COLORS.border,
      lineWidth: 0.4,
    });

    let rx = 40;
    pdf.text(row.col1, rx + 10, rowY + 5, { font: "Helvetica", size: 7.5, color: PDF_COLORS.navy, align: "left" });
    rx += tableColWidths[0];
    pdf.text(row.col2, rx + tableColWidths[1] - 10, rowY + 5, { font: "Helvetica", size: 7.5, color: PDF_COLORS.navy, align: "right" });
    rx += tableColWidths[1];
    pdf.text(row.col3, rx + tableColWidths[2] - 10, rowY + 5, { font: "Helvetica", size: 7.5, color: PDF_COLORS.navy, align: "right" });
    rx += tableColWidths[2];
    pdf.text(row.col4, rx + tableColWidths[3] - 10, rowY + 5, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.navy, align: "right" });
    if (row.col5 && tableColWidths[4]) {
      rx += tableColWidths[3];
      pdf.text(row.col5, rx + tableColWidths[4] - 10, rowY + 5, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.navy, align: "right" });
    }

    rowY -= 17;
  }

  // Page 1 Footer
  pdf.line(40, 48, 555.28, 48, { color: PDF_COLORS.gold, lineWidth: 0.8 });
  pdf.text("Alpha Investment Management · SEBI Registered Investment Adviser INA000017348 · Strictly Fee-Only", 40, 36, {
    font: "Helvetica",
    size: 6.8,
    color: PDF_COLORS.muted,
  });
  pdf.text("Page 1 of 2 · Confidential Client Projection", 555.28, 36, {
    font: "Helvetica",
    size: 6.8,
    color: PDF_COLORS.muted,
    align: "right",
  });

  // ----------------------------------------------------
  // PAGE 2 RENDERING
  // ----------------------------------------------------
  pdf.addPage();

  // Page 2 Header Band
  pdf.text(`ALPHA INVESTMENT MANAGEMENT — ${calcTitle.toUpperCase()}`, 40, 804, {
    font: "Times-Bold",
    size: 9.5,
    color: PDF_COLORS.navy,
  });
  pdf.text(`${dateStr} · Report ID: ${reportId}`, 555.28, 804, {
    font: "Helvetica",
    size: 7.5,
    color: PDF_COLORS.muted,
    align: "right",
  });
  pdf.line(40, 794, 555.28, 794, { color: PDF_COLORS.gold, lineWidth: 1 });

  // Page 2 Rows (ONLY if remainingRows > 0)
  const remainingRows = allRows.slice(p1RowsCount);
  let p2RowY = 766;

  if (remainingRows.length > 0) {
    pdf.text("YEAR-BY-YEAR PROJECTION SCHEDULE (CONTINUED)", 40, p2RowY + 12, {
      font: "Helvetica-Bold",
      size: 7.5,
      color: PDF_COLORS.muted,
    });

    pdf.rect(40, p2RowY, 515.28, thHeight, { fill: PDF_COLORS.cream, stroke: PDF_COLORS.border, lineWidth: 0.8 });

    let p2CurX = 40;
    tableHeaders.forEach((th, idx) => {
      const w = tableColWidths[idx];
      const align = idx === 0 ? "left" : "right";
      const tx = idx === 0 ? p2CurX + 10 : p2CurX + w - 10;
      pdf.text(th.toUpperCase(), tx, p2RowY + 5, { font: "Helvetica-Bold", size: 6.8, color: PDF_COLORS.navy, align });
      p2CurX += w;
    });

    p2RowY -= 17;
    const maxP2Rows = Math.min(remainingRows.length, 16);

    for (let r = 0; r < maxP2Rows; r++) {
      const row = remainingRows[r];
      const isAlt = r % 2 === 1;

      pdf.rect(40, p2RowY, 515.28, 17, {
        fill: isAlt ? PDF_COLORS.creamAlt : PDF_COLORS.white,
        stroke: PDF_COLORS.border,
        lineWidth: 0.4,
      });

      let rx = 40;
      pdf.text(row.col1, rx + 10, p2RowY + 5, { font: "Helvetica", size: 7.5, color: PDF_COLORS.navy, align: "left" });
      rx += tableColWidths[0];
      pdf.text(row.col2, rx + tableColWidths[1] - 10, p2RowY + 5, { font: "Helvetica", size: 7.5, color: PDF_COLORS.navy, align: "right" });
      rx += tableColWidths[1];
      pdf.text(row.col3, rx + tableColWidths[2] - 10, p2RowY + 5, { font: "Helvetica", size: 7.5, color: PDF_COLORS.navy, align: "right" });
      rx += tableColWidths[2];
      pdf.text(row.col4, rx + tableColWidths[3] - 10, p2RowY + 5, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.navy, align: "right" });
      if (row.col5 && tableColWidths[4]) {
        rx += tableColWidths[3];
        pdf.text(row.col5, rx + tableColWidths[4] - 10, p2RowY + 5, { font: "Helvetica-Bold", size: 7.5, color: PDF_COLORS.navy, align: "right" });
      }

      p2RowY -= 17;
    }
    p2RowY -= 14;
  } else {
    // If no continuation rows, provide comfortable top positioning for disclosures
    p2RowY = 770;
  }

  // Section: Notes & Statutory Disclosures
  const disclaimerStartY = Math.min(p2RowY, remainingRows.length > 0 ? 470 : 770);
  pdf.text("STATUTORY DISCLOSURES & FIDUCIARY NOTES", 40, disclaimerStartY + 14, {
    font: "Helvetica-Bold",
    size: 7.5,
    color: PDF_COLORS.muted,
  });

  const discBoxHeight = remainingRows.length > 0 ? 165 : 210;
  const discBoxY = disclaimerStartY - discBoxHeight;
  pdf.rect(40, discBoxY, 515.28, discBoxHeight, { fill: PDF_COLORS.cream, stroke: PDF_COLORS.border, lineWidth: 0.8 });

  let dtY = discBoxY + discBoxHeight - 16;

  // Single-source compliance illustrative projection disclaimer
  pdf.text("REGULATORY NOTICE & ASSUMPTIONS", 52, dtY, {
    font: "Helvetica-Bold",
    size: 7,
    color: PDF_COLORS.navy,
  });
  dtY -= 12;

  const usedH = pdf.textWrapped(REPORT_DISCLAIMERS.illustrativeDisclaimer, 52, dtY, 490, 9.5, {
    font: "Helvetica",
    size: 6.8,
    color: PDF_COLORS.navy,
  });
  dtY -= usedH + 6;

  // Market Risk
  pdf.text(REPORT_DISCLAIMERS.marketRisk, 52, dtY, {
    font: "Helvetica-Bold",
    size: 6.8,
    color: PDF_COLORS.navy,
  });
  dtY -= 13;

  // Guarantee Disclaimer
  pdf.text(REPORT_DISCLAIMERS.guaranteeDisclaimer, 52, dtY, {
    font: "Helvetica",
    size: 6.5,
    color: PDF_COLORS.muted,
  });
  dtY -= 13;

  // Governance Details
  pdf.text(REPORT_DISCLAIMERS.principalOfficer, 52, dtY, {
    font: "Helvetica",
    size: 6.5,
    color: PDF_COLORS.muted,
  });
  dtY -= 11;

  pdf.text(REPORT_DISCLAIMERS.address, 52, dtY, {
    font: "Helvetica",
    size: 6.5,
    color: PDF_COLORS.muted,
  });
  dtY -= 16;

  // Combined Statutory Strip
  pdf.rect(52, dtY - 3, 490, 16, { fill: [0.93, 0.90, 0.83], stroke: PDF_COLORS.gold, lineWidth: 0.8 });
  pdf.text(REPORT_DISCLAIMERS.statutoryCombined, 52 + 245, dtY + 2, {
    font: "Helvetica-Bold",
    size: 6.8,
    color: PDF_COLORS.navy,
    align: "center",
  });

  // Closing Consultation & QR Block
  const closeBoxY = discBoxY - 90;
  pdf.rect(40, closeBoxY, 515.28, 76, { fill: PDF_COLORS.white, stroke: PDF_COLORS.gold, lineWidth: 1 });

  // Left text block
  pdf.text("Schedule Fiduciary Consultation & Access Live Model", 52, closeBoxY + 58, {
    font: "Times-Bold",
    size: 11,
    color: PDF_COLORS.navy,
  });

  pdf.text(
    "Alpha Investment Management is a strictly fee-only SEBI Registered Investment Adviser. To tailor this financial",
    52,
    closeBoxY + 44,
    { font: "Helvetica", size: 7.2, color: PDF_COLORS.muted }
  );
  pdf.text(
    "projection to your personal goals and tax profile, connect directly with our advisory committee at alphaaim.in/contact.",
    52,
    closeBoxY + 33,
    { font: "Helvetica", size: 7.2, color: PDF_COLORS.muted }
  );
  pdf.text("Direct Advisory Portal: https://alphaaim.in/contact", 52, closeBoxY + 18, {
    font: "Helvetica-Bold",
    size: 7.5,
    color: PDF_COLORS.gold,
  });

  // Vector QR Code on Right
  const qrSize = 58;
  const qrX = 555.28 - qrSize - 12;
  const qrY = closeBoxY + 12;
  pdf.qrCode(qrMatrix, qrX, qrY, qrSize, PDF_COLORS.navy);
  pdf.text("Scan to open online", qrX + qrSize / 2, qrY - 6, {
    font: "Helvetica",
    size: 6,
    color: PDF_COLORS.muted,
    align: "center",
  });

  // Page 2 Footer
  pdf.line(40, 48, 555.28, 48, { color: PDF_COLORS.gold, lineWidth: 0.8 });
  pdf.text("Strictly Fee-Only · Zero Distributor Kickbacks · Pune, Maharashtra", 40, 36, {
    font: "Helvetica",
    size: 6.8,
    color: PDF_COLORS.muted,
  });
  pdf.text("Page 2 of 2 · Confidential Client Projection", 555.28, 36, {
    font: "Helvetica",
    size: 6.8,
    color: PDF_COLORS.muted,
    align: "right",
  });

  // Compile PDF
  const bytes = pdf.build();
  const blob = new Blob([bytes], { type: "application/pdf" });

  return { blob, filename, bytes };
}
