/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, Leaf, Award, Heart } from "lucide-react";
import { motion } from "motion/react";

export default function AboutView() {
  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10% 0px" },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative h-[65svh] w-full flex flex-col justify-end bg-charcoal overflow-hidden pt-16">
        <picture className="absolute inset-0 select-none">
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=80"
            alt="Warm soft lit coffee counter interior"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-charcoal/45 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent" />
        </picture>

        {/* Content Box */}
        <div className="relative max-w-7xl mx-auto w-full pb-16 px-6 md:px-16 text-white z-10 text-left">
          <span className="font-sans text-[10px] md:text-[11px] tracking-[5px] uppercase text-white/70 font-medium mb-3 block">
            OUR STORY
          </span>
          <h1 className="font-serif text-[42px] md:text-[60px] font-extralight text-white leading-[1.1] tracking-tight max-w-2xl whitespace-pre-line">
            More than coffee.{"\n"}A way of life.
          </h1>
        </div>
      </section>

      {/* 2. OUR STORY (EDITORIAL PROSE) */}
      <section className="bg-white py-24 px-6 md:px-16 border-b border-surface">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <motion.div {...fadeInUp} className="mb-12">
            <h2 className="font-serif text-[28px] md:text-[38px] text-charcoal/60 italic leading-relaxed text-center font-light px-4">
              "We believe that the ritual of coffee is a slow, sacred act of
              focus in a world moving too quickly."
            </h2>
          </motion.div>

          {/* Prose columns */}
          <motion.div
            {...fadeInUp}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 font-sans text-[15px] leading-[1.85] text-charcoal/70 font-light mt-12"
          >
            <div>
              <p className="mb-6">
                Established in the heart of Islamabad, CORTADO was conceived by
                a small team of artisans frustrated with the industrialization
                of specialty drinks. We noticed a shift—coffee became a rushed
                transaction, an injection of chemical alertness, divorced from
                the earth and the sensory depth of its roasting.
              </p>
              <p>
                We set out with one core aspiration: to return coffee to its
                roots. This means buying small micro-lots with full
                traceability, maintaining absolute AOP organic integrity, and
                treating the extraction of every shot of espresso with unhurried
                dedication.
              </p>
            </div>
            <div>
              <p className="mb-6">
                Every origin bean in our silos has a story of high elevation,
                rich altitude volcanic soils, and family-owned farms. When we
                bring them to our local hot-air custom fluid beds, we toast in
                minuscule batches, capturing exact caramelization coefficients
                without carbon scorches.
              </p>
              <p>
                Our cafés reflect this tranquility. Structured in minimal
                neutral lines, warm natural timber, and soft local stonework,
                our spaces invite you to leave behind the noisy demands of
                metropolitan speed and pause for a beautiful moment of focus.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. MISSION & VALUE METRICS */}
      <section className="bg-cream py-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div {...fadeInUp} className="max-w-xl mx-auto mb-16">
            <span className="font-sans text-[11px] tracking-[4px] uppercase text-primary font-semibold block mb-4">
              OUR IMPACT
            </span>
            <h2 className="font-serif text-[36px] font-normal text-charcoal tracking-tight">
              Responsibility in numbers
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mt-16"
          >
            {[
              {
                score: "100%",
                title: "Single-Origin Traceability",
                desc: "Directly sourced from organic growers.",
              },
              {
                score: "1,900m",
                title: "Average Cultivation Altitude",
                desc: "Sown high for concentrated sweetness.",
              },
              {
                score: "32 Layers",
                title: "Hand-laminated Puff Pastry",
                desc: "Baked freshly every morning.",
              },
              {
                score: "18 Hours",
                title: "Cold Brew Steep Times",
                desc: "Patently extracted for full-body.",
              },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="font-serif text-[42px] md:text-[54px] font-light text-primary leading-tight">
                  {stat.score}
                </span>
                <h4 className="font-sans text-[11px] tracking-[1px] uppercase text-charcoal font-semibold mt-4 mb-2">
                  {stat.title}
                </h4>
                <p className="font-sans text-[13px] text-charcoal/50 font-light leading-relaxed max-w-[200px]">
                  {stat.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. PHILOSOPHY PILLARS (3-COLUMN GRID) */}
      <section className="bg-white py-24 px-6 md:px-16 border-t border-b border-surface">
        <div className="max-w-7xl mx-auto">
          <motion.h3
            {...fadeInUp}
            className="font-serif text-[32px] font-normal text-center text-charcoal mb-16 tracking-tight"
          >
            Our Foundation
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                icon: <Leaf className="text-primary" size={26} />,
                title: "Traceable Sourcing",
                body: "We ignore corporate brokers, trading directly with small co-ops in Ethiopia, El Salvador, and Peru. Giving farmers live-pricing feedback guarantees fair terms and preserves rare heirloom crops.",
              },
              {
                icon: <Award className="text-primary" size={26} />,
                title: "Scientific Roasting",
                body: "Using convection air currents rather than direct heat drums keeps bean chaff clean. We log gas flow, heat profiles, and barometric variables to hit consistent extraction bands.",
              },
              {
                icon: <Flame className="text-primary" size={26} />,
                title: "Micro-dose Lamination",
                body: "Our pastries are rolled with traditional high-butterfat French AOP blocks. This yields golden, multi-layered, flaky sheets cooked perfectly at 200°C for early mornings.",
              },
            ].map((item, key) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: key * 0.15 }}
                className="flex flex-col items-start text-left"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h4 className="font-serif text-[22px] font-semibold text-charcoal mb-3">
                  {item.title}
                </h4>
                <p className="font-sans text-[14px] text-charcoal/60 leading-[1.8] font-light">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOUNDER PROFILE IN CHARCOAL */}
      <section className="bg-charcoal text-white/90 py-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-col"
          >
            <span className="font-sans text-[10px] tracking-[4px] uppercase text-primary font-semibold mb-6 block">
              BREWING LEGACY
            </span>
            <h2 className="font-serif text-[38px] md:text-[48px] font-light leading-tight mb-8">
              Guiding the Craft
            </h2>
            <blockquote className="font-serif italic text-lg text-white/70 border-l-2 border-primary pl-6 mb-8 py-1 leading-relaxed">
              "We built CORTADO with the idea that small details are not
              tedious. Sinking hours into temperature profiles and timing is the
              only way to deliver true luxury to a coffee consumer."
            </blockquote>
            <p className="font-sans text-[14px] leading-[1.85] text-white/60 font-light mb-4">
              Founded under the creative vision of Farhan Malik, a
              competition-level barista and food scientist, CORTADO maintains a
              strict focus on high-elevation Arabica beans. Our roasting curves
              are designed manually without pre-packaged templates, resulting in
              clear, eye-opening experiences in every double shot.
            </p>
            <div className="mt-8">
              <div className="font-serif text-[20px] text-white font-medium">
                Farhan Malik
              </div>
              <div className="font-sans text-[11px] uppercase tracking-widest text-primary font-semibold mt-1">
                Founder & Head Roaster
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl"
          >
            {/* Video */}
            <motion.video
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/assets/logo.jpg"
            >
              <source src="/assets/about/coffee-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </motion.video>

            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

            {/* Optional Text Layer (remove if not needed) */}
            <div className="absolute bottom-6 left-6 text-white z-10">
              <h3 className="text-xl md:text-2xl font-semibold">
                Crafted with Precision
              </h3>
              <p className="text-sm md:text-base text-white/80 mt-1">
                Every cup tells a story of warmth, aroma, and craft.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
