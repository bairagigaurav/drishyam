"use client";

import React from "react";
import Link from "next/link";

export interface BrandLogoProps {
  variant?: "full" | "icon" | "text" | "stacked";
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "light" | "dark" | "gold";
  href?: string;
  className?: string;
}

export function GlassesIcon({
  size = 28,
  className = "",
  colorVariant = "gold",
}: {
  size?: number;
  className?: string;
  colorVariant?: "gold" | "dark" | "white";
}) {
  const isGold = colorVariant === "gold";
  const isDark = colorVariant === "dark";

  return (
    <svg
      width={size}
      height={Math.round(size * 0.6)}
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 transition-transform duration-300 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`gold-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="30%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id={`lens-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={`dark-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Frame primary stroke color */}
      {(() => {
        const frameStroke = isGold
          ? `url(#gold-grad-${size})`
          : isDark
          ? "#0f172a"
          : "#ffffff";
        const accentStroke = isGold ? "#fbbf24" : isDark ? "#475569" : "#e2e8f0";

        return (
          <g>
            {/* Left Lens Glass Fill */}
            <path
              d="M14 20 C 14 14, 22 13, 36 13 C 44 13, 46 16, 46 22 C 46 36, 42 46, 32 46 C 18 46, 14 36, 14 20 Z"
              fill={`url(#lens-grad-${size})`}
            />
            {/* Right Lens Glass Fill */}
            <path
              d="M54 22 C 54 16, 56 13, 64 13 C 78 13, 86 14, 86 20 C 86 36, 82 46, 68 46 C 58 46, 54 36, 54 22 Z"
              fill={`url(#lens-grad-${size})`}
            />

            {/* Left Rim */}
            <path
              d="M12 20 C 12 12, 22 10, 36 10 C 45 10, 48 14, 48 22 C 48 37, 43 48, 32 48 C 17 48, 12 37, 12 20 Z"
              stroke={frameStroke}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Right Rim */}
            <path
              d="M52 22 C 52 14, 55 10, 64 10 C 78 10, 88 12, 88 20 C 88 37, 83 48, 68 48 C 57 48, 52 37, 52 22 Z"
              stroke={frameStroke}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Keyhole / Bridge */}
            <path
              d="M45 18 C 47 13, 53 13, 55 18"
              stroke={frameStroke}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M44 26 C 47 22, 53 22, 56 26"
              stroke={accentStroke}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Left Temple Hinge Bar */}
            <path
              d="M4 17 L 12 19"
              stroke={frameStroke}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Right Temple Hinge Bar */}
            <path
              d="M88 19 L 96 17"
              stroke={frameStroke}
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Lens Reflection Highlight (Curved diagonal glint) */}
            <path
              d="M20 22 C 22 17, 28 15, 33 15"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            <path
              d="M60 22 C 62 17, 68 15, 73 15"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />

            {/* Subtle rivet dots */}
            <circle cx="8" cy="18" r="1.5" fill={isGold ? "#f59e0b" : accentStroke} />
            <circle cx="92" cy="18" r="1.5" fill={isGold ? "#f59e0b" : accentStroke} />
          </g>
        );
      })()}
    </svg>
  );
}

export default function BrandLogo({
  variant = "full",
  size = "md",
  theme = "light",
  href = "/",
  className = "",
}: BrandLogoProps) {
  // Sizing mapping
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 42,
    xl: 56,
  };

  const titleSizes = {
    sm: "text-base -[0.2em]",
    md: "text-lg sm:text-xl -[0.24em]",
    lg: "text-2xl sm:text-3xl -[0.28em]",
    xl: "text-3xl sm:text-4xl -[0.32em]",
  };

  const subtitleSizes = {
    sm: "text-[7px] -[0.3em]",
    md: "text-[9px] -[0.35em]",
    lg: "text-[11px] -[0.4em]",
    xl: "text-[13px] -[0.45em]",
  };

  // Color theming
  const isLight = theme === "light"; // For dark backgrounds (header, hero, dark mode)
  const isGold = theme === "gold";
  const isDark = theme === "dark"; // For light/beige backgrounds (footer, checkout, light modals)

  const textColor = isLight
    ? "text-white"
    : isGold
    ? "text-[#d97706]"
    : "text-[#0f172a]";

  const subtextColor = isLight
    ? "text-[#f59e0b]"
    : isGold
    ? "text-[#92400e]"
    : "text-[#64748b]";

  const badgeBg = isLight
    ? "bg-white/10 border-white/15 shadow-[0_4px_20px_rgba(245,158,11,0.18)]"
    : isGold
    ? "bg-amber-500/10 border-amber-500/30"
    : "bg-[#0f172a]/5 border-[#0f172a]/10";

  const content = (
    <div className={`group inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* Icon */}
      {variant !== "text" && (
        <div
          className={`relative flex items-center justify-center rounded-2xl border p-1.5 transition-all duration-300 group-hover:scale-105 ${badgeBg}`}
        >
          <GlassesIcon
            size={iconSizes[size]}
            colorVariant={isDark ? "dark" : "gold"}
          />
        </div>
      )}

      {/* Typography */}
      {variant !== "icon" && (
        <div className="flex flex-col justify-center text-left">
          <span
            className={`font-serif font-bold uppercase leading-none transition-colors group-hover:opacity-90 ${titleSizes[size]} ${textColor}`}
          >
            DRISHYAM
          </span>
          <span
            className={`mt-1 font-sans font-bold uppercase leading-none ${subtitleSizes[size]} ${subtextColor}`}
          >
            Optical &middot; Luxury Eyewear
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b] rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
