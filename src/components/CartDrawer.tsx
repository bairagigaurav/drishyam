"use client";

import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { makeWhatsAppUrl } from "@/lib/whatsapp";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart, cartTotal, cartCount } = useApp();
  const whatsappUrl = makeWhatsAppUrl(cart);

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
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-beige-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-charcoal" />
                <h2 className="text-lg font-semibold -tight text-charcoal">Your Bag</h2>
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
                    key={`${item.product.id}-${item.selectedColor}-${idx}`} onClick={() => setCartOpen(false)}
                    className="cursor-pointer flex gap-4 border-b border-beige-100 pb-6 last:border-0 last:pb-0"
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
                            <Link href={`/product/${item.product.slug}`} >
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
                            onClick={() => updateQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                            className="p-1 hover:bg-beige-50 transition-colors text-charcoal/70"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-sm font-medium text-charcoal">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                            className="p-1 hover:bg-beige-50 transition-colors text-charcoal/70"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColor)}
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
                  <p className="text-charcoal/50 text-sm font-medium">Your shopping bag is empty.</p>
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
                    <span className="text-sm -wider uppercase font-semibold text-green-600">Complimentary</span>
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
                    className="py-3 border border-charcoal/20 hover:border-charcoal text-center text-sm font-semibold uppercase -widest text-charcoal hover:bg-white transition-all bg-white"
                  >
                    View Bag
                  </Link>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => setCartOpen(false)}
                    className="py-3 bg-gradient-to-r from-whatsapp to-emerald-500 hover:from-whatsapp/90 hover:to-emerald-500/90 text-white text-center text-sm font-semibold uppercase -widest flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-whatsapp/40 hover:scale-105 transform"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Order via WhatsApp
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

