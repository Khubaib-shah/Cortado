/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Mail,
  Lock,
  User as UserIcon,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { User } from "../types";

interface AuthViewProps {
  onSuccess: (user: User) => void;
  onNavigate: (view: string) => void;
}

export default function AuthView({ onSuccess, onNavigate }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Form Inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    // Form validation checks
    if (!email.trim() || !password.trim()) {
      setErr("Please fill in both email and password.");
      return;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setErr("Please provide your full registration name.");
        return;
      }
      if (password !== confirmPassword) {
        setErr("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setErr("Password must be at least 6 characters long.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin
        ? { email: email.toLowerCase().trim(), password }
        : { name: name.trim(), email: email.toLowerCase().trim(), password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication endpoint failed.");
      }

      // Success, notify parent state
      onSuccess(data.user);

      // Route user correctly
      if (data.user?.role === "admin") {
        onNavigate("admin");
      } else {
        onNavigate("home");
      }
    } catch (error: any) {
      console.error(error);
      setErr(
        error.message || "The credentials you provided appear to be invalid.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-16 md:pt-0 bg-cream">
      {/* Left Columns Branding Panel (Hidden on Mobile) */}
      <div className="hidden md:flex relative bg-primary items-center justify-center p-12 overflow-hidden lg:px-20">
        <picture className="absolute inset-0 select-none z-0">
          <img
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1000&q=80"
            alt="Artisanal whole beans and coffee filter"
            className="w-full h-full object-cover opacity-60 filter brightness-90 scale-102"
          />
          <div className="absolute inset-0 bg-charcoal/30 mix-blend-multiply" />
        </picture>

        <div className="relative z-10 text-center text-white max-w-sm flex flex-col items-center">
          <h2 className="font-serif text-[38px] lg:text-[44px] tracking-[4px] uppercase font-bold text-white mb-2 leading-tight">
            CORTADO
          </h2>
          <div className="w-10 h-[1px] bg-white/40 my-6" />
          <p className="font-serif italic text-lg text-white/80 leading-relaxed font-light">
            "Coffee is not a product. It is a slow, sacred dialogue of
            craftsmanship."
          </p>
        </div>
      </div>

      {/* Right Column Form Panel */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 md:p-10 w-full max-w-md shadow-card border border-surface/50"
        >
          {/* Form Header Title */}
          <div className="mb-8">
            <h1 className="font-serif text-[32px] md:text-[36px] font-normal text-charcoal tracking-tight leading-none mb-1">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="font-sans text-[13px] text-charcoal/50 font-light mt-1 select-none">
              {isLogin
                ? "Sign in to access secure order tracking or history."
                : "Register to easily checkout in future sessions."}
            </p>
          </div>

          {/* Form alert */}
          {err && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3 text-xs font-light">
              <AlertTriangle
                className="flex-shrink-0 text-red-500 mt-0.5"
                size={15}
              />
              <div>{err}</div>
            </div>
          )}

          {/* Core Sign-In / Register Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {/* Full Name (For Register Only) */}
            {!isLogin && (
              <div className="flex flex-col">
                <label
                  htmlFor="auth-name"
                  className="font-sans text-[11px] tracking-[2px] uppercase text-charcoal/60 mb-2 font-medium"
                >
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30"
                  />
                  <input
                    type="text"
                    id="auth-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ali Khan"
                    className="bg-white border border-surface rounded-xl pl-11 pr-4 py-3.5 w-full font-sans text-xs text-charcoal focus:border-primary focus:outline-none transition-all outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="auth-email"
                className="font-sans text-[11px] tracking-[2px] uppercase text-charcoal/60 mb-2 font-medium"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30"
                />
                <input
                  type="email"
                  id="auth-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ali@domain.com"
                  className="bg-white border border-surface rounded-xl pl-11 pr-4 py-3.5 w-full font-sans text-xs text-charcoal focus:border-primary focus:outline-none transition-all outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="auth-pwd"
                  className="font-sans text-[11px] tracking-[2px] uppercase text-charcoal/60 font-medium"
                >
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      alert(
                        "Please contact admin@cortado.com to reset password or check seeding defaults: admin@cortado.com / Admin@123",
                      );
                    }}
                    className="font-sans text-[11px] tracking-[1px] text-primary hover:underline uppercase font-medium cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30"
                />
                <input
                  type="password"
                  id="auth-pwd"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white border border-surface rounded-xl pl-11 pr-4 py-3.5 w-full font-sans text-xs text-charcoal focus:border-primary focus:outline-none transition-all outline-none"
                />
              </div>
            </div>

            {/* Confirm Password (For Register Only) */}
            {!isLogin && (
              <div className="flex flex-col">
                <label
                  htmlFor="auth-confirm"
                  className="font-sans text-[11px] tracking-[2px] uppercase text-charcoal/60 mb-2 font-medium"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30"
                  />
                  <input
                    type="password"
                    id="auth-confirm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white border border-surface rounded-xl pl-11 pr-4 py-3.5 w-full font-sans text-xs text-charcoal focus:border-primary focus:outline-none transition-all outline-none"
                  />
                </div>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-sans text-[11px] tracking-[2px] uppercase py-4 rounded-full font-semibold outline-none focus:ring-2 focus:ring-primary/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-md mt-6 ${
                loading
                  ? "bg-surface text-charcoal/35 cursor-not-allowed border border-surface/30"
                  : "bg-primary text-white cursor-pointer hover:opacity-92"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>Espressing Account...</span>
                </>
              ) : (
                <span>{isLogin ? "Sign In Securely" : "Register Account"}</span>
              )}
            </button>
          </form>

          {/* Split Switcher footer link */}
          <div className="border-t border-surface/80 mt-8 pt-6 text-center text-xs text-charcoal/60">
            {isLogin ? (
              <p className="font-light">
                New to CORTADO?{" "}
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setErr(null);
                  }}
                  className="font-sans tracking-[1px] uppercase text-primary hover:underline font-semibold cursor-pointer"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p className="font-light">
                Already registered?{" "}
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setErr(null);
                  }}
                  className="font-sans tracking-[1px] uppercase text-primary hover:underline font-semibold cursor-pointer"
                >
                  Sign In (admin/user)
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
