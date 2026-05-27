/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white/80 py-16 px-6 md:px-20 border-t border-white/5 font-sans text-sm font-light">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand & Tagline */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => onNavigate("home")}
              className="text-left font-serif text-[22px] tracking-[4px] uppercase text-white hover:opacity-90 transition-all font-medium cursor-pointer"
            >
              CORTADO
            </button>
            <p className="text-white/60 font-sans text-[13px] leading-[1.8] max-w-xs mt-1">
              Slow drip, warm light, clear thoughts. A place built entirely
              around slowness, intention, and perfect liquid craft.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-[11px] tracking-[3px] uppercase text-white font-medium">
              Navigation
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Home Experience", view: "home" },
                { label: "Our Philosophy", view: "about" },
                { label: "Our Offerings", view: "menu" },
                { label: "Order Tracking", view: "track" },
              ].map((link) => (
                <button
                  key={link.view}
                  onClick={() => onNavigate(link.view)}
                  className="text-left text-white/50 hover:text-primary text-[13px] transition-all cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Hours of Operation */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-[11px] tracking-[3px] uppercase text-white font-medium">
              Opening Hours
            </h4>
            <div className="flex flex-col gap-1.5 text-white/50 text-[13px] leading-relaxed">
              <div className="flex justify-between max-w-[200px]">
                <span>Mon – Fri:</span>
                <span className="text-white/75 font-serif font-light">
                  7:00 – 19:00
                </span>
              </div>
              <div className="flex justify-between max-w-[200px]">
                <span>Saturday:</span>
                <span className="text-white/75 font-serif font-light">
                  8:00 – 18:00
                </span>
              </div>
              <div className="flex justify-between max-w-[200px]">
                <span>Sunday:</span>
                <span className="text-white/75 font-serif font-light font-italic">
                  Closed
                </span>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-[11px] tracking-[3px] uppercase text-white font-medium">
              Find Us
            </h4>
            <address className="not-italic text-white/50 text-[13px] leading-[1.8] flex flex-col gap-2">
              <p>House 12-B, Kohsar Colony, F7 Islamabad, Pakistan</p>
              <p className="hover:text-primary transition-all">
                <a href="mailto:hello@cortado.com">hello@cortado.com</a>
              </p>
              <p className="hover:text-primary transition-all">
                <a href="tel:+923331234567">+92 (333) 123-4567</a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom copyright segment */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] tracking-[1px] text-white/40 uppercase">
          <div>
            © {currentYear} CORTADO Specialty Coffee. All rights carefully
            preserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-all">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-all">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-all">
              AOP Sourcing
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
