/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  CreditCard,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useCartStore } from "../store";
import { CustomerInfo } from "../types";

interface CheckoutViewProps {
  onNavigate: (view: string, params?: any) => void;
  currentUser: any;
}

export default function CheckoutView({
  onNavigate,
  currentUser,
}: CheckoutViewProps) {
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [formData, setFormData] = useState<CustomerInfo>({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    city: "Islamabad F-Sector",
    notes: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  // Sync login info if present
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || currentUser.name,
        email: prev.email || currentUser.email,
      }));
    }
  }, [currentUser]);

  // Ensure cart is not empty upon layout mounting
  useEffect(() => {
    if (items.length === 0) {
      setSubmitErr(
        `Your selection is empty. Let's fill it with something beautiful before checking out.`,
      );
    } else {
      setSubmitErr(null);
    }
  }, [items]);

  const validate = (): boolean => {
    const tempErrors: { [key: string]: string } = {};
    if (!formData.name.trim())
      tempErrors.name = "Please provide your full delivery name.";

    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = "Email address is required for receipts.";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Please provide a valid email format.";
    }

    // Phone registration (minimum numbers check)
    if (!formData.phone.trim()) {
      tempErrors.phone =
        "Tel contact number is required for delivery couriers.";
    } else if (formData.phone.length < 8) {
      tempErrors.phone =
        "Please provide a valid phone contact (at least 8 digits).";
    }

    if (!formData.address.trim()) {
      tempErrors.address = "A physical delivery address is mandatory.";
    } else if (formData.address.split(" ").length < 2) {
      tempErrors.address =
        "Please provide a complete address for accurate delivery.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setSubmitErr(
        "Cannot complete checkout: Your cart selection is currently empty.",
      );
      return;
    }

    if (!validate()) return;

    setSubmitting(true);
    setSubmitErr(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: formData,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          paymentMethod: "cod",
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || "Review extraction failed.");
      }

      // Success
      clearCart();
      onNavigate("order-success", { order: orderData });
    } catch (err: any) {
      console.error(err);
      setSubmitErr(
        err.message || "Something went wrong. Please try again in a moment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const citiesOptions = [
    "Islamabad F-Sector",
    "Islamabad E-Sector",
    "Islamabad G-Sector",
    "Rawalpindi Saddar",
    "Bahria Town Rawalpindi",
    "DHA Phase II Islamabad",
  ];

  const subtotal = getTotalPrice();
  const deliveryFee = 150;
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-cream min-h-screen pt-24 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-[40px] md:text-[48px] font-normal text-charcoal mb-12 tracking-tight">
          Checkout Selections
        </h1>

        {submitErr && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 mb-8 flex items-start gap-3 text-xs font-light">
            <AlertTriangle
              className="flex-shrink-0 text-red-500 mt-0.5"
              size={16}
            />
            <div>{submitErr}</div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start"
        >
          {/* Left panel Form cards */}
          <div className="space-y-8 bg-white rounded-2xl p-6 md:p-10 shadow-card">
            <div>
              <span className="font-sans text-[11px] tracking-[3px] uppercase text-primary font-semibold block mb-6">
                Delivery Information
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {/* Name */}
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="font-sans text-[11px] tracking-[2px] uppercase text-charcoal/60 mb-2 font-medium"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Ali Khan"
                    className={`bg-white border rounded-xl px-4 py-3.5 w-full font-sans text-xs text-charcoal focus:outline-none transition-all ${
                      errors.name
                        ? "border-red-500 ring-1 ring-red-100"
                        : "border-surface focus:border-primary"
                    }`}
                  />
                  {errors.name && (
                    <span className="font-sans text-[11px] text-red-500 mt-1.5">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="font-sans text-[11px] tracking-[2px] uppercase text-charcoal/60 mb-2 font-medium"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. ali@domain.com"
                    className={`bg-white border rounded-xl px-4 py-3.5 w-full font-sans text-xs text-charcoal focus:outline-none transition-all ${
                      errors.email
                        ? "border-red-500 ring-1 ring-red-100"
                        : "border-surface focus:border-primary"
                    }`}
                  />
                  {errors.email && (
                    <span className="font-sans text-[11px] text-red-500 mt-1.5">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {/* Phone */}
                <div className="flex flex-col">
                  <label
                    htmlFor="phone"
                    className="font-sans text-[11px] tracking-[2px] uppercase text-charcoal/60 mb-2 font-medium"
                  >
                    Phone Number (Tel)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 0333 1234567"
                    className={`bg-white border rounded-xl px-4 py-3.5 w-full font-sans text-xs text-charcoal focus:outline-none transition-all ${
                      errors.phone
                        ? "border-red-500 ring-1 ring-red-100"
                        : "border-surface focus:border-primary"
                    }`}
                  />
                  {errors.phone && (
                    <span className="font-sans text-[11px] text-red-500 mt-1.5">
                      {errors.phone}
                    </span>
                  )}
                </div>

                {/* City Sector Dropdown */}
                <div className="flex flex-col">
                  <label
                    htmlFor="city"
                    className="font-sans text-[11px] tracking-[2px] uppercase text-charcoal/60 mb-2 font-medium"
                  >
                    Sector / Area (Islamabad/Rwp)
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="bg-white border border-surface rounded-xl px-4 py-3.5 w-full font-sans text-xs text-charcoal/80 focus:border-primary focus:outline-none transition-all cursor-pointer"
                  >
                    {citiesOptions.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col mb-5">
                <label
                  htmlFor="address"
                  className="font-sans text-[11px] tracking-[2px] uppercase text-charcoal/60 mb-2 font-medium"
                >
                  Complete Physical Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Apartment code, house number, details..."
                  className={`bg-white border rounded-xl px-4 py-3.5 w-full font-sans text-xs text-charcoal focus:outline-none transition-all resize-none ${
                    errors.address
                      ? "border-red-500 ring-1 ring-red-100"
                      : "border-surface focus:border-primary"
                  }`}
                />
                {errors.address && (
                  <span className="font-sans text-[11px] text-red-500 mt-1.5">
                    {errors.address}
                  </span>
                )}
              </div>

              {/* Order Notes */}
              <div className="flex flex-col">
                <label
                  htmlFor="notes"
                  className="font-sans text-[11px] tracking-[2px] uppercase text-charcoal/60 mb-2 font-medium"
                >
                  Barista Directions or Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="e.g. Drop at gate. Split latte into separate mugs."
                  className="bg-white border border-surface rounded-xl px-4 py-3.5 w-full font-sans text-xs text-charcoal focus:border-primary focus:outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Payment Method Option */}
            <div className="border-t border-surface pt-8">
              <span className="font-sans text-[11px] tracking-[3px] uppercase text-primary font-semibold block mb-6">
                Payment Method
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash on Delivery (Enabled) */}
                <div className="border border-primary bg-primary/4 rounded-xl p-5 cursor-pointer flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Check size={18} />
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold text-charcoal text-[15px]">
                        Cash On Delivery (COD)
                      </h4>
                      <p className="font-sans text-[11px] text-charcoal/40 font-light leading-none mt-1">
                        Pay when brewed coffee arrives
                      </p>
                    </div>
                  </div>
                </div>

                {/* Credit Card (Disabled) */}
                <div className="border border-surface bg-surface/15 rounded-xl p-5 opacity-55 cursor-not-allowed flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-charcoal/10 text-charcoal/40 flex items-center justify-center">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold text-charcoal/50 text-[15px]">
                        Credit Card Gateway
                      </h4>
                      <p className="font-sans text-[11px] text-charcoal/40 font-light leading-none mt-2">
                        Integrating soon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sticky checkout details */}
          <div className="bg-white rounded-2xl p-6 shadow-card space-y-6 lg:sticky lg:top-28">
            <div className="flex items-center gap-2 border-b border-surface pb-4 mb-2">
              <ShoppingCart size={18} className="text-primary" />
              <h3 className="font-serif text-[22px] font-semibold text-charcoal">
                Your Selections
              </h3>
            </div>

            {/* Selected items list */}
            {items.length === 0 ? (
              <p className="font-sans text-xs text-charcoal/40 italic py-4 text-center">
                Selections empty
              </p>
            ) : (
              <div className="divide-y divide-surface/70 max-h-60 overflow-y-auto pr-1 no-scrollbar mb-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center py-3 flex-wrap gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-surface flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif text-[14px] text-charcoal font-medium truncate max-w-[150px]">
                          {item.name}
                        </h4>
                        <div className="font-sans text-[11px] text-charcoal/40">
                          Qty: {item.quantity} · PKR {item.price} each
                        </div>
                      </div>
                    </div>
                    <div className="font-serif font-medium text-charcoal text-[14px]">
                      PKR {item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Calculations metrics */}
            <div className="border-t border-surface pt-4 space-y-3 font-sans text-xs">
              <div className="flex justify-between text-charcoal/60 font-light">
                <span>Subtotal Selection</span>
                <span className="font-serif font-semibold text-charcoal text-[14px]">
                  PKR {subtotal}
                </span>
              </div>
              <div className="flex justify-between text-charcoal/60 font-light">
                <span>Flat Barista Delivery</span>
                <span className="font-serif font-semibold text-charcoal text-[14px]">
                  PKR {deliveryFee}
                </span>
              </div>
              <div className="border-t border-surface pt-3 flex justify-between items-end">
                <span className="text-[11px] tracking-[2px] uppercase text-charcoal font-medium">
                  Grand Total
                </span>
                <span className="font-serif font-semibold text-primary text-[28px] leading-none">
                  PKR {total}
                </span>
              </div>
            </div>

            {/* Submit checkout button */}
            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className={`w-full font-sans text-[11px] tracking-[2px] uppercase py-4 rounded-full font-semibold outline-none focus:ring-2 focus:ring-primary/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2.5 shadow-md ${
                submitting || items.length === 0
                  ? "bg-surface text-charcoal/30 cursor-not-allowed border border-surface/30"
                  : "bg-primary text-white cursor-pointer hover:opacity-92"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>Brewing Submission...</span>
                </>
              ) : (
                <span>Confirm Selection — PKR {total}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
