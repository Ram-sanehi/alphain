import React from "react";
import { ArticleChart } from "@/data/insightsArticles";

interface InsightChartProps {
  chart: ArticleChart;
}

export function InsightChartRenderer({ chart }: InsightChartProps) {
  if (chart.type === "svg-drawdown") {
    // Drawdown vs Breakeven Gain Bar Chart
    const maxVal = 100;
    return (
      <div className="my-8 p-6 rounded-2xl bg-[#090E1C] border border-white/[0.08] space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-lg text-[#F5F1E8]">{chart.title}</h4>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A96E]">
              Asymmetric Geometry
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans">{chart.description}</p>
        </div>

        <div className="space-y-3 pt-2">
          {chart.data.map((item, idx) => {
            const widthPct = Math.min(100, Math.max(5, (item.value / maxVal) * 100));
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#CBD5E1] font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.note && (
                      <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
                        {item.note}
                      </span>
                    )}
                    <span className="text-[#C9A96E] font-bold tabular-nums">
                      +{item.value.toFixed(1)}% Gain Needed
                    </span>
                  </div>
                </div>
                <div className="h-3 w-full bg-white/[0.04] rounded-full overflow-hidden p-0.5 border border-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#C9A96E] to-[#DFCA9F] transition-all duration-500"
                    style={{ width: `${widthPct}%` }}
                    role="progressbar"
                    aria-valuenow={item.value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Source: Alpha Investment Management Quantitative Risk Desk</span>
          <span className="text-[#C9A96E]">Formula: Gain = [1 / (1 - Drawdown)] - 1</span>
        </div>
      </div>
    );
  }

  if (chart.type === "svg-bar") {
    // 2-Series Bar Chart: Direct Plan vs Regular Plan
    const maxVal = Math.max(...chart.data.map((d) => Math.max(d.value, d.secondaryValue || 0)));

    return (
      <div className="my-8 p-6 rounded-2xl bg-[#090E1C] border border-white/[0.08] space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-lg text-[#F5F1E8]">{chart.title}</h4>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1.5 text-[#C9A96E]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#C9A96E]" /> Direct Plan (Net 11.5%)
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#4A5568]" /> Regular Plan (Net 10.5%)
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-sans">{chart.description}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          {chart.data.map((item, idx) => {
            const hDirect = (item.value / maxVal) * 120;
            const hReg = ((item.secondaryValue || 0) / maxVal) * 120;

            return (
              <div key={idx} className="flex flex-col items-center space-y-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-xs font-mono font-medium text-[#F5F1E8]">{item.label}</span>
                <div className="h-[130px] flex items-end gap-2 w-full justify-center pt-2">
                  {/* Regular Plan Bar */}
                  <div className="w-6 sm:w-8 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                      ₹{(item.secondaryValue || 0).toFixed(1)}Cr
                    </span>
                    <div
                      className="w-full bg-[#4A5568] rounded-t-sm transition-all duration-500"
                      style={{ height: `${Math.max(6, hReg)}px` }}
                    />
                  </div>
                  {/* Direct Plan Bar */}
                  <div className="w-6 sm:w-8 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono text-[#C9A96E] font-semibold tabular-nums">
                      ₹{item.value.toFixed(1)}Cr
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-[#C9A96E] to-[#DFCA9F] rounded-t-sm shadow-[0_0_12px_rgba(201,169,110,0.3)] transition-all duration-500"
                      style={{ height: `${Math.max(6, hDirect)}px` }}
                    />
                  </div>
                </div>
                {item.note && (
                  <span className="text-[10px] text-center text-slate-400 font-sans leading-tight pt-1">
                    {item.note}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Starting Capital: ₹5.00 Crores</span>
          <span className="text-[#C9A96E]">20-Yr Compounding Gap: ₹7.59 Crores</span>
        </div>
      </div>
    );
  }

  if (chart.type === "svg-allocation") {
    // Strategic Asset Allocation Breakdown
    return (
      <div className="my-8 p-6 rounded-2xl bg-[#090E1C] border border-white/[0.08] space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-lg text-[#F5F1E8]">{chart.title}</h4>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A96E]">
              Policy Weights
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans">{chart.description}</p>
        </div>

        {/* Segmented Stacked Bar */}
        <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-inner border border-white/[0.08]">
          <div
            style={{ width: "65%" }}
            className="bg-gradient-to-r from-[#C9A96E] to-[#DFCA9F] flex items-center justify-center text-[11px] font-mono font-bold text-[#070B14]"
            title="Equity: 65%"
          >
            65% Equity
          </div>
          <div
            style={{ width: "25%" }}
            className="bg-[#2D3748] flex items-center justify-center text-[11px] font-mono font-medium text-[#F5F1E8] border-l border-white/10"
            title="Sovereign Debt: 25%"
          >
            25% Debt
          </div>
          <div
            style={{ width: "10%" }}
            className="bg-[#B7950B] flex items-center justify-center text-[10px] font-mono font-bold text-black border-l border-white/10"
            title="Gold: 10%"
          >
            10% Gold
          </div>
        </div>

        {/* Legend Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {chart.data.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif text-[#F5F1E8]">{item.label}</span>
                <span className="text-xs font-mono font-bold text-[#C9A96E] tabular-nums">{item.value}%</span>
              </div>
              {item.note && (
                <p className="text-[11px] text-slate-400 font-sans">{item.note}</p>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Rebalancing Corridor: ±5% Drift Trigger</span>
          <span className="text-[#C9A96E]">Non-Correlated Triad Model</span>
        </div>
      </div>
    );
  }

  return null;
}
