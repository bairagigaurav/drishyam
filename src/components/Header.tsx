"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Search, ShoppingBag, Heart, User, Menu } from "lucide-react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Header() {
  const { cartCount, wishlist, setSearchOpen, setCartOpen, setMobileMenuOpen, setOnboardingOpen } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: Array<{ name: string; href: string; highlight?: boolean }> = [
    { name: "Men", href: "/shop?gender=Men" },
    { name: "Women", href: "/shop?gender=Women" },
    { name: "Kids", href: "/shop?gender=Kids" },
    { name: "Eyeglasses", href: "/shop?category=Eyeglasses" },
    { name: "Sunglasses", href: "/shop?category=Sunglasses" },
    { name: "New Arrivals", href: "/shop?new=true" },
    { name: "Best Sellers", href: "/shop?best=true" },
  ];

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10 py-2.5 shadow-[0_16px_40px_rgba(15,23,42,0.16)]"
            : "bg-[#0f172a] py-3.5 border-b border-[#f59e0b]/20"
        }`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between gap-4">
    <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 lg:hidden rounded-full hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-white/90" />
            </button>

            <div className="flex-1 lg:flex-initial flex justify-center lg:justify-start">
              <BrandLogo variant="full" size="md" theme="light" href="/" />
            </div>
            </div>
        

            <nav className="hidden lg:flex items-center space-x-8 text-[11px] font-semibold uppercase -[0.22em] text-white/80">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative py-1 transition-colors hover:text-[#fbbf24] group ${
                    item.highlight ? "text-[#fbbf24] font-bold" : ""
                  }`}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f59e0b] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
              <Link
                href="/admin"
                className="relative py-1 text-[#fbbf24] font-bold transition-colors hover:text-[#f9d87d]"
              >
                Admin
              </Link>
            </nav>

            <div className="flex items-center space-x-1 sm:space-x-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/90 cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              <button
                type="button"
                onClick={() => setOnboardingOpen(true)}
                className="hidden md:block p-2 rounded-full hover:bg-white/10 transition-colors text-white/90 cursor-pointer"
                aria-label="Open profile onboarding"
              >
                <User className="w-4.5 h-4.5" />
              </button>

              <Link
                href="/shop?wishlist=true"
                className="hidden md:block p-2 rounded-full hover:bg-white/10 transition-colors text-white/90 relative"
                aria-label="Wishlist"
              >
                <Heart className={`w-4.5 h-4.5 ${wishlist.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/90 relative cursor-pointer"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#f59e0b] text-[10px] font-bold text-[#0f172a] leading-none">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
