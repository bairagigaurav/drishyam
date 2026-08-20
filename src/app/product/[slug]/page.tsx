"use client";

import React, { use, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SearchModal from "@/components/SearchModal";
import MobileMenu from "@/components/MobileMenu";
import CartDrawer from "@/components/CartDrawer";
import { getStoredProducts, products as defaultProducts } from "@/data/products";
import { type CartItem, useApp } from "@/context/AppContext";
import { makeWhatsAppUrl } from "@/lib/whatsapp";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Heart,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const [allProducts, setAllProducts] = useState(defaultProducts);

  useEffect(() => {
    setAllProducts(getStoredProducts());
  }, []);

  // Find product by slug
  const product = allProducts.find((p) => p.slug === slug);

  // States initialized from the product data so we avoid redundant effect-driven resets.
  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0] ?? null
  );
  const [activeImage, setActiveImage] = useState(product?.images[0] || "");
  const [activeTab, setActiveTab] = useState<
    "details" | "materials" | "shipping"
  >("details");

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] ?? null);
      setActiveImage(product.images[0] || "");
    }
  }, [product]);

  if (!product) {
    return (
      <>
        <Header />

        <div className="mx-auto max-w-full px-4 py-32 text-center">
          <h1 className=" text-2xl text-charcoal">
            Frame Not Found
          </h1>

          <p className="mt-2 text-sm text-charcoal/50">
            The frame you requested does not exist in our catalog.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-block bg-charcoal px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-white"
          >
            Back to Collection
          </Link>
        </div>

        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    if (selectedColor) {
      addToCart(product, selectedColor.name, 1);
    }
  };

  const handleEnquireNow = () => {
    if (selectedColor) {
      const item: CartItem = {
        product,
        quantity: 1,
        selectedColor: selectedColor.name,
      };

      addToCart(product, selectedColor.name, 1);

      const whatsappUrl = makeWhatsAppUrl([item]);

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  function WhatsAppIcon() {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5"
        fill="currentColor"
      >
        <path d="M20.52 3.48A11.64 11.64 0 0 0 12.02 0C5.48 0 .14 5.31.14 11.85c0 2.09.55 4.13 1.6 5.93L.06 24l6.4-1.66a11.9 11.9 0 0 0 5.56 1.65h.01c6.54 0 11.88-5.31 11.88-11.85 0-3.17-1.24-6.15-3.39-8.37ZM12.02 21.6c-1.79 0-3.55-.48-5.08-1.39l-.36-.22-3.8.99 1.02-3.7-.24-.38A9.75 9.75 0 0 1 2.22 11.85C2.22 6.77 6.38 2.62 12.02 2.62c5.65 0 10.25 4.15 10.25 9.23 0 5.08-4.6 9.23-10.25 9.23Zm5.64-6.9c-.31-.16-1.81-.89-2.1-1-.28-.12-.49-.16-.7.16-.2.31-.78 1-.96 1.2-.18.16-.35.18-.66.06-.3-.16-1.28-.47-2.43-1.5-.9-.81-1.5-1.8-1.68-2.1-.18-.31-.02-.47.14-.62.14-.14.31-.35.46-.53.15-.17.2-.29.3-.48.1-.2.05-.37-.02-.52-.08-.16-.7-1.71-.96-2.34-.26-.62-.52-.53-.7-.54l-.6-.01c-.2 0-.53.08-.81.38-.28.31-1.07 1.05-1.07 2.56 0 1.52 1.1 2.96 1.26 3.17.16.2 2.17 3.31 5.26 4.64.74.32 1.32.51 1.77.66.74.24 1.42.2 1.95.13.6-.09 1.81-.74 2.07-1.46.25-.71.25-1.33.17-1.46-.08-.13-.28-.2-.58-.36Z" />
      </svg>
    );
  }

  // Recommended products (filter same category, limit 4)
  const recommendations = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const isLiked = isInWishlist(product.id);

  const featureHighlights = [
    {
      icon: Sparkles,
      label: "Premium material",
      value: product.material,
    },
    {
      icon: ShieldCheck,
      label: "Frame size",
      value: product.size,
    },
    {
      icon: BadgeCheck,
      label: "Fit",
      value: product.gender,
    },
  ];

  return (
    <>
      <Header />

      <main className="flex-1 bg-[radial-gradient(circle_at_top,_#fffaf5_0%,_#f4efe6_28%,_#ffffff_100%)] text-charcoal">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.26em] text-charcoal/50">
            <Link
              href="/shop"
              className="flex items-center gap-2 transition-colors hover:text-charcoal"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to shop
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-[28px] border border-beige-100 bg-[#f9f3ed] shadow-[0_30px_80px_rgba(17,17,17,0.08)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={activeImage}
                    alt={product.name}
                    fill
                    priority
                    unoptimized={true}
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-[4/3] overflow-hidden rounded-2xl border transition-all duration-200 ${
                      activeImage === img
                        ? "border-charcoal shadow-md shadow-charcoal/10"
                        : "border-beige-100 hover:border-beige-200"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      unoptimized={true}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[28px] border border-beige-100 bg-white/80 p-5 shadow-[0_18px_50px_rgba(17,17,17,0.04)] backdrop-blur-sm sm:p-7">
                <div className="space-y-4 border-b border-beige-100 pb-6">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-saffron">
                    <span className="rounded-full border border-gold-200 bg-gold-50 px-2.5 py-1">
                      {product.category}
                    </span>

                    <span className="text-charcoal/50">
                      {product.shape}
                    </span>
                  </div>

                  <div>
                    <h1 className=" text-4xl font-medium leading-none text-charcoal sm:text-5xl">
                      {product.name}
                    </h1>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-0.5 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-500"
                              : "text-beige-200"
                          }`}
                        />
                      ))}
                    </div>

                    <span className="font-medium text-charcoal">
                      {product.rating.toFixed(1)}
                    </span>

                    <span className="text-charcoal/50">
                      ({product.reviewsCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-6 py-6">
                  {/* Color selector intentionally kept commented out */}

                  <div className="grid grid-cols-3 gap-3">
                    {featureHighlights.map(
                      ({ icon: Icon, label, value }) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-beige-100 bg-[#fffdfb] p-3"
                        >
                          <Icon className="mb-2 h-4 w-4 text-saffron" />

                          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal/45">
                            {label}
                          </div>

                          <div className="mt-1 text-sm font-semibold text-charcoal">
                            {value}
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 rounded-full bg-gradient-to-r from-saffron to-orange-500 px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-orange-200/60 transition hover:brightness-105"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <ShoppingBag className="h-4 w-4" />
                          Add to bag
                        </span>
                      </button>

                      <button
                        onClick={() => toggleWishlist(product.id)}
                        aria-label="Toggle wishlist"
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-beige-200 bg-white text-charcoal transition hover:border-charcoal/50 hover:bg-beige-50"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isLiked
                              ? "fill-red-500 text-red-500"
                              : ""
                          }`}
                        />
                      </button>
                    </div>

                    <button
                      onClick={handleEnquireNow}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-whatsapp hover:bg-whatsapp/90 text-white text-xs font-semibold uppercase tracking-[0.16em] py-3 shadow-lg shadow-whatsapp/20 transition-all hover:scale-[1.01]"
                    >
                      <WhatsAppIcon />
                      Enquire now
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-beige-100 pt-4 text-[12px] text-charcoal/60">
                  <div className="flex items-center justify-center gap-1.5 rounded-xl bg-beige-50 px-2 py-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-charcoal/70" />
                    Warranty
                  </div>

                  <div className="flex items-center justify-center gap-1.5 rounded-xl bg-beige-50 px-2 py-2">
                    <Truck className="h-3.5 w-3.5 text-charcoal/70" />
                    Free shipping
                  </div>

                  <div className="flex items-center justify-center gap-1.5 rounded-xl bg-beige-50 px-2 py-2">
                    <RotateCcw className="h-3.5 w-3.5 text-charcoal/70" />
                    Easy returns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="border-y border-beige-100 bg-beige-50/30 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[28px] border border-beige-100 bg-white p-5 sm:p-7">
                <div className="mb-6 flex justify-center border-b border-beige-100 text-sm font-semibold uppercase tracking-[0.2em] text-charcoal/50">
                  {[
                    { id: "details", label: "Overview" },
                    { id: "materials", label: "Craft" },
                    { id: "shipping", label: "Shipping" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() =>
                        setActiveTab(
                          tab.id as
                            | "details"
                            | "materials"
                            | "shipping"
                        )
                      }
                      className={`px-5 py-3 transition ${
                        activeTab === tab.id
                          ? "border-b-2 border-charcoal text-charcoal"
                          : "hover:text-charcoal"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="min-h-[160px] text-base leading-8 text-charcoal/75">
                  {activeTab === "details" && (
                    <div className="space-y-4">
                      <p>{product.description}</p>

                      <ul className="space-y-2 pl-5 text-base text-charcoal/70">
                        {product.details.map((detail, idx) => (
                          <li key={idx} className="list-disc">
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === "materials" && (
                    <div className="space-y-4">
                      <p className="font-semibold text-charcoal">
                        Handcrafted in small batches
                      </p>

                      <p>
                        Built with{" "}
                        {product.material.toLowerCase()} and
                        precision-finished details for a refined,
                        durable finish that feels elevated from the very
                        first wear.
                      </p>

                      <p>
                        The shape, bridge, and temple balance are tuned to
                        deliver a confident fit whether you are shopping
                        for everyday use or a leading design statement.
                      </p>
                    </div>
                  )}

                  {activeTab === "shipping" && (
                    <div className="space-y-4">
                      <p>
                        We ship fast and responsibly across the world.
                      </p>

                      <ul className="space-y-2 pl-5 text-base text-charcoal/70">
                        <li className="list-disc">
                          Domestic: 2&ndash;4 business days.
                        </li>

                        <li className="list-disc">
                          International: 4&ndash;7 business days.
                        </li>

                        <li className="list-disc">
                          Prescription pairs: 3&ndash;5 business days extra.
                        </li>
                      </ul>

                      <p>
                        Free shipping and easy returns are included with
                        every order.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-beige-100 bg-[#171717] p-5 text-white sm:p-6">
                <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#f7dca8]">
                  <Check className="h-4 w-4" />
                  Why people love it
                </div>

                <div className="space-y-4 text-sm text-white/75">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="font-semibold text-white">
                      Made for everyday style
                    </div>

                    <p className="mt-1">
                      A strong silhouette with enough polish to move from
                      desk to dinner.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="font-semibold text-white">
                      Comfort-first engineering
                    </div>

                    <p className="mt-1">
                      Balanced temples and lightweight construction reduce
                      pressure after long wear.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="font-semibold text-white">
                      Premium finish
                    </div>

                    <p className="mt-1">
                      Crafted details and color depth that feel luxury
                      without being loud.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {recommendations.length > 0 && (
          <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-end justify-between gap-4">
                <h2 className=" text-3xl text-charcoal">
                  Recommended frames
                </h2>

                <Link
                  href="/shop"
                  className="text-sm font-semibold uppercase tracking-[0.18em] text-charcoal/60 hover:text-charcoal"
                >
                  View all
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {recommendations.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <SearchModal />
      <MobileMenu />
      <CartDrawer />
    </>
  );
}