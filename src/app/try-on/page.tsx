import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VirtualTryOn from "@/components/VirtualTryOn";
import SearchModal from "@/components/SearchModal";
import MobileMenu from "@/components/MobileMenu";
import CartDrawer from "@/components/CartDrawer";

export default function TryOnPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="bg-beige-50/50 py-12 border-b border-beige-100 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <span className="text-sm font-semibold uppercase -widest text-charcoal/60 block mb-2">
              Virtual Studio
            </span>
            <h1 className=" text-3xl md:text-4xl text-charcoal font-medium uppercase">
              Interactive Fitting Room
            </h1>
            <p className="text-sm text-charcoal/50 font-light mt-2">
              Utilize high-precision facial layout simulations to find frames that complement your style.
            </p>
          </div>
        </div>
        <VirtualTryOn />
      </main>
      <Footer />
      <SearchModal />
      <MobileMenu />
      <CartDrawer />
    </>
  );
}
