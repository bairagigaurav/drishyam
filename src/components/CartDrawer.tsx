"use client";

import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { makeWhatsAppUrl } from "@/lib/whatsapp";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useApp();

  // Keep the existing dynamic cart data
  const whatsappUrl = makeWhatsAppUrl(cart);

  // Fixed: use the existing dynamic cart instead of undefined
  // product / selectedColor / CartItem
  const handleEnquireNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (cart.length === 0) return;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  function WhatsAppIcon() {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-6 w-6"
        fill="currentColor"
      >
        <path d="M20.52 3.48A11.64 11.64 0 0 0 12.02 0C5.48 0 .14 5.31.14 11.85c0 2.09.55 4.13 1.6 5.93L.06 24l6.4-1.66a11.9 11.9 0 0 0 5.56 1.65h.01c6.54 0 11.88-5.31 11.88-11.85 0-3.17-1.24-6.15-3.39-8.37ZM12.02 21.6c-1.79 0-3.55-.48-5.08-1.39l-.36-.22-3.8.99 1.02-3.7-.24-.38A9.75 9.75 0 0 1 2.22 11.85C2.22 6.77 6.38 2.62 12.02 2.62c5.65 0 10.25 4.15 10.25 9.23 0 5.08-4.6 9.23-10.25 9.23Zm5.64-6.9c-.31-.16-1.81-.89-2.1-1-.28-.12-.49-.16-.7.16-.2.31-.78 1-.96 1.2-.18.16-.35.18-.66.06-.3-.16-1.28-.47-2.43-1.5-.9-.81-1.5-1.8-1.68-2.1-.18-.31-.02-.47.14-.62.14-.14.31-.35.46-.53.15-.17.2-.29.3-.48.1-.2.05-.37-.02-.52-.08-.16-.7-1.71-.96-2.34-.26-.62-.52-.53-.7-.54l-.6-.01c-.2 0-.53.08-.81.38-.28.31-1.07 1.05-1.07 2.56 0 1.52 1.1 2.96 1.26 3.17.16.2 2.17 3.31 5.26 4.64.74.32 1.32.51 1.77.66.74.24 1.42.2 1.95.13.6-.09 1.81-.74 2.07-1.46.25-.71.25-1.33.17-1.46-.08-.13-.28-.2-.58-.36Z" />
      </svg>
    );
  }

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.3,
              ease: "easeOut",
            }}
            className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-beige-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-charcoal" />

                <h2 className="text-lg font-semibold -tight text-charcoal">
                  Your Bag
                </h2>

                <span className="text-sm bg-beige-100 text-charcoal/80 font-medium px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="p-1 -mr-2 rounded-full hover:bg-beige-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-charcoal/60" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length > 0 ? (
                cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}-${idx}`}
                    className="flex gap-4 border-b border-beige-100 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="relative w-20 h-20 bg-beige-50 border border-beige-100 flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-charcoal text-sm leading-tight">
                            <Link
                              href={`/product/${item.product.slug}`}
                              onClick={() => setCartOpen(false)}
                            >
                              {item.product.name}
                            </Link>
                          </h3>

                          <span className="text-sm font-semibold text-charcoal pl-2">
                            ${item.product.price * item.quantity}
                          </span>
                        </div>

                        <p className="text-sm text-charcoal/50 mt-1">
                          Color: {item.selectedColor}
                        </p>

                        {item.selectedLens && (
                          <p className="text-sm text-charcoal/45 mt-0.5">
                            Lens: {item.selectedLens}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-beige-200">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedColor,
                                item.quantity - 1
                              )
                            }
                            className="p-1 hover:bg-beige-50 transition-colors text-charcoal/70"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="px-3 text-sm font-medium text-charcoal">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedColor,
                                item.quantity + 1
                              )
                            }
                            className="p-1 hover:bg-beige-50 transition-colors text-charcoal/70"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() =>
                            removeFromCart(
                              item.product.id,
                              item.selectedColor
                            )
                          }
                          className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-charcoal/20 mb-4" />

                  <p className="text-charcoal/50 text-sm font-medium">
                    Your shopping bag is empty.
                  </p>

                  <Link
                    href="/shop"
                    onClick={() => setCartOpen(false)}
                    className="mt-4 px-6 py-2.5 bg-charcoal text-white hover:bg-charcoal/90 text-sm font-semibold -widest uppercase transition-all"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="border-t border-beige-100 p-6 bg-beige-50/50">
                <div className="space-y-1.5 mb-6 text-sm">
                  <div className="flex justify-between text-charcoal/70">
                    <span>Subtotal</span>
                    <span>${cartTotal}</span>
                  </div>

                  <div className="flex justify-between text-charcoal/70">
                    <span>Shipping</span>

                    <span className="text-sm -wider uppercase font-semibold text-green-600">
                      Complimentary
                    </span>
                  </div>

                  <div className="flex justify-between font-semibold text-charcoal text-base pt-3 border-t border-beige-100">
                    <span>Estimated Total</span>
                    <span>${cartTotal}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/cart"
                    onClick={() => setCartOpen(false)}
                    className="btn-secondary mt-2 w-full flex items-center justify-center gap-2 rounded-xl border border-[#111111] bg-white text-[#111111] text-xs font-semibold uppercase tracking-[0.16em] py-3 shadow-sm transition-all hover:bg-[#111111] hover:text-white"
                  >
                    View Bag
                  </Link>

                  <button
                    type="button"
                    onClick={handleEnquireNow}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-whatsapp hover:bg-whatsapp/90 text-white text-xs font-semibold uppercase tracking-[0.16em] py-3 shadow-lg shadow-whatsapp/20 transition-all hover:scale-[1.01]"
                  >
                    <WhatsAppIcon />
                    <span>Enquire now</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}