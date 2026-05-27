/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check, Calendar, MapPin, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Order } from "../types";

interface SuccessViewProps {
  order: Order | null;
  onNavigate: (view: string, params?: any) => void;
}

export default function SuccessView({ order, onNavigate }: SuccessViewProps) {
  // If no order data has been passed (e.g. direct access), offer simple redirect
  if (!order) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center p-6 pt-24">
        <div className="bg-white rounded-2xl p-12 max-w-lg w-full shadow-card text-center">
          <h2 className="font-serif text-[32px] text-charcoal mb-4">
            No order found
          </h2>
          <p className="font-sans text-[14px] text-charcoal/60 mb-8 font-light leading-relaxed">
            It looks like you haven't placed an order yet. Visit our offerings
            menu to add some items to your tray.
          </p>
          <button
            onClick={() => onNavigate("menu")}
            className="w-full bg-primary text-white py-4 rounded-full font-sans text-[11px] tracking-[2px] uppercase font-semibold cursor-pointer"
          >
            Explore offerings
          </button>
        </div>
      </div>
    );
  }

  const pathVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut", delay: 0.2 },
    },
  };

  const circleVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", damping: 15, duration: 0.6 },
    },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center p-6 pt-24 pb-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-8 md:p-12 max-w-xl w-full shadow-card relative overflow-hidden"
      >
        {/* Animated Checkmark Canvas (Utilizes Framer Motion path draw) */}
        <div className="flex justify-center mb-8 relative">
          <motion.div
            variants={circleVariants}
            initial="initial"
            animate="animate"
            className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center relative"
          >
            {/* Pulsing decorative circle */}
            <span className="absolute inset-0 rounded-full bg-primary/5 animate-ping opacity-60" />

            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <motion.path
                variants={pathVariants}
                initial="initial"
                animate="animate"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        </div>

        {/* Content segments */}
        <div className="text-center mb-8">
          <motion.span
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="font-sans text-[10px] tracking-[3px] uppercase text-primary font-bold inline-flex items-center gap-1.5 mb-3"
          >
            <Sparkles size={11} />
            <span>Success Confirmation</span>
          </motion.span>

          <motion.h2
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="font-serif text-[38px] md:text-[44px] leading-tight font-normal text-charcoal mb-2"
          >
            Order Confirmed!
          </motion.h2>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="font-sans text-[13px] text-primary tracking-widest font-semibold uppercase mb-4"
          >
            ID: {order.orderId}
          </motion.div>

          <motion.p
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="font-sans text-[14px] text-charcoal/60 font-light leading-relaxed max-w-md mx-auto"
          >
            Your order is confirmed. We're crafting it with care. Standard
            brewing and delivery take around 25 to 40 minutes.
          </motion.p>
        </div>

        {/* Order details listing */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-b border-surface/80 py-6 mb-8 text-xs font-sans text-charcoal/70 space-y-4"
        >
          <div className="flex items-center justify-between text-[11px] tracking-wider uppercase text-charcoal/40 font-semibold">
            <span>Brewing Items Ordered</span>
            <span>Est Total</span>
          </div>

          <div className="space-y-3.5 max-h-40 overflow-y-auto pr-1 no-scrollbar">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-xs font-light"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-serif font-semibold text-charcoal/60">
                    {item.quantity}x
                  </span>
                  <span className="font-serif font-medium text-charcoal truncate">
                    {item.name}
                  </span>
                </div>
                <span className="font-serif text-charcoal/80 font-medium">
                  PKR {item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-surface/50 pt-4 flex flex-col gap-2.5 text-xs font-normal text-charcoal/60 bg-cream/35 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-charcoal/40" />
              <span>
                Deliver to:{" "}
                <span className="font-medium text-charcoal">
                  {order.customer.name}
                </span>
                , {order.customer.address}, {order.customer.city}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-charcoal/40" />
              <span>
                Sourced:{" "}
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                ({new Date(order.createdAt).toLocaleDateString()})
              </span>
            </div>
          </div>

          <div className="flex justify-between items-end pt-2 text-sm text-charcoal">
            <span className="font-sans text-[11px] tracking-[1.5px] uppercase text-charcoal/40 font-semibold">
              Total Sourced Amount
            </span>
            <span className="font-serif font-semibold text-primary text-[24px] leading-none">
              PKR {order.total}
            </span>
          </div>
        </motion.div>

        {/* Success Navigation buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={() => onNavigate("track", { orderId: order.orderId })}
            className="w-full bg-primary text-white font-sans text-[11px] font-semibold tracking-[2px] uppercase py-4 rounded-full hover:bg-opacity-92 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span>Track My Order</span>
            <ChevronRight size={14} />
          </button>

          <button
            onClick={() => onNavigate("menu")}
            className="w-full border border-charcoal text-charcoal font-sans text-[11px] tracking-[2px] uppercase py-4 rounded-full hover:bg-surface transition-all cursor-pointer"
          >
            Back to offerings
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
