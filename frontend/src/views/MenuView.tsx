/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, SlidersHorizontal, Coffee, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";

interface MenuViewProps {
  products: Product[];
  onNavigate: (view: string, params?: any) => void;
  onAddedFeedback: () => void;
}

type CategoryType =
  | "all"
  | "coffee"
  | "espresso"
  | "cold-brew"
  | "pastries"
  | "seasonal";

export default function MenuView({
  products,
  onNavigate,
  onAddedFeedback,
}: MenuViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<
    "default" | "price-low" | "price-high" | "popular"
  >("default");

  const categoriesList: { label: string; value: CategoryType }[] = [
    { label: "All Offerings", value: "all" },
    { label: "Coffee", value: "coffee" },
    { label: "Espresso", value: "espresso" },
    { label: "Cold Brew", value: "cold-brew" },
    { label: "Pastries", value: "pastries" },
    { label: "Seasonal", value: "seasonal" },
  ];

  // Perform Client-side filtering and sorting instantly (0ms latency, beautiful user experience)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tastingNotes.some((note) => note.toLowerCase().includes(query)),
      );
    }

    // Sort options
    if (sortOption === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "popular") {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortOption]);

  const gridAnim = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemAnim = {
    initial: { opacity: 0, y: 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* 1. PAGE HEADER */}
      <section className="pt-28 md:pt-36 pb-12 text-center px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-[48px] md:text-[64px] font-normal text-charcoal tracking-tight leading-tight mb-4">
            Our Offerings
          </h1>
          <p className="font-sans text-[14px] md:text-[15px] text-charcoal/60 leading-relaxed font-light">
            Each coffee bean is high-elevation sourced and profile roasted;
            every single French pastry is rolled by hand daily.
          </p>
        </div>
      </section>

      {/* 2. STICKY CATEGORIES BAR */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-surface py-4 px-6 overflow-x-auto no-scrollbar shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-start md:justify-center gap-3">
          {categoriesList.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`font-sans text-[10px] md:text-[11px] tracking-[2px] uppercase rounded-full px-5 py-2.5 transition-all duration-300 pointer-events-auto cursor-pointer flex-shrink-0 ${
                  isActive
                    ? "bg-primary text-white font-medium shadow-sm ring-2 ring-primary/25"
                    : "bg-surface/60 text-charcoal hover:bg-surface hover:text-charcoal"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SEARCH & FILTERS CONTROLS */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search input field */}
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brewing, pastries, tasts..."
            className="bg-white border border-surface rounded-full pl-11 pr-5 py-3.5 w-full font-sans text-[13px] text-charcoal placeholder:text-charcoal/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-300"
          />
        </div>

        {/* Sort select input form */}
        <div className="relative w-full md:w-60 flex items-center gap-2 justify-end">
          <SlidersHorizontal
            size={14}
            className="text-charcoal/40 hidden sm:inline"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="bg-white border border-surface rounded-xl px-4 py-3.5 w-full font-sans text-[12px] tracking-[1px] uppercase text-charcoal/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Signatures (Featured)</option>
          </select>
        </div>
      </div>

      {/* 4. PRODUCT LISTING GRID */}
      <div className="max-w-7xl mx-auto w-full px-6 pb-28">
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 px-4 bg-white rounded-2xl border border-surface flex flex-col items-center justify-center shadow-sm"
            >
              <AlertCircle size={40} className="text-primary mb-4 opacity-75" />
              <h3 className="font-serif italic text-[22px] text-charcoal/80 mb-2 leading-relaxed">
                "Nothing found. Try a different search — we have more to offer."
              </h3>
              <p className="font-sans text-xs text-charcoal/40 font-light uppercase tracking-wider">
                Clear search terms or select an alternative category to continue
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSortOption("default");
                }}
                className="mt-6 font-sans text-[12px] bg-charcoal text-white rounded-full px-6 py-2.5 tracking-wider uppercase hover:opacity-90 active:scale-95 transition-all font-medium cursor-pointer"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={gridAnim}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={itemAnim}>
                  <ProductCard
                    product={product}
                    onViewDetails={(id) => onNavigate("product-detail", { id })}
                    onAddedFeedback={onAddedFeedback}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
