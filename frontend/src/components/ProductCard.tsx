/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { Product } from "../types";
import { useCartStore } from "../store";

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: string) => void;
  onAddedFeedback: () => void;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddedFeedback,
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    onAddedFeedback();
  };

  // Convert schema names to client display tags
  const getCategoryLabel = (category: Product["category"]) => {
    switch (category) {
      case "coffee":
        return "Coffee";
      case "espresso":
        return "Espresso";
      case "cold-brew":
        return "Cold Brew";
      case "pastries":
        return "Pastry";
      case "seasonal":
        return "Seasonal";
      default:
        return category;
    }
  };

  return (
    <motion.div
      onClick={() => onViewDetails(product.id)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-400 cursor-pointer flex flex-col h-full"
    >
      {/* Image container with category badge */}
      <div className="relative w-full aspect-square overflow-hidden bg-surface">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-primary/15 backdrop-blur-sm text-primary rounded-full px-3.5 py-1.5 font-sans text-[9px] tracking-[2px] uppercase font-semibold">
          {getCategoryLabel(product.category)}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="font-sans text-[11px] font-medium tracking-[3px] uppercase text-white border border-white/35 rounded-full px-5 py-2">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Card Content body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-serif text-[22px] font-semibold text-charcoal mb-1 tracking-tight leading-snug hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="font-sans text-[13px] text-charcoal/60 leading-relaxed mb-5 line-clamp-2 font-light">
            {product.description}
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center mt-auto pt-2">
          <span className="font-serif text-[20px] font-semibold text-charcoal">
            PKR {product.price}
          </span>
          {product.inStock ? (
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition-all shadow-md hover:shadow-lg cursor-pointer"
              aria-label={`Add ${product.name} toSelections`}
            >
              <Plus size={18} />
            </motion.button>
          ) : (
            <div className="w-10 h-10 rounded-full bg-surface text-charcoal/30 flex items-center justify-center cursor-not-allowed">
              <Plus size={18} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
