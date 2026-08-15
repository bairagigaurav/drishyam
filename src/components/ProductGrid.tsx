"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface ProductGridProps {
  productsList: Product[];
}

export default function ProductGrid({ productsList }: ProductGridProps) {
  if (productsList.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-beige-200">
        <p className="text-charcoal/40 text-sm font-light">No products found matching those filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
      {productsList.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
