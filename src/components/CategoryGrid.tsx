"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { DEFAULT_SITE_CONTENT, getSiteContent, hydrateSiteContent, AdminCategory } from "@/lib/site-content";

export default function CategoryGrid() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const sync = () => {
      const content = getSiteContent();
      setCategories(content.categories ?? []);
      setIsHydrated(true);
    };

    sync();
    void hydrateSiteContent().then((content) => setCategories(content.categories ?? []));
    window.addEventListener("storage", sync);
    window.addEventListener("drishyam:content-update", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("drishyam:content-update", sync);
    };
  }, []);

  if (!isHydrated || categories.length === 0) {
    return null; // Gracefully hide when no admin category cards have been created yet
  }

  return (
    <section className="py-20 bg-[#fffaf3] border-t border-[#f5e7d1]">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-sm font-semibold uppercase -[0.24em] text-[#1f2a44] block mb-2">
              Our Collections
            </span>
            <h2 className=" text-3xl md:text-4xl text-[#111827] font-medium">
              Shop by style.
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold uppercase -[0.18em] text-[#111827] hover:text-[#0f172a] flex items-center gap-1 pb-1 border-b border-[#f59e0b]/60 w-fit transition-colors"
          >
            <span>Explore all products</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(Math.max(categories.length, 1), 4)} gap-6`}>
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id || cat.slug || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <Link
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="block relative h-full overflow-hidden rounded-[26px] border border-[#f1e7d8] bg-white shadow-[0_16px_35px_rgba(15,23,42,0.04)]"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f1e7d8]/40">
                  {cat.image ? (
         <Image
  src={cat.image}
  alt={cat.name}
  fill
  unoptimized
  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
/>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-charcoal/40">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/45 via-transparent to-transparent" />
                </div>

                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#111827] -tight text-base sm:text-lg truncate max-w-[250px]">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-[#475569] font-light mt-1 max-w-[200px] truncate">
                      {cat.description}
                    </p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f59e0b] text-[#111827] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
