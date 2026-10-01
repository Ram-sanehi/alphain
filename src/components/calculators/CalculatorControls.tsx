import React, { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { formatINR } from "@/utils/calculators";

/**
 * Converts a positive Indian Rupee integer into written English words
 * using standard Indian numbering denomination (Lakh, Crore, Thousand).
 */
export function toIndianWords(num: number): string {
  if (isNaN(num) || num <= 0) return "";
  const n = Math.floor(Math.abs(num));
  if (n === 0) return "Zero Rupees";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  function convert2Digits(val: number): string {
    if (val === 0) return "";
    if (val < 20) return ones[val];
    const t = tens[Math.floor(val / 10)];
    const o = ones[val % 10];
    return o ? `${t} ${o}` : t;
  }

  function convert3Digits(val: number): string {
    const h = Math.floor(val / 100);
    const rem = val % 100;
    const hStr = h > 0 ? `${ones[h]} Hundred` : "";
    const remStr = convert2Digits(rem);
    if (hStr && remStr) return `${hStr} ${remStr}`;
    return hStr || remStr;
  }

  const crore = Math.floor(n / 10000000);
  const remCrore = n % 10000000;
  const lakh = Math.floor(remCrore / 100000);
  const remLakh = remCrore % 100000;
  const thousand = Math.floor(remLakh / 1000);
  const remThousand = remLakh % 1000;
  const remainder = remThousand;

  const parts: string[] = [];
  if (crore > 0) {
    parts.push(`${crore < 100 ? convert2Digits(crore) : convert3Digits(crore)} Crore`);
  }
  if (lakh > 0) {
    parts.push(`${convert2Digits(lakh)} Lakh`);
  }
  if (thousand > 0) {
    parts.push(`${convert2Digits(thousand)} Thousand`);
  }
  if (remainder > 0) {
    parts.push(convert3Digits(remainder));
  }

  return parts.join(" ") + " Rupees";
}

/**
 * Smoothly interpolates an integer value over ~300ms using easeOutQuad
 */
export function useCountUp(target: number, duration: number = 320): number {
  const [current, setCurrent] = useState(target);
  const prevRef = useRef(target);

  useEffect(() => {
    if (prevRef.current === target) return;
    const startVal = current;
    const endVal = target;
    const startTime = performance.now();

    let animationFrameId: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuad curve: fast initial acceleration, silky deceleration
      const ease = 1 - (1 - progress) * (1 - progress);
      const nextVal = Math.round(startVal + (endVal - startVal) * ease);
      setCurrent(nextVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        setCurrent(endVal);
        prevRef.current = endVal;
      }
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return current;
}

interface AnimatedSummaryCardProps {
  label: string;
  numericValue?: number;
  formattedText?: string;
  prefix?: string;
  suffix?: string;
  helperText?: string;
  highlightValue?: boolean;
}

export function AnimatedSummaryCard({
  label,
  numericValue,
  formattedText,
  prefix = "",
  suffix = "",
  helperText,
  highlightValue,
}: AnimatedSummaryCardProps) {
  const isNumeric = typeof numericValue === "number" && !isNaN(numericValue);
  const animatedNum = useCountUp(isNumeric ? numericValue : 0);
  const [flash, setFlash] = useState(false);
  const prevValRef = useRef(numericValue ?? formattedText);

  useEffect(() => {
    const cur = numericValue ?? formattedText;
    if (prevValRef.current !== cur) {
      prevValRef.current = cur;
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 350);
      return () => clearTimeout(timer);
    }
  }, [numericValue, formattedText]);

  const displayString = isNumeric
    ? `${prefix}${formatINR(animatedNum)}${suffix}`
    : formattedText ?? "—";

  return (
    <div
      className={`p-6 rounded-2xl bg-[#090E1C] border transition-all duration-300 shadow-lg min-h-[148px] flex flex-col justify-between group hover:-translate-y-1 motion-reduce:hover:transform-none ${
        flash
          ? "border-[#C9A96E] ring-1 ring-[#C9A96E]/40 bg-[#0E1529]"
          : highlightValue
          ? "border-[#C9A96E]/40 hover:border-[#C9A96E]/70"
          : "border-white/[0.08] hover:border-[#C9A96E]/50"
      }`}
    >
      <div>
        <p className="text-[12px] font-mono uppercase tracking-[0.15em] text-[#A8B0BD] min-h-[30px] flex items-center leading-snug">
          {label}
        </p>
        <h3
          className={`font-serif text-[28px] sm:text-[32px] leading-tight mt-1 transition-colors duration-200 [font-variant-numeric:lining-nums_tabular-nums] ${
            flash
              ? "text-[#F5E2B3]"
              : highlightValue
              ? "text-[#C9A96E]"
              : "text-[#F5F1E8]"
          }`}
        >
          {displayString}
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

interface NumericSliderControlProps {
  id: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string; // "₹", "%", "Years"
  minLabel?: string;
  maxLabel?: string;
  midLabel?: string;
  showWords?: boolean;
}

export function NumericSliderControl({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "₹",
  minLabel,
  maxLabel,
  midLabel,
  showWords = false,
}: NumericSliderControlProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempInput, setTempInput] = useState(value.toString());

  useEffect(() => {
    if (!isEditing) {
      setTempInput(value.toString());
    }
  }, [value, isEditing]);

  const handleCommit = () => {
    setIsEditing(false);
    const cleaned = tempInput.replace(/[^0-9.]/g, "");
    let num = Number(cleaned);
    if (isNaN(num)) num = min;
    num = Math.max(min, Math.min(num, max));
    onChange(num);
  };

  const formattedDisplay =
    unit === "₹"
      ? formatINR(value)
      : unit === "%"
      ? `${value}%`
      : `${value} ${unit}`;

  const words = showWords && unit === "₹" ? toIndianWords(value) : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <label
          htmlFor={id}
          className="text-[12px] text-[#A8B0BD] uppercase tracking-wider font-mono cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {label}
        </label>

        {isEditing ? (
          <div className="flex items-center gap-1">
            {unit === "₹" && <span className="text-[#C9A96E] font-mono text-xs">₹</span>}
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              value={tempInput}
              onChange={(e) => setTempInput(e.target.value)}
              onBlur={handleCommit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCommit();
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setTempInput(value.toString());
                }
              }}
              className="w-24 sm:w-28 px-2 py-0.5 bg-[#070B14] border border-[#C9A96E] rounded-md text-right font-mono text-sm text-[#F5F1E8] focus:outline-none [font-variant-numeric:lining-nums_tabular-nums]"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            title="Click to type exact value"
            className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white/[0.04] transition-colors"
          >
            <span
              className={`font-mono text-sm font-semibold [font-variant-numeric:lining-nums_tabular-nums] ${
                unit === "%" ? "text-[#C9A96E]" : "text-[#F5F1E8]"
              }`}
            >
              {formattedDisplay}
            </span>
            <span className="text-[10px] text-white/30 group-hover:text-[#C9A96E] transition-colors">
              ✎
            </span>
          </button>
        )}
      </div>

      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([val]) => onChange(val)}
        aria-label={label}
        ariaValueText={formattedDisplay}
      />

      <div className="flex justify-between items-baseline text-[11px] font-mono text-[#A8B0BD] [font-variant-numeric:lining-nums_tabular-nums]">
        <span>{minLabel || (unit === "₹" ? formatINR(min) : `${min}${unit}`)}</span>
        {midLabel && <span>{midLabel}</span>}
        <span>{maxLabel || (unit === "₹" ? formatINR(max) : `${max}${unit}`)}</span>
      </div>

      {words && (
        <p className="text-[11px] font-mono text-[#C9A96E]/80 tracking-wide truncate select-none">
          {words}
        </p>
      )}
    </div>
  );
}
