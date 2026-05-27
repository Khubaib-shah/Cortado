/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Trash2, Plus, Minus, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useCartStore, useUIStore } from "../store";
import { CartItem } from "../types";
import RemoveConfirmModal from "./RemoveConfirmModal";

interface CartDrawerProps {
  onNavigate: (view: string) => void;
}

export default function CartDrawer({ onNavigate }: CartDrawerProps) {
  const { cartOpen, setCartOpen } = useUIStore();
  const { items, updateQty, removeItem, getTotalPrice, getItemCount } =
    useCartStore();

  // Local confirmation state
  const [targetItem, setTargetItem] = useState<CartItem | null>(null);

  // Close drawer if hitting Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && cartOpen) {
        setCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cartOpen, setCartOpen]);

  // Handle Confirm Removal
  const handleConfirmRemove = () => {
    if (targetItem) {
      removeItem(targetItem.productId);
      setTargetItem(null);
    }
  };

  const handleCheckoutClick = () => {
    setCartOpen(false);
    onNavigate("checkout");
  };

  return (
    <>
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-[80] overflow-hidden">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            />

            {/* Panel wrapper */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 md:pl-0">
              {/* Desktop slide out panel right / Mobile full slide-up sheet bottom */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="w-screen md:w-96 bg-white overflow-hidden shadow-drawer flex flex-col h-full rounded-l-2xl md:rounded-l-3xl"
              >
                {/* Header segment */}
                <div className="h-16 border-b border-surface px-6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-serif text-[22px] font-semibold text-charcoal">
                      Your Selections
                    </h2>
                    <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-semibold rounded-full px-2.5 py-1 font-sans">
                      {getItemCount()} items
                    </span>
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="p-1.5 text-charcoal/40 hover:text-charcoal hover:bg-surface rounded-full transition-all cursor-pointer"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Main body selection lists */}
                <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4 py-16">
                      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                        <Coffee size={24} />
                      </div>
                      <p className="font-serif italic text-lg text-charcoal/70 mb-2 leading-relaxed">
                        "Your cart is empty. Let's fill it with something
                        beautiful."
                      </p>
                      <button
                        onClick={() => {
                          setCartOpen(false);
                          onNavigate("menu");
                        }}
                        className="font-sans text-[11px] tracking-[2px] uppercase text-primary border-b border-primary hover:text-charcoal hover:border-charcoal transition-all font-medium mt-3"
                      >
                        Explore Our Offerings
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col divide-y divide-surface">
                      {items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex gap-4 items-center py-4"
                        >
                          {/* Image */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover bg-surface flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />

                          {/* Metadata */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-[16px] font-medium text-charcoal truncate">
                              {item.name}
                            </h4>
                            <div className="font-sans text-xs text-primary font-medium mt-1">
                              PKR {item.price}
                            </div>

                            {/* Quantity buttons adjuster */}
                            <div className="flex items-center gap-1.5 mt-2">
                              <button
                                onClick={() =>
                                  updateQty(item.productId, item.quantity - 1)
                                }
                                className="w-6 h-6 rounded-full bg-surface text-charcoal hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all cursor-pointer"
                                aria-label="Decrease qty"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="font-serif w-6 text-center text-[14px] text-charcoal font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQty(item.productId, item.quantity + 1)
                                }
                                className="w-6 h-6 rounded-full bg-surface text-charcoal hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all cursor-pointer"
                                aria-label="Increase qty"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Delete */}
                          <button
                            onClick={() => setTargetItem(item)}
                            className="p-2 text-charcoal/30 hover:text-red-500 rounded-full hover:bg-red-50 transition-all cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer totals segment */}
                {items.length > 0 && (
                  <div className="border-t border-surface px-6 py-6 bg-cream/35">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <span className="font-sans text-[11px] tracking-[2px] uppercase text-charcoal/40 font-medium">
                          Subtotal
                        </span>
                        <div className="font-sans text-xs text-charcoal/40 font-light mt-1">
                          Calculated in Pak Rupees
                        </div>
                      </div>
                      <div className="font-serif text-[24px] font-semibold text-charcoal leading-none">
                        PKR {getTotalPrice()}
                      </div>
                    </div>

                    <p className="font-sans text-[12px] text-charcoal/50 font-light text-center mb-6">
                      Standard shipping flat PKR 150 added at checkout.
                    </p>

                    <button
                      onClick={handleCheckoutClick}
                      className="w-full font-sans text-[12px] tracking-[2px] uppercase bg-primary text-white rounded-full py-4 font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-300 block shadow-md cursor-pointer text-center"
                    >
                      Checkout Selections
                    </button>

                    <button
                      onClick={() => setCartOpen(false)}
                      className="mt-4 hover:text-primary font-sans text-[11px] tracking-[2px] uppercase text-charcoal/60 text-center block w-full transition-all cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation removal modal overlay */}
      <RemoveConfirmModal
        isOpen={targetItem !== null}
        onClose={() => setTargetItem(null)}
        onConfirm={handleConfirmRemove}
        itemName={targetItem?.name || ""}
      />
    </>
  );
}
