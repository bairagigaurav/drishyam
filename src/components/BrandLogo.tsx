"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import brandLogo from "../../public/assets/brand-logo.webp";

export interface BrandLogoProps {
  variant?: "full";
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "light" | "dark";
  href?: string;
  className?: string;
}

export default function BrandLogo({
  variant = "full",
  size = "md",
  theme = "light",
  href = "/",
  className = "",
}: BrandLogoProps) {
  const sizeMap = {
    sm: "h-8 sm:h-10",
    md: "h-8 sm:h-10",
    lg: "h-16 sm:h-20",
    xl: "h-20 sm:h-24",
  } as const;

  const content = (
    <div
      data-variant={variant}
      data-theme={theme}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <Image
        src={brandLogo}
        alt="Drishyam Optical logo"
        className={`${sizeMap[size]} w-auto object-contain select-none`}
        priority
      />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b]"
      >
        {content}
      </Link>
    );
  }

  return content;
}