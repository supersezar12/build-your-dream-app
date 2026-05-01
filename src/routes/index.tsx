import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useLanguageStore } from "../stores/language-store";
import { useAuthStore } from "../stores/auth-store";
import { getDirection } from "../lib/i18n";
import { IVORY } from "../lib/constants";

import { Header } from "../components/layout/Header";
import { BottomNav } from "../components/layout/BottomNav";
import { Toast } from "../components/layout/Toast";

import { AuthPage } from "../components/auth/AuthPage";
import { DashboardPage } from "../components/dashboard/DashboardPage";
import { AIDoctorPage } from "../components/ai-doctor/AIDoctorPage";
import { SimulatorPage } from "../components/simulator/SimulatorPage";
import { MarketPage } from "../components/market/MarketPage";
import { ProductDetailPage } from "../components/market/ProductDetailPage";
import { SettingsPage } from "../components/settings/SettingsPage";
import { CartPage } from "../components/cart/CartPage";
import { CheckoutPage } from "../components/cart/CheckoutPage";
import { OrdersPage } from "../components/settings/OrdersPage";
import { WishlistPage } from "../components/settings/WishlistPage";
import { SubscriptionPage } from "../components/subscription/SubscriptionPage";
import { AdminDashboard } from "../components/admin/AdminDashboard";
import { NotificationsPanel } from "../components/notifications/NotificationsPanel";
import { EncyclopediaPage } from "../components/encyclopedia/EncyclopediaPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Green — Luxury Living. Intelligent Growing." },
      {
        name: "description",
        content:
          "Smart Green is a luxury hydroponic system for Erbil — AI plant doctor, live sensor dashboard, AR garden simulator, and a curated plant boutique.",
      },
      { name: "theme-color", content: "#006039" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
    ],
  }),
  component: SmartGreenApp,
});

type View =
  | "dashboard"
  | "ai-doctor"
  | "simulate"
  | "market"
  | "encyclopedia"
  | "settings"
  | "product-detail"
  | "cart"
  | "checkout"
  | "orders"
  | "wishlist"
  | "subscription"
  | "admin"
  | "notifications";

function SmartGreenApp() {
  const { lang } = useLanguageStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  const [view, setView] = useState<View>("dashboard");
  const [productId, setProductId] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const dir = getDirection(lang);

  if (!user) {
    return <AuthPage />;
  }

  const mainTabs = ["dashboard", "ai-doctor", "simulate", "market", "encyclopedia", "settings"];
  const activeTab = mainTabs.includes(view) ? view : "market";

  const handleNavigate = (target: string) => {
    if (target === "cart") {
      setView("cart");
    } else if (target === "notifications") {
      setShowNotifications(true);
    } else if (target === "orders") {
      setView("orders");
    } else if (target === "wishlist") {
      setView("wishlist");
    } else if (target === "subscription") {
      setView("subscription");
    } else if (target === "admin") {
      setView("admin");
    } else {
      setView(target as View);
    }
  };

  const handleProductDetail = (id: string) => {
    if (id === "cart") {
      setView("cart");
      return;
    }
    setProductId(id);
    setView("product-detail");
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "0 auto",
        minHeight: "100vh",
        background: IVORY,
        fontFamily: "Inter, sans-serif",
        direction: dir,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        ::-webkit-scrollbar { display: none; }
        * { box-sizing: border-box; }
      `}</style>

      <Toast />

      {showNotifications && (
        <NotificationsPanel onClose={() => setShowNotifications(false)} />
      )}

      {/* Show header for main tabs */}
      {mainTabs.includes(view) && (
        <Header
          onNotificationClick={() => setShowNotifications(true)}
          onSettingsClick={() => setView("settings")}
        />
      )}

      <div style={{ overflowY: "auto", height: mainTabs.includes(view) ? "calc(100vh - 110px)" : "100vh" }}>
        {view === "dashboard" && <DashboardPage onNavigate={handleNavigate} />}
        {view === "ai-doctor" && <AIDoctorPage />}
        {view === "simulate" && <SimulatorPage />}
        {view === "market" && <MarketPage onProductDetail={handleProductDetail} />}
        {view === "encyclopedia" && <EncyclopediaPage />}
        {view === "settings" && <SettingsPage onNavigate={handleNavigate} />}
        {view === "product-detail" && productId && (
          <ProductDetailPage productId={productId} onBack={() => setView("market")} />
        )}
        {view === "cart" && (
          <CartPage onBack={() => setView("market")} onCheckout={() => setView("checkout")} />
        )}
        {view === "checkout" && (
          <CheckoutPage onBack={() => setView("cart")} onComplete={() => setView("dashboard")} />
        )}
        {view === "orders" && <OrdersPage onBack={() => setView("settings")} />}
        {view === "wishlist" && (
          <WishlistPage onBack={() => setView("settings")} onProductDetail={handleProductDetail} />
        )}
        {view === "subscription" && <SubscriptionPage onBack={() => setView("settings")} />}
        {view === "admin" && <AdminDashboard onBack={() => setView("settings")} />}
      </div>

      {mainTabs.includes(view) && (
        <BottomNav active={activeTab} onNavigate={(id) => setView(id as View)} />
      )}
    </div>
  );
}
