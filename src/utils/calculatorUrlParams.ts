/**
 * Compact, Validated Calculator URL Query Params Engine (v=1)
 *
 * Encodes active tab and inputs into compact query strings.
 * Parses, validates, and clamps every parameter within control bounds.
 * Zero unescaped string insertion into the DOM. Client-side only.
 */

export type CalculatorType = "sip" | "lumpsum" | "step-up" | "retirement" | "goal" | "emi" | "tax";
export type GoalMilestoneType = "higher-education" | "marriage" | "luxury-home";

export interface CalculatorStatePayload {
  activeCalc: CalculatorType;
  // SIP
  sipMonthly: number;
  sipRate: number;
  sipYears: number;
  // Lumpsum
  lumpAmount: number;
  lumpRate: number;
  lumpYears: number;
  // Step-Up
  stepMonthly: number;
  stepUpPercent: number;
  stepRate: number;
  stepYears: number;
  // Retirement
  curAge: number;
  retAge: number;
  lifeExp: number;
  monthlyExp: number;
  inflation: number;
  preReturn: number;
  postReturn: number;
  // Goal
  goalType: GoalMilestoneType;
  goalCost: number;
  goalYears: number;
  goalInflation: number;
  goalReturn: number;
  // EMI
  loanPrincipal: number;
  loanRate: number;
  loanTenureYears: number;
  // Tax
  taxSalary: number;
  tax80C: number;
  tax80D: number;
  taxHra: number;
  tax24b: number;
}

export const CALCULATOR_DEFAULTS: CalculatorStatePayload = {
  activeCalc: "sip",
  sipMonthly: 25000,
  sipRate: 12.5,
  sipYears: 15,
  lumpAmount: 500000,
  lumpRate: 12,
  lumpYears: 10,
  stepMonthly: 20000,
  stepUpPercent: 10,
  stepRate: 12,
  stepYears: 15,
  curAge: 32,
  retAge: 58,
  lifeExp: 85,
  monthlyExp: 75000,
  inflation: 6,
  preReturn: 12,
  postReturn: 8,
  goalType: "higher-education",
  goalCost: 3500000,
  goalYears: 10,
  goalInflation: 9,
  goalReturn: 12,
  loanPrincipal: 5000000,
  loanRate: 8.65,
  loanTenureYears: 20,
  taxSalary: 1800000,
  tax80C: 150000,
  tax80D: 35000,
  taxHra: 120000,
  tax24b: 200000,
};

/**
 * Safely parse and clamp numeric input
 */
function clamp(val: number | null | undefined, min: number, max: number, defaultVal: number, step?: number): number {
  if (val === null || val === undefined || isNaN(val) || !isFinite(val)) {
    return defaultVal;
  }
  let clamped = Math.max(min, Math.min(max, val));
  if (step && step > 0) {
    clamped = Math.round((clamped - min) / step) * step + min;
    clamped = Math.max(min, Math.min(max, clamped));
  }
  return Number(clamped.toFixed(2));
}

/**
 * Serialize current calculator state into compact query string ?v=1&calc=...
 */
export function serializeCalculatorParams(state: CalculatorStatePayload): string {
  const p = new URLSearchParams();
  p.set("v", "1");
  p.set("calc", state.activeCalc);

  switch (state.activeCalc) {
    case "sip":
      p.set("m", state.sipMonthly.toString());
      p.set("r", state.sipRate.toString());
      p.set("y", state.sipYears.toString());
      break;
    case "lumpsum":
      p.set("p", state.lumpAmount.toString());
      p.set("r", state.lumpRate.toString());
      p.set("y", state.lumpYears.toString());
      break;
    case "step-up":
      p.set("m", state.stepMonthly.toString());
      p.set("s", state.stepUpPercent.toString());
      p.set("r", state.stepRate.toString());
      p.set("y", state.stepYears.toString());
      break;
    case "retirement":
      p.set("ca", state.curAge.toString());
      p.set("ra", state.retAge.toString());
      p.set("le", state.lifeExp.toString());
      p.set("exp", state.monthlyExp.toString());
      p.set("inf", state.inflation.toString());
      p.set("pr", state.preReturn.toString());
      p.set("por", state.postReturn.toString());
      break;
    case "goal":
      p.set("gt", state.goalType);
      p.set("c", state.goalCost.toString());
      p.set("y", state.goalYears.toString());
      p.set("inf", state.goalInflation.toString());
      p.set("r", state.goalReturn.toString());
      break;
    case "emi":
      p.set("p", state.loanPrincipal.toString());
      p.set("r", state.loanRate.toString());
      p.set("y", state.loanTenureYears.toString());
      break;
    case "tax":
      p.set("sal", state.taxSalary.toString());
      p.set("c80", state.tax80C.toString());
      p.set("d80", state.tax80D.toString());
      p.set("hra", state.taxHra.toString());
      p.set("i24", state.tax24b.toString());
      break;
  }

  return p.toString();
}

/**
 * Parse URLSearchParams and sanitize into validated CalculatorStatePayload
 */
export function deserializeCalculatorParams(params: URLSearchParams): {
  state: CalculatorStatePayload;
  hasCalculationParams: boolean;
} {
  const result: CalculatorStatePayload = { ...CALCULATOR_DEFAULTS };

  const validTypes: CalculatorType[] = ["sip", "lumpsum", "step-up", "retirement", "goal", "emi", "tax"];
  const rawCalc = (params.get("calc") || params.get("type")) as CalculatorType;
  if (validTypes.includes(rawCalc)) {
    result.activeCalc = rawCalc;
  }

  const v = params.get("v");
  const hasV1 = v === "1";
  const hasLegacy = Boolean(params.get("type") || params.get("sip_p") || params.get("lump_p"));
  const hasCalculationParams = hasV1 || hasLegacy;

  // 1. SIP
  const rawSipM = params.get("m") || params.get("sip_p");
  if (rawSipM) result.sipMonthly = clamp(Number(rawSipM), 1000, 500000, 25000, 1000);
  const rawSipR = params.get("r") || params.get("sip_r");
  if (rawSipR) result.sipRate = clamp(Number(rawSipR), 5, 25, 12.5, 0.5);
  const rawSipY = params.get("y") || params.get("sip_y");
  if (rawSipY) result.sipYears = clamp(Number(rawSipY), 1, 35, 15, 1);

  // 2. Lumpsum
  const rawLumpP = params.get("p") || params.get("lump_p");
  if (rawLumpP) result.lumpAmount = clamp(Number(rawLumpP), 50000, 10000000, 500000, 50000);
  const rawLumpR = params.get("r") || params.get("lump_r");
  if (rawLumpR) result.lumpRate = clamp(Number(rawLumpR), 6, 22, 12, 0.5);
  const rawLumpY = params.get("y") || params.get("lump_y");
  if (rawLumpY) result.lumpYears = clamp(Number(rawLumpY), 1, 30, 10, 1);

  // 3. Step-Up
  const rawStepM = params.get("m") || params.get("step_p");
  if (rawStepM) result.stepMonthly = clamp(Number(rawStepM), 5000, 300000, 20000, 5000);
  const rawStepS = params.get("s") || params.get("step_up");
  if (rawStepS) result.stepUpPercent = clamp(Number(rawStepS), 5, 25, 10, 1);
  const rawStepR = params.get("r") || params.get("step_r");
  if (rawStepR) result.stepRate = clamp(Number(rawStepR), 6, 20, 12, 0.5);
  const rawStepY = params.get("y") || params.get("step_y");
  if (rawStepY) result.stepYears = clamp(Number(rawStepY), 3, 30, 15, 1);

  // 4. Retirement
  const rawCurAge = params.get("ca") || params.get("ret_age");
  if (rawCurAge) result.curAge = clamp(Number(rawCurAge), 18, 75, 32, 1);
  const rawRetAge = params.get("ra") || params.get("ret_target");
  if (rawRetAge) result.retAge = clamp(Number(rawRetAge), Math.max(result.curAge + 1, 35), 80, 58, 1);
  const rawLifeExp = params.get("le") || params.get("ret_life");
  if (rawLifeExp) result.lifeExp = clamp(Number(rawLifeExp), Math.max(result.retAge + 1, 60), 100, 85, 1);
  const rawMonthlyExp = params.get("exp") || params.get("ret_exp");
  if (rawMonthlyExp) result.monthlyExp = clamp(Number(rawMonthlyExp), 25000, 500000, 75000, 5000);
  const rawInf = params.get("inf") || params.get("ret_inf");
  if (rawInf) result.inflation = clamp(Number(rawInf), 3, 15, 6, 0.5);
  const rawPreR = params.get("pr") || params.get("ret_pre");
  if (rawPreR) result.preReturn = clamp(Number(rawPreR), 5, 25, 12, 0.5);
  const rawPostR = params.get("por") || params.get("ret_post");
  if (rawPostR) result.postReturn = clamp(Number(rawPostR), 3, 18, 8, 0.5);

  // 5. Goal
  const validGoals: GoalMilestoneType[] = ["higher-education", "marriage", "luxury-home"];
  const rawGt = (params.get("gt") || params.get("goal_type")) as GoalMilestoneType;
  if (validGoals.includes(rawGt)) {
    result.goalType = rawGt;
  }
  const rawGoalC = params.get("c") || params.get("goal_c");
  if (rawGoalC) result.goalCost = clamp(Number(rawGoalC), 500000, 30000000, 3500000, 500000);
  const rawGoalY = params.get("y") || params.get("goal_y");
  if (rawGoalY) result.goalYears = clamp(Number(rawGoalY), 1, 30, 10, 1);
  const rawGoalInf = params.get("inf") || params.get("goal_inf");
  if (rawGoalInf) result.goalInflation = clamp(Number(rawGoalInf), 3, 15, 9, 0.5);
  const rawGoalR = params.get("r") || params.get("goal_r");
  if (rawGoalR) result.goalReturn = clamp(Number(rawGoalR), 5, 25, 12, 0.5);

  // 6. EMI
  const rawEmiP = params.get("p") || params.get("emi_p");
  if (rawEmiP) result.loanPrincipal = clamp(Number(rawEmiP), 500000, 50000000, 5000000, 250000);
  const rawEmiR = params.get("r") || params.get("emi_r");
  if (rawEmiR) result.loanRate = clamp(Number(rawEmiR), 6.5, 16, 8.65, 0.05);
  const rawEmiY = params.get("y") || params.get("emi_y");
  if (rawEmiY) result.loanTenureYears = clamp(Number(rawEmiY), 1, 30, 20, 1);

  // 7. Tax
  const rawTaxSal = params.get("sal") || params.get("tax_sal");
  if (rawTaxSal) result.taxSalary = clamp(Number(rawTaxSal), 300000, 50000000, 1800000, 50000);
  const raw80C = params.get("c80") || params.get("tax_80c");
  if (raw80C) result.tax80C = clamp(Number(raw80C), 0, 150000, 150000, 5000);
  const raw80D = params.get("d80") || params.get("tax_80d");
  if (raw80D) result.tax80D = clamp(Number(raw80D), 0, 100000, 35000, 5000);
  const rawHra = params.get("hra") || params.get("tax_hra");
  if (rawHra) result.taxHra = clamp(Number(rawHra), 0, 1000000, 120000, 10000);
  const raw24b = params.get("i24") || params.get("tax_24b");
  if (raw24b) result.tax24b = clamp(Number(raw24b), 0, 200000, 200000, 10000);

  return { state: result, hasCalculationParams };
}
