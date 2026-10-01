import React, { useState } from "react";

export interface AllocationDonutProps {
  allocation: {
    equity: number;
    debt: number;
    gold: number;
    cash: number;
    equityRange?: string;
    debtRange?: string;
    goldRange?: string;
    cashRange?: string;
  };
  archetypeName?: string;
}

export function AllocationDonut({ allocation, archetypeName }: AllocationDonutProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Harmonized Fiduciary Gold & Slate Palette with Emerald Accent
  const allCards = [
    {
      label: "Equity",
      value: allocation.equity,
      color: "#C9A96E", // Fiduciary Gold
      range: allocation.equityRange || "0%",
      index: 0,
    },
    {
      label: "Debt",
      value: allocation.debt,
      color: "#64748B", // Slate
      range: allocation.debtRange || "0%",
      index: 1,
    },
    {
      label: "Gold",
      value: allocation.gold,
      color: "#E5C07B", // Warm Amber Gold
      range: allocation.goldRange || "0%",
      index: 2,
    },
    {
      label: "Liquid Cash",
      value: allocation.cash,
      color: "#10B981", // Emerald accent
      range: allocation.cashRange || "0%",
      index: 3,
    },
  ];

  // For the Donut SVG: Only draw slices with positive weights
  const slices = allCards.filter((s) => s.value > 0);
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 100;

  // Donut geometry
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 88;
  const rInner = 60;

  let currentAngle = -Math.PI / 2; // Start at 12 o'clock

  const paths = slices.map((slice) => {
    const angleSpan = (slice.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleSpan;
    currentAngle = endAngle;

    const isHovered = hoveredIndex === slice.index;
    const effOuter = isHovered ? rOuter + 4 : rOuter;
    const effInner = isHovered ? rInner - 2 : rInner;

    // Calculate arc points
    const x1 = cx + effOuter * Math.cos(startAngle);
    const y1 = cy + effOuter * Math.sin(startAngle);
    const x2 = cx + effOuter * Math.cos(endAngle);
    const y2 = cy + effOuter * Math.sin(endAngle);

    const x3 = cx + effInner * Math.cos(endAngle);
    const y3 = cy + effInner * Math.sin(endAngle);
    const x4 = cx + effInner * Math.cos(startAngle);
    const y4 = cy + effInner * Math.sin(startAngle);

    const largeArc = angleSpan > Math.PI ? 1 : 0;

    const d = [
      `M ${x1} ${y1}`,
      `A ${effOuter} ${effOuter} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${effInner} ${effInner} 0 ${largeArc} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ");

    return { ...slice, d };
  });

  const activeItem = hoveredIndex !== null ? allCards[hoveredIndex] : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
      {/* Donut Container with Hover Tooltip */}
      <div className="relative shrink-0 select-none flex flex-col items-center">
        {/* Subtle Floating Hover Tooltip */}
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[#070B14]/95 border border-[#C9A96E]/40 text-xs font-mono shadow-xl pointer-events-none flex items-center gap-1.5 transition-all duration-200 z-10 ${
            activeItem ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
          aria-hidden={!activeItem}
        >
          {activeItem && (
            <>
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: activeItem.color }}
              />
              <span className="text-[#F5F1E8] font-medium">{activeItem.label}:</span>
              <span className="text-[#C9A96E] font-bold tabular-nums">{activeItem.value}%</span>
            </>
          )}
        </div>

        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-[180px] h-[180px] drop-shadow-md cursor-pointer"
          onMouseLeave={() => setHoveredIndex(null)}
          role="img"
          aria-label="Asset Allocation Donut Chart"
        >
          {paths.map((p) => (
            <path
              key={p.label}
              d={p.d}
              fill={p.color}
              stroke="#090E1C"
              strokeWidth="2.5"
              onMouseEnter={() => setHoveredIndex(p.index)}
              className="transition-all duration-200"
            />
          ))}
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-2">
          {activeItem ? (
            <>
              <span className="font-mono text-xl font-bold text-[#F5F1E8] tabular-nums">
                {activeItem.value}%
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A96E] truncate max-w-[85px]">
                {activeItem.label}
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A8B0BD]">
                Asset Mix
              </span>
              <span className="font-serif text-xs text-[#F5F1E8]">Indicative</span>
            </>
          )}
        </div>
      </div>

      {/* 4 Equal-Height Allocation Cards in a 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2.5 w-full flex-1">
        {allCards.map((card) => {
          const isHovered = hoveredIndex === card.index;

          return (
            <div
              key={card.label}
              onMouseEnter={() => setHoveredIndex(card.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex flex-col justify-between p-3 rounded-xl border transition-all cursor-pointer h-[68px] ${
                isHovered
                  ? "bg-white/[0.06] border-[#C9A96E]/60 shadow-lg shadow-[#C9A96E]/5"
                  : "bg-white/[0.02] border-white/[0.07] hover:border-white/15"
              }`}
            >
              {/* Row 1: Label and percentage */}
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: card.color }}
                  />
                  <span className="text-xs sm:text-sm font-sans font-medium text-[#F5F1E8] truncate">
                    {card.label}
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-[#F5F1E8] tabular-nums shrink-0">
                  {card.value}%
                </span>
              </div>

              {/* Row 2: Target range on row 2 without wrapping */}
              <div className="text-[11px] font-mono text-[#A8B0BD] whitespace-nowrap tabular-nums overflow-hidden text-ellipsis">
                Target: {card.range}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
