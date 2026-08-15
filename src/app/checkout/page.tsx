"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, ArrowLeft, ChevronRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { makeWhatsAppUrl } from "@/lib/whatsapp";
import BrandLogo from "@/components/BrandLogo";

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount } = useApp();
  const whatsappUrl = makeWhatsAppUrl(cart);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Distraction-free Header */}
      <header className="border-b border-beige-100 py-4">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <BrandLogo variant="full" size="md" theme="dark" href="/" />
          <Link
            href="/cart"
            className="text-sm text-charcoal/50 hover:text-charcoal flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Bag</span>
          </Link>
        </div>
      </header>

      {/* Main Panel */}
      <main className="flex-grow mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
            <h2 className="font-serif text-lg font-medium text-charcoal">Your bag is empty</h2>
            <Link href="/shop" className="mt-4 inline-block bg-charcoal text-white px-6 py-2.5 text-sm font-semibold uppercase -widest">
              Shop Collection
            </Link>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[1.4fr_1fr] items-start">
            
            <div className="rounded-3xl bg-white border border-beige-100 p-8">
              <div className="mb-6">
                <p className="text-sm uppercase -widest font-semibold text-charcoal/50 mb-2">Offline Store Order</p>
                <h1 className="font-serif text-3xl text-charcoal font-medium">Send this order to WhatsApp</h1>
                <p className="mt-4 text-sm leading-relaxed text-charcoal/60">
                  Our store team will receive your order and contact you on WhatsApp to confirm pickup and availability.
                </p>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl bg-beige-50/50 p-6 border border-beige-100">
                  <h2 className="text-sm uppercase -widest font-semibold text-charcoal/60 mb-4">Order Summary</h2>
                  <div className="space-y-3 text-sm text-charcoal/70">
                    <div className="flex justify-between">
                      <span>Items ({cartCount})</span>
                      <span className="font-semibold text-charcoal">${cartTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600 font-semibold">Complimentary</span>
                    </div>
                    <div className="pt-3 border-t border-beige-100 flex justify-between text-charcoal font-semibold">
                      <span>Total</span>
                      <span>${cartTotal}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex w-full justify-center items-center gap-2 py-4 bg-gradient-to-r from-whatsapp to-emerald-500 hover:from-whatsapp/90 hover:to-emerald-500/90 text-white text-sm font-bold uppercase -widest rounded-full shadow-lg hover:shadow-whatsapp/40 transition-all transform hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  Message us on WhatsApp
                </a>

                <div className="rounded-3xl bg-white border border-beige-100 p-6 text-sm text-charcoal/60">
                  <p className="font-semibold text-charcoal mb-3">What happens next?</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>We receive your order request via WhatsApp.</li>
                    <li>Our team confirms stock and pickup time.</li>
                    <li>Collect your frames at our offline store.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-beige-50/30 border border-beige-100 p-8 rounded-3xl">
              <h2 className="text-sm uppercase -widest font-semibold text-charcoal/60 mb-6">Order Items ({cartCount})</h2>
              <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start rounded-3xl bg-white border border-beige-100 p-4">
                    <div className="relative w-20 h-20 bg-beige-50 border border-beige-100 flex-shrink-0">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-charcoal">{item.product.name}</p>
                      <p className="text-sm text-charcoal/50 mt-1">Color: {item.selectedColor}</p>
                      {item.selectedLens && (
                        <p className="text-sm text-charcoal/50">Lens: {item.selectedLens}</p>
                      )}
                      <p className="text-sm text-charcoal/50 mt-2">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right font-semibold text-charcoal">${item.product.price * item.quantity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

