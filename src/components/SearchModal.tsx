"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { products } from "@/data/products";
import { Product } from "@/types/product";
import { Search, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchModal() {
  const { isSearchOpen, setSearchOpen } = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.shape.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.slice(0, 5));
  }, [query]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-32">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-white border border-beige-100 shadow-2xl overflow-hidden mx-4"
          >
            {/* Search Input Area */}
            <div className="flex items-center justify-between border-b border-beige-100 px-6 py-4">
              <Search className="w-5 h-5 text-charcoal/40 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search eyewear (e.g. Avery, Round, Sunglasses)..."
                className="w-full text-lg border-0 bg-transparent text-charcoal placeholder-charcoal/30 focus:outline-hidden outline-hidden focus:ring-0"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-full hover:bg-beige-100 transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5 text-charcoal/60" />
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
              {results.length > 0 ? (
                <div>
                  <h3 className="text-sm uppercase -widest text-charcoal/40 font-semibold mb-4">
                    Products found ({results.length})
                  </h3>
                  <div className="space-y-4">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-4 p-2 -mx-2 hover:bg-beige-50 transition-colors group"
                      >
                        <div className="relative w-16 h-16 bg-beige-50 border border-beige-100 flex-shrink-0">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-charcoal group-hover:text-charcoal/70 transition-colors">
                            {product.name}
                          </p>
                          <p className="text-sm text-charcoal/50">
                            {product.category} &middot; {product.shape} Frame
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">${product.price}</span>
                          <ArrowRight className="w-4 h-4 text-charcoal opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : query.trim() ? (
                <div className="py-8 text-center text-charcoal/50">
                  No frames found matching &ldquo;{query}&rdquo;
                </div>
              ) : (
                <div>
                  <h3 className="text-sm uppercase -widest text-charcoal/40 font-semibold mb-3">
                    Popular Suggestions
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["Avery Classic", "Sunglasses", "Blue Light", "Round Shape", "Titanium"].map(
                      (term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1 bg-beige-50 border border-beige-100 hover:border-charcoal/30 text-sm text-charcoal/70 hover:text-charcoal transition-colors"
                        >
                          {term}
                        </button>
                      )
                    )}
                  </div>
                  <h3 className="text-sm uppercase -widest text-charcoal/40 font-semibold mb-3">
                    Our Curated Collection
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      href="/shop?category=Eyeglasses"
                      onClick={() => setSearchOpen(false)}
                      className="p-4 border border-beige-100 hover:border-charcoal/30 bg-beige-50/50 hover:bg-beige-50 text-center transition-all"
                    >
                      <span className="font-medium block text-charcoal text-sm">Eyeglasses</span>
                    </Link>
                    <Link
                      href="/shop?category=Sunglasses"
                      onClick={() => setSearchOpen(false)}
                      className="p-4 border border-beige-100 hover:border-charcoal/30 bg-beige-50/50 hover:bg-beige-50 text-center transition-all"
                    >
                      <span className="font-medium block text-charcoal text-sm">Sunglasses</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

