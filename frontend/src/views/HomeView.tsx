/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";

interface HomeViewProps {
  products: Product[];
  onNavigate: (view: string, params?: any) => void;
  onAddedFeedback: () => void;
}

export default function HomeView({
  products,
  onNavigate,
  onAddedFeedback,
}: HomeViewProps) {
  // Get exactly 4 featured products for showcase
  const featured = products.filter((p) => p.featured).slice(0, 4);

  // Fallback in case none marked as featured
  const favorites = featured.length >= 4 ? featured : products.slice(0, 4);

  // 9 Unsplash images for static gallery block
  const galleryImages = [
    "/assets/gallery/8.jpg",
    "/assets/gallery/3.jpg",
    "/assets/gallery/4.jpg",
    "/assets/gallery/5.jpg",
    "/assets/gallery/1.jpg",
    "/assets/gallery/2.jpg",
    "/assets/gallery/7.jpg",
    "/assets/gallery/9.jpg",
    "/assets/gallery/10.jpg",
  ];

  // fadeInUp variant configuration
  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10% 0px" },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    viewport: { once: true },
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative h-svh w-full flex flex-col justify-end bg-charcoal overflow-hidden">
        {/* Background Image Layer */}
        <picture className="absolute inset-0 select-none">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80"
            alt="Warm specialty café counter"
            className="w-full h-full object-cover origin-center opacity-85 transition-transform duration-1000"
          />
          {/* Overlay mask */}
          <div className="absolute inset-0 bg-charcoal/45 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
        </picture>

        {/* Content Box */}
        <div className="relative max-w-7xl mx-auto w-full pb-24 md:pb-32 px-6 md:px-16 lg:px-20 text-white flex flex-col z-10">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 0.75, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-sans text-[10px] md:text-[11px] tracking-[5px] uppercase text-white/80 font-medium mb-3"
          >
            Specialty Coffee
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.25,
            }}
            className="font-serif text-[44px] md:text-[72px] lg:text-[96px] font-extralight text-white leading-[1.05] tracking-tight max-w-3xl mb-10 whitespace-pre-line"
          >
            Coffee made with intention, served with warmth.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => onNavigate("menu")}
              className="bg-primary hover:bg-opacity-92 text-white font-sans text-[12px] tracking-[2px] uppercase rounded-full px-9 py-4 transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg cursor-pointer font-semibold"
            >
              Explore Menu
            </button>
            <button
              onClick={() => onNavigate("menu")}
              className="border border-white hover:bg-white hover:text-charcoal text-white font-sans text-[12px] tracking-[2px] uppercase rounded-full px-9 py-4 transition-all active:scale-[1.01] cursor-pointer"
            >
              Order Now
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce hidden md:flex cursor-pointer"
          onClick={() => {
            document
              .getElementById("favorites-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="font-sans text-[9px] tracking-[3px] uppercase text-white/40">
            Scroll
          </span>
          <ChevronDown size={14} className="text-white/50" />
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS SECTION */}
      <section
        id="favorites-section"
        className="bg-cream py-24 md:py-32 px-6 md:px-16"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="text-center max-w-xl mx-auto mb-16"
          >
            <span className="font-sans text-[11px] tracking-[4px] uppercase text-primary font-semibold block mb-4">
              SIGNATURE DRINKS
            </span>
            <h2 className="font-serif text-[38px] md:text-[48px] font-normal text-charcoal tracking-tight">
              Our Favorites
            </h2>
          </motion.div>

          {/* Staggered Cards Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-5%" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {favorites.map((product) => (
              <motion.div key={product.id} variants={fadeInUp}>
                <ProductCard
                  product={product}
                  onViewDetails={(id) => onNavigate("product-detail", { id })}
                  onAddedFeedback={onAddedFeedback}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...fadeInUp} className="text-center mt-16">
            <button
              onClick={() => onNavigate("menu")}
              className="border border-charcoal/70 text-charcoal rounded-full px-8 py-3.5 hover:bg-charcoal hover:text-white transition-all duration-300 font-sans text-[11px] tracking-[2px] uppercase font-medium cursor-pointer"
            >
              View Full Menu
            </button>
          </motion.div>
        </div>
      </section>

      {/* 3. BRAND STORY SECTION */}
      <section className="bg-charcoal text-white/90 py-24 md:py-40 px-6 md:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&q=80"
              alt="Pouring drip coffee intentionally"
              className="h-[420px] md:h-[580px] w-full object-cover rounded-2xl shadow-xl hover:brightness-95 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Right Column Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col items-start text-left"
          >
            <span className="font-sans text-[10px] md:text-[11px] tracking-[4px] uppercase text-primary font-semibold mb-6">
              Our Philosophy
            </span>
            <h2 className="font-serif text-[38px] md:text-[52px] font-thin text-white leading-[1.15] tracking-tight mb-8">
              Crafted for the
              <br />
              ordinary moment.
            </h2>
            <p className="font-sans text-[15px] text-white/70 font-light leading-[1.9] mb-10 max-w-xl">
              We believe every cup tells a story. From carefully sourced
              single-origin beans to the ritual of preparation — CORTADO is
              built on slowness, intention, and the pursuit of perfect craft. We
              slow down the timeline so you can appreciate the clarity of the
              pour.
            </p>
            <button
              onClick={() => onNavigate("about")}
              className="border border-white/30 text-white rounded-full px-8 py-3.5 hover:bg-white hover:text-charcoal transition-all duration-300 font-sans text-[11px] tracking-[2px] uppercase cursor-pointer"
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* 4. GALLERY SECTION */}
      <section className="bg-cream py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.h3
            {...fadeInUp}
            className="font-serif text-[28px] md:text-[36px] font-light text-charcoal/80 text-center mb-12 tracking-tight"
          >
            Captured Moments
          </motion.h3>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-3"
          >
            {galleryImages.map((src, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden mb-3 bg-surface group relative cursor-pointer shadow-sm border border-surface/20"
              >
                <img
                  src={src}
                  alt={`Sourcing and craft snapshot ${index + 1}`}
                  className="w-full object-cover rounded-xl transition-all duration-500 group-hover:scale-103 group-hover:brightness-90 max-h-[400px]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. CTA BANNER */}
      <section className="bg-primary pt-20 pb-24 px-6 text-center text-white relative">
        <motion.div
          {...fadeInUp}
          className="max-w-2xl mx-auto flex flex-col items-center"
        >
          <h2 className="font-serif text-[36px] md:text-[48px] font-light text-white leading-tight mb-4 tracking-tight">
            Good coffee. Real moments.
          </h2>
          <p className="font-sans text-[15px] text-white/80 font-light max-w-lg mb-10">
            Visit us or order online — we're here to craft your day beautifully.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate("about")}
              className="bg-white text-charcoal text-[11px] tracking-[2px] uppercase font-semibold rounded-full px-8 py-3.5 hover:bg-cream hover:scale-102 hover:shadow-lg active:scale-97 transition-all cursor-pointer"
            >
              Visit Us
            </button>
            <button
              onClick={() => onNavigate("menu")}
              className="border border-white/40 text-white text-[11px] tracking-[2px] uppercase rounded-full px-8 py-3.5 hover:bg-white/10 transition-all cursor-pointer"
            >
              Order Online
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
