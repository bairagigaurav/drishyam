"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  ClipboardCheck,
  ArrowLeftRight,
  Truck,
  Eye,
  Sparkles,
  Award,
  HeartHandshake,
  Glasses,
  Clock,
  Star,
  CheckCircle2,
} from "lucide-react";
import { DEFAULT_SITE_CONTENT, getSiteContent, hydrateSiteContent } from "@/lib/site-content";

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldCheck,
  ClipboardCheck,
  ArrowLeftRight,
  Truck,
  Eye,
  Sparkles,
  Award,
  HeartHandshake,
  Glasses,
  Clock,
  Star,
  CheckCircle2,
};

export default function Benefits() {
  const [benefits, setBenefits] = useState(DEFAULT_SITE_CONTENT.benefits);

  useEffect(() => {
    const sync = () => {
      const content = getSiteContent();
      setBenefits(content.benefits ?? DEFAULT_SITE_CONTENT.benefits);
    };

    sync();
    void hydrateSiteContent().then((content) => setBenefits(content.benefits ?? DEFAULT_SITE_CONTENT.benefits));
    window.addEventListener("storage", sync);
    window.addEventListener("drishyam:content-update", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("drishyam:content-update", sync);
    };
  }, []);

  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-beige-100 gradient-bg">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(benefits.length, 4)} gap-8 md:gap-12`}>
          {benefits.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || ShieldCheck;
            return (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-11 h-11 bg-beige-50 border border-beige-100 rounded-2xl flex items-center justify-center text-charcoal/80 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#fff7eb] group-hover:border-[#f59e0b]/40 group-hover:text-[#f59e0b]">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm uppercase font-bold -wider text-charcoal">
                    {item.title}
                  </h3>
                  <p className="text-sm font-light text-charcoal/60 mt-1 leading-relaxed max-w-[240px]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
