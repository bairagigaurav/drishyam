"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";
import SearchModal from "@/components/SearchModal";
import MobileMenu from "@/components/MobileMenu";
import CartDrawer from "@/components/CartDrawer";
import { getStoredProducts, products as initialProducts } from "@/data/products";
import { Product } from "@/types/product";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

interface Filters {
  category: string;
  gender: string;
  shape: string;
  material: string;
}

const initialFilters: Filters = {
  category: "",
  gender: "",
  shape: "",
  material: ""
};

function ShopContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [allProductsList, setAllProductsList] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [isMobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      setAllProductsList(getStoredProducts());
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("drishyam:products-update", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("drishyam:products-update", sync);
    };
  }, []);

  // Sync state from query parameters on mount
  useEffect(() => {
    const categoryQuery = searchParams.get("category") || "";
    const genderQuery = searchParams.get("gender") || "";
    const shapeQuery = searchParams.get("shape") || "";

    setFilters((prev) => ({
      ...prev,
      category: categoryQuery,
      gender: genderQuery,
      shape: shapeQuery,
    }));
  }, [searchParams]);

  // Apply filters and sort
  useEffect(() => {
    let result = [...allProductsList];

    // Filter by Category
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    // Filter by Gender
    if (filters.gender) {
      result = result.filter((p) => p.gender === filters.gender || p.gender === "Unisex");
    }

    // Filter by Shape
    if (filters.shape) {
      result = result.filter((p) => p.shape === filters.shape);
    }

    // Filter by Material
    if (filters.material) {
      result = result.filter((p) => p.material === filters.material);
    }

    // Apply special URL queries (e.g. Best sellers or New arrivals)
    const bestQuery = searchParams.get("best");
    if (bestQuery) {
      result = result.filter((p) => p.isBestSeller);
    }
    const newQuery = searchParams.get("new");
    if (newQuery) {
      result = result.filter((p) => p.isNew);
    }

    // Sort products
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [filters, sortBy, searchParams]);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Editorial Header */}
      <div className="mb-10 text-center lg:text-left">
        <h1 className="font-serif text-3xl md:text-4xl text-charcoal font-medium">
          The Collection
        </h1>
        <p className="text-sm text-charcoal/50 font-light mt-2 max-w-md">
          Explore our range of eyeglasses, sunglasses, and blue light block structures handcrafted from precious elements.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-y border-beige-100 py-4 mb-8">
        
        {/* Mobile Filter toggle trigger */}
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex lg:hidden items-center gap-1.5 px-3 py-1.5 border border-beige-200 text-sm font-semibold uppercase -wider text-charcoal"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>

        <span className="hidden lg:inline text-sm text-charcoal/40">
          Showing {filteredProducts.length} frames
        </span>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-charcoal/40">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-charcoal font-semibold focus:outline-hidden outline-hidden cursor-pointer appearance-none pr-6 border-0 focus:ring-0"
            >
              <option value="featured">Featured</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Sidebar Filters */}
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          isOpen={isMobileFiltersOpen}
          setOpen={setMobileFiltersOpen}
        />

        {/* Grid List */}
        <div className="flex-1 w-full">
          <ProductGrid productsList={filteredProducts} />
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <Header />
      <main className="flex-1 min-h-screen">
        <Suspense fallback={<div className="text-center py-20 text-sm text-charcoal/40">Loading collection...</div>}>
          <ShopContent />
        </Suspense>
      </main>
      <Footer />
      <SearchModal />
      <MobileMenu />
      <CartDrawer />
    </>
  );
}

