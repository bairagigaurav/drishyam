"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import FaceShapeFinder from "@/components/FaceShapeFinder";
import VirtualTryOn from "@/components/VirtualTryOn";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

import SearchModal from "@/components/SearchModal";
import MobileMenu from "@/components/MobileMenu";
import CartDrawer from "@/components/CartDrawer";

import { DEFAULT_SITE_CONTENT, getSiteContent, hydrateSiteContent } from "@/lib/site-content";
import { getStoredProducts, hydrateProducts, products as initialProducts } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types/product";

export default function HomePage() {
  const [visibleNewArrivalsCount, setVisibleNewArrivalsCount] = useState(4);
  const [siteContent, setSiteContent] = useState(DEFAULT_SITE_CONTENT);
  const [productList, setProductList] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const sync = () => {
      setSiteContent(getSiteContent());
      setProductList(getStoredProducts());
    };
    void Promise.all([hydrateSiteContent(), hydrateProducts()]).then(([remoteContent, remoteProducts]) => {
      setSiteContent(remoteContent);
      setProductList(remoteProducts);
    });
    window.addEventListener("storage", sync);
    window.addEventListener("drishyam:content-update", sync);
    window.addEventListener("drishyam:products-update", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("drishyam:content-update", sync);
      window.removeEventListener("drishyam:products-update", sync);
    };
  }, []);

  const featuredProductIds = siteContent.featuredProductIds ?? [];
  const newArrivalProductIds = siteContent.newArrivalProductIds ?? [];
  const shopByStyleProductIds = siteContent.shopByStyleProductIds ?? [];

  const bestSellers = featuredProductIds.length
    ? productList.filter((product) => featuredProductIds.includes(product.id))
    : productList.filter((product) => product.isBestSeller).slice(0, 4);

  const allNewArrivals = newArrivalProductIds.length
    ? productList.filter((product) => newArrivalProductIds.includes(product.id))
    : productList.filter((product) => product.isNew);

  const shopByStyleProducts = shopByStyleProductIds.length
    ? productList.filter((product) => shopByStyleProductIds.includes(product.id))
    : productList.slice(0, 4);

  const visibleNewArrivals = allNewArrivals.slice(0, visibleNewArrivalsCount);

  return (
    <>
      <Header />

      <main className="flex-1">
        <Hero />

        <section className="py-20 bg-white border-t border-beige-100">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="text-sm font-semibold uppercase -widest text-charcoal/60 block mb-2">
                {siteContent.labels.favorites}
              </span>
              <h2 className="font-serif text-3xl text-charcoal font-medium">
                Best Sellers.
              </h2>
            </div>

            <ProductGrid productsList={bestSellers} />
          </div>
        </section>

        <section className="bg-[#0f172a] py-16 text-white">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <span className="text-sm font-semibold uppercase -[0.24em] text-[#fcd34d] block mb-3">
                  {siteContent.labels.whyDrishyam}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-white font-medium">
                  Premium eyewear, local expertise, and real care.
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {siteContent.metrics.map(({ value, label }) => (
                  <div key={label} className="rounded-[22px] border border-white/10 bg-white/5 p-5">
                    <p className="text-2xl font-bold text-[#fcd34d]">{value}</p>
                    <p className="mt-2 text-sm text-slate-200">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-[#fffaf5] to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <span className="text-[12px] font-bold uppercase -[0.24em] text-charcoal/60 block mb-3">Visit our optical boutique</span>
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal font-medium">{siteContent.store.title}</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 items-center">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 gap-4 h-[360px]">
                  <div className="relative overflow-hidden rounded-[24px] border border-[#eadcc6] bg-white shadow-[0_12px_28px_rgba(17,17,17,0.04)]">
                    <div className="relative w-full h-full">
                      <Image src={siteContent.store.image1} alt="Premium eyewear display" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[24px] border border-[#eadcc6] bg-white shadow-[0_12px_28px_rgba(17,17,17,0.04)]">
                    <div className="relative w-full h-full">
                      <Image src={siteContent.store.image2} alt="Luxury sunglasses collection" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#eadcc6] bg-white p-6 shadow-[0_12px_28px_rgba(17,17,17,0.04)] h-[360px] flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase -[0.18em] text-charcoal/50 mb-2">Drishyam Optical</p>
                  <h3 className="font-serif text-xl text-charcoal mb-4">{siteContent.store.title}</h3>
                  <p className="text-sm leading-relaxed text-charcoal/70 mb-4">{siteContent.store.location}</p>
                  <p className="text-sm text-charcoal/60 font-light mb-4">{siteContent.store.subtitle}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-charcoal/50"><span className="font-semibold">Call:</span> {siteContent.store.phone}</p>
                  <Link href="/shop" className="btn-primary inline-flex items-center gap-2 rounded-xl bg-[#111111] px-4 py-2 text-[10px] font-bold uppercase -[0.18em] text-white hover:bg-[#1d1d1d] transition-colors">
                    Explore collection
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CategoryGrid />

        <section className="py-20 bg-[#f8f4ee]">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="text-sm font-semibold uppercase -[0.24em] text-charcoal/60 block mb-2">
                Shop by style
              </span>
              <h2 className="font-serif text-3xl text-charcoal font-medium">
                Curated looks for every mood.
              </h2>
            </div>

            <ProductGrid productsList={shopByStyleProducts} />
          </div>
        </section>

        <FaceShapeFinder />

        <section className="py-20 bg-white">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 md:flex justify-between items-end">
              <div>
                <span className="text-sm font-semibold uppercase -widest text-charcoal/60 block mb-2">
                  Just Released
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-charcoal font-medium">
                  {siteContent.labels.newArrivals}.
                </h2>
              </div>
            </div>

            <ProductGrid productsList={visibleNewArrivals} />
            {visibleNewArrivalsCount < allNewArrivals.length && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleNewArrivalsCount((prev) => Math.min(prev + 4, allNewArrivals.length))}
                  className="btn-secondary inline-flex items-center justify-center rounded-xl border border-[#111111] bg-white px-6 py-3 text-[11px] font-bold uppercase -[0.24em] text-charcoal transition-all hover:bg-[#111111] hover:text-white"
                >
                  Load more
                </button>
              </div>
            )}
          </div>
        </section>

        <Testimonials />
        <VirtualTryOn />
        <Benefits />
        <Newsletter />
      </main>

      <Footer />

      <SearchModal />
      <MobileMenu />
      <CartDrawer />
    </>
  );
}

