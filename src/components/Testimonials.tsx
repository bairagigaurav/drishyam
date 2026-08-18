"use client";

import React, { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_SITE_CONTENT, getSiteContent, hydrateSiteContent, TestimonialItem } from "@/lib/site-content";

export default function Testimonials() {
  const [list, setList] = useState<TestimonialItem[]>(DEFAULT_SITE_CONTENT.testimonials);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const sync = () => {
      const content = getSiteContent();
      const nextList = content.testimonials ?? DEFAULT_SITE_CONTENT.testimonials;
      setList(nextList);
      setActiveIdx((prev) => (prev >= nextList.length ? 0 : prev));
    };

    sync();
    void hydrateSiteContent().then((content) => {
      const nextList = content.testimonials ?? DEFAULT_SITE_CONTENT.testimonials;
      setList(nextList);
      setActiveIdx((prev) => (prev >= nextList.length ? 0 : prev));
    });
    window.addEventListener("storage", sync);
    window.addEventListener("drishyam:content-update", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("drishyam:content-update", sync);
    };
  }, []);

  // Auto Play
  useEffect(() => {
    if (!list || list.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev === list.length - 1 ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [list]);

  if (!list || list.length === 0) return null;

  const currentItem = list[activeIdx] ?? list[0];

  const prev = () => {
    setActiveIdx((current) => (current === 0 ? list.length - 1 : current - 1));
  };

  const next = () => {
    setActiveIdx((current) => (current === list.length - 1 ? 0 : current + 1));
  };

  return (
    <section className="relative py-24 overflow-hidden border-b border-white/10">
      {/* Background Image */}
      <div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('https://images.unsplash.com/photo-1611222777277-61319d63ca94?q=80&w=874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
  }}
/>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Soft Blur / Light Overlay */}
      <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[3px]" />

      {/* Decorative Light */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#f59e0b]/15 blur-3xl" />
      <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <span className="text-[14px] font-semibold uppercase -[0.3em] text-[#fcd34d] block mb-3">
            Reviews
          </span>

          <h2 className="font-serif text-3xl md:text-4xl text-white font-medium">
            Seen On You.
          </h2>

          <p className="mt-3 text-sm text-white/70 max-w-md mx-auto">
            Loved by people who appreciate timeless design, precision, and exceptional optical craftsmanship.
          </p>
        </div>

        {/* Glassmorphism Card */}
        <div
          className="
            relative
            border border-white/20
            bg-white/10
            backdrop-blur-xl
            p-8 md:p-12
            rounded-3xl
            shadow-2xl
            overflow-hidden
          "
        >
          {/* Glass Highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id || activeIdx}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.35 }}
              className="relative flex flex-col md:flex-row gap-8 items-center"
            >
              {/* Photo */}
              <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-[#f59e0b]/50 flex-shrink-0 bg-white/10 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentItem.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"}
                  alt={currentItem.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                {/* Rating */}
                <div className="flex justify-center md:justify-start gap-1">
                  {[...Array(Math.max(1, Math.min(5, currentItem.rating || 5)))].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]"
                    />
                  ))}
                </div>

                {/* Review */}
                <p className="text-sm sm:text-base font-light italic leading-relaxed text-white/95">
                  &ldquo;{currentItem.text}&rdquo;
                </p>

                {/* User */}
                <div>
                  <h4 className="text-sm uppercase font-bold -wider text-white">
                    {currentItem.name}
                  </h4>

                  <p className="text-[13px] text-[#fcd34d]/90 mt-0.5">
                    {currentItem.role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows & Indicators */}
          {list.length > 1 && (
            <div className="relative flex items-center justify-between mt-8 md:mt-6 pt-4 border-t border-white/10">
              <div className="flex gap-1.5">
                {list.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveIdx(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeIdx ? "w-6 bg-[#f59e0b]" : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="
                    w-9 h-9
                    rounded-full
                    cursor-pointer
                    border border-white/30
                    bg-white/10
                    backdrop-blur-md
                    flex items-center justify-center
                    text-white/80
                    hover:bg-[#f59e0b]
                    hover:border-[#f59e0b]
                    hover:text-[#0f172a]
                    hover:scale-105
                    transition-all
                  "
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={next}
                  className="
                    w-9 h-9
                    rounded-full
                    cursor-pointer
                    border border-white/30
                    bg-white/10
                    backdrop-blur-md
                    flex items-center justify-center
                    text-white/80
                    hover:bg-[#f59e0b]
                    hover:border-[#f59e0b]
                    hover:text-[#0f172a]
                    hover:scale-105
                    transition-all
                  "
                  aria-label="Next review"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}