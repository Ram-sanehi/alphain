import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { StockTicker } from "@/components/StockTicker";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  TrendingUp,
  Coins,
  ShieldCheck,
  CalendarCheck,
  Calculator,
  Compass,
  ArrowRight,
  Home,
  GraduationCap,
  Heart,
  PiggyBank,
  BadgePercent,
  ReceiptText
} from "lucide-react";
import {
  calculateSip,
  calculateLumpsum,
  calculateStepUpSip,
  calculateRetirement,
  calculateGoal,
  calculateLoanEmi,
  calculateIncomeTax,
  formatINR,
  CalculationYearBreakdown
} from "@/utils/calculators";
import { ReportBar } from "@/components/calculators/ReportBar";
import {
  deserializeCalculatorParams,
  serializeCalculatorParams,
  CalculatorStatePayload,
  CalculatorType,
  GoalMilestoneType
} from "@/utils/calculatorUrlParams";
import {
  AnimatedSummaryCard,
  NumericSliderControl,
  toIndianWords,
} from "@/components/calculators/CalculatorControls";
import {
  SvgRetirementChart,
  SvgGoalChart,
  SvgLoanEmiChart,
  SvgTaxComparisonChart,
} from "@/components/calculators/CalculatorCharts";

export default function Calculators() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Deserialize and sanitize incoming URL params on initial load
  const initialData = useMemo(() => deserializeCalculatorParams(searchParams), [searchParams]);
  const [activeCalc, setActiveCalc] = useState<CalculatorType>(initialData.state.activeCalc);

  // Synchronize URL on tab switch
  const handleCalcChange = (type: CalculatorType) => {
    setActiveCalc(type);
    setSearchParams({ calc: type });
  };

  // Sync state if browser back/forward buttons are clicked
  useEffect(() => {
    const calcFromUrl = searchParams.get("calc") || searchParams.get("type");
    if (
      calcFromUrl &&
      ["sip", "lumpsum", "step-up", "retirement", "goal", "emi", "tax"].includes(calcFromUrl) &&
      calcFromUrl !== activeCalc
    ) {
      setActiveCalc(calcFromUrl as CalculatorType);
    }
  }, [searchParams, activeCalc]);

  // 1. SIP State
  const [sipMonthly, setSipMonthly] = useState(initialData.state.sipMonthly);
  const [sipRate, setSipRate] = useState(initialData.state.sipRate);
  const [sipYears, setSipYears] = useState(initialData.state.sipYears);

  // 2. Lumpsum State
  const [lumpAmount, setLumpAmount] = useState(initialData.state.lumpAmount);
  const [lumpRate, setLumpRate] = useState(initialData.state.lumpRate);
  const [lumpYears, setLumpYears] = useState(initialData.state.lumpYears);

  // 3. Step-Up SIP State
  const [stepMonthly, setStepMonthly] = useState(initialData.state.stepMonthly);
  const [stepUpPercent, setStepUpPercent] = useState(initialData.state.stepUpPercent);
  const [stepRate, setStepRate] = useState(initialData.state.stepRate);
  const [stepYears, setStepYears] = useState(initialData.state.stepYears);

  // 4. Retirement State
  const [curAge, setCurAge] = useState(initialData.state.curAge);
  const [retAge, setRetAge] = useState(initialData.state.retAge);
  const [lifeExp, setLifeExp] = useState(initialData.state.lifeExp);
  const [monthlyExp, setMonthlyExp] = useState(initialData.state.monthlyExp);
  const [inflation, setInflation] = useState(initialData.state.inflation);
  const [preReturn, setPreReturn] = useState(initialData.state.preReturn);
  const [postReturn, setPostReturn] = useState(initialData.state.postReturn);

  // 5. Goal State
  const [goalType, setGoalType] = useState<GoalMilestoneType>(initialData.state.goalType);
  const [goalCost, setGoalCost] = useState(initialData.state.goalCost);
  const [goalYears, setGoalYears] = useState(initialData.state.goalYears);
  const [goalInflation, setGoalInflation] = useState(initialData.state.goalInflation);
  const [goalReturn, setGoalReturn] = useState(initialData.state.goalReturn);

  // 6. EMI State
  const [loanPrincipal, setLoanPrincipal] = useState(initialData.state.loanPrincipal);
  const [loanRate, setLoanRate] = useState(initialData.state.loanRate);
  const [loanTenureYears, setLoanTenureYears] = useState(initialData.state.loanTenureYears);

  // 7. Income Tax State
  const [taxSalary, setTaxSalary] = useState(initialData.state.taxSalary);
  const [tax80C, setTax80C] = useState(initialData.state.tax80C);
  const [tax80D, setTax80D] = useState(initialData.state.tax80D);
  const [taxHra, setTaxHra] = useState(initialData.state.taxHra);
  const [tax24b, setTax24b] = useState(initialData.state.tax24b);

  // Auto-scroll to calculation results if initialized with URL calculation parameters
  useEffect(() => {
    if (initialData.hasCalculationParams) {
      const timer = setTimeout(() => {
        const el = document.getElementById("calculator-results");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [initialData.hasCalculationParams]);

  // Calculation Results
  const sipResult = useMemo(
    () =>
      calculateSip({
        monthlyInvestment: sipMonthly,
        expectedReturnRate: sipRate,
        timePeriodYears: sipYears,
      }),
    [sipMonthly, sipRate, sipYears]
  );

  const lumpsumResult = useMemo(
    () =>
      calculateLumpsum({
        totalInvestment: lumpAmount,
        expectedReturnRate: lumpRate,
        timePeriodYears: lumpYears,
      }),
    [lumpAmount, lumpRate, lumpYears]
  );

  const stepUpResult = useMemo(
    () =>
      calculateStepUpSip({
        initialMonthlyInvestment: stepMonthly,
        annualStepUpPercent: stepUpPercent,
        expectedReturnRate: stepRate,
        timePeriodYears: stepYears,
      }),
    [stepMonthly, stepUpPercent, stepRate, stepYears]
  );

  const retirementResult = useMemo(
    () =>
      calculateRetirement({
        currentAge: curAge,
        retirementAge: retAge,
        lifeExpectancy: lifeExp,
        currentMonthlyExpense: monthlyExp,
        expectedInflationRate: inflation,
        preRetirementReturn: preReturn,
        postRetirementReturn: postReturn,
      }),
    [curAge, retAge, lifeExp, monthlyExp, inflation, preReturn, postReturn]
  );

  const goalResult = useMemo(
    () =>
      calculateGoal({
        goalType,
        currentCost: goalCost,
        yearsToGoal: goalYears,
        expectedInflation: goalInflation,
        expectedReturn: goalReturn,
      }),
    [goalType, goalCost, goalYears, goalInflation, goalReturn]
  );

  const emiResult = useMemo(
    () =>
      calculateLoanEmi({
        loanAmount: loanPrincipal,
        interestRate: loanRate,
        tenureYears: loanTenureYears,
      }),
    [loanPrincipal, loanRate, loanTenureYears]
  );

  const taxResult = useMemo(
    () =>
      calculateIncomeTax({
        grossAnnualSalary: taxSalary,
        deduction80C: tax80C,
        deduction80D: tax80D,
        hraExemption: taxHra,
        homeLoanInterest24b: tax24b,
        otherDeductions: 0,
      }),
    [taxSalary, tax80C, tax80D, taxHra, tax24b]
  );

  // Current consolidated calculator payload for link serialization & report generation
  const currentPayload: CalculatorStatePayload = useMemo(
    () => ({
      activeCalc,
      sipMonthly,
      sipRate,
      sipYears,
      lumpAmount,
      lumpRate,
      lumpYears,
      stepMonthly,
      stepUpPercent,
      stepRate,
      stepYears,
      curAge,
      retAge,
      lifeExp,
      monthlyExp,
      inflation,
      preReturn,
      postReturn,
      goalType,
      goalCost,
      goalYears,
      goalInflation,
      goalReturn,
      loanPrincipal,
      loanRate,
      loanTenureYears,
      taxSalary,
      tax80C,
      tax80D,
      taxHra,
      tax24b,
    }),
    [
      activeCalc,
      sipMonthly,
      sipRate,
      sipYears,
      lumpAmount,
      lumpRate,
      lumpYears,
      stepMonthly,
      stepUpPercent,
      stepRate,
      stepYears,
      curAge,
      retAge,
      lifeExp,
      monthlyExp,
      inflation,
      preReturn,
      postReturn,
      goalType,
      goalCost,
      goalYears,
      goalInflation,
      goalReturn,
      loanPrincipal,
      loanRate,
      loanTenureYears,
      taxSalary,
      tax80C,
      tax80D,
      taxHra,
      tax24b,
    ]
  );

  // Compact shareable link serialized with ?v=1&calc=...
  const currentShareUrl = useMemo(() => {
    const query = serializeCalculatorParams(currentPayload);
    const baseUrl = `${window.location.origin}/calculators`;
    return `${baseUrl}?${query}`;
  }, [currentPayload]);

  // Client-side vector PDF generation dynamically imported on demand
  const handleGeneratePdf = async (stateToGenerate: CalculatorStatePayload) => {
    const { generateCalculatorPdf } = await import("@/components/calculators/pdf/generateReport");
    return generateCalculatorPdf(stateToGenerate, currentShareUrl);
  };

  const tabs = [
    { id: "sip", label: "SIP Calculator", icon: TrendingUp },
    { id: "lumpsum", label: "Lumpsum", icon: Coins },
    { id: "step-up", label: "Step-Up SIP", icon: PiggyBank },
    { id: "retirement", label: "Retirement Corpus", icon: CalendarCheck },
    { id: "goal", label: "Goal Planner", icon: Compass },
    { id: "emi", label: "Loan EMI", icon: Calculator },
    { id: "tax", label: "Tax (Old vs New)", icon: ReceiptText },
  ];

  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const tabListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const activeEl = tabRefs.current[activeCalc];
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeCalc]);

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex >= 0) {
      e.preventDefault();
      const nextTab = tabs[nextIndex].id as CalculatorType;
      handleCalcChange(nextTab);
      tabRefs.current[nextTab]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F5F1E8] flex flex-col selection:bg-[#C9A24B]/30 selection:text-[#F5F1E8] overflow-x-hidden">
      <Navbar />
      <StockTicker />

      <main className="flex-1">
        {/* Editorial Header (No hairline under hero, max-w 1280px shared container) */}
        <section className="relative pt-24 pb-6 sm:pt-32 sm:pb-8 overflow-hidden">
          <div className="w-full max-w-[1280px] mx-auto px-[clamp(24px,4vw,48px)] relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-3xl space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A24B]/10 border border-[#C9A24B]/20 text-[10px] font-mono uppercase tracking-[0.25em] text-[#C9A24B]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Institutional Math · SEBI RIA INA000017348</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F5F1E8] leading-[1.12]">
                Precision wealth <br />
                <span className="italic text-[#C9A24B]">calculators &amp; projections.</span>
              </h1>
              <p className="text-[#A8B0BD] text-sm sm:text-base font-sans font-light max-w-[640px] leading-relaxed [text-wrap:pretty]">
                Model your compounding trajectory with institutional-grade compounding equations. Every simulation can be preserved via a shareable link or audited with our advisory committee.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Sticky Tab Bar (Below fixed nav, sticks at top-16/top-[72px], all 7 tabs fit at >=1280px, horizontal scroll on mobile) */}
        <div className="sticky top-[64px] sm:top-[72px] z-30 bg-[#070B14]/95 backdrop-blur-md py-3 border-b border-white/[0.06]">
          <div className="w-full max-w-[1280px] mx-auto px-[clamp(24px,4vw,48px)]">
            <div className="relative">
              <div
                ref={tabListRef}
                role="tablist"
                aria-label="Wealth Calculators"
                className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#090E1C] border border-white/[0.08] w-full lg:w-fit"
              >
                {tabs.map((tab, idx) => {
                  const Icon = tab.icon;
                  const isActive = activeCalc === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`tab-${tab.id}`}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`panel-${tab.id}`}
                      tabIndex={isActive ? 0 : -1}
                      ref={(el) => (tabRefs.current[tab.id] = el)}
                      onKeyDown={(e) => handleTabKeyDown(e, idx)}
                      onClick={() => handleCalcChange(tab.id as CalculatorType)}
                      className={`relative flex items-center gap-2 py-2.5 px-3.5 sm:px-4 rounded-xl text-[13px] sm:text-[14px] font-sans font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] shrink-0 ${
                        isActive
                          ? "text-[#070B14] font-semibold"
                          : "text-[#A8B0BD] hover:text-[#F5F1E8] hover:bg-white/[0.04]"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="activeTabBadge"
                          className="absolute inset-0 bg-[#C9A96E] rounded-xl shadow-md z-0"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{tab.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              {/* Fade on right edge below 1024px */}
              <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l from-[#070B14] to-transparent lg:hidden" />
            </div>
          </div>
        </div>

        {/* CALCULATOR WORKSPACE (32-40px spacing from sticky tab bar to first row of cards) */}
        <section className="pt-8 sm:pt-10 pb-16 sm:pb-20">
          <div className="w-full max-w-[1280px] mx-auto px-[clamp(24px,4vw,48px)]">
            <AnimatePresence mode="wait">
              
              {/* ========================================================== */}
              {/* 1. SIP CALCULATOR */}
              {/* ========================================================== */}
              {activeCalc === "sip" && (
                <motion.div
                  key="calc-sip"
                  id="panel-sip"
                  role="tabpanel"
                  aria-labelledby="tab-sip"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
                >
                  {/* Left Column: Sliders (Sticky Parameter Card) */}
                  <div className="lg:col-span-5 lg:sticky lg:top-[144px] lg:self-start p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-7 shadow-xl">
                    <div className="space-y-1">
                      <span className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#A8B0BD]">
                        Systematic Investment Plan
                      </span>
                      <h2 className="font-serif text-2xl text-[#F5F1E8]">Monthly Compounding Parameters</h2>
                    </div>

                    {/* Monthly Investment Slider */}
                    <NumericSliderControl
                      id="sip-monthly-slider"
                      label="Monthly Investment"
                      value={sipMonthly}
                      onChange={setSipMonthly}
                      min={1000}
                      max={500000}
                      step={1000}
                      unit="₹"
                      showWords={true}
                    />

                    {/* Expected Return Rate */}
                    <NumericSliderControl
                      id="sip-rate-slider"
                      label="Expected Annual Return (CAGR)"
                      value={sipRate}
                      onChange={setSipRate}
                      min={5}
                      max={25}
                      step={0.5}
                      unit="%"
                      minLabel="5% (Debt)"
                      midLabel="12.5% (Nifty Index)"
                      maxLabel="25% (Alpha)"
                    />

                    {/* Time Period Years */}
                    <NumericSliderControl
                      id="sip-years-slider"
                      label="Investment Horizon"
                      value={sipYears}
                      onChange={setSipYears}
                      min={1}
                      max={35}
                      step={1}
                      unit="Years"
                      minLabel="1 Year"
                      maxLabel="35 Years"
                    />
                  </div>

                  {/* Right Column: Dynamic SVG Chart + Result Cards */}
                  <div id="calculator-results" className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <AnimatedSummaryCard
                        label="Total Invested"
                        numericValue={sipResult.investedAmount}
                        helperText="Principal capital"
                      />
                      <AnimatedSummaryCard
                        label="Estimated Gains"
                        numericValue={sipResult.estimatedReturns}
                        helperText="Compounding growth"
                        highlightValue
                      />
                      <AnimatedSummaryCard
                        label="Total Wealth Corpus"
                        numericValue={sipResult.totalValue}
                        helperText="Maturity value"
                      />
                    </div>

                    {/* Animated SVG Vector Growth Chart */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <span className="font-mono uppercase tracking-wider text-[#A8B0BD] text-[12px]">
                          Trajectory Projection (Years 1 to {sipYears})
                        </span>
                        <div className="flex items-center gap-4 text-[12px] font-mono">
                          <span className="flex items-center gap-1.5 text-[#A8B0BD]">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Invested
                          </span>
                          <span className="flex items-center gap-1.5 text-[#C9A96E]">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A96E]" /> Total Wealth
                          </span>
                        </div>
                      </div>

                      {/* SVG Vector Area Chart */}
                      <SvgTrajectoryChart breakdown={sipResult.breakdown} />
                    </div>

                    {/* Report Bar: Download Report & Share This Calculation */}
                    <ReportBar
                      state={currentPayload}
                      shareUrl={currentShareUrl}
                      onGeneratePdf={handleGeneratePdf}
                    />

                    {/* Talk to an Advisor CTA */}
                    <AdvisorCtaCard
                      title="Ready to put this SIP roadmap into action?"
                      description={`Our investment committee can structure a direct, fee-only portfolio delivering a target of ${formatINR(sipResult.totalValue)} over ${sipYears} years with zero distributor kickbacks.`}
                      contextParam={`SIP:${sipMonthly}/mo,Target:${sipResult.totalValue}`}
                    />
                  </div>
                </motion.div>
              )}

              {/* ========================================================== */}
              {/* 2. LUMPSUM CALCULATOR */}
              {/* ========================================================== */}
              {activeCalc === "lumpsum" && (
                <motion.div
                  key="calc-lump"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
                >
                  <div className="lg:col-span-5 lg:sticky lg:top-[144px] lg:self-start p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-7 shadow-xl">
                    <div className="space-y-1">
                      <span className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#A8B0BD]">
                        One-Time Allocation
                      </span>
                      <h2 className="font-serif text-2xl text-[#F5F1E8]">Lumpsum Capital Parameters</h2>
                    </div>

                    <NumericSliderControl
                      id="lump-amount-slider"
                      label="Initial Investment"
                      value={lumpAmount}
                      onChange={setLumpAmount}
                      min={50000}
                      max={10000000}
                      step={50000}
                      unit="₹"
                      showWords={true}
                      maxLabel="₹1,00,00,000 (1 Cr)"
                    />

                    <NumericSliderControl
                      id="lump-rate-slider"
                      label="Expected Annual Return"
                      value={lumpRate}
                      onChange={setLumpRate}
                      min={6}
                      max={22}
                      step={0.5}
                      unit="%"
                    />

                    <NumericSliderControl
                      id="lump-years-slider"
                      label="Time Horizon"
                      value={lumpYears}
                      onChange={setLumpYears}
                      min={1}
                      max={30}
                      step={1}
                      unit="Years"
                    />
                  </div>

                  <div id="calculator-results" className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <AnimatedSummaryCard
                        label="Principal Deployed"
                        numericValue={lumpsumResult.investedAmount}
                        helperText="Original capital"
                      />
                      <AnimatedSummaryCard
                        label="Compounded Growth"
                        numericValue={lumpsumResult.estimatedReturns}
                        helperText="Compounding gains"
                        highlightValue
                      />
                      <AnimatedSummaryCard
                        label="Projected Value"
                        numericValue={lumpsumResult.totalValue}
                        helperText="Maturity value"
                      />
                    </div>

                    <div className="p-6 sm:p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <span className="font-mono uppercase tracking-wider text-[#A8B0BD] text-[12px]">Lumpsum Exponential Curve</span>
                        <div className="flex items-center gap-4 text-[12px] font-mono">
                          <span className="flex items-center gap-1.5 text-[#A8B0BD]">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Invested
                          </span>
                          <span className="flex items-center gap-1.5 text-[#C9A96E]">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A96E]" /> Total Wealth
                          </span>
                        </div>
                      </div>
                      <SvgTrajectoryChart breakdown={lumpsumResult.breakdown} />
                    </div>

                    {/* Report Bar: Download Report & Share This Calculation */}
                    <ReportBar
                      state={currentPayload}
                      shareUrl={currentShareUrl}
                      onGeneratePdf={handleGeneratePdf}
                    />

                    <AdvisorCtaCard
                      title="Deploying institutional capital or a windfall?"
                      description={`Our committee offers staggered STP (Systematic Transfer Plan) deployment to protect against market peaks when allocating ${formatINR(lumpAmount)}.`}
                      contextParam={`Lumpsum:${lumpAmount},Horizon:${lumpYears}yr`}
                    />
                  </div>
                </motion.div>
              )}

              {/* ========================================================== */}
              {/* 3. STEP-UP SIP CALCULATOR */}
              {/* ========================================================== */}
              {activeCalc === "step-up" && (
                <motion.div
                  key="calc-stepup"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
                >
                  <div className="lg:col-span-5 lg:sticky lg:top-[144px] lg:self-start p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-7 shadow-xl">
                    <div className="space-y-1">
                      <span className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#A8B0BD]">
                        Accelerated Wealth Creation
                      </span>
                      <h2 className="font-serif text-2xl text-[#F5F1E8]">Annual Step-Up Increment</h2>
                    </div>

                    <NumericSliderControl
                      id="step-monthly-slider"
                      label="Starting Monthly SIP"
                      value={stepMonthly}
                      onChange={setStepMonthly}
                      min={5000}
                      max={300000}
                      step={5000}
                      unit="₹"
                      showWords={true}
                    />

                    <NumericSliderControl
                      id="step-up-percent-slider"
                      label="Annual Step-Up (% Increase)"
                      value={stepUpPercent}
                      onChange={setStepUpPercent}
                      min={5}
                      max={25}
                      step={1}
                      unit="%"
                      minLabel="5%"
                      midLabel="10% (Appraisal)"
                      maxLabel="25%"
                    />

                    <NumericSliderControl
                      id="step-rate-slider"
                      label="Expected CAGR"
                      value={stepRate}
                      onChange={setStepRate}
                      min={6}
                      max={20}
                      step={0.5}
                      unit="%"
                    />

                    <NumericSliderControl
                      id="step-years-slider"
                      label="Duration"
                      value={stepYears}
                      onChange={setStepYears}
                      min={3}
                      max={30}
                      step={1}
                      unit="Years"
                      minLabel="3 Years"
                      maxLabel="30 Years"
                    />
                  </div>

                  <div id="calculator-results" className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <AnimatedSummaryCard
                        label="Total Capital Contributed"
                        numericValue={stepUpResult.investedAmount}
                        helperText="Principal deposited"
                      />
                      <AnimatedSummaryCard
                        label="Step-Up Maturity Corpus"
                        numericValue={stepUpResult.totalValue}
                        helperText="Maturity value"
                      />
                      <AnimatedSummaryCard
                        label="Extra Wealth Created"
                        numericValue={stepUpResult.stepUpAdvantage}
                        prefix="+"
                        helperText="vs flat SIP without step-up"
                        highlightValue
                      />
                    </div>

                    <div className="p-6 sm:p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <span className="font-mono uppercase tracking-wider text-[#A8B0BD] text-[12px]">
                          Step-Up Compounding Trajectory
                        </span>
                        <div className="flex items-center gap-4 text-[12px] font-mono">
                          <span className="flex items-center gap-1.5 text-[#A8B0BD]">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Invested
                          </span>
                          <span className="flex items-center gap-1.5 text-[#C9A96E]">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A96E]" /> Total Wealth
                          </span>
                        </div>
                      </div>
                      <SvgTrajectoryChart breakdown={stepUpResult.breakdown} />
                    </div>

                    {/* Report Bar: Download Report & Share This Calculation */}
                    <ReportBar
                      state={currentPayload}
                      shareUrl={currentShareUrl}
                      onGeneratePdf={handleGeneratePdf}
                    />

                    <AdvisorCtaCard
                      title="Harness the true power of Step-Up investing"
                      description={`Stepping up contributions by ${stepUpPercent}% per year generates an additional ${formatINR(stepUpResult.stepUpAdvantage)} in net wealth.`}
                      contextParam={`StepUp:${stepMonthly}+${stepUpPercent}%,Advantage:${stepUpResult.stepUpAdvantage}`}
                    />
                  </div>
                </motion.div>
              )}

              {/* ========================================================== */}
              {/* 4. RETIREMENT CORPUS CALCULATOR */}
              {/* ========================================================== */}
              {activeCalc === "retirement" && (
                <motion.div
                  key="calc-retirement"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
                >
                  <div className="lg:col-span-5 lg:sticky lg:top-[144px] lg:self-start p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-6 shadow-xl">
                    <div className="space-y-1">
                      <span className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#A8B0BD]">
                        Lifelong Financial Independence
                      </span>
                      <h2 className="font-serif text-2xl text-[#F5F1E8]">Retirement Variables</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-mono uppercase text-[#A8B0BD]">Current Age</label>
                        <input
                          type="number"
                          value={curAge}
                          onChange={(e) => setCurAge(Number(e.target.value))}
                          className="w-full h-[44px] bg-[#070B14] border border-white/10 rounded-xl px-3 text-sm text-[#F5F1E8] font-mono [font-variant-numeric:lining-nums_tabular-nums] focus:outline-none focus:border-[#C9A96E]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-mono uppercase text-[#A8B0BD]">Retirement Target</label>
                        <input
                          type="number"
                          value={retAge}
                          onChange={(e) => setRetAge(Number(e.target.value))}
                          className="w-full h-[44px] bg-[#070B14] border border-white/10 rounded-xl px-3 text-sm text-[#F5F1E8] font-mono [font-variant-numeric:lining-nums_tabular-nums] focus:outline-none focus:border-[#C9A96E]"
                        />
                      </div>
                    </div>

                    <NumericSliderControl
                      id="monthly-exp-slider"
                      label="Current Monthly Household Expenses"
                      value={monthlyExp}
                      onChange={setMonthlyExp}
                      min={25000}
                      max={500000}
                      step={5000}
                      unit="₹"
                      showWords={true}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-mono uppercase text-[#A8B0BD]">Expected Inflation (%)</label>
                        <input
                          type="number"
                          step={0.5}
                          value={inflation}
                          onChange={(e) => setInflation(Number(e.target.value))}
                          className="w-full h-[44px] bg-[#070B14] border border-white/10 rounded-xl px-3 text-sm text-[#F5F1E8] font-mono [font-variant-numeric:lining-nums_tabular-nums] focus:outline-none focus:border-[#C9A96E]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-mono uppercase text-[#A8B0BD]">Life Expectancy</label>
                        <input
                          type="number"
                          value={lifeExp}
                          onChange={(e) => setLifeExp(Number(e.target.value))}
                          className="w-full h-[44px] bg-[#070B14] border border-white/10 rounded-xl px-3 text-sm text-[#F5F1E8] font-mono [font-variant-numeric:lining-nums_tabular-nums] focus:outline-none focus:border-[#C9A96E]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase text-[#A8B0BD]">Pre-Ret CAGR (%)</label>
                        <input
                          type="number"
                          step={0.5}
                          value={preReturn}
                          onChange={(e) => setPreReturn(Number(e.target.value))}
                          className="w-full h-[40px] bg-[#070B14] border border-white/10 rounded-xl px-3 text-sm text-[#F5F1E8] font-mono [font-variant-numeric:lining-nums_tabular-nums] focus:outline-none focus:border-[#C9A96E]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase text-[#A8B0BD]">Post-Ret CAGR (%)</label>
                        <input
                          type="number"
                          step={0.5}
                          value={postReturn}
                          onChange={(e) => setPostReturn(Number(e.target.value))}
                          className="w-full h-[40px] bg-[#070B14] border border-white/10 rounded-xl px-3 text-sm text-[#F5F1E8] font-mono [font-variant-numeric:lining-nums_tabular-nums] focus:outline-none focus:border-[#C9A96E]"
                        />
                      </div>
                    </div>
                  </div>

                  <div id="calculator-results" className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <AnimatedSummaryCard
                        label="Required Retirement Corpus"
                        numericValue={retirementResult.requiredCorpus}
                        helperText={`Guarantees inflation-adjusted income until age ${lifeExp}.`}
                        highlightValue
                      />
                      <AnimatedSummaryCard
                        label="Monthly SIP Needed Today"
                        numericValue={retirementResult.monthlySipRequired}
                        helperText={`Disciplined ${preReturn}% allocation over ${retirementResult.yearsToRetirement} years.`}
                      />
                      <AnimatedSummaryCard
                        label="Future Monthly Expense"
                        numericValue={retirementResult.monthlyExpenseAtRetirement}
                        helperText={`At age ${retAge} inflating at ${inflation}% p.a.`}
                      />
                    </div>

                    {/* Interactive Lifecycle Trajectory (Accumulation & Drawdown) */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <span className="font-mono uppercase tracking-wider text-[#A8B0BD] text-[12px]">
                          Lifecycle Trajectory (Age {curAge} to {lifeExp})
                        </span>
                        <div className="flex items-center gap-4 text-[12px] font-mono">
                          <span className="flex items-center gap-1.5 text-[#C9A96E]">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A96E]" /> Corpus Progression
                          </span>
                          <span className="flex items-center gap-1.5 text-[#A8B0BD]">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Milestone Marker
                          </span>
                        </div>
                      </div>
                      <SvgRetirementChart
                        currentAge={curAge}
                        retirementAge={retAge}
                        lifeExpectancy={lifeExp}
                        monthlyExpense={monthlyExp}
                        inflation={inflation}
                        preReturn={preReturn}
                        postReturn={postReturn}
                        requiredCorpus={retirementResult.requiredCorpus}
                        monthlySip={retirementResult.monthlySipRequired}
                      />
                    </div>

                    <div className="p-6 sm:p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-4">
                      <h4 className="font-serif text-[22px] text-[#F5F1E8]">Inflation Impact Analysis</h4>
                      <p className="text-[14px] sm:text-[15px] text-[#A8B0BD] font-light leading-relaxed">
                        At age {retAge}, your current living expense of{" "}
                        <strong className="text-[#F5F1E8] font-medium [font-variant-numeric:lining-nums_tabular-nums]">
                          {formatINR(monthlyExp)}/month
                        </strong>{" "}
                        will inflate to approximately{" "}
                        <strong className="text-[#F5F1E8] font-medium [font-variant-numeric:lining-nums_tabular-nums]">
                          {formatINR(retirementResult.monthlyExpenseAtRetirement)}/month
                        </strong>{" "}
                        due to a{" "}
                        <span className="text-[#F5F1E8] font-medium [font-variant-numeric:lining-nums_tabular-nums]">
                          {inflation}%
                        </span>{" "}
                        compounding inflation rate.
                      </p>
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[12px] font-mono text-[#A8B0BD] space-y-1.5 [font-variant-numeric:lining-nums_tabular-nums]">
                        <div>Accumulation Phase: {retirementResult.yearsToRetirement} Years (until age {retAge})</div>
                        <div>Distribution Phase: {retirementResult.yearsInRetirement} Years (through age {lifeExp})</div>
                      </div>
                    </div>

                    {/* Report Bar: Download Report & Share This Calculation */}
                    <ReportBar
                      state={currentPayload}
                      shareUrl={currentShareUrl}
                      onGeneratePdf={handleGeneratePdf}
                    />

                    <AdvisorCtaCard
                      title="Design an institutional retirement drawdown plan"
                      description={`Our fiduciary advisors build customized SWP (Systematic Withdrawal Plan) portfolios engineered for zero tax leakage and perpetual longevity.`}
                      contextParam={`RetirementCorpus:${retirementResult.requiredCorpus},TargetAge:${retAge}`}
                    />
                  </div>
                </motion.div>
              )}

              {/* ========================================================== */}
              {/* 5. GOAL PLANNER CALCULATOR */}
              {/* ========================================================== */}
              {activeCalc === "goal" && (
                <motion.div
                  key="calc-goal"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
                >
                  <div className="lg:col-span-5 lg:sticky lg:top-[144px] lg:self-start p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-6 shadow-xl">
                    <div className="space-y-1">
                      <span className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#A8B0BD]">
                        Target Milestone Planning
                      </span>
                      <h2 className="font-serif text-2xl text-[#F5F1E8]">Select Milestone</h2>
                    </div>

                    {/* Goal Type Switcher */}
                    <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-[#070B14] border border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => {
                          setGoalType("higher-education");
                          setGoalInflation(10);
                        }}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg text-[12px] font-sans transition-colors ${
                          goalType === "higher-education"
                            ? "bg-[#C9A96E] text-[#070B14] font-semibold"
                            : "text-[#A8B0BD] hover:text-white"
                        }`}
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Education</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setGoalType("marriage");
                          setGoalInflation(8);
                        }}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg text-[12px] font-sans transition-colors ${
                          goalType === "marriage"
                            ? "bg-[#C9A96E] text-[#070B14] font-semibold"
                            : "text-[#A8B0BD] hover:text-white"
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                        <span>Marriage</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setGoalType("luxury-home");
                          setGoalInflation(6);
                        }}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg text-[12px] font-sans transition-colors ${
                          goalType === "luxury-home"
                            ? "bg-[#C9A96E] text-[#070B14] font-semibold"
                            : "text-[#A8B0BD] hover:text-white"
                        }`}
                      >
                        <Home className="w-4 h-4" />
                        <span>Real Estate</span>
                      </button>
                    </div>

                    <NumericSliderControl
                      id="goal-cost-slider"
                      label="Current Cost of This Goal"
                      value={goalCost}
                      onChange={setGoalCost}
                      min={500000}
                      max={30000000}
                      step={500000}
                      unit="₹"
                      showWords={true}
                      maxLabel="₹3,00,00,000 (3 Cr)"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-mono uppercase text-[#A8B0BD]">Years to Goal</label>
                        <input
                          type="number"
                          value={goalYears}
                          onChange={(e) => setGoalYears(Number(e.target.value))}
                          className="w-full h-[44px] bg-[#070B14] border border-white/10 rounded-xl px-3 text-sm text-[#F5F1E8] font-mono [font-variant-numeric:lining-nums_tabular-nums] focus:outline-none focus:border-[#C9A96E]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-mono uppercase text-[#A8B0BD]">Goal Inflation (%)</label>
                        <input
                          type="number"
                          value={goalInflation}
                          onChange={(e) => setGoalInflation(Number(e.target.value))}
                          className="w-full h-[44px] bg-[#070B14] border border-white/10 rounded-xl px-3 text-sm text-[#F5F1E8] font-mono [font-variant-numeric:lining-nums_tabular-nums] focus:outline-none focus:border-[#C9A96E]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                      <label className="text-[11px] font-mono uppercase text-[#A8B0BD]">Expected Investment Return (CAGR %)</label>
                      <input
                        type="number"
                        step={0.5}
                        value={goalReturn}
                        onChange={(e) => setGoalReturn(Number(e.target.value))}
                        className="w-full h-[40px] bg-[#070B14] border border-white/10 rounded-xl px-3 text-sm text-[#F5F1E8] font-mono [font-variant-numeric:lining-nums_tabular-nums] focus:outline-none focus:border-[#C9A96E]"
                      />
                    </div>
                  </div>

                  <div id="calculator-results" className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <AnimatedSummaryCard
                        label="Future Inflation Cost"
                        numericValue={goalResult.futureCost}
                        helperText={`In ${goalYears} years with ${goalInflation}% inflation`}
                      />
                      <AnimatedSummaryCard
                        label="Monthly SIP Required"
                        numericValue={goalResult.monthlySipNeeded}
                        helperText="Starting today"
                        highlightValue
                      />
                      <AnimatedSummaryCard
                        label="Lumpsum Option"
                        numericValue={goalResult.lumpsumNeededToday}
                        helperText="One-time allocation today"
                      />
                    </div>

                    {/* Interactive Goal Trajectory Chart */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <span className="font-mono uppercase tracking-wider text-[#A8B0BD] text-[12px]">
                          Goal Funding Trajectory (Years 0 to {goalYears})
                        </span>
                        <div className="flex items-center gap-4 text-[12px] font-mono">
                          <span className="flex items-center gap-1.5 text-[#94A3B8]">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Inflated Target
                          </span>
                          <span className="flex items-center gap-1.5 text-[#C9A96E]">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A96E]" /> Projected Wealth
                          </span>
                        </div>
                      </div>
                      <SvgGoalChart
                        goalType={goalType}
                        currentCost={goalCost}
                        years={goalYears}
                        inflation={goalInflation}
                        returnRate={goalReturn}
                        futureCost={goalResult.futureCost}
                        monthlySip={goalResult.monthlySipNeeded}
                      />
                    </div>

                    <div className="p-6 sm:p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-4">
                      <h4 className="font-serif text-[22px] text-[#F5F1E8]">Inflation Surge Summary</h4>
                      <p className="text-[14px] sm:text-[15px] text-[#A8B0BD] font-light leading-relaxed">
                        Due to the compounding inflation rate of{" "}
                        <strong className="text-[#F5F1E8] font-medium [font-variant-numeric:lining-nums_tabular-nums]">
                          {goalInflation}%
                        </strong>{" "}
                        in {goalType.replace("-", " ")}, your target cost escalates by an additional{" "}
                        <strong className="text-[#F5F1E8] font-medium [font-variant-numeric:lining-nums_tabular-nums]">
                          {formatINR(goalResult.additionalCostFromInflation)}
                        </strong>{" "}
                        by maturity.
                      </p>
                    </div>

                    {/* Report Bar: Download Report & Share This Calculation */}
                    <ReportBar
                      state={currentPayload}
                      shareUrl={currentShareUrl}
                      onGeneratePdf={handleGeneratePdf}
                    />

                    <AdvisorCtaCard
                      title={`Ringfence funding for your ${goalType.replace("-", " ")}`}
                      description={`We align debt instruments to match the exact maturity date of your goal so market drawdowns never imperil your family's timeline.`}
                      contextParam={`Goal:${goalType},Cost:${goalResult.futureCost}`}
                    />
                  </div>
                </motion.div>
              )}

              {/* ========================================================== */}
              {/* 6. LOAN EMI CALCULATOR */}
              {/* ========================================================== */}
              {activeCalc === "emi" && (
                <motion.div
                  key="calc-emi"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
                >
                  <div className="lg:col-span-5 lg:sticky lg:top-[144px] lg:self-start p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-7 shadow-xl">
                    <div className="space-y-1">
                      <span className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#A8B0BD]">
                        Debt &amp; Mortgages
                      </span>
                      <h2 className="font-serif text-2xl text-[#F5F1E8]">Loan Parameters</h2>
                    </div>

                    <NumericSliderControl
                      id="loan-amount-slider"
                      label="Loan Amount"
                      value={loanPrincipal}
                      onChange={setLoanPrincipal}
                      min={500000}
                      max={50000000}
                      step={250000}
                      unit="₹"
                      showWords={true}
                      maxLabel="₹5,00,00,000 (5 Cr)"
                    />

                    <NumericSliderControl
                      id="loan-rate-slider"
                      label="Interest Rate (Annual %)"
                      value={loanRate}
                      onChange={setLoanRate}
                      min={6.5}
                      max={16}
                      step={0.1}
                      unit="%"
                    />

                    <NumericSliderControl
                      id="loan-tenure-slider"
                      label="Tenure (Years)"
                      value={loanTenureYears}
                      onChange={setLoanTenureYears}
                      min={1}
                      max={30}
                      step={1}
                      unit="Years"
                    />
                  </div>

                  <div id="calculator-results" className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <AnimatedSummaryCard
                        label="Monthly EMI"
                        numericValue={emiResult.monthlyEmi}
                        helperText="Monthly installment"
                        highlightValue
                      />
                      <AnimatedSummaryCard
                        label="Total Interest"
                        numericValue={emiResult.totalInterest}
                        helperText="Cost of borrowing"
                      />
                      <AnimatedSummaryCard
                        label="Total Payment"
                        numericValue={emiResult.totalPayment}
                        helperText="Principal + Interest"
                      />
                    </div>

                    {/* Interactive Loan Amortization Chart */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <span className="font-mono uppercase tracking-wider text-[#A8B0BD] text-[12px]">
                          Amortization Curve ({loanTenureYears} Years)
                        </span>
                        <div className="flex items-center gap-4 text-[12px] font-mono">
                          <span className="flex items-center gap-1.5 text-[#C9A96E]">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A96E]" /> Loan Balance
                          </span>
                          <span className="flex items-center gap-1.5 text-[#64748B]">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Cumulative Interest
                          </span>
                        </div>
                      </div>
                      <SvgLoanEmiChart
                        principal={loanPrincipal}
                        rate={loanRate}
                        tenureYears={loanTenureYears}
                        monthlyEmi={emiResult.monthlyEmi}
                        totalInterest={emiResult.totalInterest}
                      />
                    </div>

                    {/* Principal vs Interest Breakdown Bar */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-4">
                      <span className="font-mono text-[12px] uppercase tracking-wider text-[#A8B0BD]">Repayment Ratio</span>
                      <div className="h-4 w-full rounded-full bg-slate-800 overflow-hidden flex">
                        <div
                          style={{ width: `${emiResult.principalPercent}%` }}
                          className="bg-[#C9A96E] h-full"
                          title="Principal"
                        />
                        <div
                          style={{ width: `${emiResult.interestPercent}%` }}
                          className="bg-slate-600 h-full"
                          title="Interest"
                        />
                      </div>
                      <div className="flex justify-between text-[12px] font-mono [font-variant-numeric:lining-nums_tabular-nums]">
                        <span className="text-[#C9A96E]">Principal: {emiResult.principalPercent.toFixed(1)}%</span>
                        <span className="text-[#A8B0BD]">Interest: {emiResult.interestPercent.toFixed(1)}%</span>
                      </div>
                    </div>

                    {/* Report Bar: Download Report & Share This Calculation */}
                    <ReportBar
                      state={currentPayload}
                      shareUrl={currentShareUrl}
                      onGeneratePdf={handleGeneratePdf}
                    />

                    <AdvisorCtaCard
                      title="Optimize your debt servicing costs"
                      description={`We assist HNIs and business owners with Loan Against Property (LAP) refinancing and balance transfer syndication to lower effective interest rates.`}
                      contextParam={`Loan:${loanPrincipal},EMI:${emiResult.monthlyEmi}`}
                    />
                  </div>
                </motion.div>
              )}

              {/* ========================================================== */}
              {/* 7. INCOME TAX CALCULATOR (OLD VS NEW REGIME) */}
              {/* ========================================================== */}
              {activeCalc === "tax" && (
                <motion.div
                  key="calc-tax"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
                >
                  <div className="lg:col-span-5 lg:sticky lg:top-[144px] lg:self-start p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-6 shadow-xl">
                    <div className="space-y-1">
                      <span className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#A8B0BD]">
                        FY 2024-25 &amp; FY 2025-26
                      </span>
                      <h2 className="font-serif text-2xl text-[#F5F1E8]">Income &amp; Deductions</h2>
                    </div>

                    <div>
                      <CurrencyInputWithStepper
                        id="tax-salary"
                        label="Gross Annual CTC / Salary"
                        value={taxSalary}
                        onChange={setTaxSalary}
                        step={50000}
                      />
                      {taxSalary > 0 && (
                        <p className="text-[11px] font-mono text-[#C9A96E]/80 tracking-wide truncate select-none mt-1.5 pl-0.5">
                          {toIndianWords(taxSalary)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                      <span className="text-[12px] font-mono uppercase tracking-wider text-[#A8B0BD] block">
                        Eligible Deductions (For Old Regime)
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <CurrencyInputWithStepper
                          id="tax-80c"
                          label="Section 80C"
                          subLabel="Max ₹1.5L"
                          value={tax80C}
                          onChange={setTax80C}
                          step={10000}
                          max={150000}
                        />
                        <CurrencyInputWithStepper
                          id="tax-80d"
                          label="Section 80D"
                          subLabel="Health"
                          value={tax80D}
                          onChange={setTax80D}
                          step={5000}
                          max={100000}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <CurrencyInputWithStepper
                          id="tax-hra"
                          label="HRA Exemption"
                          value={taxHra}
                          onChange={setTaxHra}
                          step={10000}
                        />
                        <CurrencyInputWithStepper
                          id="tax-24b"
                          label="Home Loan Interest 24(B)"
                          value={tax24b}
                          onChange={setTax24b}
                          step={10000}
                          max={200000}
                        />
                      </div>
                    </div>
                  </div>

                  <div id="calculator-results" className="lg:col-span-7 space-y-6">
                    {/* Standardized 3-Card Result Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <AnimatedSummaryCard
                        label="Recommended Regime"
                        formattedText={
                          taxResult.recommendedRegime === "new"
                            ? "New Tax Regime"
                            : taxResult.recommendedRegime === "old"
                            ? "Old Tax Regime"
                            : "Equal Liability"
                        }
                        helperText={
                          taxResult.taxSavings > 0
                            ? `Saves ${formatINR(taxResult.taxSavings)} per year`
                            : "Both regimes yield equal tax"
                        }
                        highlightValue
                      />
                      <AnimatedSummaryCard
                        label="Annual Tax Savings"
                        numericValue={taxResult.taxSavings}
                        helperText="Net annual tax reduction"
                      />
                      <AnimatedSummaryCard
                        label="Net Tax Liability"
                        numericValue={
                          taxResult.recommendedRegime === "new"
                            ? taxResult.newRegime.totalTaxLiability
                            : taxResult.oldRegime.totalTaxLiability
                        }
                        helperText={`Under recommended ${taxResult.recommendedRegime.toUpperCase()} regime`}
                      />
                    </div>

                    {/* Interactive Tax Comparison Chart */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <span className="font-mono uppercase tracking-wider text-[#A8B0BD] text-[12px]">
                          Regime Comparison (FY 2024-25 / FY 2025-26)
                        </span>
                        <div className="flex items-center gap-4 text-[12px] font-mono">
                          <span className="flex items-center gap-1.5 text-[#C9A96E]">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A96E]" /> New Regime (Budget 2024)
                          </span>
                          <span className="flex items-center gap-1.5 text-[#64748B]">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Old Regime
                          </span>
                        </div>
                      </div>
                      <SvgTaxComparisonChart
                        taxSalary={taxSalary}
                        taxResult={taxResult}
                      />
                    </div>

                    {/* Side by Side Comparison Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* New Regime Card */}
                      <div className={`p-6 rounded-2xl border space-y-4 transition-all duration-200 hover:border-[#C9A96E]/50 hover:-translate-y-1 motion-reduce:hover:transform-none ${
                        taxResult.recommendedRegime === "new"
                          ? "bg-[#090E1C] border-[#C9A96E]/50 ring-1 ring-[#C9A96E]/30"
                          : "bg-[#090E1C] border-white/[0.08]"
                      }`}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif text-lg text-[#F5F1E8]">New Tax Regime</h4>
                          {taxResult.recommendedRegime === "new" && (
                            <span className="text-[12px] font-mono uppercase px-2 py-0.5 rounded bg-[#C9A96E]/20 text-[#C9A96E] font-semibold">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="space-y-2 text-[12px] font-mono text-[#A8B0BD] [font-variant-numeric:lining-nums_tabular-nums]">
                          <div className="flex justify-between">
                            <span className="text-[#A8B0BD]">Standard Deduction:</span>
                            <span className="text-[#F5F1E8]">₹75,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#A8B0BD]">Taxable Income:</span>
                            <span className="text-[#F5F1E8]">{formatINR(taxResult.newRegime.taxableIncome)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-white/[0.08] text-sm">
                            <span className="text-[#A8B0BD]">Total Tax:</span>
                            <span className="text-[#C9A96E] font-bold">{formatINR(taxResult.newRegime.totalTaxLiability)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Old Regime Card */}
                      <div className={`p-6 rounded-2xl border space-y-4 transition-all duration-200 hover:border-[#C9A96E]/50 hover:-translate-y-1 motion-reduce:hover:transform-none ${
                        taxResult.recommendedRegime === "old"
                          ? "bg-[#090E1C] border-[#C9A96E]/50 ring-1 ring-[#C9A96E]/30"
                          : "bg-[#090E1C] border-white/[0.08]"
                      }`}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif text-lg text-[#F5F1E8]">Old Tax Regime</h4>
                          {taxResult.recommendedRegime === "old" && (
                            <span className="text-[12px] font-mono uppercase px-2 py-0.5 rounded bg-[#C9A96E]/20 text-[#C9A96E] font-semibold">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="space-y-2 text-[12px] font-mono text-[#A8B0BD] [font-variant-numeric:lining-nums_tabular-nums]">
                          <div className="flex justify-between">
                            <span className="text-[#A8B0BD]">Total Deductions:</span>
                            <span className="text-[#F5F1E8]">{formatINR(taxResult.oldRegime.totalDeductions)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#A8B0BD]">Taxable Income:</span>
                            <span className="text-[#F5F1E8]">{formatINR(taxResult.oldRegime.taxableIncome)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-white/[0.08] text-sm">
                            <span className="text-[#A8B0BD]">Total Tax:</span>
                            <span className="text-[#C9A96E] font-bold">{formatINR(taxResult.oldRegime.totalTaxLiability)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Report Bar: Download Report & Share This Calculation */}
                    <ReportBar
                      state={currentPayload}
                      shareUrl={currentShareUrl}
                      onGeneratePdf={handleGeneratePdf}
                    />

                    <AdvisorCtaCard
                      title="Looking for strategic tax-loss harvesting?"
                      description="Our advisory committee performs annual capital gains tax audits to set off short-term gains against eligible losses, safeguarding your compounding returns."
                      contextParam={`Salary:${taxSalary},Regime:${taxResult.recommendedRegime}`}
                    />
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Statutory Fiduciary Compliance & Regulatory Footnote */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#090E1C]/80 border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 text-[#C9A96E] text-xs font-mono uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#C9A96E]" />
                <span>SEBI Statutory Disclosure · RIA Registration No. INA000017348</span>
              </div>
              <p className="text-[12px] sm:text-[13px] text-[#A8B0BD] font-sans font-light leading-relaxed">
                Alpha Investment Management is a SEBI-registered Investment Adviser (Registration No. INA000017348) adhering strictly to fiduciary standards with zero distributor kickbacks. Mathematical projections, compounded trajectories, and simulations generated by these calculators are illustrative and designed for financial planning and wealth projection purposes only. They do not constitute guaranteed returns, personalized investment advice, or an offer to buy or sell securities. Mutual fund investments are subject to market risks; please read all scheme-related documents carefully. Tax simulations incorporate provisions of the Finance Act 2024 and are subject to statutory assessment by the Income Tax Department.
              </p>
            </div>
          </div>
        </section>

        <CTA
          className="border-t-0"
          pill="PLANNING TOOLS"
          headlineLead="Calculators give you numbers."
          headlineEmphasis="An adviser gives you a plan."
          subtitle="Use the tools to explore your options, then talk to an adviser about what the results mean for your finances."
          buttonLabel="Discuss Your Results"
        />
      </main>

      <Footer />
    </div>
  );
}

// Currency compact formatter for chart ticks
function formatCompactINR(amount: number): string {
  if (isNaN(amount) || amount === 0) return "₹0";
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    const l = amount / 100000;
    return `₹${l % 1 === 0 ? l : l.toFixed(1)}L`;
  }
  if (amount >= 1000) {
    const k = amount / 1000;
    return `₹${k % 1 === 0 ? k : k.toFixed(0)}k`;
  }
  return `₹${amount}`;
}

// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
// Sub-components: Shared Summary Card
// --------------------------------------------------------------------------
interface SummaryCardProps {
  label: string;
  value: string;
  helperText?: string;
  highlightValue?: boolean;
}

function SummaryCard({ label, value, helperText, highlightValue }: SummaryCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#090E1C] border border-white/[0.08] hover:border-[#C9A96E]/50 hover:-translate-y-1 motion-reduce:hover:transform-none focus-within:border-[#C9A96E]/50 focus-within:-translate-y-1 transition-all duration-200 shadow-lg min-h-[148px] flex flex-col justify-between group">
      <div>
        <p className="text-[12px] font-mono uppercase tracking-[0.15em] text-[#A8B0BD] min-h-[32px] flex items-center leading-snug">
          {label}
        </p>
        <h3 className={`font-serif text-[28px] sm:text-[32px] leading-tight mt-1 [font-variant-numeric:lining-nums_tabular-nums] ${
          highlightValue ? "text-[#C9A96E]" : "text-[#F5F1E8]"
        }`}>
          {value}
        </h3>
      </div>
      {helperText && (
        <p className="text-[13px] text-[#A8B0BD] font-sans font-light mt-2 leading-snug">
          {helperText}
        </p>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// Sub-components: Indian Rupee Formatted Currency Input with Stepper
// --------------------------------------------------------------------------
interface CurrencyInputWithStepperProps {
  id: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
  step?: number;
  min?: number;
  max?: number;
  subLabel?: string;
}

function CurrencyInputWithStepper({
  id,
  label,
  value,
  onChange,
  step = 10000,
  min = 0,
  max = 100000000,
  subLabel,
}: CurrencyInputWithStepperProps) {
  const [displayValue, setDisplayValue] = useState(() =>
    value ? `₹ ${new Intl.NumberFormat("en-IN").format(value)}` : "₹ 0"
  );

  useEffect(() => {
    setDisplayValue(`₹ ${new Intl.NumberFormat("en-IN").format(value)}`);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, "");
    const num = rawVal ? Math.min(Number(rawVal), max) : 0;
    onChange(num);
    setDisplayValue(rawVal ? `₹ ${new Intl.NumberFormat("en-IN").format(num)}` : "₹ ");
  };

  const handleBlur = () => {
    setDisplayValue(`₹ ${new Intl.NumberFormat("en-IN").format(value)}`);
  };

  const increment = () => {
    const next = Math.min(value + step, max);
    onChange(next);
  };

  const decrement = () => {
    const next = Math.max(value - step, min);
    onChange(next);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <label htmlFor={id} className="text-[12px] uppercase font-mono text-[#A8B0BD]">
          {label}
        </label>
        {subLabel && (
          <span className="text-[12px] font-mono text-[#A8B0BD]">{subLabel}</span>
        )}
      </div>
      <div className="relative flex items-center">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-full h-[44px] bg-[#070B14] border border-white/10 rounded-xl pl-4 pr-20 text-sm text-[#F5F1E8] font-mono [font-variant-numeric:lining-nums_tabular-nums] focus:outline-none focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E] transition-colors"
        />
        <div className="absolute right-1.5 flex items-center gap-1">
          <button
            type="button"
            onClick={decrement}
            disabled={value <= min}
            aria-label={`Decrease ${label}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#A8B0BD] hover:text-[#F5F1E8] disabled:opacity-40 disabled:pointer-events-none transition-colors font-mono text-sm [font-variant-numeric:lining-nums_tabular-nums]"
          >
            -
          </button>
          <button
            type="button"
            onClick={increment}
            disabled={value >= max}
            aria-label={`Increase ${label}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#A8B0BD] hover:text-[#F5F1E8] disabled:opacity-40 disabled:pointer-events-none transition-colors font-mono text-sm [font-variant-numeric:lining-nums_tabular-nums]"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Sub-components: Animated SVG Trajectory Graph
// --------------------------------------------------------------------------
function SvgTrajectoryChart({ breakdown }: { breakdown: CalculationYearBreakdown[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!breakdown || breakdown.length === 0) return null;

  const maxVal = Math.max(...breakdown.map((b) => b.totalValue), 1);
  const width = 640;
  const height = 280;
  const paddingLeft = 58;
  const paddingRight = 24;
  const paddingTop = 28;
  const paddingBottom = 40;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const points = breakdown.map((item, index) => {
    const x = paddingLeft + (index / (breakdown.length - 1 || 1)) * plotWidth;
    const y = paddingTop + (1 - item.totalValue / maxVal) * plotHeight;
    return { x, y, item, index };
  });

  const investedPoints = breakdown.map((item, index) => {
    const x = paddingLeft + (index / (breakdown.length - 1 || 1)) * plotWidth;
    const y = paddingTop + (1 - item.investedAmount / maxVal) * plotHeight;
    return { x, y };
  });

  const polylinePoints = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const investedPolylinePoints = investedPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPoints = `${paddingLeft},${height - paddingBottom} ${polylinePoints} ${width - paddingRight},${height - paddingBottom}`;

  // Y-axis gridlines & labels at 0%, 33%, 66%, 100%
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => {
    const val = maxVal * pct;
    const y = paddingTop + (1 - pct) * plotHeight;
    return { y, label: formatCompactINR(Math.round(val)) };
  });

  // X-axis ticks evenly spaced and ending at final year (e.g. 0, 5, 10, 15)
  const xTicks = (() => {
    const totalYears = breakdown.length;
    if (totalYears <= 1) {
      return [{ x: paddingLeft + plotWidth, label: `Yr ${breakdown[0]?.year || 1}`, index: 0 }];
    }
    const numIntervals = totalYears <= 5 ? totalYears - 1 : 4;
    const ticks: { x: number; label: string; index: number }[] = [];
    for (let i = 0; i <= numIntervals; i++) {
      const idx = Math.round((i / numIntervals) * (totalYears - 1));
      ticks.push({
        x: paddingLeft + (idx / (totalYears - 1)) * plotWidth,
        label: `Yr ${breakdown[idx].year}`,
        index: idx,
      });
    }
    return ticks;
  })();

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const relativeX = ((e.clientX - svgRect.left) / svgRect.width) * width;
    let closestIdx = 0;
    let minDistance = Infinity;
    points.forEach((p, idx) => {
      const dist = Math.abs(p.x - relativeX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });
    setHoveredIndex(closestIdx);
  };

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div
      className="w-full relative select-none"
      onPointerLeave={() => setHoveredIndex(null)}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto cursor-crosshair drop-shadow-md"
        onPointerMove={handlePointerMove}
      >
        <defs>
          <linearGradient id="goldTrajectoryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#C9A96E" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines & Y-axis labels */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={paddingLeft}
              y1={tick.y}
              x2={width - paddingRight}
              y2={tick.y}
              stroke="rgba(255, 255, 255, 0.06)"
              strokeDasharray={i === 0 ? undefined : "4 4"}
            />
            <text
              x={paddingLeft - 10}
              y={tick.y + 4}
              textAnchor="end"
              className="fill-[#A8B0BD] text-[12px] font-mono [font-variant-numeric:lining-nums_tabular-nums]"
            >
              {tick.label}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xTicks.map((tick, i) => (
          <text
            key={i}
            x={tick.x}
            y={height - paddingBottom + 24}
            textAnchor="middle"
            className="fill-[#A8B0BD] text-[12px] font-mono [font-variant-numeric:lining-nums_tabular-nums]"
          >
            {tick.label}
          </text>
        ))}

        {/* Shaded Area */}
        <polygon points={areaPoints} fill="url(#goldTrajectoryGradient)" />

        {/* Invested Principal Line */}
        <polyline
          fill="none"
          stroke="#64748B"
          strokeWidth="2"
          strokeDasharray="4 4"
          points={investedPolylinePoints}
        />

        {/* Total Wealth Line */}
        <polyline
          fill="none"
          stroke="#C9A96E"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylinePoints}
        />

        {/* Active hover crosshair and indicator dots */}
        {activePoint && (
          <g>
            <line
              x1={activePoint.x}
              y1={paddingTop}
              x2={activePoint.x}
              y2={height - paddingBottom}
              stroke="rgba(201, 169, 110, 0.45)"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />
            <circle
              cx={activePoint.x}
              cy={investedPoints[hoveredIndex!].y}
              r="4.5"
              fill="#64748B"
              stroke="#0B1220"
              strokeWidth="2"
            />
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="6"
              fill="#C9A96E"
              stroke="#0B1220"
              strokeWidth="2.5"
            />
          </g>
        )}
      </svg>

      {/* Tooltip on hover/focus */}
      {activePoint && (
        <div
          className="absolute pointer-events-none transition-all duration-75 z-20"
          style={{
            left: `${(activePoint.x / width) * 100}%`,
            top: `${Math.max(8, Math.min(((activePoint.y - 75) / height) * 100, 60))}%`,
            transform: activePoint.x > width * 0.65 ? "translateX(-105%)" : "translateX(12px)",
          }}
        >
          <div className="px-3.5 py-2.5 rounded-xl bg-[#0B1220]/95 border border-[#C9A96E]/40 shadow-2xl backdrop-blur-md space-y-1 text-left min-w-[170px]">
            <p className="text-[11px] font-mono text-[#A8B0BD] uppercase tracking-wider [font-variant-numeric:lining-nums_tabular-nums]">
              Year {activePoint.item.year}
            </p>
            <div className="space-y-1 text-[13px] font-mono [font-variant-numeric:lining-nums_tabular-nums]">
              <p className="flex items-center justify-between gap-3">
                <span className="text-[#A8B0BD] text-xs">Total Wealth:</span>
                <span className="text-[#C9A96E] font-semibold">{formatINR(activePoint.item.totalValue)}</span>
              </p>
              <p className="flex items-center justify-between gap-3">
                <span className="text-[#A8B0BD] text-xs">Invested:</span>
                <span className="text-slate-300 font-medium">{formatINR(activePoint.item.investedAmount)}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// Sub-components: "Talk to an Advisor" Callout Card
// --------------------------------------------------------------------------
function AdvisorCtaCard({
  title,
  description,
  contextParam,
}: {
  title: string;
  description: string;
  contextParam: string;
}) {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#090E1C] via-[#090E1C] to-[#C9A24B]/10 border border-[#C9A24B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
      <div className="space-y-1.5 max-w-xl">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C9A24B]">
          Fiduciary Guidance
        </span>
        <h4 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-normal">{title}</h4>
        <p className="text-xs sm:text-sm text-slate-300 font-sans font-light leading-relaxed">
          {description}
        </p>
      </div>
      <Button
        asChild
        className="bg-[#C9A24B] hover:bg-[#d6af57] text-[#070B14] font-sans font-semibold text-xs tracking-wider uppercase px-6 py-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-[#C9A24B]/20 shrink-0 group"
      >
        <Link to={`/contact?note=${encodeURIComponent(contextParam)}`} className="flex items-center gap-2">
          <span>Talk to an Advisor</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  );
}
