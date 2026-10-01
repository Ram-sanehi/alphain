/**
 * Loan Amortization Schedule Computation
 * Calculates yearly breakdown: principal paid, interest paid, and closing balance.
 */

export interface LoanYearBreakdown {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  closingBalance: number;
}

export function calculateLoanAmortizationSchedule(
  principal: number,
  annualInterestRate: number,
  tenureYears: number
): LoanYearBreakdown[] {
  const monthlyRate = annualInterestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let monthlyEmi = 0;
  if (monthlyRate === 0) {
    monthlyEmi = principal / totalMonths;
  } else {
    monthlyEmi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  let currentBalance = principal;
  const schedule: LoanYearBreakdown[] = [];

  for (let yr = 1; yr <= tenureYears; yr++) {
    let yearPrincipal = 0;
    let yearInterest = 0;

    for (let m = 1; m <= 12; m++) {
      if (currentBalance <= 0) break;
      const monthInterest = currentBalance * monthlyRate;
      const monthPrincipal = Math.min(currentBalance, monthlyEmi - monthInterest);
      yearInterest += monthInterest;
      yearPrincipal += monthPrincipal;
      currentBalance = Math.max(0, currentBalance - monthPrincipal);
    }

    schedule.push({
      year: yr,
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      totalPaid: Math.round(yearPrincipal + yearInterest),
      closingBalance: Math.round(currentBalance),
    });
  }

  return schedule;
}
