/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus, Minus, Star, ChevronLeft, ShoppingBag } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { Product } from "../types";
import { useCartStore } from "../store";
import ProductCard from "../components/ProductCard";

interface ProductDetailViewProps {
  productId: string;
  allProducts: Product[];
  onNavigate: (view: string, params?: any) => void;
  onAddedFeedback: () => void;
}

export default function ProductDetailView({
  productId,
  allProducts,
  onNavigate,
  onAddedFeedback,
}: ProductDetailViewProps) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  // Scroll to top when product ID shifts to keep details vertical space proper
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setQty(1);
  }, [productId]);

  // Find targeted product entity
  const product = useMemo(() => {
    return allProducts.find((p) => p.id === productId);
  }, [allProducts, productId]);

  // Compute related items (excluding current product, limit to 4)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [allProducts, product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <h2 className="font-serif text-[32px] text-charcoal mb-4">
            Brewing Experience...
          </h2>
          <button
            onClick={() => onNavigate("menu")}
            className="text-primary font-sans text-xs tracking-wider uppercase border-b border-primary hover:text-charcoal hover:border-charcoal transition-all font-semibold"
          >
            Back to offerings
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, qty);
    onAddedFeedback();
  };

  const getCategoryLabel = (category: Product["category"]) => {
    switch (category) {
      case "coffee":
        return "AOP Origin Coffee";
      case "espresso":
        return "Barista Espresso";
      case "cold-brew":
        return "Active Cold Brew";
      case "pastries":
        return "Organic Pastry";
      case "seasonal":
        return "Seasonal Special";
      default:
        return category;
    }
  };

  return (
    <div className="bg-cream min-h-screen pt-24 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Link Breadcrumb */}
        <button
          onClick={() => onNavigate("menu")}
          className="flex items-center gap-2 font-sans text-[11px] tracking-[2px] uppercase text-charcoal/50 hover:text-primary mb-10 transition-colors pointer-events-auto cursor-pointer"
        >
          <ChevronLeft size={14} />
          <span>Back to Menu</span>
        </button>

        {/* Primary Product Card detail grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start bg-white rounded-2xl p-6 md:p-12 shadow-card">
          {/* Left Side: Solid Laminated Image Showcase */}
          <div className="space-y-4">
            <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-surface shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl transition-all duration-700 hover:scale-102"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Visual thumb grid (mock thumbnail images since standard unsplash provides matching details) */}
            <div className="grid grid-cols-3 gap-3">
              {[product.image, product.image, product.image].map((img, i) => (
                <div
                  key={i}
                  className="aspect-video rounded-lg overflow-hidden border border-surface bg-surface h-20 cursor-pointer hover:border-primary transition-all"
                >
                  <img
                    src={img}
                    alt="Detail perspective"
                    className="w-full h-full object-cover filter brightness-95"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Coffee metadata + interactions */}
          <div className="flex flex-col h-full pt-2">
            <span className="font-sans text-[10px] md:text-[11px] tracking-[4px] uppercase text-primary font-semibold mb-3">
              {getCategoryLabel(product.category)}
            </span>

            <h1 className="font-serif text-[38px] md:text-[48px] font-normal leading-tight text-charcoal mb-2 tracking-tight">
              {product.name}
            </h1>

            {/* Static Review Bar (Satisfies detail specification) */}
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
              <span className="font-sans text-xs text-charcoal/40 font-light ml-2">
                (4.9 out of 5 from 82 reviews)
              </span>
            </div>

            <div className="font-serif text-[28px] md:text-[32px] font-semibold text-primary mb-6 leading-none">
              PKR {product.price}
            </div>

            <p className="font-sans text-[14px] leading-[1.85] text-charcoal/70 font-light mb-8 max-w-xl">
              {product.description}
            </p>

            <div className="border-t border-surface pt-6 mb-6">
              <h4 className="font-sans text-[11px] tracking-[2px] uppercase text-charcoal/50 font-semibold mb-3">
                Key Tasting Notes
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {product.tastingNotes.map((note, index) => (
                  <span
                    key={index}
                    className="bg-sage/12 text-charcoal/85 border border-sage/20 rounded-full px-4 py-1.5 font-sans text-xs font-light"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Ingredients Specs list */}
            <div className="mb-8 p-4 bg-cream/35 border border-surface rounded-xl">
              <h5 className="font-sans text-[11px] tracking-[2px] uppercase text-charcoal/50 font-semibold mb-2">
                Ingredients Sourced
              </h5>
              <ul className="list-disc list-inside font-sans text-xs text-charcoal/60 leading-relaxed space-y-1 font-light">
                {product.ingredients.map((ing, k) => (
                  <li key={k}>{ing}</li>
                ))}
              </ul>
            </div>

            {/* Quantity Controller & Button row */}
            {product.inStock ? (
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <span className="font-sans text-[11px] tracking-[2px] uppercase text-charcoal/50 font-semibold">
                    Quantity
                  </span>

                  {/* Stepper buttons */}
                  <div className="flex items-center gap-2 bg-surface/50 rounded-full px-4 py-1.5 border border-surface">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-8 h-8 rounded-full text-charcoal/70 hover:bg-white hover:text-primary transition-all flex items-center justify-center cursor-pointer"
                      aria-label="Reduce"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-serif text-[22px] font-semibold text-charcoal text-center w-10 leading-none">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="w-8 h-8 rounded-full text-charcoal/70 hover:bg-white hover:text-primary transition-all flex items-center justify-center cursor-pointer"
                      aria-label="Increase"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    onClick={handleAddToCart}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-primary text-white rounded-full py-4 px-6 font-sans text-[11px] font-semibold tracking-[2px] uppercase hover:bg-opacity-92 transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg cursor-pointer text-center"
                  >
                    <ShoppingBag size={14} />
                    <span>Add to selections — PKR {product.price * qty}</span>
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 text-red-700 border border-red-100 rounded-xl p-4 text-center font-sans text-xs font-light">
                This offering is currently out of stock. Standard batches are
                roasted/baked hourly; check back in a few minutes.
              </div>
            )}

            <button
              onClick={() => onNavigate("menu")}
              className="mt-6 hover:text-primary font-sans text-[11px] tracking-[2px] uppercase text-charcoal/60 hover:underline text-center cursor-pointer"
            >
              Continue Sourcing Menu
            </button>
          </div>
        </div>

        {/* 2. RELATED OFFERINGS SHOWCASE */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-surface pt-16">
            <h3 className="font-serif text-[28px] font-normal text-charcoal mb-10 tracking-tight">
              You might also like
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProd) => (
                <div key={relProd.id}>
                  <ProductCard
                    product={relProd}
                    onViewDetails={(id) => onNavigate("product-detail", { id })}
                    onAddedFeedback={onAddedFeedback}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
