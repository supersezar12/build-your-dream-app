import { useState } from "react";
import {
  ArrowLeft, Package, BarChart3, Settings, Bell,
  TrendingUp, DollarSign, ShoppingCart, AlertTriangle,
  ChevronDown, Edit2, Eye,
} from "lucide-react";
import { useLanguageStore } from "../../stores/language-store";
import { useNotificationStore } from "../../stores/notification-store";
import { t, getDirection } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, DARK_GREEN, LIGHT_GREEN, IVORY } from "../../lib/constants";
import { mockOrders, mockProducts, mockNotifications } from "../../lib/mock-data";

type AdminTab = "overview" | "orders" | "inventory" | "analytics" | "settings";

const statusColors: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  processing: "#8b5cf6",
  shipped: "#06b6d4",
  delivered: "#16a34a",
  cancelled: "#ef4444",
};

export function AdminDashboard({ onBack }: { onBack: () => void }) {
  const { lang } = useLanguageStore();
  const showToast = useNotificationStore((s) => s.showToast);
  const [tab, setTab] = useState<AdminTab>("overview");
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [notifSettings, setNotifSettings] = useState({
    order_alerts: true,
    low_stock_alerts: true,
    low_stock_threshold: 10,
    sound_enabled: true,
    quiet_hours_start: "22:00",
    quiet_hours_end: "08:00",
  });
  const isRTL = getDirection(lang) === "rtl";

  const totalRevenue = mockOrders.reduce((s, o) => s + o.total, 0);
  const lowStockProducts = mockProducts.filter((p) => p.stock < 20);

  const tabs: { id: AdminTab; icon: React.ComponentType<any>; labelKey: string }[] = [
    { id: "overview", icon: BarChart3, labelKey: "admin" },
    { id: "orders", icon: Package, labelKey: "adminOrders" },
    { id: "inventory", icon: ShoppingCart, labelKey: "adminInventory" },
    { id: "analytics", icon: TrendingUp, labelKey: "adminAnalytics" },
    { id: "settings", icon: Settings, labelKey: "adminSettings" },
  ];

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexDirection: isRTL ? "row-reverse" : "row" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
          <ArrowLeft size={20} color={ROYAL_GREEN} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
        </button>
        <h2 style={{ fontSize: "24px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: 0 }}>
          {t(lang, "admin")}
        </h2>
      </div>

      {/* Admin Tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            style={{
              padding: "8px 14px",
              background: tab === tb.id ? ROYAL_GREEN : "white",
              color: tab === tb.id ? "white" : "#666",
              border: `1px solid ${tab === tb.id ? ROYAL_GREEN : CHAMPAGNE_GOLD + "33"}`,
              borderRadius: "12px",
              fontSize: "11px",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: tab === tb.id ? 600 : 400,
            }}
          >
            <tb.icon size={14} />
            {t(lang, tb.labelKey)}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
            {[
              { label: t(lang, "revenue"), value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "#16a34a" },
              { label: t(lang, "totalOrders"), value: mockOrders.length.toString(), icon: Package, color: "#3b82f6" },
              { label: t(lang, "totalPlants"), value: mockProducts.length.toString(), icon: ShoppingCart, color: CHAMPAGNE_GOLD },
              { label: t(lang, "lowStock"), value: lowStockProducts.length.toString(), icon: AlertTriangle, color: "#ef4444" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "16px",
                  border: `1px solid ${CHAMPAGNE_GOLD}22`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <stat.icon size={16} color={stat.color} />
                  </div>
                </div>
                <p style={{ fontSize: "20px", fontWeight: 700, color: ROYAL_GREEN, fontFamily: "Playfair Display, serif", margin: "0 0 2px 0" }}>{stat.value}</p>
                <p style={{ fontSize: "11px", color: "#999", fontFamily: "Inter, sans-serif", margin: 0 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Notifications */}
          <h3 style={{ fontSize: "16px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, marginBottom: "12px" }}>
            {t(lang, "notificationCenter")}
          </h3>
          {mockNotifications.slice(0, 3).map((n) => (
            <div key={n.id} style={{ background: "white", borderRadius: "12px", padding: "12px", border: `1px solid ${CHAMPAGNE_GOLD}22`, marginBottom: "8px" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: ROYAL_GREEN, fontFamily: "Inter, sans-serif", margin: "0 0 4px 0" }}>{n.title}</p>
              <p style={{ fontSize: "12px", color: "#666", fontFamily: "Inter, sans-serif", margin: 0 }}>{n.message}</p>
            </div>
          ))}
        </>
      )}

      {/* Orders */}
      {tab === "orders" && (
        <>
          <h3 style={{ fontSize: "16px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, marginBottom: "12px" }}>
            {t(lang, "adminOrders")} ({mockOrders.length})
          </h3>
          {mockOrders.map((order) => (
            <div key={order.id} style={{ background: "white", borderRadius: "16px", padding: "16px", border: `1px solid ${CHAMPAGNE_GOLD}22`, marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: ROYAL_GREEN, fontFamily: "Inter, sans-serif", margin: 0 }}>#{order.id.toUpperCase()}</p>
                  <p style={{ fontSize: "10px", color: "#999", fontFamily: "Inter, sans-serif", margin: 0 }}>{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ background: `${statusColors[order.status]}15`, color: statusColors[order.status], padding: "4px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: 600, textTransform: "capitalize" }}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => setEditingOrder(editingOrder === order.id ? null : order.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                  >
                    <Edit2 size={14} color={CHAMPAGNE_GOLD} />
                  </button>
                </div>
              </div>
              {order.items.map((item) => (
                <p key={item.id} style={{ fontSize: "12px", color: "#666", fontFamily: "Inter, sans-serif", margin: "2px 0" }}>
                  {item.product_name} × {item.quantity} — ${item.price * item.quantity}
                </p>
              ))}
              <p style={{ fontSize: "14px", fontWeight: 700, color: CHAMPAGNE_GOLD, fontFamily: "Playfair Display, serif", margin: "8px 0 0 0" }}>
                ${order.total}
              </p>
              {editingOrder === order.id && (
                <div style={{ marginTop: "12px", padding: "12px", background: IVORY, borderRadius: "12px" }}>
                  <p style={{ fontSize: "11px", color: "#999", margin: "0 0 8px 0", fontFamily: "Inter, sans-serif" }}>{t(lang, "updateStatus")}</p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          showToast(`Order ${order.id} updated to ${s}`);
                          setEditingOrder(null);
                        }}
                        style={{
                          padding: "6px 10px",
                          background: order.status === s ? statusColors[s] : "white",
                          color: order.status === s ? "white" : statusColors[s],
                          border: `1px solid ${statusColors[s]}44`,
                          borderRadius: "8px",
                          fontSize: "10px",
                          cursor: "pointer",
                          textTransform: "capitalize",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* Inventory */}
      {tab === "inventory" && (
        <>
          <h3 style={{ fontSize: "16px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, marginBottom: "12px" }}>
            {t(lang, "adminInventory")}
          </h3>
          {lowStockProducts.length > 0 && (
            <div style={{ background: "#fef3c7", borderRadius: "14px", padding: "12px 16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertTriangle size={16} color="#f59e0b" />
              <span style={{ fontSize: "12px", color: "#92400e", fontFamily: "Inter, sans-serif" }}>
                {lowStockProducts.length} products with low stock
              </span>
            </div>
          )}
          {mockProducts.map((product) => (
            <div
              key={product.id}
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "14px",
                border: `1px solid ${product.stock < 20 ? "#f59e0b33" : CHAMPAGNE_GOLD + "22"}`,
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>{product.emoji}</span>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: ROYAL_GREEN, fontFamily: "Inter, sans-serif", margin: 0 }}>{product.name}</p>
                  <p style={{ fontSize: "11px", color: "#999", fontFamily: "Inter, sans-serif", margin: 0, textTransform: "capitalize" }}>{product.category}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: product.stock < 20 ? "#f59e0b" : ROYAL_GREEN, fontFamily: "Inter, sans-serif", margin: 0 }}>
                  {product.stock}
                </p>
                <p style={{ fontSize: "10px", color: "#999", fontFamily: "Inter, sans-serif", margin: 0 }}>in stock</p>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Analytics */}
      {tab === "analytics" && (
        <>
          <h3 style={{ fontSize: "16px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, marginBottom: "16px" }}>
            {t(lang, "adminAnalytics")}
          </h3>

          {/* Revenue Chart (simplified bars) */}
          <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: `1px solid ${CHAMPAGNE_GOLD}33`, marginBottom: "20px" }}>
            <h4 style={{ fontSize: "14px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: "0 0 16px 0" }}>{t(lang, "revenue")}</h4>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "100px" }}>
              {[450, 820, 1299, 680, 920, 1100, 1382].map((val, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: i === 6 ? CHAMPAGNE_GOLD : `${CHAMPAGNE_GOLD}44`,
                    borderRadius: "6px 6px 0 0",
                    height: `${(val / 1400) * 100}%`,
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d} style={{ fontSize: "10px", color: "#ccc", fontFamily: "Inter, sans-serif", flex: 1, textAlign: "center" }}>{d}</span>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: `1px solid ${CHAMPAGNE_GOLD}33`, marginBottom: "20px" }}>
            <h4 style={{ fontSize: "14px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: "0 0 16px 0" }}>{t(lang, "topProducts")}</h4>
            {mockProducts.slice(0, 5).map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: i < 4 ? `1px solid ${IVORY}` : "none" }}>
                <span style={{ fontSize: "12px", color: "#999", fontFamily: "Inter, sans-serif", width: "16px" }}>#{i + 1}</span>
                <span style={{ fontSize: "18px" }}>{p.emoji}</span>
                <span style={{ flex: 1, fontSize: "13px", color: ROYAL_GREEN, fontFamily: "Inter, sans-serif" }}>{p.name}</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: CHAMPAGNE_GOLD, fontFamily: "Inter, sans-serif" }}>${p.price}</span>
              </div>
            ))}
          </div>

          {/* Category Distribution */}
          <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: `1px solid ${CHAMPAGNE_GOLD}33` }}>
            <h4 style={{ fontSize: "14px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: "0 0 16px 0" }}>Category Distribution</h4>
            {["plant", "nutrient", "kit", "accessory"].map((cat) => {
              const count = mockProducts.filter((p) => p.category === cat).length;
              const pct = Math.round((count / mockProducts.length) * 100);
              return (
                <div key={cat} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "12px", color: "#666", fontFamily: "Inter, sans-serif", textTransform: "capitalize" }}>{cat}</span>
                    <span style={{ fontSize: "12px", color: ROYAL_GREEN, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{pct}%</span>
                  </div>
                  <div style={{ height: "6px", background: IVORY, borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: ROYAL_GREEN, borderRadius: "3px" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Admin Settings */}
      {tab === "settings" && (
        <>
          <h3 style={{ fontSize: "16px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, marginBottom: "16px" }}>
            {t(lang, "adminSettings")}
          </h3>

          <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: `1px solid ${CHAMPAGNE_GOLD}33`, marginBottom: "16px" }}>
            <h4 style={{ fontSize: "14px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: "0 0 16px 0" }}>
              {t(lang, "notificationPrefs")}
            </h4>

            {[
              { key: "order_alerts", label: t(lang, "orderUpdates") },
              { key: "low_stock_alerts", label: t(lang, "lowStock") },
              { key: "sound_enabled", label: t(lang, "soundSettings") },
            ].map((item) => (
              <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${IVORY}` }}>
                <span style={{ fontSize: "13px", color: "#555", fontFamily: "Inter, sans-serif" }}>{item.label}</span>
                <button
                  onClick={() => setNotifSettings((s) => ({ ...s, [item.key]: !s[item.key as keyof typeof s] }))}
                  style={{
                    width: "44px",
                    height: "24px",
                    borderRadius: "12px",
                    background: (notifSettings as any)[item.key] ? ROYAL_GREEN : "#ddd",
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.2s",
                  }}
                >
                  <div style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "white",
                    position: "absolute",
                    top: "2px",
                    left: (notifSettings as any)[item.key] ? "22px" : "2px",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }} />
                </button>
              </div>
            ))}

            <div style={{ marginTop: "16px" }}>
              <label style={{ fontSize: "13px", color: "#555", fontFamily: "Inter, sans-serif", display: "block", marginBottom: "8px" }}>
                {t(lang, "stockThreshold")}: {notifSettings.low_stock_threshold}
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={notifSettings.low_stock_threshold}
                onChange={(e) => setNotifSettings((s) => ({ ...s, low_stock_threshold: Number(e.target.value) }))}
                style={{ width: "100%", accentColor: ROYAL_GREEN }}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={{ fontSize: "13px", color: "#555", fontFamily: "Inter, sans-serif", display: "block", marginBottom: "8px" }}>
                {t(lang, "quietHours")}
              </label>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <input
                  type="time"
                  value={notifSettings.quiet_hours_start}
                  onChange={(e) => setNotifSettings((s) => ({ ...s, quiet_hours_start: e.target.value }))}
                  style={{ padding: "8px", border: `1px solid ${CHAMPAGNE_GOLD}33`, borderRadius: "10px", fontSize: "12px", fontFamily: "Inter, sans-serif" }}
                />
                <span style={{ color: "#999", fontSize: "12px" }}>→</span>
                <input
                  type="time"
                  value={notifSettings.quiet_hours_end}
                  onChange={(e) => setNotifSettings((s) => ({ ...s, quiet_hours_end: e.target.value }))}
                  style={{ padding: "8px", border: `1px solid ${CHAMPAGNE_GOLD}33`, borderRadius: "10px", fontSize: "12px", fontFamily: "Inter, sans-serif" }}
                />
              </div>
            </div>
          </div>

          {/* Notification Templates */}
          <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: `1px solid ${CHAMPAGNE_GOLD}33` }}>
            <h4 style={{ fontSize: "14px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: "0 0 16px 0" }}>
              {t(lang, "templates")}
            </h4>
            {[
              { name: "Order Confirmation", preview: "Your order #{orderId} has been confirmed!" },
              { name: "Shipping Update", preview: "Your order #{orderId} has been shipped." },
              { name: "Low Stock Alert", preview: "{productName} is running low ({stock} remaining)." },
            ].map((tmpl) => (
              <div key={tmpl.name} style={{ padding: "12px 0", borderBottom: `1px solid ${IVORY}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: ROYAL_GREEN, fontFamily: "Inter, sans-serif" }}>{tmpl.name}</span>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Edit2 size={12} color={CHAMPAGNE_GOLD} />
                    <span style={{ fontSize: "11px", color: CHAMPAGNE_GOLD, fontFamily: "Inter, sans-serif" }}>{t(lang, "editTemplate")}</span>
                  </button>
                </div>
                <p style={{ fontSize: "12px", color: "#999", fontFamily: "Inter, sans-serif", margin: 0, fontStyle: "italic" }}>
                  {tmpl.preview}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
