import React from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  const CURRENT_YEAR = 2026;

  const shopLinks = [
    { name: "All Eyewear", href: "/shop" },
    { name: "Eyeglasses", href: "/shop?category=Eyeglasses" },
    { name: "Sunglasses", href: "/shop?category=Sunglasses" },
    { name: "New Arrivals", href: "/shop?new=true" },
  ];

  const brandLinks = [
    { name: "Our Story", href: "/shop" },
  ];

  const helpLinks = [
    { name: "Prescription Help", href: "/shop" },
    { name: "Shipping & Returns", href: "/shop" },
  ];

  return (
    <footer className="bg-white pt-16 pb-6 text-sm text-charcoal/60 border-t border-beige-100">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-beige-100">
          {/* Brand Info (Col: 4) */}
          <div className="md:col-span-4 space-y-4">
            <BrandLogo variant="full" size="md" theme="dark" href="/" />
            <p className="font-light leading-relaxed max-w-xs text-charcoal/70 pt-2">
              Handcrafted optical excellence. We create premium minimalist eyewear designed around character, proportion, and clarity.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.instagram.com/drishyam_opticals_indore?utm_source=qr&igsh=MTNienYxMDR0a25lbQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-charcoal/40 hover:text-[#f59e0b] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link groups (Col: 8) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h4 className="text-[13px] uppercase font-bold -widest text-charcoal">Shop</h4>
              <ul className="space-y-2 font-light">
                {shopLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-[#f59e0b] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-[13px] uppercase font-bold -widest text-charcoal">Brand</h4>
              <ul className="space-y-2 font-light">
                {brandLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-[#f59e0b] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h4 className="text-[13px] uppercase font-bold -widest text-charcoal">Support</h4>
              <ul className="space-y-2 font-light">
                {helpLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-[#f59e0b] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright alignment */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 font-light text-[13px] text-charcoal/50">
          <p>&copy; {CURRENT_YEAR} DRISHYAM OPTICAL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
