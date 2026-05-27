import {
  Search,
  Loader2,
  Check,
  Clock,
  Coffee,
  ShieldCheck,
  MapPin,
  Phone,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Order } from "../types";
import { useOrderTracking } from "../hooks/useSocket";

interface TrackViewProps {
  initialOrderId?: string;
}

export default function TrackView({ initialOrderId }: TrackViewProps) {\r
  const [orderId, setOrderId] = useState(initialOrderId || "");\r
  const [loading, setLoading] = useState(false);\r
  const [order, setOrder] = useState<Order | null>(null);\r
  const [errorMsg, setErrorMsg] = useState<string | null>(null);\r
\r
  // Socket.IO: live status updates when admin changes order status\r
  useOrderTracking(order?.orderId || null, (data) => {\r
    setOrder(prev => prev ? { ...prev, status: data.status, updatedAt: data.updatedAt } : prev);\r
  });\r
\r
  useEffect(() => {\r
    if (initialOrderId) {\r
      handleTrack(initialOrderId);\r
    }\r
  }, [initialOrderId]);\r
\r
  const handleTrack = async (searchId: string) => {\r
    if (!searchId.trim()) return;\r
\r
    setLoading(true);\r
    setErrorMsg(null);\r
    setOrder(null);\r
\r
    try {\r
      const response = await fetch(\r
        `/api/orders/track?orderId=${encodeURIComponent(searchId.trim())}`,\r
      );\r
      const data = await response.json();\r
\r
      if (!response.ok) {\r
        throw new Error(data.error || "Tracking request failed.");\r
      }\r
\r
      setOrder(data);\r
    } catch (err: any) {\r
      console.error(err);\r
      setErrorMsg(err.message || "No order found with that tracking code.");\r
    } finally {\r
      setLoading(false);\r
    }\r
  };

  const stepsList: {
    status: Order["status"];
    label: string;
    details: string;
    color: string;
  }[] = [
    {
      status: "pending",
      label: "Received",
      details: "Order queued in our roasting queue.",
      color: "amber",
    },
    {
      status: "preparing",
      label: "Preparing",
      details: "Baristas are actively drawing espresso.",
      color: "blue",
    },
    {
      status: "ready",
      label: "Ready",
      details: "Freshly boxed, waiting for dispatch.",
      color: "orange",
    },
    {
      status: "completed",
      label: "Completed",
      details: "Safely delivered. Enjoy your craft.",
      color: "green",
    },
  ];

  // Helper index to check completed status
  const getStepIndex = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return 0;
      case "preparing":
        return 1;
      case "ready":
        return 2;
      case "completed":
        return 3;
      default:
        return 0;
    }
  };

  const activeIndex = order ? getStepIndex(order.status) : 0;

  const getBaristaMessage = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Your request has been received. Our baristas are logging the timing and selecting your bean profiles.";
      case "preparing":
        return "Your order is being prepared with care. Sifting grounds, weighing micro-dosages, and steaming milk.";
      case "ready":
        return "Your selections are confirmed and boxed! Our logistics courier is loading the order for immediate delivery.";
      case "completed":
        return "Order completed. We hope your coffee experience is slow, warm, and beautiful.";
      default:
        return "";
    }
  };

  const statusIcons = (status: string, index: number) => {
    const isCompleted = index < activeIndex;
    const isActive = index === activeIndex;

    if (isCompleted) {
      return <Check size={16} className="text-white" />;
    }
    if (isActive) {
      return <Clock size={16} className="text-primary animate-pulse" />;
    }
    return (
      <span className="font-serif text-[11px] font-semibold text-charcoal/30">
        {index + 1}
      </span>
    );
  };

  return (
    <div className="bg-cream min-h-screen py-24 px-6">
      <div className="max-w-3xl mx-auto pt-8">
        {/* Header center */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-[44px] md:text-[52px] font-normal text-charcoal tracking-tight leading-none mb-4">
            Track Your Order
          </h1>
          <p className="font-sans text-xs text-charcoal/50 uppercase tracking-[2px] font-light max-w-md mx-auto leading-relaxed">
            Enter your ORD-XXXXXX tracking number to view real-time brewing and
            delivery stages.
          </p>
        </div>

        {/* Dynamic tracking ID Search bar */}
        <div className="bg-white rounded-2xl p-6 shadow-card mb-10 border border-surface flex flex-col sm:flex-row gap-3.5">
          <div className="relative flex-1">
            <Search
              className="absolute left-4.5 top-1/2 -translate-y-1/2 text-charcoal/35"
              size={16}
            />
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ORD-123456"
              className="bg-cream/40 border border-surface rounded-xl pl-12 pr-4 py-3.5 w-full font-sans text-xs text-charcoal uppercase tracking-wider focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/15 transition-all outline-none font-semibold"
            />
          </div>
          <button
            onClick={() => handleTrack(orderId)}
            disabled={loading || !orderId.trim()}
            className={`font-sans text-[11px] tracking-[2px] uppercase sm:px-8 py-3.5 rounded-xl font-semibold hover:scale-101 active:scale-97 transition-all flex items-center justify-center gap-2 ${
              loading || !orderId.trim()
                ? "bg-surface text-charcoal/30 cursor-not-allowed border border-surface/50"
                : "bg-primary text-white cursor-pointer hover:opacity-92"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                <span>Locating...</span>
              </>
            ) : (
              <span>Track Process</span>
            )}
          </button>
        </div>

        {/* Display Error warnings */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 text-red-700 border border-red-100 rounded-xl p-5 text-center font-sans text-xs font-light flex items-center justify-center gap-2.5 shadow-sm"
            >
              <AlertCircle size={15} className="text-red-500" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Stepper Tracking Board */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Stepper Card */}
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-card border border-surface relative">
                {/* Visual Connector Line background */}
                <div className="hidden md:block absolute top-[85px] left-16 right-16 h-0.5 bg-surface z-0">
                  {/* Dynamic Filled Color progress */}
                  <div
                    className="h-full bg-primary transition-all duration-700"
                    style={{
                      width: `${(activeIndex / (stepsList.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {/* Vertical/Horizontal Nodes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
                  {stepsList.map((step, idx) => {
                    const isCompleted = idx < activeIndex;
                    const isActive = idx === activeIndex;
                    const isUpcoming = idx > activeIndex;

                    return (
                      <div
                        key={idx}
                        className="flex md:flex-col items-center gap-4 md:gap-2 text-center"
                      >
                        {/* Node circle wrapper */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                            isCompleted
                              ? "bg-primary border-2 border-primary/20 text-white"
                              : isActive
                                ? "bg-primary/10 border-2 border-primary ring-4 ring-primary/15"
                                : "bg-white border-2 border-surface text-charcoal/30"
                          }`}
                        >
                          {statusIcons(step.status, idx)}
                        </div>

                        {/* Text descriptions */}
                        <div className="text-left md:text-center mt-1">
                          <h4
                            className={`font-sans text-[11px] tracking-[2.5px] uppercase font-semibold transition-colors duration-500 ${
                              isActive
                                ? "text-primary"
                                : isUpcoming
                                  ? "text-charcoal/30"
                                  : "text-charcoal"
                            }`}
                          >
                            {step.label}
                          </h4>
                          <p className="font-sans text-[11px] text-charcoal/40 font-light hidden lg:block mt-1">
                            {step.details}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Status central barista message */}
                <div className="border-t border-surface mt-12 pt-8 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Coffee size={18} />
                  </div>
                  <p className="font-serif italic text-lg text-charcoal/75 max-w-xl text-center leading-relaxed">
                    "{getBaristaMessage(order.status)}"
                  </p>

                  {order.status !== "completed" && (
                    <span className="font-sans text-[10px] text-charcoal/40 uppercase tracking-[2px] font-medium mt-4">
                      Estimated Remaining: 15–20 Mins
                    </span>
                  )}
                </div>
              </div>

              {/* Order Accordion detail metrics */}
              <div className="bg-white rounded-2xl p-6.5 shadow-card border border-surface space-y-5">
                <h3 className="font-serif text-[18px] font-semibold text-charcoal border-b border-surface pb-3 mb-2 uppercase tracking-wide">
                  Order Details Summary
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans text-charcoal/70">
                  {/* Left block Info */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck size={14} className="text-primary mt-0.5" />
                      <div>
                        <div className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">
                          Secure Reference ID
                        </div>
                        <div className="font-mono text-primary text-[12px] mt-0.5">
                          {order.orderId}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin size={14} className="text-charcoal/40 mt-0.5" />
                      <div>
                        <div className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">
                          Delivery Location
                        </div>
                        <div className="font-light mt-0.5">
                          {order.customer.name} · {order.customer.address},{" "}
                          {order.customer.city}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right block Info */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-2.5">
                      <Phone size={14} className="text-charcoal/40 mt-0.5" />
                      <div>
                        <div className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">
                          Courier Contact Info
                        </div>
                        <div className="font-light mt-0.5">
                          {order.customer.phone}
                        </div>
                      </div>
                    </div>

                    {order.customer.notes && (
                      <div className="flex items-start gap-2.5">
                        <MessageSquare
                          size={14}
                          className="text-charcoal/40 mt-0.5"
                        />
                        <div>
                          <div className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">
                            Notes to Espresso Bar
                          </div>
                          <div className="font-light text-charcoal/60 mt-0.5 font-sans italic">
                            "{order.customer.notes}"
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Condensed items list */}
                <div className="border-t border-surface pt-4">
                  <table className="w-full text-left font-sans text-xs">
                    <thead>
                      <tr className="text-charcoal/40 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="pb-2">Offerings Sourced</th>
                        <th className="pb-2 text-center">Qty</th>
                        <th className="pb-2 text-right">Ext Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface/60 font-light">
                      {order.items.map((it, idx) => (
                        <tr key={idx} className="text-charcoal/80">
                          <td className="py-2.5 select-none font-medium flex items-center gap-2">
                            <img
                              src={it.image}
                              alt="Thumbnail representation"
                              className="w-7 h-7 rounded object-cover"
                            />
                            <span className="font-serif text-[13px]">
                              {it.name}
                            </span>
                          </td>
                          <td className="py-2.5 text-center font-serif text-[13px]">
                            {it.quantity}
                          </td>
                          <td className="py-2.5 text-right font-serif text-[13px]">
                            PKR {it.price * it.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-medium text-charcoal">
                        <td
                          colSpan={2}
                          className="pt-4 font-sans text-[11px] tracking-wider uppercase text-charcoal/40 text-left"
                        >
                          Grand Sourced Cumulative Total:
                        </td>
                        <td className="pt-4 text-right font-serif text-primary text-[19px] font-semibold">
                          PKR {order.total}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
