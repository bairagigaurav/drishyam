"use client";

import React from "react";
import { X } from "lucide-react";

interface Filters {
  category: string;
  gender: string;
  shape: string;
  material: string;
}

interface FilterSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  resetFilters: () => void;
  isOpen: boolean; // For mobile drawer
  setOpen: (open: boolean) => void;
}

const categories = ["Eyeglasses", "Sunglasses", "Blue Light"];
const genders = ["Men", "Women", "Kids", "Unisex"];
const shapes = ["Rectangle", "Round", "Square", "Oval", "Heart", "Diamond"];
const materials = ["Acetate", "Metal", "Titanium", "Eco-Friendly"];

export default function FilterSidebar({
  filters,
  setFilters,
  resetFilters,
  isOpen,
  setOpen
}: FilterSidebarProps) {
  
  const Content = () => (
    <div className="space-y-8 pr-2">
      {/* Header with clear action */}
      <div className="flex items-center justify-between border-b border-beige-100 pb-4">
        <h3 className="text-sm uppercase font-bold -widest text-charcoal">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-[14px] uppercase font-bold -widest text-charcoal/40 hover:text-charcoal transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <h4 className="text-[14px] uppercase font-bold -wider text-charcoal/70">Category</h4>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm text-charcoal/70 cursor-pointer hover:text-charcoal transition-colors">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => setFilters((p) => ({ ...p, category: p.category === cat ? "" : cat }))}
                className="w-3.5 h-3.5 border-beige-200 checked:bg-charcoal text-charcoal focus:ring-0 rounded-xs"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="space-y-2.5">
        <h4 className="text-[14px] uppercase font-bold -wider text-charcoal/70">Gender</h4>
        <div className="space-y-1.5">
          {genders.map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm text-charcoal/70 cursor-pointer hover:text-charcoal transition-colors">
              <input
                type="radio"
                name="gender"
                checked={filters.gender === g}
                onChange={() => setFilters((p) => ({ ...p, gender: p.gender === g ? "" : g }))}
                className="w-3.5 h-3.5 border-beige-200 checked:bg-charcoal text-charcoal focus:ring-0 rounded-xs"
              />
              <span>{g}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Frame Shape */}
      <div className="space-y-2.5">
        <h4 className="text-[14px] uppercase font-bold -wider text-charcoal/70">Frame Shape</h4>
        <div className="grid grid-cols-2 gap-2">
          {shapes.map((sh) => (
            <button
              key={sh}
              onClick={() => setFilters((p) => ({ ...p, shape: p.shape === sh ? "" : sh }))}
              className={`px-3 py-1.5 text-sm text-center border transition-all ${
                filters.shape === sh
                  ? "bg-charcoal text-white border-charcoal"
                  : "bg-white text-charcoal/70 border-beige-100 hover:border-beige-200"
              }`}
            >
              {sh}
            </button>
          ))}
        </div>
      </div>

      {/* Material */}
      <div className="space-y-2.5">
        <h4 className="text-[14px] uppercase font-bold -wider text-charcoal/70">Material</h4>
        <div className="space-y-1.5">
          {materials.map((m) => (
            <label key={m} className="flex items-center gap-2 text-sm text-charcoal/70 cursor-pointer hover:text-charcoal transition-colors">
              <input
                type="radio"
                name="material"
                checked={filters.material === m}
                onChange={() => setFilters((p) => ({ ...p, material: p.material === m ? "" : m }))}
                className="w-3.5 h-3.5 border-beige-200 checked:bg-charcoal text-charcoal focus:ring-0 rounded-xs"
              />
              <span>{m}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop View (Sidebar on left) */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <Content />
      </aside>

      {/* Mobile Drawer (Responsive slide-out) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop overlay */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Panel drawer content */}
          <div className="relative w-4/5 max-w-sm h-full bg-white shadow-2xl flex flex-col z-10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-beige-100 mb-6">
              <span className=" text-base font-bold -widest text-charcoal">
                DRISHYAM
              </span>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-beige-100 transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5 text-charcoal/60" />
              </button>
            </div>
            
            <Content />

            <div className="mt-8 pt-6 border-t border-beige-100">
              <button
                onClick={() => setOpen(false)}
                className="w-full bg-charcoal text-white text-sm font-semibold uppercase -widest py-3 hover:bg-charcoal/90 transition-all text-center"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

