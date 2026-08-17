"use client";

import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { X, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";

export default function MobileMenu() {
  const CURRENT_YEAR = 2026;
  const { isMobileMenuOpen, setMobileMenuOpen, cartCount, setSearchOpen, setCartOpen } = useApp();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks: Array<{ name: string; href: string; highlight?: boolean }> = [
    { name: "Men", href: "/shop?gender=Men" },
    { name: "Women", href: "/shop?gender=Women" },
    { name: "Kids", href: "/shop?gender=Kids" },
    { name: "Eyeglasses", href: "/shop?category=Eyeglasses" },
    { name: "Sunglasses", href: "/shop?category=Sunglasses" },
    { name: "New Arrivals", href: "/shop?new=true" },
    { name: "Best Sellers", href: "/shop?best=true" },
    { name: "Face Shape Finder", href: "/face-shape" },
    { name: "Admin Dashboard", href: "/admin", highlight: true },
  ];

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Menu */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="relative w-4/5 max-w-sm h-full bg-white shadow-2xl flex flex-col z-10 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-beige-100">
              <div onClick={() => setMobileMenuOpen(false)}>
                <BrandLogo variant="full" size="sm" theme="dark" href="/" />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-beige-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-charcoal/60" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4 py-6 border-b border-beige-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-beige-50 hover:bg-beige-100 border border-beige-100 rounded-xl text-sm font-semibold text-charcoal/70 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCartOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-[#0f172a] rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Bag ({cartCount})</span>
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 py-6 space-y-3 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-base font-medium py-1.5 transition-colors ${
                    link.highlight
                      ? "text-[#d97706] font-bold border-l-2 border-[#f59e0b] pl-3"
                      : "text-charcoal/80 hover:text-[#f59e0b]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="pt-6 border-t border-beige-100 text-center text-xs text-charcoal/40">
              <p>&copy; {CURRENT_YEAR} DRISHYAM OPTICAL.</p>
              <p className="mt-0.5">Handcrafted Luxury Eyewear</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
