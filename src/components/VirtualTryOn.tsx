"use client";

import React, { useState } from "react";
import { Check, Heart, ShoppingBag } from "lucide-react";
import { products } from "@/data/products";
import { useApp } from "@/context/AppContext";
import Image from "next/image";
import { motion } from "framer-motion";

// Model avatars that can be used for try-on simulation
const avatars = [
  {
    id: "avatar-1",
    name: "Benjamin",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop",
    eyeOffset: "top-[40%] left-[50%] -translate-x-1/2"
  },
  {
    id: "avatar-2",
    name: "Clara",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop",
    eyeOffset: "top-[42%] left-[50%] -translate-x-1/2"
  },
  {
    id: "avatar-3",
    name: "Marcus",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
    eyeOffset: "top-[39%] left-[50%] -translate-x-1/2"
  }
];

// PNG frame transparency crops that we overlay on the models
// To make it look highly premium, we render a stylized SVG frame vector or scale a nice image overlay
const overlayFrames: Record<string, string> = {
  "frame-001": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=300&auto=format&fit=crop", // Rectangle
  "frame-002": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=300&auto=format&fit=crop", // Sunglasses
  "frame-003": "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=300&auto=format&fit=crop", // Square
  "frame-004": "https://images.unsplash.com/photo-1509695507497-903c140c43b0?q=80&w=300&auto=format&fit=crop", // Oval
};

export default function VirtualTryOn() {
  const { addToCart } = useApp();
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedProduct.colors[0].name, 1);
  };

  return (
    <section className="py-20 bg-white border-b border-beige-100 hidden">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 md:mb-16 text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold uppercase -widest text-charcoal/60 block mb-2">
            Virtual Preview
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal font-medium">
            Preview frames on a model with clarity.
          </h2>
          <p className="text-base font-light text-charcoal/60 mt-3 max-w-2xl mx-auto leading-relaxed">
            A simple, elegant preview of our most-loved frames so you can choose with confidence.
          </p>
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 bg-beige-50/80 border border-beige-100 p-6 rounded-[28px] shadow-[0_32px_60px_rgba(15,23,42,0.08)]">
            <div className="relative overflow-hidden rounded-[28px] bg-white shadow-inner">
              <div className="relative aspect-[4/5]">
                <Image
                  src={selectedAvatar.image}
                  alt={selectedAvatar.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-x-0 top-[40%] flex justify-center">
                  <div className="w-[55%] aspect-[3/1] bg-charcoal/95 rounded-full border border-white/10 shadow-2xl relative">
                    <div className="absolute inset-x-0 top-1/2 h-2 bg-white/10 rounded-full -translate-y-1/2" />
                    <div className="absolute left-4 top-1/2 h-3 w-12 bg-white/20 rounded-full -translate-y-1/2" />
                    <div className="absolute right-4 top-1/2 h-3 w-12 bg-white/20 rounded-full -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm font-semibold text-charcoal">Select a model to preview.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {avatars.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => setSelectedAvatar(av)}
                    className={`h-12 min-w-[100px] rounded-full border px-4 text-sm font-medium transition-all ${
                      selectedAvatar.id === av.id
                        ? "bg-charcoal text-white border-charcoal"
                        : "bg-white text-charcoal border-beige-200 hover:border-charcoal/30"
                    }`}
                  >
                    {av.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-beige-100 p-8 rounded-[28px] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-sm text-charcoal/40 font-bold uppercase -widest block mb-2">
                Featured Frame
              </span>
              <h3 className="font-serif text-3xl font-semibold text-charcoal">{selectedProduct.name}</h3>
              <p className="text-4xl font-semibold text-charcoal mt-3">${selectedProduct.price}</p>
              <p className="text-base text-charcoal/60 mt-4 leading-relaxed">{selectedProduct.description}</p>
            </div>

            <div className="mt-8">
              <span className="text-sm text-charcoal/40 font-bold uppercase -widest block mb-3">
                See other frame fits
              </span>
              <div className="space-y-3 max-h-[270px] overflow-y-auto pr-1">
                {products.slice(0, 5).map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className={`w-full flex items-center justify-between gap-3 rounded-3xl border px-4 py-3 text-left transition-all ${
                      selectedProduct.id === prod.id
                        ? "bg-beige-50 border-charcoal/30"
                        : "bg-white border-beige-100 hover:border-charcoal/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-beige-100 bg-beige-50">
                        <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">{prod.name}</p>
                        <p className="text-sm text-charcoal/45">{prod.shape} &middot; {prod.material}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-charcoal">${prod.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-beige-100 flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full rounded-full bg-charcoal hover:bg-charcoal/90 text-white text-sm font-semibold uppercase -widest py-4 transition-all"
              >
                Add Selected to Bag
              </button>
              <button
                className="w-full rounded-full border border-beige-200 text-charcoal text-sm font-semibold uppercase -widest py-4 hover:bg-beige-50 transition-all"
              >
                Save for later
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}

