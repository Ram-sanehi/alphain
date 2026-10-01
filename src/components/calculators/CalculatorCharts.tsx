import React, { useState } from "react";
import { formatINR, IncomeTaxResult } from "@/utils/calculators";
import { calculateLoanAmortizationSchedule } from "@/utils/loanAmortization";

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
// 1. Retirement Trajectory Chart (Accumulation -> Peak -> Distribution)
// --------------------------------------------------------------------------
interface SvgRetirementChartProps {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  monthlyExpense: number;
  inflation: number;
  preReturn: number;
  postReturn: number;
  requiredCorpus: number;
  monthlySip: number;
}

export function SvgRetirementChart({
  currentAge,
  retirementAge,
  lifeExpectancy,
  monthlyExpense,
  inflation,
  preReturn,
  postReturn,
  requiredCorpus,
  monthlySip,
}: SvgRetirementChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const yearsToRet = Math.max(retirementAge - currentAge, 1);
  const yearsInRet = Math.max(lifeExpectancy - retirementAge, 1);
  const totalYears = yearsToRet + yearsInRet;

  // Build simulated trajectory data points for each year from currentAge to lifeExpectancy
  const trajectory: {
    age: number;
    phase: "accumulation" | "distribution";
    corpus: number;
    annualCashflow: number;
  }[] = [];

  const monthlyPreR = preReturn / 12 / 100;
  const annualPostR = postReturn / 100;
  const annualInf = inflation / 100;

  // Accumulation Phase
  for (let y = 0; y <= yearsToRet; y++) {
    const age = currentAge + y;
    if (y === 0) {
      trajectory.push({ age, phase: "accumulation", corpus: 0, annualCashflow: monthlySip * 12 });
    } else if (y === yearsToRet) {
      trajectory.push({
        age,
        phase: "accumulation",
        corpus: requiredCorpus,
        annualCashflow: monthlySip * 12,
      });
    } else {
      const months = y * 12;
      const corpus = monthlyPreR > 0
        ? monthlySip * ((Math.pow(1 + monthlyPreR, months) - 1) / monthlyPreR) * (1 + monthlyPreR)
        : monthlySip * months;
      trajectory.push({ age, phase: "accumulation", corpus, annualCashflow: monthlySip * 12 });
    }
  }

  // Distribution Phase
  let runningCorpus = requiredCorpus;
  for (let y = 1; y <= yearsInRet; y++) {
    const age = retirementAge + y;
    const expenseThisYear =
      monthlyExpense * Math.pow(1 + annualInf, yearsToRet + y - 1) * 12;
    // Corpus grows at postReturn, expense withdrawn
    runningCorpus = Math.max(runningCorpus * (1 + annualPostR) - expenseThisYear, 0);
    trajectory.push({
      age,
      phase: "distribution",
      corpus: runningCorpus,
      annualCashflow: -expenseThisYear,
    });
  }

  const maxVal = Math.max(...trajectory.map((t) => t.corpus), requiredCorpus, 1);

  const width = 640;
  const height = 280;
  const paddingLeft = 58;
  const paddingRight = 24;
  const paddingTop = 28;
  const paddingBottom = 40;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const points = trajectory.map((item, index) => {
    const x = paddingLeft + (index / (trajectory.length - 1 || 1)) * plotWidth;
    const y = paddingTop + (1 - item.corpus / maxVal) * plotHeight;
    return { x, y, item, index };
  });

  const retIdx = yearsToRet;
  const retX = points[retIdx]?.x ?? paddingLeft + plotWidth * 0.5;

  const polylinePoints = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPoints = `${paddingLeft},${height - paddingBottom} ${polylinePoints} ${width - paddingRight},${height - paddingBottom}`;

  // Y-axis ticks
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => {
    const val = maxVal * pct;
    const y = paddingTop + (1 - pct) * plotHeight;
    return { y, label: formatCompactINR(Math.round(val)) };
  });

  // X-axis age ticks
  const xTicks = [
    { x: points[0].x, label: `Age ${currentAge}` },
    { x: retX, label: `Retire ${retirementAge}` },
    { x: points[points.length - 1].x, label: `Age ${lifeExpectancy}` },
  ];

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const relativeX = ((e.clientX - svgRect.left) / svgRect.width) * width;
    let closestIdx = 0;
    let minDist = Infinity;
    points.forEach((p, idx) => {
      const dist = Math.abs(p.x - relativeX);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = idx;
      }
    });
    setHoveredIdx(closestIdx);
  };

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div
      className="w-full relative select-none"
      onPointerLeave={() => setHoveredIdx(null)}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto cursor-crosshair drop-shadow-md"
        onPointerMove={handlePointerMove}
      >
        <defs>
          <linearGradient id="retTrajectoryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#C9A96E" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gridlines & Y-Axis */}
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

        {/* Retirement Milestone Vertical Line */}
        <line
          x1={retX}
          y1={paddingTop}
          x2={retX}
          y2={height - paddingBottom}
          stroke="#C9A96E"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <text
          x={retX}
          y={paddingTop - 10}
          textAnchor="middle"
          className="fill-[#C9A96E] text-[11px] font-mono font-semibold"
        >
          Retirement (Age {retirementAge})
        </text>

        {/* X-axis labels */}
        {xTicks.map((tick, i) => (
          <text
            key={i}
            x={tick.x}
            y={height - paddingBottom + 24}
            textAnchor={i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle"}
            className="fill-[#A8B0BD] text-[12px] font-mono [font-variant-numeric:lining-nums_tabular-nums]"
          >
            {tick.label}
          </text>
        ))}

        {/* Area fill */}
        <polygon points={areaPoints} fill="url(#retTrajectoryGradient)" />

        {/* Main curve */}
        <polyline
          fill="none"
          stroke="#C9A96E"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylinePoints}
        />

        {/* Peak corpus point at retirement */}
        {points[retIdx] && (
          <circle
            cx={points[retIdx].x}
            cy={points[retIdx].y}
            r="6"
            fill="#C9A96E"
            stroke="#070B14"
            strokeWidth="2.5"
          />
        )}

        {/* Hover Crosshair & indicator dot */}
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
              cy={activePoint.y}
              r="6.5"
              fill="#C9A96E"
              stroke="#070B14"
              strokeWidth="2.5"
            />
          </g>
        )}
      </svg>

      {/* Floating Tooltip */}
      {activePoint && (
        <div
          className="absolute pointer-events-none transition-all duration-75 z-20"
          style={{
            left: `${(activePoint.x / width) * 100}%`,
            top: `${Math.max(8, Math.min(((activePoint.y - 80) / height) * 100, 60))}%`,
            transform: activePoint.x > width * 0.65 ? "translateX(-105%)" : "translateX(12px)",
          }}
        >
          <div className="px-3.5 py-2.5 rounded-xl bg-[#0B1220]/95 border border-[#C9A96E]/40 shadow-2xl backdrop-blur-md space-y-1 text-left min-w-[190px]">
            <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-1">
              <span className="text-[11px] font-mono text-[#F5F1E8] font-bold">
                Age {activePoint.item.age}
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#C9A96E]/20 text-[#C9A96E]">
                {activePoint.item.phase === "accumulation" ? "Accumulation" : "Drawdown"}
              </span>
            </div>
            <div className="space-y-1 text-[12px] font-mono [font-variant-numeric:lining-nums_tabular-nums]">
              <p className="flex items-center justify-between gap-3">
                <span className="text-[#A8B0BD]">Corpus Balance:</span>
                <span className="text-[#C9A96E] font-semibold">
                  {formatINR(activePoint.item.corpus)}
                </span>
              </p>
              <p className="flex items-center justify-between gap-3">
                <span className="text-[#A8B0BD]">
                  {activePoint.item.phase === "accumulation" ? "SIP Annual Inflow:" : "Annual Expense Outflow:"}
                </span>
                <span className="text-slate-300 font-medium">
                  {formatINR(Math.abs(activePoint.item.annualCashflow))}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// 2. Goal Trajectory Chart (SIP Accumulation vs Inflated Goal Cost)
// --------------------------------------------------------------------------
interface SvgGoalChartProps {
  goalType: string;
  currentCost: number;
  years: number;
  inflation: number;
  returnRate: number;
  futureCost: number;
  monthlySip: number;
}

export function SvgGoalChart({
  goalType,
  currentCost,
  years,
  inflation,
  returnRate,
  futureCost,
  monthlySip,
}: SvgGoalChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalYears = Math.max(years, 1);
  const monthlyR = returnRate / 12 / 100;
  const annualInf = inflation / 100;

  const dataPoints: {
    year: number;
    goalTarget: number;
    sipWealth: number;
  }[] = [];

  for (let yr = 0; yr <= totalYears; yr++) {
    const goalTarget = currentCost * Math.pow(1 + annualInf, yr);
    const months = yr * 12;
    const sipWealth = yr === 0
      ? 0
      : monthlyR > 0
      ? monthlySip * ((Math.pow(1 + monthlyR, months) - 1) / monthlyR) * (1 + monthlyR)
      : monthlySip * months;

    dataPoints.push({ year: yr, goalTarget, sipWealth });
  }

  const maxVal = Math.max(
    ...dataPoints.map((d) => Math.max(d.goalTarget, d.sipWealth)),
    futureCost,
    1
  );

  const width = 640;
  const height = 280;
  const paddingLeft = 58;
  const paddingRight = 24;
  const paddingTop = 28;
  const paddingBottom = 40;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const points = dataPoints.map((item, index) => {
    const x = paddingLeft + (index / (dataPoints.length - 1 || 1)) * plotWidth;
    const yWealth = paddingTop + (1 - item.sipWealth / maxVal) * plotHeight;
    const yTarget = paddingTop + (1 - item.goalTarget / maxVal) * plotHeight;
    return { x, yWealth, yTarget, item, index };
  });

  const wealthPolyline = points.map((p) => `${p.x.toFixed(1)},${p.yWealth.toFixed(1)}`).join(" ");
  const targetPolyline = points.map((p) => `${p.x.toFixed(1)},${p.yTarget.toFixed(1)}`).join(" ");
  const areaPoints = `${paddingLeft},${height - paddingBottom} ${wealthPolyline} ${width - paddingRight},${height - paddingBottom}`;

  // Y-axis ticks
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => {
    const val = maxVal * pct;
    const y = paddingTop + (1 - pct) * plotHeight;
    return { y, label: formatCompactINR(Math.round(val)) };
  });

  // X-axis ticks
  const xTicks = (() => {
    if (totalYears <= 5) {
      return points.map((p) => ({ x: p.x, label: `Yr ${p.item.year}` }));
    }
    const intervals = 4;
    return Array.from({ length: intervals + 1 }, (_, i) => {
      const idx = Math.round((i / intervals) * (points.length - 1));
      return { x: points[idx].x, label: `Yr ${points[idx].item.year}` };
    });
  })();

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const relativeX = ((e.clientX - svgRect.left) / svgRect.width) * width;
    let closestIdx = 0;
    let minDist = Infinity;
    points.forEach((p, idx) => {
      const dist = Math.abs(p.x - relativeX);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = idx;
      }
    });
    setHoveredIdx(closestIdx);
  };

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div
      className="w-full relative select-none"
      onPointerLeave={() => setHoveredIdx(null)}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto cursor-crosshair drop-shadow-md"
        onPointerMove={handlePointerMove}
      >
        <defs>
          <linearGradient id="goalTrajectoryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#C9A96E" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gridlines & Y-Axis */}
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

        {/* Wealth Area fill */}
        <polygon points={areaPoints} fill="url(#goalTrajectoryGradient)" />

        {/* Inflated Goal Target Line (Dashed Slate) */}
        <polyline
          fill="none"
          stroke="#94A3B8"
          strokeWidth="2"
          strokeDasharray="5 5"
          points={targetPolyline}
        />

        {/* SIP Wealth Accumulation Line (Solid Gold) */}
        <polyline
          fill="none"
          stroke="#C9A96E"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={wealthPolyline}
        />

        {/* Final Target Destination Dot */}
        {points[points.length - 1] && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].yWealth}
            r="6"
            fill="#C9A96E"
            stroke="#070B14"
            strokeWidth="2.5"
          />
        )}

        {/* Hover Crosshair & indicator dots */}
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
              cy={activePoint.yTarget}
              r="4.5"
              fill="#94A3B8"
              stroke="#070B14"
              strokeWidth="2"
            />
            <circle
              cx={activePoint.x}
              cy={activePoint.yWealth}
              r="6.5"
              fill="#C9A96E"
              stroke="#070B14"
              strokeWidth="2.5"
            />
          </g>
        )}
      </svg>

      {/* Floating Tooltip */}
      {activePoint && (
        <div
          className="absolute pointer-events-none transition-all duration-75 z-20"
          style={{
            left: `${(activePoint.x / width) * 100}%`,
            top: `${Math.max(8, Math.min(((activePoint.yWealth - 75) / height) * 100, 60))}%`,
            transform: activePoint.x > width * 0.65 ? "translateX(-105%)" : "translateX(12px)",
          }}
        >
          <div className="px-3.5 py-2.5 rounded-xl bg-[#0B1220]/95 border border-[#C9A96E]/40 shadow-2xl backdrop-blur-md space-y-1 text-left min-w-[180px]">
            <p className="text-[11px] font-mono text-[#A8B0BD] uppercase tracking-wider">
              Year {activePoint.item.year}
            </p>
            <div className="space-y-1 text-[12px] font-mono [font-variant-numeric:lining-nums_tabular-nums]">
              <p className="flex items-center justify-between gap-3">
                <span className="text-[#A8B0BD]">Projected Wealth:</span>
                <span className="text-[#C9A96E] font-semibold">
                  {formatINR(activePoint.item.sipWealth)}
                </span>
              </p>
              <p className="flex items-center justify-between gap-3">
                <span className="text-[#A8B0BD]">Inflated Goal Cost:</span>
                <span className="text-slate-300 font-medium">
                  {formatINR(activePoint.item.goalTarget)}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// 3. Loan EMI Amortization Chart (Principal Decaying vs Cumulative Interest)
// --------------------------------------------------------------------------
interface SvgLoanEmiChartProps {
  principal: number;
  rate: number;
  tenureYears: number;
  monthlyEmi: number;
  totalInterest: number;
}

export function SvgLoanEmiChart({
  principal,
  rate,
  tenureYears,
  monthlyEmi,
  totalInterest,
}: SvgLoanEmiChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const schedule = calculateLoanAmortizationSchedule(principal, rate, tenureYears);

  // Generate Year 0 to Year N trajectory
  const pointsData: {
    year: number;
    balance: number;
    cumInterest: number;
    principalPaid: number;
    interestPaid: number;
  }[] = [
    {
      year: 0,
      balance: principal,
      cumInterest: 0,
      principalPaid: 0,
      interestPaid: 0,
    },
  ];

  let cumulativeInt = 0;
  schedule.forEach((row) => {
    cumulativeInt += row.interestPaid;
    pointsData.push({
      year: row.year,
      balance: row.closingBalance,
      cumInterest: cumulativeInt,
      principalPaid: row.principalPaid,
      interestPaid: row.interestPaid,
    });
  });

  const maxVal = Math.max(principal, cumulativeInt, 1);

  const width = 640;
  const height = 280;
  const paddingLeft = 58;
  const paddingRight = 24;
  const paddingTop = 28;
  const paddingBottom = 40;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const points = pointsData.map((item, index) => {
    const x = paddingLeft + (index / (pointsData.length - 1 || 1)) * plotWidth;
    const yBalance = paddingTop + (1 - item.balance / maxVal) * plotHeight;
    const yInterest = paddingTop + (1 - item.cumInterest / maxVal) * plotHeight;
    return { x, yBalance, yInterest, item, index };
  });

  const balancePolyline = points.map((p) => `${p.x.toFixed(1)},${p.yBalance.toFixed(1)}`).join(" ");
  const interestPolyline = points.map((p) => `${p.x.toFixed(1)},${p.yInterest.toFixed(1)}`).join(" ");
  const areaPoints = `${paddingLeft},${height - paddingBottom} ${balancePolyline} ${width - paddingRight},${height - paddingBottom}`;

  // Y-axis ticks
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => {
    const val = maxVal * pct;
    const y = paddingTop + (1 - pct) * plotHeight;
    return { y, label: formatCompactINR(Math.round(val)) };
  });

  // X-axis ticks
  const xTicks = (() => {
    if (tenureYears <= 5) {
      return points.map((p) => ({ x: p.x, label: `Yr ${p.item.year}` }));
    }
    const intervals = 4;
    return Array.from({ length: intervals + 1 }, (_, i) => {
      const idx = Math.round((i / intervals) * (points.length - 1));
      return { x: points[idx].x, label: `Yr ${points[idx].item.year}` };
    });
  })();

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const relativeX = ((e.clientX - svgRect.left) / svgRect.width) * width;
    let closestIdx = 0;
    let minDist = Infinity;
    points.forEach((p, idx) => {
      const dist = Math.abs(p.x - relativeX);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = idx;
      }
    });
    setHoveredIdx(closestIdx);
  };

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div
      className="w-full relative select-none"
      onPointerLeave={() => setHoveredIdx(null)}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto cursor-crosshair drop-shadow-md"
        onPointerMove={handlePointerMove}
      >
        <defs>
          <linearGradient id="loanTrajectoryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#C9A96E" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gridlines & Y-Axis */}
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

        {/* Principal balance area */}
        <polygon points={areaPoints} fill="url(#loanTrajectoryGradient)" />

        {/* Cumulative Interest Line (Slate Dashed) */}
        <polyline
          fill="none"
          stroke="#64748B"
          strokeWidth="2"
          strokeDasharray="4 4"
          points={interestPolyline}
        />

        {/* Outstanding Principal Balance Line (Gold Solid) */}
        <polyline
          fill="none"
          stroke="#C9A96E"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={balancePolyline}
        />

        {/* Hover Crosshair & indicator dots */}
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
              cy={activePoint.yInterest}
              r="4.5"
              fill="#64748B"
              stroke="#070B14"
              strokeWidth="2"
            />
            <circle
              cx={activePoint.x}
              cy={activePoint.yBalance}
              r="6.5"
              fill="#C9A96E"
              stroke="#070B14"
              strokeWidth="2.5"
            />
          </g>
        )}
      </svg>

      {/* Floating Tooltip */}
      {activePoint && (
        <div
          className="absolute pointer-events-none transition-all duration-75 z-20"
          style={{
            left: `${(activePoint.x / width) * 100}%`,
            top: `${Math.max(8, Math.min(((activePoint.yBalance - 80) / height) * 100, 60))}%`,
            transform: activePoint.x > width * 0.65 ? "translateX(-105%)" : "translateX(12px)",
          }}
        >
          <div className="px-3.5 py-2.5 rounded-xl bg-[#0B1220]/95 border border-[#C9A96E]/40 shadow-2xl backdrop-blur-md space-y-1 text-left min-w-[200px]">
            <p className="text-[11px] font-mono text-[#A8B0BD] uppercase tracking-wider">
              Year {activePoint.item.year} of {tenureYears}
            </p>
            <div className="space-y-1 text-[12px] font-mono [font-variant-numeric:lining-nums_tabular-nums]">
              <p className="flex items-center justify-between gap-3">
                <span className="text-[#A8B0BD]">Loan Balance:</span>
                <span className="text-[#C9A96E] font-semibold">
                  {formatINR(activePoint.item.balance)}
                </span>
              </p>
              <p className="flex items-center justify-between gap-3">
                <span className="text-[#A8B0BD]">Cumulative Interest:</span>
                <span className="text-slate-300 font-medium">
                  {formatINR(activePoint.item.cumInterest)}
                </span>
              </p>
              {activePoint.item.year > 0 && (
                <p className="flex items-center justify-between gap-3 pt-1 border-t border-white/[0.08] text-[11px]">
                  <span className="text-[#A8B0BD]">Yearly Split:</span>
                  <span className="text-slate-400">
                    P: {formatCompactINR(activePoint.item.principalPaid)} | I: {formatCompactINR(activePoint.item.interestPaid)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// 4. Tax Comparison Chart (Grouped Bars: New vs Old Regime)
// --------------------------------------------------------------------------
interface SvgTaxComparisonChartProps {
  taxSalary: number;
  taxResult: IncomeTaxResult;
}

export function SvgTaxComparisonChart({
  taxSalary,
  taxResult,
}: SvgTaxComparisonChartProps) {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const categories = [
    {
      id: "gross",
      label: "Gross CTC",
      newVal: taxSalary,
      oldVal: taxSalary,
    },
    {
      id: "deductions",
      label: "Deductions",
      newVal: 75000,
      oldVal: taxResult.oldRegime.totalDeductions,
    },
    {
      id: "taxable",
      label: "Taxable Income",
      newVal: taxResult.newRegime.taxableIncome,
      oldVal: taxResult.oldRegime.taxableIncome,
    },
    {
      id: "tax",
      label: "Tax Liability",
      newVal: taxResult.newRegime.totalTaxLiability,
      oldVal: taxResult.oldRegime.totalTaxLiability,
    },
  ];

  const maxVal = Math.max(taxSalary, 1);
  const width = 640;
  const height = 280;
  const paddingLeft = 58;
  const paddingRight = 24;
  const paddingTop = 28;
  const paddingBottom = 40;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const groupWidth = plotWidth / categories.length;
  const barWidth = 28;

  // Y-axis ticks
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => {
    const val = maxVal * pct;
    const y = paddingTop + (1 - pct) * plotHeight;
    return { y, label: formatCompactINR(Math.round(val)) };
  });

  return (
    <div className="w-full relative select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-md">
        {/* Gridlines & Y-Axis */}
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

        {/* Grouped Bars */}
        {categories.map((cat, idx) => {
          const groupCenterX = paddingLeft + (idx + 0.5) * groupWidth;
          const newX = groupCenterX - barWidth - 3;
          const oldX = groupCenterX + 3;

          const newH = Math.max((cat.newVal / maxVal) * plotHeight, 2);
          const oldH = Math.max((cat.oldVal / maxVal) * plotHeight, 2);

          const newY = paddingTop + plotHeight - newH;
          const oldY = paddingTop + plotHeight - oldH;

          const isRecommendedNew = taxResult.recommendedRegime === "new";

          return (
            <g
              key={cat.id}
              className="cursor-pointer transition-opacity"
              onMouseEnter={() => setHoveredMetric(cat.id)}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              {/* Category X-Label */}
              <text
                x={groupCenterX}
                y={height - paddingBottom + 24}
                textAnchor="middle"
                className="fill-[#A8B0BD] text-[12px] font-mono [font-variant-numeric:lining-nums_tabular-nums]"
              >
                {cat.label}
              </text>

              {/* New Regime Bar (Gold) */}
              <rect
                x={newX}
                y={newY}
                width={barWidth}
                height={newH}
                rx={4}
                fill="#C9A96E"
                opacity={hoveredMetric && hoveredMetric !== cat.id ? 0.4 : 1}
                className="transition-all duration-200"
              />

              {/* Old Regime Bar (Slate) */}
              <rect
                x={oldX}
                y={oldY}
                width={barWidth}
                height={oldH}
                rx={4}
                fill="#64748B"
                opacity={hoveredMetric && hoveredMetric !== cat.id ? 0.4 : 1}
                className="transition-all duration-200"
              />

              {/* Values above bars on hover or on tax group */}
              {(hoveredMetric === cat.id || cat.id === "tax") && (
                <>
                  <text
                    x={newX + barWidth / 2}
                    y={newY - 6}
                    textAnchor="middle"
                    className="fill-[#C9A96E] text-[10px] font-mono font-semibold [font-variant-numeric:lining-nums_tabular-nums]"
                  >
                    {formatCompactINR(cat.newVal)}
                  </text>
                  <text
                    x={oldX + barWidth / 2}
                    y={oldY - 6}
                    textAnchor="middle"
                    className="fill-slate-300 text-[10px] font-mono font-semibold [font-variant-numeric:lining-nums_tabular-nums]"
                  >
                    {formatCompactINR(cat.oldVal)}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
