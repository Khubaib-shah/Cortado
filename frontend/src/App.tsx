import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/ui/Toast";

import HomeView from "./views/HomeView";
import AboutView from "./views/AboutView";
import MenuView from "./views/MenuView";
import ProductDetailView from "./views/ProductDetailView";
import CheckoutView from "./views/CheckoutView";
import SuccessView from "./views/SuccessView";
import TrackView from "./views/TrackView";
import AuthView from "./views/AuthView";
import AdminView from "./views/AdminView";

import { useToast } from "./hooks/useToast";
import { Product, User } from "./types";
import { authApi, productsApi } from "./lib/api";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("home");
  const [viewParams, setViewParams] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingApp, setLoadingApp] = useState(true);
  const toast = useToast();

  useEffect(() => {
    bootstrapSessionData();
  }, []);

  const bootstrapSessionData = async () => {
    try {
      const [userRes, prodRes] = await Promise.allSettled([
        authApi.me(),
        productsApi.getAll(),
      ]);
      if (userRes.status === "fulfilled") {
        setCurrentUser(userRes.value.user);
        console.log(userRes.value);
      }
      if (prodRes.status === "fulfilled") {
        setProducts(prodRes.value);
      }
    } catch (err) {
      console.error("Bootstrap failed:", err);
    } finally {
      setLoadingApp(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setCurrentUser(null);
      setCurrentView("home");
      toast.show("Logged out successfully.");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const refreshProducts = async () => {
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (err) {
      console.error("Product refresh failed:", err);
    }
  };

  const handleNavigate = (view: string, params: any = null) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (view === "home" || view === "menu") refreshProducts();
  };

  const renderActiveView = () => {
    switch (currentView) {
      case "home":
        return <HomeView products={products} onNavigate={handleNavigate} onAddedFeedback={() => toast.show("Added to cart!")} />;
      case "about":
        return <AboutView />;
      case "menu":
        return <MenuView products={products} onNavigate={handleNavigate} onAddedFeedback={() => toast.show("Added to cart!")} />;
      case "product-detail":
        return <ProductDetailView productId={viewParams?.id || ""} allProducts={products} onNavigate={handleNavigate} onAddedFeedback={() => toast.show("Added to cart!")} />;
      case "checkout":
        return <CheckoutView currentUser={currentUser} onNavigate={handleNavigate} />;
      case "order-success":
        return <SuccessView order={viewParams?.order || null} onNavigate={handleNavigate} />;
      case "track":
        return <TrackView initialOrderId={viewParams?.orderId || ""} />;
      case "auth":
        return <AuthView onSuccess={(user) => { setCurrentUser(user); toast.show(`Welcome, ${user.name}!`); }} onNavigate={handleNavigate} />;
      case "admin":
        return <AdminView currentUser={currentUser} onLogout={handleLogout} onNavigate={handleNavigate} />;
      default:
        return <HomeView products={products} onNavigate={handleNavigate} onAddedFeedback={() => toast.show("Added to cart!")} />;
    }
  };

  if (loadingApp) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary/25 border-t-primary animate-spin mb-6" />
          <h2 className="font-serif italic text-lg text-charcoal/60">Brewing your experience...</h2>
          <span className="font-sans text-[10px] tracking-[3px] uppercase text-charcoal/30 font-medium mt-3 block select-none">CORTADO SPECIALTY COFFEE</span>
        </div>
      </div>
    );
  }

  const isAdminView = currentView === "admin";
  const isAuthView = currentView === "auth";

  return (
    <div className="bg-cream min-h-screen flex flex-col relative font-sans text-charcoal overflow-hidden antialiased">
      {!isAdminView && !isAuthView && (
        <Navbar currentView={currentView} onNavigate={handleNavigate} currentUser={currentUser} onLogout={handleLogout} />
      )}

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isAdminView && !isAuthView && <CartDrawer onNavigate={handleNavigate} />}
      <Toast message={toast.message} />
      {!isAdminView && !isAuthView && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}
