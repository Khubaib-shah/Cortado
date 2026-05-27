/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Menu,
  X,
  ShoppingBag,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import { useCartStore, useUIStore } from "../store";
import { User } from "../types";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  currentUser,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setCartOpen, cartOpen } = useUIStore();
  const itemCount = useCartStore((state) => state.getItemCount());

  const navLinks = [
    { label: "Home", view: "home" },
    { label: "Our Philosophy", view: "about" },
    { label: "Our Offerings", view: "menu" },
    { label: "Track Order", view: "track" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white/95 backdrop-blur-sm border-b border-surface z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Left: Branding Logo */}
        <button
          onClick={() => {
            onNavigate("home");
            setMobileMenuOpen(false);
          }}
          className="font-serif text-[18px] md:text-[22px] tracking-[4px] uppercase text-charcoal font-medium hover:opacity-80 transition-all uppercase cursor-pointer"
        >
          CORTADO
        </button>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => onNavigate(link.view)}
                className={`font-sans text-[11px] tracking-[2px] uppercase transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "text-primary font-medium border-b border-primary pb-1"
                    : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Admin link if user is admin */}
          {currentUser?.role === "admin" && (
            <button
              onClick={() => onNavigate("admin")}
              className={`hidden sm:flex items-center gap-2 font-sans text-[11px] tracking-[2px] uppercase px-4 py-2 rounded-full border border-primary/40 text-primary hover:bg-primary/5 transition-all text-xs cursor-pointer ${
                currentView === "admin" ? "bg-primary/10 border-primary" : ""
              }`}
              title="Admin Dashboard"
            >
              <LayoutDashboard size={14} />
              <span className="hidden lg:inline">Dashboard</span>
            </button>
          )}

          {/* User Sign In or Avatar */}
          {currentUser ? (
            <div className="relative group flex items-center gap-2">
              <button
                onClick={() =>
                  onNavigate(
                    currentUser.role === "admin" ? "admin" : "orders-history",
                  )
                }
                className="flex items-center gap-2 text-charcoal hover:text-primary transition-all text-xs"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif text-sm border border-primary/20">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline font-sans text-[11px] tracking-[1px] uppercase font-medium max-w-[80px] truncate">
                  {currentUser.name.split(" ")[0]}
                </span>
              </button>

              <button
                onClick={onLogout}
                className="text-charcoal/50 hover:text-charcoal hover:bg-surface p-1.5 rounded-full transition-all cursor-pointer"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate("auth")}
              className="text-charcoal/70 hover:text-charcoal hover:bg-surface p-1.5 rounded-full transition-all cursor-pointer"
              title="Sign In / Register"
            >
              <UserIcon size={18} />
            </button>
          )}

          {/* Shopping Bag Button */}
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="relative p-1.5 text-charcoal hover:text-primary transition-all transform hover:scale-105 cursor-pointer"
            aria-label="Toggle Selections"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-sans font-medium text-white shadow-sm">
                {itemCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu on Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-charcoal p-1 hover:bg-surface rounded-full transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Drawer slide overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-cream z-40 md:hidden flex flex-col justify-between py-12 px-8 border-t border-surface">
          <div className="flex flex-col gap-8">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => {
                    onNavigate(link.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left font-serif text-[32px] tracking-[1px] ${
                    isActive ? "text-primary" : "text-charcoal/80"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {currentUser?.role === "admin" && (
              <button
                onClick={() => {
                  onNavigate("admin");
                  setMobileMenuOpen(false);
                }}
                className="text-left font-serif text-[32px] tracking-[1px] text-primary"
              >
                Admin Panel
              </button>
            )}
          </div>

          <div className="border-t border-surface pt-8 flex flex-col gap-4">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-serif text-[20px] text-charcoal">
                    {currentUser.name}
                  </div>
                  <div className="font-sans text-[11px] uppercase tracking-wider text-charcoal/40">
                    {currentUser.role} Account
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-full border border-charcoal text-charcoal text-[11px] tracking-widest uppercase hover:bg-charcoal hover:text-white transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onNavigate("auth");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-4 bg-charcoal text-white rounded-full font-sans text-[11px] tracking-[2px] uppercase block hover:opacity-90 transition-all font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
