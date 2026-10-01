import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface RiskScoreGaugeProps {
  score: number; // 0 to 100
  archetypeName?: string;
  categoryName?: string;
}

export function RiskScoreGauge({ score, archetypeName, categoryName }: RiskScoreGaugeProps) {
  const displayName = archetypeName || categoryName || "Risk Score";
  const shouldReduceMotion = useReducedMotion();
  const [animatedScore, setAnimatedScore] = useState(shouldReduceMotion ? score : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setAnimatedScore(score);
      return;
    }
    const start = performance.now();
    const duration = 1000;
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * ease));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setAnimatedScore(score);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [score, shouldReduceMotion]);

  // Semi-circle gauge geometry
  // Arc runs from 180 deg (left) to 0 deg (right)
  const size = 260;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2 + 30;

  // Circumference of half circle = Math.PI * radius
  const arcLength = Math.PI * radius;
  // Score percentage along arc
  const scorePercent = Math.max(0, Math.min(100, score)) / 100;
  const dashOffset = arcLength * (1 - scorePercent);

  // Angle in degrees for needle: 180 (score 0) to 0 (score 100)
  const needleAngle = 180 - scorePercent * 180;
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleLen = radius - 14;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy - needleLen * Math.sin(needleRad);

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <svg
        viewBox={`0 0 ${size} ${cy + 15}`}
        className="w-full max-w-[280px] h-auto drop-shadow-xl overflow-visible"
        aria-label={`Risk score gauge: ${score} out of 100, ${displayName}`}
        role="img"
      >
        <defs>
          <linearGradient id="gaugeTrackGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8A6E3D" />
            <stop offset="35%" stopColor="#A88B4E" />
            <stop offset="70%" stopColor="#C9A96E" />
            <stop offset="100%" stopColor="#E5C790" />
          </linearGradient>

          <filter id="gaugeGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#C9A96E" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Background track arc (semi-circle) */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Colored progress arc */}
        <motion.path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="url(#gaugeTrackGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: shouldReduceMotion ? 0 : 1, ease: "easeOut" }}
          filter="url(#gaugeGoldGlow)"
        />

        {/* Ticks at 0%, 25%, 50%, 75%, 100% */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
          const ang = (180 - p * 180) * (Math.PI / 180);
          const r1 = radius - strokeWidth / 2 - 4;
          const r2 = radius - strokeWidth / 2 - 10;
          const x1 = cx + r1 * Math.cos(ang);
          const y1 = cy - r1 * Math.sin(ang);
          const x2 = cx + r2 * Math.cos(ang);
          const y2 = cy - r2 * Math.sin(ang);
          return (
            <line
              key={idx}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Needle pointer */}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="#F5F1E8"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="6.5" fill="#C9A96E" stroke="#070B14" strokeWidth="2.5" />
        <circle cx={nx} cy={ny} r="3.5" fill="#C9A96E" />

        {/* Labels at extremities */}
        <text
          x={cx - radius}
          y={cy + 18}
          textAnchor="middle"
          className="fill-[#A8B0BD] text-[10px] font-mono [font-variant-numeric:lining-nums_tabular-nums]"
        >
          0
        </text>
        <text
          x={cx + radius}
          y={cy + 18}
          textAnchor="middle"
          className="fill-[#A8B0BD] text-[10px] font-mono [font-variant-numeric:lining-nums_tabular-nums]"
        >
          100
        </text>
      </svg>

      {/* Central Score readout with ample breathing room */}
      <div className="text-center mt-3 sm:mt-4">
        <div className="font-serif text-4xl sm:text-5xl font-normal text-[#F5F1E8] tracking-tight [font-variant-numeric:lining-nums_tabular-nums]">
          {animatedScore}
          <span className="text-lg text-[#C9A96E] font-mono font-light ml-1">/ 100</span>
        </div>
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#C9A96E] mt-1.5">
          {displayName}
        </p>
      </div>
    </div>
  );
}
