import React, { useState } from "react";
import { InsightCategory } from "@/data/insightsData";

export interface InsightCoverProps {
  category: InsightCategory;
  title?: string;
  coverImage?: string;
  coverImageSrcSet?: string;
  altText?: string;
  className?: string;
  variant?: "featured" | "card" | "hero";
  priority?: boolean;
}

export function InsightCover({
  category,
  title,
  coverImage,
  coverImageSrcSet,
  altText,
  className = "",
  variant = "card",
  priority = false,
}: InsightCoverProps) {
  const [imageError, setImageError] = useState(false);

  const isFeatured = variant === "featured";
  const aspectRatioClass = isFeatured ? "aspect-[4/3]" : "aspect-[16/9]";
  const imgWidth = isFeatured ? 800 : 640;
  const imgHeight = isFeatured ? 600 : 360;

  // If a valid custom photo override exists and has not errored, render it with unified editorial treatment
  if (coverImage && !imageError) {
    return (
      <div
        className={`insight-cover-wrapper relative overflow-hidden bg-[#070B14] rounded-2xl border border-white/[0.08] ${aspectRatioClass} ${className}`}
      >
        {/* 1. Underlying Photo: Monochrome by default, transitions to full colour on image hover */}
        <picture className="w-full h-full block overflow-hidden">
          {coverImageSrcSet && (
            <source
              type="image/webp"
              srcSet={coverImageSrcSet}
              sizes={
                isFeatured
                  ? "(max-width: 1024px) 100vw, 45vw"
                  : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              }
            />
          )}
          <img
            src={coverImage}
            alt={altText || (title ? `Cover for ${title}` : `${category} publication cover`)}
            width={imgWidth}
            height={imgHeight}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            onError={() => setImageError(true)}
            className="insight-cover-image w-full h-full object-cover pointer-events-none select-none"
          />
        </picture>

        {/* 2. Navy Duotone & Gold Overlay: Fades out smoothly on image hover to reveal full colour */}
        <div className="insight-cover-overlay absolute inset-0 pointer-events-none">
          {/* Navy Duotone Gradient Overlay: rgba(6,10,20,0.15) top to rgba(6,10,20,0.75) bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(6, 10, 20, 0.15) 0%, rgba(6, 10, 20, 0.45) 50%, rgba(6, 10, 20, 0.75) 100%)",
            }}
          />

          {/* Subtle Warm Gold Tint */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#C9A96E]/18 via-[#C9A96E]/10 to-transparent mix-blend-soft-light opacity-65" />
        </div>

        {/* 3. Static Fine Gold Hairline Rim Accent (No hover shift) */}
        <div className="absolute inset-0 rounded-2xl border border-[#C9A96E]/20 pointer-events-none" />

        {/* 4. Category Pill (Top-Left) with Dark Translucent Backdrop & Blur */}
        <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-[#070B14]/85 backdrop-blur-md border border-[#C9A96E]/30 text-[10px] font-mono uppercase tracking-wider text-[#E5C790] shadow-sm pointer-events-none select-none">
          {category}
        </span>
      </div>
    );
  }

  // Pure on-brand vector SVG generated covers
  return (
    <div
      className={`insight-cover-wrapper relative overflow-hidden bg-[#070B14] rounded-2xl select-none border border-white/[0.08] ${aspectRatioClass} ${className}`}
      role="img"
      aria-label={`${category} research illustration`}
    >
      <svg
        viewBox="0 0 600 400"
        className="insight-cover-image w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle noise/grain filter */}
          <filter id={`grain-${category.replace(/\s+/g, "")}`} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" />
            <feComposite in2="SourceGraphic" in="gl" operator="in" />
          </filter>

          {/* Gold Linear Gradient */}
          <linearGradient id="goldGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A6E3D" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#C9A96E" stopOpacity="1" />
            <stop offset="100%" stopColor="#F5E3B8" stopOpacity="0.9" />
          </linearGradient>

          {/* Slate Gradient */}
          <linearGradient id="slateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#64748B" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#334155" stopOpacity="0.2" />
          </linearGradient>

          {/* Background Radial Glow */}
          <radialGradient id="navyGoldRadial" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#0B1220" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#070B14" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Base Background */}
        <rect width="600" height="400" fill="url(#navyGoldRadial)" />

        {/* Category-Specific Vector Artwork */}
        {category === "Market Commentary" && (
          <g opacity="0.95">
            {/* Fine Financial Coordinate Grid */}
            <line x1="60" y1="80" x2="540" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="60" y1="140" x2="540" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="60" y1="200" x2="540" y2="200" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="60" y1="260" x2="540" y2="260" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="60" y1="320" x2="540" y2="320" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

            {/* Smoothing Moving Average Curve (Slate) */}
            <path
              d="M 60 260 C 140 240, 200 270, 280 210 C 350 160, 420 180, 540 110"
              fill="none"
              stroke="#64748B"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.6"
            />

            {/* Primary Compounding Trend Vector (Gold) */}
            <path
              d="M 60 290 Q 150 280, 210 240 T 360 170 T 480 120 L 540 95"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Candlestick Abstractions */}
            {[
              { x: 120, y1: 250, y2: 280, top: 240, bot: 290, bull: true },
              { x: 180, y1: 230, y2: 260, top: 220, bot: 270, bull: false },
              { x: 240, y1: 210, y2: 240, top: 200, bot: 250, bull: true },
              { x: 300, y1: 190, y2: 225, top: 180, bot: 235, bull: true },
              { x: 370, y1: 160, y2: 185, top: 150, bot: 195, bull: true },
              { x: 440, y1: 130, y2: 155, top: 120, bot: 165, bull: true },
              { x: 500, y1: 100, y2: 125, top: 90, bot: 135, bull: true },
            ].map((c, i) => (
              <g key={i}>
                <line x1={c.x} y1={c.top} x2={c.x} y2={c.bot} stroke={c.bull ? "#C9A96E" : "#64748B"} strokeWidth="1" opacity="0.7" />
                <rect
                  x={c.x - 4}
                  y={c.y1}
                  width="8"
                  height={c.y2 - c.y1}
                  fill={c.bull ? "rgba(201, 169, 110, 0.25)" : "rgba(100, 116, 139, 0.2)"}
                  stroke={c.bull ? "#C9A96E" : "#64748B"}
                  strokeWidth="1"
                />
              </g>
            ))}

            {/* Glowing Accent Peak */}
            <circle cx="540" cy="95" r="4" fill="#C9A96E" />
            <circle cx="540" cy="95" r="9" fill="none" stroke="#C9A96E" strokeWidth="1" opacity="0.4" />
          </g>
        )}

        {category === "Tax Optimization" && (
          <g opacity="0.95">
            {/* Layered Geometric Ledger & Grid Matrix */}
            <rect x="70" y="70" width="460" height="260" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="70" y1="120" x2="530" y2="120" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <line x1="70" y1="180" x2="530" y2="180" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="70" y1="240" x2="530" y2="240" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />

            <line x1="180" y1="70" x2="180" y2="330" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="330" y1="70" x2="330" y2="330" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="430" y1="70" x2="430" y2="330" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

            {/* Geometric Tax Shield Brackets */}
            <path d="M 120 150 L 100 150 L 100 280 L 120 280" fill="none" stroke="#C9A96E" strokeWidth="1.5" />
            <path d="M 480 150 L 500 150 L 500 280 L 480 280" fill="none" stroke="#C9A96E" strokeWidth="1.5" />

            {/* Overlapping Intersecting Vector Shield */}
            <polygon
              points="300,100 420,160 420,270 300,320 180,270 180,160"
              fill="rgba(201, 169, 110, 0.04)"
              stroke="url(#goldGradient)"
              strokeWidth="1.5"
            />
            <polygon
              points="300,125 390,170 390,250 300,295 210,250 210,170"
              fill="none"
              stroke="#64748B"
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.7"
            />

            {/* Calibration Reticle Node */}
            <circle cx="300" cy="210" r="3" fill="#C9A96E" />
            <line x1="285" y1="210" x2="315" y2="210" stroke="#C9A96E" strokeWidth="1" />
            <line x1="300" y1="195" x2="300" y2="225" stroke="#C9A96E" strokeWidth="1" />
          </g>
        )}

        {category === "Fiduciary Wealth" && (
          <g opacity="0.95">
            {/* Concentric Balanced Arcs & Fiduciary Scale Motif */}
            <circle cx="300" cy="200" r="160" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <circle cx="300" cy="200" r="120" fill="none" stroke="#64748B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <circle cx="300" cy="200" r="85" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" />
            <circle cx="300" cy="200" r="45" fill="none" stroke="rgba(201, 169, 110, 0.3)" strokeWidth="1" />

            {/* Horizontal Fiduciary Balance Beam */}
            <line x1="130" y1="200" x2="470" y2="200" stroke="#C9A96E" strokeWidth="1.5" />
            <line x1="300" y1="100" x2="300" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="2 4" />

            {/* Fulcrum Pivot Base */}
            <polygon points="300,185 312,205 288,205" fill="#C9A96E" />
            <circle cx="300" cy="200" r="5" fill="#070B14" stroke="#C9A96E" strokeWidth="1.5" />

            {/* Left Pan (Client Capital Alignment) */}
            <line x1="160" y1="200" x2="160" y2="235" stroke="#64748B" strokeWidth="1" />
            <path d="M 125 235 Q 160 255 195 235 Z" fill="rgba(201,169,110,0.1)" stroke="#C9A96E" strokeWidth="1" />

            {/* Right Pan (Zero Conflict Governance) */}
            <line x1="440" y1="200" x2="440" y2="235" stroke="#64748B" strokeWidth="1" />
            <path d="M 405 235 Q 440 255 475 235 Z" fill="rgba(201,169,110,0.1)" stroke="#C9A96E" strokeWidth="1" />
          </g>
        )}

        {category === "Retirement Planning" && (
          <g opacity="0.95">
            {/* Rising Horizon & Golden Sunrise Arc */}
            {/* Ground Horizon Datum */}
            <line x1="50" y1="280" x2="550" y2="280" stroke="#C9A96E" strokeWidth="1.5" />
            <line x1="50" y1="290" x2="550" y2="290" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <line x1="50" y1="305" x2="550" y2="305" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Radiating Geometric Solar Rays */}
            {[
              { x2: 120, y2: 120 },
              { x2: 180, y2: 90 },
              { x2: 240, y2: 70 },
              { x2: 300, y2: 60 },
              { x2: 360, y2: 70 },
              { x2: 420, y2: 90 },
              { x2: 480, y2: 120 },
            ].map((ray, i) => (
              <line
                key={i}
                x1="300"
                y1="280"
                x2={ray.x2}
                y2={ray.y2}
                stroke="#64748B"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.4"
              />
            ))}

            {/* Compounding Parabolic Sunrise Waves */}
            <path
              d="M 160 280 A 140 140 0 0 1 440 280"
              fill="rgba(201, 169, 110, 0.05)"
              stroke="rgba(201, 169, 110, 0.3)"
              strokeWidth="1"
            />
            <path
              d="M 200 280 A 100 100 0 0 1 400 280"
              fill="rgba(201, 169, 110, 0.08)"
              stroke="rgba(201, 169, 110, 0.6)"
              strokeWidth="1.5"
            />
            <path
              d="M 240 280 A 60 60 0 0 1 360 280"
              fill="url(#goldGradient)"
              opacity="0.9"
            />
          </g>
        )}

        {category === "Asset Allocation" && (
          <g opacity="0.95">
            {/* Proportional Asset Quadrants & Ribbons */}
            <rect x="80" y="80" width="440" height="240" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="300" y1="80" x2="300" y2="320" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="80" y1="200" x2="520" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 3" />

            {/* Asset Allocation Weight Ribbons */}
            {/* Equity Ribbon (Gold) */}
            <path d="M 80 230 C 180 220, 240 140, 360 120 C 420 110, 480 130, 520 100 L 520 130 C 480 160, 420 140, 360 150 C 240 170, 180 250, 80 260 Z" fill="rgba(201, 169, 110, 0.25)" stroke="#C9A96E" strokeWidth="1.5" />
            {/* Debt Ribbon (Slate) */}
            <path d="M 80 260 C 180 250, 240 170, 360 150 C 420 140, 480 160, 520 130 L 520 190 C 460 210, 400 200, 340 220 C 240 250, 170 290, 80 300 Z" fill="rgba(100, 116, 139, 0.2)" stroke="#64748B" strokeWidth="1" />

            {/* Target Weight Nodes */}
            <circle cx="360" cy="120" r="5" fill="#C9A96E" />
            <circle cx="360" cy="150" r="4" fill="#64748B" />
          </g>
        )}

        {/* Framing Gold Hairlines & Corner Registration Marks */}
        <g stroke="#C9A96E" strokeWidth="1" opacity="0.6">
          {/* Top-Left Corner */}
          <line x1="24" y1="24" x2="44" y2="24" />
          <line x1="24" y1="24" x2="24" y2="44" />
          {/* Top-Right Corner */}
          <line x1="576" y1="24" x2="556" y2="24" />
          <line x1="576" y1="24" x2="576" y2="44" />
          {/* Bottom-Left Corner */}
          <line x1="24" y1="376" x2="44" y2="376" />
          <line x1="24" y1="376" x2="24" y2="356" />
          {/* Bottom-Right Corner */}
          <line x1="576" y1="376" x2="556" y2="376" />
          <line x1="576" y1="376" x2="576" y2="356" />
        </g>

        {/* Faint Publication Grain Overlay */}
        <rect
          width="600"
          height="400"
          fill="rgba(255,255,255,0.015)"
          filter={`url(#grain-${category.replace(/\s+/g, "")})`}
        />
      </svg>

      {/* Navy Duotone & Gold Overlay: Fades out smoothly on image hover to reveal full colour */}
      <div className="insight-cover-overlay absolute inset-0 pointer-events-none">
        {/* Navy Duotone Gradient Overlay: rgba(6,10,20,0.15) top to rgba(6,10,20,0.75) bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(6, 10, 20, 0.15) 0%, rgba(6, 10, 20, 0.45) 50%, rgba(6, 10, 20, 0.75) 100%)",
          }}
        />

        {/* Subtle Warm Gold Tint */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#C9A96E]/18 via-[#C9A96E]/10 to-transparent mix-blend-soft-light opacity-65" />
      </div>

      {/* Static Fine Gold Hairline Rim Accent (No hover shift) */}
      <div className="absolute inset-0 rounded-2xl border border-[#C9A96E]/20 pointer-events-none" />

      {/* Category Pill (Top-Left) with Dark Translucent Backdrop & Blur */}
      <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-[#070B14]/85 backdrop-blur-md border border-[#C9A96E]/30 text-[10px] font-mono uppercase tracking-wider text-[#E5C790] shadow-sm pointer-events-none select-none">
        {category}
      </span>

      {/* Editorial Category Watermark Caption (HTML overlay with guaranteed padding and crisp contrast) */}
      {category !== "Asset Allocation" && (
        <div className="absolute bottom-4 left-6 z-10 font-mono text-[10.5px] sm:text-[11px] tracking-[0.22em] uppercase text-[#E5C790] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] pointer-events-none select-none max-w-[85%] truncate">
          ALPHA RESEARCH · {category.toUpperCase()}
        </div>
      )}

      {/* Decorative Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/70 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
