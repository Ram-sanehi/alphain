/**
 * Alpha Investment Management - Institutional Risk Profile & Suitability Configuration
 * SEBI Registered Investment Adviser (RIA Registration No. INA000017348)
 *
 * Unified configuration defining:
 * 1. 10 Comprehensive Suitability Questions across 5 financial planning dimensions.
 * 2. Mathematical weight definitions and normalized scoring (0 to 100).
 * 3. 5 Scientific Investor Archetypes with indicative asset allocations and volatility envelopes.
 * 4. Fiduciary suitability override guards (e.g. < 1 year horizon cap).
 */

export interface OptionConfig {
  id: string;
  text: string;
  subtext?: string;
  weight: number; // 1 to 4
}

export type RiskDimension =
  | "timeHorizon"
  | "riskTolerance"
  | "riskCapacity"
  | "liquidityNeeds"
  | "investmentExperience";

/**
 * Compliance-editable policy, benchmark, and regulatory constants
 */
export const FIDUCIARY_POLICY_CONSTANTS = {
  shortTermCapitalPolicy:
    "Our fiduciary policy keeps capital needed within 1 year out of high-risk equities.",
  fiduciaryGuardTitle: "Fiduciary Guard",
  pdfReportTitle: "Audit PDF Report",
  pdfReportDescription:
    "Downloadable PDF report with your score, answer summary and advisory link.",
  dimensionsCardTitle: "5 Dimensions",
  dimensionsCardDescription:
    "Evaluates time horizon, risk tolerance, capacity, liquidity, and experience.",
  reassuranceText:
    "Takes about 2 minutes · Your answers are used only to generate this profile",
  overrideAlertTitle: "FIDUCIARY SUITABILITY OVERRIDE APPLIED",
  horizonCapReasonUnder1Yr:
    "Fiduciary Suitability Mandate: Because your investment runway is under 12 months, our fiduciary policy restricts short-term capital from equity volatility, capping your allocation at Conservative Fiduciary.",
  horizonCapReason1to3Yr:
    "Fiduciary Suitability Mandate: For an investment horizon of 1 to 3 years, maximum equity exposure is restricted to preserve capital for planned medium-term goals.",
  drawdownLabel: "Illustrative historical range, not a forecast",
  baslLine: "BASL Membership No. 1982",
  benchmarkLine: "Crisil / Nifty benchmark indices mapped to risk archetype",
  statutoryCaveat:
    "Indicative profile based on your answers. Not an investment recommendation. Suitability is assessed only through a formal advisory engagement.",
  scoringRule:
    "Archetype Category = min(Score-based Category Index, Override Cap Index). Under-1-year horizon caps allocation at Conservative Fiduciary (15% max equity). 1-to-3-year horizon caps allocation at Moderately Conservative (35% max equity).",
} as const;

export interface QuestionConfig {
  id: string;
  number: number;
  category: string;
  dimension: RiskDimension;
  title: string;
  explanation: string;
  whyItMatters: string;
  options: OptionConfig[];
}

export interface ArchetypeConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  minScore: number;
  maxScore: number;
  allocation: {
    equity: number;
    debt: number;
    gold: number;
    cash: number;
    equityRange: string;
    debtRange: string;
    goldRange: string;
    cashRange: string;
  };
  volatilityBand: string;
  benchmark: string;
  recommendedHorizon: string;
}

export interface DimensionScore {
  dimension: RiskDimension;
  label: string;
  score: number; // 0 to 100
  rawScore: number;
  maxPossible: number;
  level: "Conservative" | "Moderate" | "Balanced" | "Growth" | "High";
}

export interface RiskProfileResult {
  rawScore: number;
  maxRawScore: number;
  minRawScore: number;
  normalizedScore: number; // 0 to 100
  archetype: ArchetypeConfig;
  dimensionScores: DimensionScore[];
  isHorizonCapped: boolean;
  horizonCapReason?: string;
  completedAtIso: string;
  answers: Record<string, string>; // questionId -> optionId
}

export const RISK_QUESTIONS: QuestionConfig[] = [
  {
    id: "q1",
    number: 1,
    category: "Time Horizon",
    dimension: "timeHorizon",
    title: "How long do you plan to keep the major portion of your investments untouched?",
    explanation: "Longer investment horizons allow portfolios to comfortably ride out economic cycles.",
    whyItMatters:
      "Time horizon is the single most critical determinant of equity suitability. Money required within 1 to 3 years cannot safely absorb cyclical market drawdowns.",
    options: [
      { id: "q1_o1", text: "Less than 1 year", subtext: "Immediate liquidity required", weight: 1 },
      { id: "q1_o2", text: "1 to 3 years", subtext: "Short-to-medium term milestone", weight: 2 },
      { id: "q1_o3", text: "3 to 7 years", subtext: "Full business/economic cycle", weight: 3 },
      { id: "q1_o4", text: "7+ years (Decade horizon)", subtext: "Multi-year wealth compounding", weight: 4 },
    ],
  },
  {
    id: "q2",
    number: 2,
    category: "Primary Objective",
    dimension: "investmentExperience",
    title: "What is your primary investment goal for this capital?",
    explanation: "Aligns asset selection with your fundamental lifestyle and legacy requirements.",
    whyItMatters:
      "Clarifies whether the core purpose of this portfolio is capital safety, cash-flow generation, or beating inflation through long-term compounding.",
    options: [
      { id: "q2_o1", text: "Capital preservation with zero nominal loss", subtext: "Safety of principal is paramount", weight: 1 },
      { id: "q2_o2", text: "Regular monthly/quarterly income with modest growth", subtext: "Income-first distribution model", weight: 2 },
      { id: "q2_o3", text: "Long-term wealth creation beating inflation by 4-6%", subtext: "Balanced wealth compounding", weight: 3 },
      { id: "q2_o4", text: "Maximum aggressive capital appreciation", subtext: "High equity compounding priority", weight: 4 },
    ],
  },
  {
    id: "q3",
    number: 3,
    category: "Liquidity Buffer",
    dimension: "liquidityNeeds",
    title: "How many months of household expenses do you hold in liquid cash or risk-free bank FDs?",
    explanation: "Adequate emergency reserves ensure you never have to liquidate equities at a market bottom.",
    whyItMatters:
      "A fortress liquidity buffer acts as shock absorption, preventing forced portfolio redemptions during unforeseen personal or business emergencies.",
    options: [
      { id: "q3_o1", text: "Less than 3 months of expenses", subtext: "Minimal emergency liquidity", weight: 1 },
      { id: "q3_o2", text: "3 to 6 months of expenses", subtext: "Standard safety reserve", weight: 2 },
      { id: "q3_o3", text: "6 to 12 months of expenses", subtext: "Robust contingency buffer", weight: 3 },
      { id: "q3_o4", text: "Over 12 months + independent health cover", subtext: "Fortress balance sheet", weight: 4 },
    ],
  },
  {
    id: "q4",
    number: 4,
    category: "Drawdown Resilience",
    dimension: "riskTolerance",
    title: "If a market correction causes your ₹10 Lakh portfolio to decline to ₹8 Lakhs (-20%) in 60 days, what would you do?",
    explanation: "Behavioral psychology during market panics determines long-term compounding success.",
    whyItMatters:
      "Theoretical risk tolerance often evaporates during actual market sell-offs. Behavioral discipline during drawdowns is what captures long-term equity premiums.",
    options: [
      { id: "q4_o1", text: "Liquidate everything immediately to stop further decline", subtext: "Zero volatility tolerance", weight: 1 },
      { id: "q4_o2", text: "Move a major portion into fixed bank deposits", subtext: "Risk-averse reduction", weight: 2 },
      { id: "q4_o3", text: "Hold calmly and wait for recovery", subtext: "Disciplined patience", weight: 3 },
      { id: "q4_o4", text: "Deploy additional cash to accumulate quality assets at discount", subtext: "Opportunistic contrarian buyer", weight: 4 },
    ],
  },
  {
    id: "q5",
    number: 5,
    category: "Income Stability",
    dimension: "riskCapacity",
    title: "How would you describe your household income regularity and career security?",
    explanation: "Stable human capital allows taking calculated market risks in financial assets.",
    whyItMatters:
      "A predictable earned income stream functions economically like a bond coupon, providing the capacity to withstand volatility in your financial assets.",
    options: [
      { id: "q5_o1", text: "Highly volatile / seasonal freelance / vulnerable to downturns", subtext: "Variable earning visibility", weight: 1 },
      { id: "q5_o2", text: "Salaried with moderate bonus variability / small business", subtext: "Moderate predictability", weight: 2 },
      { id: "q5_o3", text: "Stable corporate executive salary or established practice", subtext: "High cash-flow security", weight: 3 },
      { id: "q5_o4", text: "Multiple independent recurring cash flows / passive wealth", subtext: "Perpetual financial independence", weight: 4 },
    ],
  },
  {
    id: "q6",
    number: 6,
    category: "Historical Experience",
    dimension: "investmentExperience",
    title: "Which asset classes have you actively invested in over the past 3 to 5 years?",
    explanation: "Familiarity with market fluctuations prevents premature decision-making.",
    whyItMatters:
      "Firsthand experience navigating at least one complete market correction significantly reduces the risk of panic selling during future economic cycles.",
    options: [
      { id: "q6_o1", text: "Exclusively Bank FDs, PPF, and Post Office savings", subtext: "Guaranteed fixed instruments only", weight: 1 },
      { id: "q6_o2", text: "Debt Mutual Funds, Sovereign Gold Bonds, conservative hybrids", subtext: "Low-volatility market instruments", weight: 2 },
      { id: "q6_o3", text: "Large-cap equity mutual funds, index funds, blue-chip stocks", subtext: "Broad equity market cycle experience", weight: 3 },
      { id: "q6_o4", text: "Direct mid/small-caps, PMS/AIFs, derivatives, unlisted equity", subtext: "Advanced equity & alternative strategies", weight: 4 },
    ],
  },
  {
    id: "q7",
    number: 7,
    category: "Equity Exposure",
    dimension: "riskCapacity",
    title: "What percentage of your total liquid financial net worth is currently deployed in equities?",
    explanation: "Measures your existing portfolio risk concentration.",
    whyItMatters:
      "Analyzing current allocation prevents jarring shifts in your financial life and establishes a smooth transition toward target asset allocation.",
    options: [
      { id: "q7_o1", text: "0% to 15% (Under-allocated to equities)", subtext: "Predominantly fixed income", weight: 1 },
      { id: "q7_o2", text: "15% to 35% (Conservative equity exposure)", subtext: "Modest equity allocation", weight: 2 },
      { id: "q7_o3", text: "35% to 65% (Balanced market exposure)", subtext: "Standard diversified asset mix", weight: 3 },
      { id: "q7_o4", text: "Over 65% (Heavy equity exposure)", subtext: "Aggressive compounding footprint", weight: 4 },
    ],
  },
  {
    id: "q8",
    number: 8,
    category: "Financial Dependents",
    dimension: "riskCapacity",
    title: "How many individuals (children, elderly parents, non-working family) depend on your income?",
    explanation: "Family obligations dictate safety allocations and insurance coverage.",
    whyItMatters:
      "Capital earmarked for upcoming children's education or parental medical security must be ring-fenced in sovereign instruments and debt.",
    options: [
      { id: "q8_o1", text: "4 or more dependents with immediate major commitments", subtext: "Significant liability commitments", weight: 1 },
      { id: "q8_o2", text: "2 to 3 dependents with ongoing education or healthcare needs", subtext: "Moderate family cash-flow obligations", weight: 2 },
      { id: "q8_o3", text: "1 dependent or dual-income household", subtext: "Low liability pressure", weight: 3 },
      { id: "q8_o4", text: "No dependents; self-sufficient household balance sheet", subtext: "High discretionary capital buffer", weight: 4 },
    ],
  },
  {
    id: "q9",
    number: 9,
    category: "Liquidation Probability",
    dimension: "liquidityNeeds",
    title: "Is there any probability you will need to withdraw >25% of this portfolio in the next 24 months?",
    explanation: "Guards against premature exit during unforeseen market downturns.",
    whyItMatters:
      "Capital needed within 24 months for real estate down payments or business capex must never be exposed to equity volatility.",
    options: [
      { id: "q9_o1", text: "Very high probability (property purchase, child admission, etc.)", subtext: "Imminent capital outflow", weight: 1 },
      { id: "q9_o2", text: "Moderate probability if unforeseen expenses arise", subtext: "Potential contingency demand", weight: 2 },
      { id: "q9_o3", text: "Unlikely; all foreseeable short-term needs are ring-fenced", subtext: "Low interruption risk", weight: 3 },
      { id: "q9_o4", text: "Almost zero; capital committed strictly for long-term growth", subtext: "Zero foreseeable redemption need", weight: 4 },
    ],
  },
  {
    id: "q10",
    number: 10,
    category: "Risk vs Return Tradeoff",
    dimension: "riskTolerance",
    title: "Which hypothetical portfolio profile best reflects your personal investment comfort?",
    explanation: "Directly calibrates expected CAGR against historical downside volatility.",
    whyItMatters:
      "Long-term returns cannot be decoupled from interim drawdowns. This question calibrates the exact volatility band your temperament can endure.",
    options: [
      { id: "q10_o1", text: "Portfolio A: 6% fixed return with 0% risk of annual decline", subtext: "Guaranteed capital preservation", weight: 1 },
      { id: "q10_o2", text: "Portfolio B: 9% return with typical annual range of -4% to +16%", subtext: "Conservative hybrid distribution", weight: 2 },
      { id: "q10_o3", text: "Portfolio C: 13% return with typical annual range of -12% to +26%", subtext: "Balanced equity compounding", weight: 3 },
      { id: "q10_o4", text: "Portfolio D: 17%+ return with typical annual range of -25% to +48%", subtext: "Aggressive multi-cap growth", weight: 4 },
    ],
  },
];

export const ARCHETYPES: ArchetypeConfig[] = [
  {
    id: "conservative",
    name: "Conservative Fiduciary",
    tagline: "Capital Preservation & Inflation Defence",
    description:
      "You prioritize total principal security and minimal volatility over aggressive returns. Your optimal asset allocation concentrates in sovereign bonds, AAA corporate debt, and gold, with a measured equity allocation to protect purchasing power against inflation.",
    minScore: 0,
    maxScore: 24,
    allocation: {
      equity: 15,
      debt: 65,
      gold: 15,
      cash: 5,
      equityRange: "10% – 20%",
      debtRange: "60% – 70%",
      goldRange: "10% – 20%",
      cashRange: "5% – 10%",
    },
    volatilityBand: "Low (Max Historical Drawdown: -3% to -5%)",
    benchmark: "Crisil Composite Bond Index",
    recommendedHorizon: "1 to 3 Years",
  },
  {
    id: "mod-conservative",
    name: "Moderately Conservative",
    tagline: "Stable Yield with Calculated Growth",
    description:
      "You seek predictable income with disciplined capital appreciation. You accept mild market fluctuations in exchange for beating fixed deposit returns comfortably after tax, using high-quality debt as a defensive anchor alongside blue-chip equities.",
    minScore: 25,
    maxScore: 45,
    allocation: {
      equity: 35,
      debt: 50,
      gold: 10,
      cash: 5,
      equityRange: "30% – 40%",
      debtRange: "45% – 55%",
      goldRange: "5% – 15%",
      cashRange: "0% – 5%",
    },
    volatilityBand: "Moderate (Max Historical Drawdown: -8% to -10%)",
    benchmark: "Nifty 50 Hybrid Composite Debt 65:35",
    recommendedHorizon: "3 to 5 Years",
  },
  {
    id: "balanced",
    name: "Balanced Wealth Builder",
    tagline: "Optimal Risk-Adjusted Compounding",
    description:
      "Our signature fiduciary strategy. You balance long-term equity compounding with robust downside protection. Equities drive multi-year capital growth while high-grade debt and gold provide liquidity to rebalance during panic corrections.",
    minScore: 46,
    maxScore: 65,
    allocation: {
      equity: 55,
      debt: 35,
      gold: 8,
      cash: 2,
      equityRange: "50% – 60%",
      debtRange: "30% – 40%",
      goldRange: "5% – 10%",
      cashRange: "0% – 5%",
    },
    volatilityBand: "Balanced (Max Historical Drawdown: -14% to -16%)",
    benchmark: "Nifty 500 Multicap 50:50",
    recommendedHorizon: "5 to 7 Years",
  },
  {
    id: "growth",
    name: "Growth-Oriented Compounding",
    tagline: "High Long-Term Capital Appreciation",
    description:
      "You possess a multi-year horizon, strong cash-flow stability, and psychological discipline during drawdowns. High equity allocation captures India's compounding expansion across large-cap and emerging mid-cap market leaders.",
    minScore: 66,
    maxScore: 82,
    allocation: {
      equity: 75,
      debt: 20,
      gold: 5,
      cash: 0,
      equityRange: "70% – 80%",
      debtRange: "15% – 25%",
      goldRange: "0% – 5%",
      cashRange: "0%",
    },
    volatilityBand: "High (Max Historical Drawdown: -20% to -24%)",
    benchmark: "Nifty 500 TRI",
    recommendedHorizon: "7+ Years",
  },
  {
    id: "aggressive",
    name: "Aggressive Wealth Accumulator",
    tagline: "Maximum Long-Term Equity Compounding",
    description:
      "You embrace sharp interim corrections as buying opportunities. Your balance sheet and decade-long horizon allow complete focus on high-alpha equities, mid-caps, and special situations with zero liquidity pressure.",
    minScore: 83,
    maxScore: 100,
    allocation: {
      equity: 85,
      debt: 10,
      gold: 5,
      cash: 0,
      equityRange: "80% – 90%",
      debtRange: "5% – 15%",
      goldRange: "0% – 5%",
      cashRange: "0%",
    },
    volatilityBand: "Aggressive (Max Historical Drawdown: -28% to -35%)",
    benchmark: "Nifty MidSmallcap 400 TRI",
    recommendedHorizon: "10+ Years",
  },
];

export const DIMENSION_METADATA: Record<RiskDimension, { label: string; questionIds: string[] }> = {
  timeHorizon: { label: "Time Horizon", questionIds: ["q1"] },
  riskTolerance: { label: "Risk Tolerance & Drawdown Resilience", questionIds: ["q4", "q10"] },
  riskCapacity: { label: "Financial Risk Capacity", questionIds: ["q5", "q7", "q8"] },
  liquidityNeeds: { label: "Liquidity Contingency Buffer", questionIds: ["q3", "q9"] },
  investmentExperience: { label: "Investment Knowledge & Experience", questionIds: ["q2", "q6"] },
};

/**
 * Validates, scores, and categorizes investor risk profile.
 * Throws explicit descriptive error if answers are missing or invalid.
 */
export function calculateRiskProfile(answers: Record<string, string>): RiskProfileResult {
  if (!answers || typeof answers !== "object") {
    throw new Error("Invalid answers payload: expected object");
  }

  // 1. Guard against incomplete questionnaire
  for (const q of RISK_QUESTIONS) {
    const selectedOptId = answers[q.id];
    if (!selectedOptId) {
      throw new Error(`Incomplete assessment: Question ${q.number} (${q.category}) is unanswered.`);
    }
    const option = q.options.find((o) => o.id === selectedOptId);
    if (!option || typeof option.weight !== "number" || isNaN(option.weight)) {
      throw new Error(`Invalid option selection for Question ${q.number}: ${selectedOptId}`);
    }
  }

  // 2. Compute dynamic min, max, and actual raw scores
  const minRawScore = RISK_QUESTIONS.reduce(
    (sum, q) => sum + Math.min(...q.options.map((o) => o.weight)),
    0
  );
  const maxRawScore = RISK_QUESTIONS.reduce(
    (sum, q) => sum + Math.max(...q.options.map((o) => o.weight)),
    0
  );

  let rawScore = 0;
  for (const q of RISK_QUESTIONS) {
    const optId = answers[q.id];
    const option = q.options.find((o) => o.id === optId)!;
    rawScore += option.weight;
  }

  // Normalize score between 0 and 100
  const normalizedScore = Math.max(
    0,
    Math.min(100, Math.round(((rawScore - minRawScore) / (maxRawScore - minRawScore)) * 100))
  );

  // 3. Compute Per-Dimension Breakdown
  const dimensionScores: DimensionScore[] = Object.entries(DIMENSION_METADATA).map(
    ([dimKey, meta]) => {
      const dimension = dimKey as RiskDimension;
      const questions = RISK_QUESTIONS.filter((q) => meta.questionIds.includes(q.id));
      const dimMin = questions.reduce(
        (sum, q) => sum + Math.min(...q.options.map((o) => o.weight)),
        0
      );
      const dimMax = questions.reduce(
        (sum, q) => sum + Math.max(...q.options.map((o) => o.weight)),
        0
      );

      let dimRaw = 0;
      for (const q of questions) {
        const opt = q.options.find((o) => o.id === answers[q.id])!;
        dimRaw += opt.weight;
      }

      const score = Math.round(((dimRaw - dimMin) / (dimMax - dimMin)) * 100);
      let level: DimensionScore["level"] = "Balanced";
      if (score <= 25) level = "Conservative";
      else if (score <= 45) level = "Moderate";
      else if (score <= 65) level = "Balanced";
      else if (score <= 82) level = "Growth";
      else level = "High";

      return {
        dimension,
        label: meta.label,
        score,
        rawScore: dimRaw,
        maxPossible: dimMax,
        level,
      };
    }
  );

  // 4. Find matching archetype by normalized score
  let matchedArchetype = ARCHETYPES.find(
    (a) => normalizedScore >= a.minScore && normalizedScore <= a.maxScore
  );
  if (!matchedArchetype) {
    matchedArchetype = ARCHETYPES[ARCHETYPES.length - 1];
  }

  // 5. Fiduciary Suitability Override Guards
  // Single documented rule: Category = the lower of the score-based category and any override cap.
  const ARCHETYPE_ORDER = ["conservative", "mod-conservative", "balanced", "growth", "aggressive"] as const;
  const scoreArchetypeIndex = ARCHETYPE_ORDER.indexOf(matchedArchetype.id as typeof ARCHETYPE_ORDER[number]);

  let capIndex: number = ARCHETYPE_ORDER.length - 1; // Default: uncapped (index 4)
  let capReason: string | undefined;

  const q1Answer = answers["q1"];
  if (q1Answer === "q1_o1") {
    // Under 12 months runway: strict cap at Conservative Fiduciary (Index 0, max 15% equity)
    capIndex = 0;
    capReason = FIDUCIARY_POLICY_CONSTANTS.horizonCapReasonUnder1Yr;
  } else if (q1Answer === "q1_o2") {
    // 1 to 3 years runway: cap at Moderately Conservative (Index 1, max 35% equity)
    capIndex = 1;
    capReason = FIDUCIARY_POLICY_CONSTANTS.horizonCapReason1to3Yr;
  }

  let isHorizonCapped = false;
  let horizonCapReason: string | undefined;

  if (scoreArchetypeIndex > capIndex) {
    isHorizonCapped = true;
    horizonCapReason = capReason;
    matchedArchetype = ARCHETYPES[capIndex];
  }

  return {
    rawScore,
    maxRawScore,
    minRawScore,
    normalizedScore,
    archetype: matchedArchetype,
    dimensionScores,
    isHorizonCapped,
    horizonCapReason,
    completedAtIso: new Date().toISOString(),
    answers,
  };
}
