"use client";

import React, { useEffect, useState } from "react";

const frameStyles = [
  {
    type: "rectangle",
    mainBorder: "rounded-[20px]",
    mainSize: "h-16 w-20",
    lens: "rounded-[16px]",
    bridge: "w-10"
  },
  {
    type: "round",
    mainBorder: "rounded-full",
    mainSize: "h-16 w-16",
    lens: "rounded-full",
    bridge: "w-6"
  },
  {
    type: "square",
    mainBorder: "rounded-[8px]",
    mainSize: "h-16 w-16",
    lens: "rounded-[6px]",
    bridge: "w-8"
  },
  {
    type: "oval",
    mainBorder: "rounded-[28px]",
    mainSize: "h-14 w-20",
    lens: "rounded-[22px]",
    bridge: "w-10"
  }
];

const frameColors = ["#111111", "#70483c", "#d4af37", "#4a5568", "#e5b4b4"];

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [frameIndex, setFrameIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frameStyles.length);
      setColorIndex((prev) => (prev + 1) % frameColors.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const currentFrame = frameStyles[frameIndex];
  const currentColor = frameColors[colorIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fffaf5] transition-opacity duration-500">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Frame Carousel */}
        <div className="relative flex items-center justify-center h-32 w-32">
          {/* Frame border */}
          <div
            className={`absolute ${currentFrame.mainSize} ${currentFrame.mainBorder} border-[6px] bg-transparent transition-all duration-500`}
            style={{ borderColor: currentColor }}
          />
          
          {/* Left lens */}
          <div
            className={`absolute left-2 top-1/2 h-12 w-10 ${currentFrame.lens} border-[5px] -translate-y-1/2 transition-all duration-500`}
            style={{ borderColor: currentColor }}
          />
          
          {/* Right lens */}
          <div
            className={`absolute right-2 top-1/2 h-12 w-10 ${currentFrame.lens} border-[5px] -translate-y-1/2 transition-all duration-500`}
            style={{ borderColor: currentColor }}
          />
          
          {/* Bridge */}
          <div
            className={`absolute top-1/2 h-1 bg-opacity-60 -translate-y-1/2 transition-all duration-500`}
            style={{ width: currentFrame.bridge, backgroundColor: currentColor }}
          />
          
          {/* Accent dot */}
          <div
            className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors duration-500"
            style={{ backgroundColor: currentColor }}
          />
        </div>

        {/* Text with loading indicator */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase -[0.4em] text-[#111111]/70">
            <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
            DRISHYAM
          </div>
          
          {/* Loading dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#111111] opacity-40 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
