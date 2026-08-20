"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchModal from "@/components/SearchModal";
import MobileMenu from "@/components/MobileMenu";
import CartDrawer from "@/components/CartDrawer";
import { makeWhatsAppUrl } from "@/lib/whatsapp";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, Trash2, Plus, Minus, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount, toggleWishlist, isInWishlist } = useApp();
  const whatsappUrl = makeWhatsAppUrl(cart);

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <h1 className=" text-3xl font-medium text-charcoal mb-8 text-center sm:text-left">
            Shopping Bag
          </h1>

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Product list (Col: 8) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-beige-100 pb-3 text-[14px] uppercase font-bold -widest text-charcoal/40">
                  <div className="col-span-6">Product Details</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {cart.map((item, index) => {
                  const isFav = isInWishlist(item.product.id);
                  return (
                    <div
                      key={`${item.product.id}-${item.selectedColor}-${index}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => router.push(`/product/${item.product.slug}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(`/product/${item.product.slug}`);
                        }
                      }}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center border-b border-beige-100 pb-6 last:border-0 cursor-pointer outline-none"
                    >
                      {/* Details */}
                      <div className="col-span-6 flex gap-4">
                        <div className="relative w-20 h-20 bg-beige-50 border border-beige-100 flex-shrink-0">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1 py-1">
                          <h3 className="font-semibold text-charcoal text-sm leading-tight">
                            <Link href={`/product/${item.product.slug}`}>{item.product.name}</Link>
                          </h3>
                          <p className="text-sm text-charcoal/50">
                            Color: {item.selectedColor}
                          </p>
                          {item.selectedLens && (
                            <p className="text-[14px] text-charcoal/40 font-light">
                              Lens: {item.selectedLens}
                            </p>
                          )}
                          
                          <div className="flex gap-4 pt-1.5 text-[14px] font-bold uppercase -wider text-charcoal/50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(item.product.id);
                              }}
                              className="hover:text-charcoal transition-colors flex items-center gap-1"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                              <span>{isFav ? "Saved" : "Save to Wishlist"}</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(item.product.id, item.selectedColor);
                              }}
                              className="hover:text-red-500 transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="col-span-2 text-center text-sm font-medium text-charcoal">
                        <span className="sm:hidden text-sm text-charcoal/40 block mb-1">Unit Price</span>
                        ${item.product.price}
                      </div>

                      {/* Quantity Selector */}
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border border-beige-200">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                            className="p-1.5 hover:bg-beige-50 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 text-charcoal/60" />
                          </button>
                          <span className="px-3 text-sm font-semibold text-charcoal">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                            className="p-1.5 hover:bg-beige-50 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-charcoal/60" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-2 text-right text-sm font-semibold text-charcoal">
                        <span className="sm:hidden text-sm text-charcoal/40 block mb-1">Total</span>
                        ${item.product.price * item.quantity}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Price summary card (Col: 4) */}
              <div className="lg:col-span-4 bg-beige-50/40 border border-beige-100 p-6 space-y-6">
                <h2 className="text-sm uppercase font-bold -widest text-charcoal border-b border-beige-100 pb-3">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-charcoal/70">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-medium">${cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-charcoal/70">
                    <span>Shipping</span>
                    <span className="text-[14px] -wider uppercase font-bold text-green-600">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-charcoal/70">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-charcoal text-sm font-bold pt-4 border-t border-beige-100">
                    <span>Estimated Total</span>
                    <span>${cartTotal}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-full py-3.5 bg-whatsapp hover:bg-whatsapp/90 text-white text-sm font-semibold uppercase -widest text-center flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-whatsapp/40 hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Order via WhatsApp</span>
                  </a>
                  <Link
                    href="/shop"
                    className="w-full py-3.5 border border-charcoal/20 hover:border-charcoal text-charcoal hover:bg-white text-sm font-semibold uppercase -widest text-center block transition-all bg-white"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Additional trust prompt */}
                <div className="pt-2 text-[14px] text-charcoal/40 leading-relaxed font-light">
                  <p>Flexible financing options available. Add items to bag to see details. All purchases backed by our 30-day structural warranty.</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-beige-200">
              <ShoppingBag className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
              <h2 className=" text-lg font-medium text-charcoal">Your bag is empty</h2>
              <p className="text-sm text-charcoal/50 mt-1">Explore our collections to add frames to your selection.</p>
              <Link
                href="/shop"
                className="mt-6 inline-block bg-charcoal text-white hover:bg-charcoal/90 px-8 py-3 text-sm font-semibold uppercase -widest transition-all"
              >
                Shop Collection
              </Link>
            </div>
          )}

        </div>
      </main>
      <Footer />
      <SearchModal />
      <MobileMenu />
      <CartDrawer />
    </>
  );
}

