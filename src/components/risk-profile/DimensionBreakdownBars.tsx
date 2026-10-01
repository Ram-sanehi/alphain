import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DimensionScore } from "@/constants/riskProfileConfig";

export interface DimensionBreakdownBarsProps {
  dimensions?: DimensionScore[];
  dimensionScores?: DimensionScore[];
}

export function DimensionBreakdownBars({ dimensions, dimensionScores }: DimensionBreakdownBarsProps) {
  const shouldReduceMotion = useReducedMotion();
  const list = dimensions || dimensionScores || [];

  const getZeroScoreHint = (dimensionKey: string) => {
    switch (dimensionKey) {
      case "timeHorizon":
        return "Below 1 year";
      case "riskTolerance":
        return "Zero drawdown tolerance";
      case "riskCapacity":
        return "Baseline capacity";
      case "liquidityNeeds":
        return "Immediate liquidity needed";
      case "investmentExperience":
        return "Foundational novice";
      default:
        return "Baseline min";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-[11px] uppercase tracking-wider text-[#A8B0BD]">
          Fiduciary Suitability Dimensions
        </span>
        <span className="text-[#C9A96E]">Score / 100</span>
      </div>

      <div className="space-y-3.5">
        {list.map((dim, idx) => {
          const isZero = dim.score === 0;
          const displayWidth = isZero ? 3.5 : dim.score;
          const zeroHint = isZero ? getZeroScoreHint(dim.dimension) : null;

          return (
            <div
              key={dim.dimension}
              className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 hover:border-[#C9A96E]/30 transition-colors"
            >
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-sans font-medium text-[#F5F1E8]">{dim.label}</span>
                <div className="flex items-center gap-2">
                  {zeroHint && (
                    <span className="text-[10px] font-mono text-[#A8B0BD] italic hidden xs:inline">
                      ({zeroHint})
                    </span>
                  )}
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.06] text-[#A8B0BD]">
                    {dim.level}
                  </span>
                  <span className="font-mono text-sm font-semibold text-[#C9A96E] tabular-nums">
                    {dim.score}
                  </span>
                </div>
              </div>

              {/* Horizontal Progress Bar with 0-score baseline stub and entry animation */}
              <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden relative">
                <motion.div
                  className={`h-full rounded-full ${
                    isZero
                      ? "bg-[#C9A96E]/50"
                      : "bg-gradient-to-r from-[#C9A96E] to-[#E2C78E]"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${displayWidth}%` }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.65,
                    delay: shouldReduceMotion ? 0 : idx * 0.08,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
