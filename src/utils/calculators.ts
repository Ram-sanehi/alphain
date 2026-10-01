/**
 * Financial Calculators Computation Engine
 * Client-side calculations with shareable query state and year-by-year growth progressions.
 */

// 1. SIP Calculator
export interface SipInputs {
  monthlyInvestment: number;
  expectedReturnRate: number; // in percentage e.g. 12
  timePeriodYears: number;
}

export interface CalculationYearBreakdown {
  year: number;
  investedAmount: number;
  wealthGained: number;
  totalValue: number;
}

export interface SipResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  breakdown: CalculationYearBreakdown[];
}

export function calculateSip(inputs: SipInputs): SipResult {
  const { monthlyInvestment, expectedReturnRate, timePeriodYears } = inputs;
  const monthlyRate = expectedReturnRate / 12 / 100;
  const totalMonths = timePeriodYears * 12;

  let totalValue = 0;
  if (monthlyRate === 0) {
    totalValue = monthlyInvestment * totalMonths;
  } else {
    totalValue =
      monthlyInvestment *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
      (1 + monthlyRate);
  }

  const investedAmount = monthlyInvestment * totalMonths;
  const estimatedReturns = Math.max(0, totalValue - investedAmount);

  // Year by year breakdown
  const breakdown: CalculationYearBreakdown[] = [];
  for (let yr = 1; yr <= timePeriodYears; yr++) {
    const months = yr * 12;
    const inv = monthlyInvestment * months;
    const val =
      monthlyRate === 0
        ? inv
        : monthlyInvestment *
          ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate);
    breakdown.push({
      year: yr,
      investedAmount: Math.round(inv),
      wealthGained: Math.round(Math.max(0, val - inv)),
      totalValue: Math.round(val),
    });
  }

  return {
    investedAmount: Math.round(investedAmount),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    breakdown,
  };
}

// 2. Lumpsum Calculator
export interface LumpsumInputs {
  totalInvestment: number;
  expectedReturnRate: number;
  timePeriodYears: number;
}

export interface LumpsumResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  breakdown: CalculationYearBreakdown[];
}

export function calculateLumpsum(inputs: LumpsumInputs): LumpsumResult {
  const { totalInvestment, expectedReturnRate, timePeriodYears } = inputs;
  const annualRate = expectedReturnRate / 100;

  const totalValue = totalInvestment * Math.pow(1 + annualRate, timePeriodYears);
  const estimatedReturns = totalValue - totalInvestment;

  const breakdown: CalculationYearBreakdown[] = [];
  for (let yr = 1; yr <= timePeriodYears; yr++) {
    const val = totalInvestment * Math.pow(1 + annualRate, yr);
    breakdown.push({
      year: yr,
      investedAmount: Math.round(totalInvestment),
      wealthGained: Math.round(val - totalInvestment),
      totalValue: Math.round(val),
    });
  }

  return {
    investedAmount: Math.round(totalInvestment),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    breakdown,
  };
}

// 3. Step-Up SIP Calculator
export interface StepUpSipInputs {
  initialMonthlyInvestment: number;
  annualStepUpPercent: number; // e.g. 10%
  expectedReturnRate: number; // e.g. 12%
  timePeriodYears: number;
}

export interface StepUpSipResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  normalSipValue: number;
  stepUpAdvantage: number;
  breakdown: CalculationYearBreakdown[];
}

export function calculateStepUpSip(inputs: StepUpSipInputs): StepUpSipResult {
  const { initialMonthlyInvestment, annualStepUpPercent, expectedReturnRate, timePeriodYears } = inputs;
  const monthlyRate = expectedReturnRate / 12 / 100;

  let totalValue = 0;
  let totalInvested = 0;
  let currentMonthly = initialMonthlyInvestment;
  const breakdown: CalculationYearBreakdown[] = [];

  for (let yr = 1; yr <= timePeriodYears; yr++) {
    for (let m = 1; m <= 12; m++) {
      totalInvested += currentMonthly;
      totalValue = (totalValue + currentMonthly) * (1 + monthlyRate);
    }
    breakdown.push({
      year: yr,
      investedAmount: Math.round(totalInvested),
      wealthGained: Math.round(totalValue - totalInvested),
      totalValue: Math.round(totalValue),
    });
    currentMonthly += currentMonthly * (annualStepUpPercent / 100);
  }

  // Normal SIP for comparison
  const normalSip = calculateSip({
    monthlyInvestment: initialMonthlyInvestment,
    expectedReturnRate,
    timePeriodYears,
  });

  return {
    investedAmount: Math.round(totalInvested),
    estimatedReturns: Math.round(totalValue - totalInvested),
    totalValue: Math.round(totalValue),
    normalSipValue: normalSip.totalValue,
    stepUpAdvantage: Math.round(totalValue - normalSip.totalValue),
    breakdown,
  };
}

// 4. Retirement Corpus Calculator
export interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentMonthlyExpense: number;
  expectedInflationRate: number; // e.g. 6%
  preRetirementReturn: number; // e.g. 12%
  postRetirementReturn: number; // e.g. 8%
}

export interface RetirementResult {
  yearsToRetirement: number;
  yearsInRetirement: number;
  monthlyExpenseAtRetirement: number;
  requiredCorpus: number;
  monthlySipRequired: number;
}

export function calculateRetirement(inputs: RetirementInputs): RetirementResult {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentMonthlyExpense,
    expectedInflationRate,
    preRetirementReturn,
    postRetirementReturn,
  } = inputs;

  const yearsToRetirement = Math.max(1, retirementAge - currentAge);
  const yearsInRetirement = Math.max(1, lifeExpectancy - retirementAge);

  // Future monthly expense at retirement age adjusted for inflation
  const inflationDecimal = expectedInflationRate / 100;
  const monthlyExpenseAtRetirement =
    currentMonthlyExpense * Math.pow(1 + inflationDecimal, yearsToRetirement);

  const annualExpenseAtRetirement = monthlyExpenseAtRetirement * 12;

  // Real rate of return post-retirement
  const postReturnDecimal = postRetirementReturn / 100;
  const realRate = (postReturnDecimal - inflationDecimal) / (1 + inflationDecimal);

  // Capital needed for an inflation-adjusted annuity post retirement
  let requiredCorpus = 0;
  if (Math.abs(realRate) < 0.0001) {
    requiredCorpus = annualExpenseAtRetirement * yearsInRetirement;
  } else {
    requiredCorpus =
      annualExpenseAtRetirement *
      ((1 - Math.pow(1 + realRate, -yearsInRetirement)) / realRate);
  }

  // Monthly SIP needed during accumulation phase
  const monthlyPreRate = preRetirementReturn / 12 / 100;
  const accumulationMonths = yearsToRetirement * 12;
  let monthlySipRequired = 0;

  if (monthlyPreRate === 0) {
    monthlySipRequired = requiredCorpus / accumulationMonths;
  } else {
    monthlySipRequired =
      requiredCorpus /
      (((Math.pow(1 + monthlyPreRate, accumulationMonths) - 1) / monthlyPreRate) *
        (1 + monthlyPreRate));
  }

  return {
    yearsToRetirement,
    yearsInRetirement,
    monthlyExpenseAtRetirement: Math.round(monthlyExpenseAtRetirement),
    requiredCorpus: Math.round(requiredCorpus),
    monthlySipRequired: Math.round(monthlySipRequired),
  };
}

// 5. Goal Planner Calculator (Education / Marriage / Home)
export interface GoalInputs {
  goalType: "higher-education" | "marriage" | "luxury-home";
  currentCost: number;
  yearsToGoal: number;
  expectedInflation: number;
  expectedReturn: number;
}

export interface GoalResult {
  futureCost: number;
  monthlySipNeeded: number;
  lumpsumNeededToday: number;
  additionalCostFromInflation: number;
}

export function calculateGoal(inputs: GoalInputs): GoalResult {
  const { currentCost, yearsToGoal, expectedInflation, expectedReturn } = inputs;

  const inflationRate = expectedInflation / 100;
  const futureCost = currentCost * Math.pow(1 + inflationRate, yearsToGoal);
  const additionalCostFromInflation = futureCost - currentCost;

  // Monthly SIP to reach future cost
  const monthlyRate = expectedReturn / 12 / 100;
  const totalMonths = yearsToGoal * 12;
  const monthlySipNeeded =
    monthlyRate === 0
      ? futureCost / totalMonths
      : futureCost /
        (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));

  // Lumpsum needed today
  const annualReturn = expectedReturn / 100;
  const lumpsumNeededToday = futureCost / Math.pow(1 + annualReturn, yearsToGoal);

  return {
    futureCost: Math.round(futureCost),
    monthlySipNeeded: Math.round(monthlySipNeeded),
    lumpsumNeededToday: Math.round(lumpsumNeededToday),
    additionalCostFromInflation: Math.round(additionalCostFromInflation),
  };
}

// 6. Loan EMI Calculator
export interface LoanEmiInputs {
  loanAmount: number;
  interestRate: number; // e.g. 8.5%
  tenureYears: number;
}

export interface LoanEmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  principalPercent: number;
  interestPercent: number;
}

export function calculateLoanEmi(inputs: LoanEmiInputs): LoanEmiResult {
  const { loanAmount, interestRate, tenureYears } = inputs;
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let monthlyEmi = 0;
  if (monthlyRate === 0) {
    monthlyEmi = loanAmount / totalMonths;
  } else {
    monthlyEmi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const totalPayment = monthlyEmi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);
  const principalPercent = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 100;
  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  return {
    monthlyEmi: Math.round(monthlyEmi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    principalPercent: Math.round(principalPercent),
    interestPercent: Math.round(interestPercent),
  };
}

// 7. Income Tax Calculator (Old vs New Regime)
export interface IncomeTaxInputs {
  grossAnnualSalary: number;
  deduction80C: number; // up to 150000
  deduction80D: number; // health insurance up to 75000
  hraExemption: number;
  homeLoanInterest24b: number; // up to 200000
  otherDeductions: number;
}

export interface RegimeTaxDetails {
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  slabTax: number;
  rebate87A: number;
  cess: number; // 4%
  totalTaxLiability: number;
  takeHomeIncome: number;
}

export interface IncomeTaxResult {
  oldRegime: RegimeTaxDetails;
  newRegime: RegimeTaxDetails;
  recommendedRegime: "new" | "old" | "equal";
  taxSavings: number;
}

export function calculateIncomeTax(inputs: IncomeTaxInputs): IncomeTaxResult {
  const {
    grossAnnualSalary,
    deduction80C,
    deduction80D,
    hraExemption,
    homeLoanInterest24b,
    otherDeductions,
  } = inputs;

  // OLD REGIME CALCULATION
  const oldStandardDeduction = 50000;
  const capped80C = Math.min(150000, Math.max(0, deduction80C));
  const capped80D = Math.min(100000, Math.max(0, deduction80D));
  const capped24b = Math.min(200000, Math.max(0, homeLoanInterest24b));
  const oldTotalDeductions =
    oldStandardDeduction + capped80C + capped80D + hraExemption + capped24b + otherDeductions;
  const oldTaxableIncome = Math.max(0, grossAnnualSalary - oldTotalDeductions);

  let oldSlabTax = 0;
  if (oldTaxableIncome > 250000) {
    if (oldTaxableIncome <= 500000) {
      oldSlabTax = (oldTaxableIncome - 250000) * 0.05;
    } else if (oldTaxableIncome <= 1000000) {
      oldSlabTax = 12500 + (oldTaxableIncome - 500000) * 0.2;
    } else {
      oldSlabTax = 112500 + (oldTaxableIncome - 1000000) * 0.3;
    }
  }

  // 87A rebate for Old Regime if taxable <= 5L
  let oldRebate87A = 0;
  if (oldTaxableIncome <= 500000) {
    oldRebate87A = Math.min(oldSlabTax, 12500);
  }
  const oldTaxAfterRebate = Math.max(0, oldSlabTax - oldRebate87A);
  const oldCess = oldTaxAfterRebate * 0.04;
  const oldTotalTax = Math.round(oldTaxAfterRebate + oldCess);

  // NEW REGIME CALCULATION (FY 2024-25 / 2025-26 updated slabs)
  // Standard deduction under Budget 2024 is ₹75,000
  const newStandardDeduction = 75000;
  const newTotalDeductions = newStandardDeduction;
  const newTaxableIncome = Math.max(0, grossAnnualSalary - newTotalDeductions);

  let newSlabTax = 0;
  // Slabs:
  // 0 - 3L: Nil
  // 3L - 7L: 5%
  // 7L - 10L: 10%
  // 10L - 12L: 15%
  // 12L - 15L: 20%
  // Above 15L: 30%
  if (newTaxableIncome > 300000) {
    if (newTaxableIncome <= 700000) {
      newSlabTax = (newTaxableIncome - 300000) * 0.05;
    } else if (newTaxableIncome <= 1000000) {
      newSlabTax = 20000 + (newTaxableIncome - 700000) * 0.1;
    } else if (newTaxableIncome <= 1200000) {
      newSlabTax = 50000 + (newTaxableIncome - 1000000) * 0.15;
    } else if (newTaxableIncome <= 1500000) {
      newSlabTax = 80000 + (newTaxableIncome - 1200000) * 0.2;
    } else {
      newSlabTax = 140000 + (newTaxableIncome - 1500000) * 0.3;
    }
  }

  // 87A rebate for New Regime: full rebate if taxable income <= 7L
  let newRebate87A = 0;
  if (newTaxableIncome <= 700000) {
    newRebate87A = newSlabTax;
  }
  const newTaxAfterRebate = Math.max(0, newSlabTax - newRebate87A);
  const newCess = newTaxAfterRebate * 0.04;
  const newTotalTax = Math.round(newTaxAfterRebate + newCess);

  let recommendedRegime: "new" | "old" | "equal" = "equal";
  let taxSavings = 0;

  if (newTotalTax < oldTotalTax) {
    recommendedRegime = "new";
    taxSavings = oldTotalTax - newTotalTax;
  } else if (oldTotalTax < newTotalTax) {
    recommendedRegime = "old";
    taxSavings = newTotalTax - oldTotalTax;
  }

  return {
    oldRegime: {
      grossIncome: grossAnnualSalary,
      standardDeduction: oldStandardDeduction,
      totalDeductions: oldTotalDeductions,
      taxableIncome: oldTaxableIncome,
      slabTax: Math.round(oldSlabTax),
      rebate87A: Math.round(oldRebate87A),
      cess: Math.round(oldCess),
      totalTaxLiability: oldTotalTax,
      takeHomeIncome: Math.round(grossAnnualSalary - oldTotalTax),
    },
    newRegime: {
      grossIncome: grossAnnualSalary,
      standardDeduction: newStandardDeduction,
      totalDeductions: newTotalDeductions,
      taxableIncome: newTaxableIncome,
      slabTax: Math.round(newSlabTax),
      rebate87A: Math.round(newRebate87A),
      cess: Math.round(newCess),
      totalTaxLiability: newTotalTax,
      takeHomeIncome: Math.round(grossAnnualSalary - newTotalTax),
    },
    recommendedRegime,
    taxSavings,
  };
}

// Currency Formatter helper for Indian numbering system
export function formatINR(amount: number): string {
  if (isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
