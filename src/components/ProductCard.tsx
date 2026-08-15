"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { type CartItem, useApp } from "@/context/AppContext";
import { Heart, ShoppingBag, Eye, Star, MessageCircle } from "lucide-react";
import { makeWhatsAppUrl } from "@/lib/whatsapp";
import Image from "next/image";
import Link from "next/link";
interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useApp();
  const [hovered, setHovered] = useState(false);

  const isLiked = isInWishlist(product.id);

  const selectedColor = product.colors[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedColor.name, 1);
  };

  const handleEnquireNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const item: CartItem = {
      product,
      quantity: 1,
      selectedColor: selectedColor.name,
    };

    window.open(makeWhatsAppUrl([item]), "_blank", "noopener,noreferrer");
  };
  function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="currentColor">
      <path d="M20.52 3.48A11.64 11.64 0 0 0 12.02 0C5.48 0 .14 5.31.14 11.85c0 2.09.55 4.13 1.6 5.93L.06 24l6.4-1.66a11.9 11.9 0 0 0 5.56 1.65h.01c6.54 0 11.88-5.31 11.88-11.85 0-3.17-1.24-6.15-3.39-8.37ZM12.02 21.6c-1.79 0-3.55-.48-5.08-1.39l-.36-.22-3.8.99 1.02-3.7-.24-.38A9.75 9.75 0 0 1 2.22 11.85C2.22 6.77 6.38 2.62 12.02 2.62c5.65 0 10.25 4.15 10.25 9.23 0 5.08-4.6 9.23-10.25 9.23Zm5.64-6.9c-.31-.16-1.81-.89-2.1-1-.28-.12-.49-.16-.7.16-.2.31-.78 1-.96 1.2-.18.16-.35.18-.66.06-.3-.16-1.28-.47-2.43-1.5-.9-.81-1.5-1.8-1.68-2.1-.18-.31-.02-.47.14-.62.14-.14.31-.35.46-.53.15-.17.2-.29.3-.48.1-.2.05-.37-.02-.52-.08-.16-.7-1.71-.96-2.34-.26-.62-.52-.53-.7-.54l-.6-.01c-.2 0-.53.08-.81.38-.28.31-1.07 1.05-1.07 2.56 0 1.52 1.1 2.96 1.26 3.17.16.2 2.17 3.31 5.26 4.64.74.32 1.32.51 1.77.66.74.24 1.42.2 1.95.13.6-.09 1.81-.74 2.07-1.46.25-.71.25-1.33.17-1.46-.08-.13-.28-.2-.58-.36Z" />
    </svg>
  );
}

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col bg-gradient-to-br from-white via-white to-gold-50 border-2 border-gold-200/30 p-4 rounded-3xl overflow-hidden shadow-md hover:shadow-[0_20px_60px_rgba(212,175,55,0.15)] transition-all duration-500 hover:border-gold-500/40 transform hover:scale-105 hover:-translate-y-1"
    >
      
      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-4 right-4 z-20 p-2 bg-gradient-to-br from-white to-gold-50 backdrop-blur-md rounded-full border-2 border-gold-500/50 text-charcoal/70 hover:text-red-500 hover:scale-110 transition-all shadow-lg hover:shadow-gold-500/30 hover:border-red-500"
        aria-label="Add to wishlist"
      >
        <Heart className={`w-4 h-4 transition-colors ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
      </button>

      {/* Image container with hover effect and Indian aesthetic border */}
      <Link href={`/product/${product.slug}`} className="block relative overflow-hidden bg-gradient-to-br from-gold-100 to-gold-50 rounded-2xl min-h-[280px] sm:min-h-[320px] border border-gold-200/50 shadow-inner">
        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-gold-500/30 rounded-bl-3xl z-5 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-gold-500/30 rounded-tr-3xl z-5 pointer-events-none"></div>
        
        <div className="relative w-full h-[320px] sm:h-[360px] lg:h-[380px]">
          <Image
            src={hovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            fill
            unoptimized={true}
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Quick Add Overlay with gradient */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-transparent flex gap-2 justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            className="btn-primary flex-1 rounded-xl bg-gradient-to-r from-saffron to-orange-500 hover:from-saffron/90 hover:to-orange-500/90 text-white py-2 px-3 text-[12px] font-semibold uppercase -[0.18em] flex items-center justify-center gap-2 transition-all border border-gold-400/50 shadow-lg"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
          <button
            className="bg-white/95 hover:bg-white text-charcoal p-2 border-2 border-gold-400/50 transition-all hover:shadow-lg"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </Link>

      {/* Product Details */}
<div className="mt-4 flex-1 flex flex-col justify-between">
  <div>
    <div className="flex justify-between items-center text-xs text-charcoal/60 font-bold uppercase tracking-widest mb-2 pb-2 border-b border-gray-200/30">
      <span className="text-gray-600">
        {product.shape} {product.category}
      </span>

      <div className="flex items-center gap-1 text-saffron">
        <Star className="w-4 h-4 fill-saffron" />
        <span className="text-charcoal font-semibold text-sm">
          {product.rating}
        </span>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <h3 className="font-bold text-lg text-charcoal leading-tight group-hover:text-saffron transition-colors line-clamp-2 mb-2">
        <Link href={`/product/${product.slug}`}>
          {product.name}
        </Link>
      </h3>
    </div>
  </div>

  <div className="pt-3 border-t border-gray-200/40">
    <button
      type="button"
      onClick={handleEnquireNow}
      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-whatsapp hover:bg-whatsapp/90 text-white text-sm font-semibold uppercase tracking-[0.16em] py-3 shadow-lg shadow-whatsapp/20 transition-all hover:scale-[1.01]"
    >
      <WhatsAppIcon />
      <span>Enquire now</span>
    </button>

    <Link
      href={`/product/${product.slug}`}
      className="btn-secondary mt-2 w-full flex items-center justify-center gap-2 rounded-xl border border-[#111111] bg-white text-[#111111] text-sm font-semibold uppercase tracking-[0.16em] py-3 shadow-sm transition-all hover:bg-[#111111] hover:text-white"
    >
      <span>View Details</span>
    </Link>
  </div>
</div>
    </div>
  );
}

