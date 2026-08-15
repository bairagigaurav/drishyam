"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProductGridProps {
  productsList: Product[];
}

export default function ProductGrid({ productsList }: ProductGridProps) {
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  if (productsList.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-beige-200">
        <p className="text-charcoal/40 text-sm font-light">
          No products found matching those filters.
        </p>
      </div>
    );
  }

  const visibleProducts = productsList.slice(0, 6);

  return (
    <>
      <div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${
          isHomePage ? "lg:grid-cols-4" : "lg:grid-cols-3"
        }`}
      >
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {productsList.length > 6 && (
        <div className="mt-10 flex justify-center">
          <Link
            href="/shop"
            className="rounded-full bg-charcoal px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-charcoal/90"
          >
            See All Products
          </Link>
        </div>
      )}
    </>
  );
}