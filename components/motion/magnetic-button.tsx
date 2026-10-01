"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import Link from "next/link";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "ivory";
}

export function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  variant = "primary",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.35);
    y.set(middleY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseStyles =
    "inline-flex items-center justify-center font-sans text-xs md:text-sm font-medium tracking-wide transition-colors duration-300 rounded-2xl px-7 py-3.5 select-none relative group";

  const variantStyles = {
    primary:
      "bg-gold text-ink font-semibold hover:bg-gold-light shadow-sm active:scale-[0.98]",
    secondary:
      "bg-ink-light/80 text-ivory border-hairline-dark hover:border-gold/40 hover:bg-ink-muted active:scale-[0.98]",
    ghost:
      "bg-transparent text-slate-300 hover:text-ivory hover:bg-white/[0.04]",
    ivory:
      "bg-ink text-ivory hover:bg-ink-light active:scale-[0.98]",
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: shouldReduceMotion ? 0 : x, y: shouldReduceMotion ? 0 : y }}
      className="inline-block"
    >
      <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
        {children}
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-none">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block focus:outline-none">
      {content}
    </button>
  );
}
