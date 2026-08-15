import React from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  const shopLinks = [
    { name: "All Eyewear", href: "/shop" },
    { name: "Eyeglasses", href: "/shop?category=Eyeglasses" },
    { name: "Sunglasses", href: "/shop?category=Sunglasses" },
    { name: "Blue Light", href: "/shop?category=Blue%20Light" },
    { name: "New Arrivals", href: "/shop?new=true" },
  ];

  const brandLinks = [
    { name: "Our Story", href: "/shop" },
    { name: "Journal", href: "/shop" },
    { name: "Craftsmanship", href: "/shop" },
    { name: "Sustainability", href: "/shop" },
  ];

  const helpLinks = [
    { name: "Fit & Size Guide", href: "/face-shape" },
    { name: "Prescription Help", href: "/shop" },
    { name: "Shipping & Returns", href: "/shop" },
    { name: "Contact Us", href: "/shop" },
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
              <a href="#" className="text-charcoal/40 hover:text-[#f59e0b] transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="text-charcoal/40 hover:text-[#f59e0b] transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-light text-[13px] text-charcoal/50">
          <p>&copy; {new Date().getFullYear()} DRISHYAM OPTICAL. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-charcoal transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-charcoal transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-charcoal transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
