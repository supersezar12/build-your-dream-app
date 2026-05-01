import { ArrowLeft, Package } from "lucide-react";
import { useLanguageStore } from "../../stores/language-store";
import { t, getDirection } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, LIGHT_GREEN } from "../../lib/constants";
import { mockOrders } from "../../lib/mock-data";

const statusColors: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  processing: "#8b5cf6",
  shipped: "#06b6d4",
  delivered: "#16a34a",
  cancelled: "#ef4444",
};

export function OrdersPage({ onBack }: { onBack: () => void }) {
  const { lang } = useLanguageStore();
  const isRTL = getDirection(lang) === "rtl";
  const userOrders = mockOrders.filter((o) => o.user_id === "user-1");

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexDirection: isRTL ? "row-reverse" : "row" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
          <ArrowLeft size={20} color={ROYAL_GREEN} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
        </button>
        <h2 style={{ fontSize: "24px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: 0 }}>
          {t(lang, "myOrders")}
        </h2>
      </div>

      {userOrders.map((order) => (
        <div
          key={order.id}
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "18px",
            border: `1px solid ${CHAMPAGNE_GOLD}22`,
            marginBottom: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexDirection: isRTL ? "row-reverse" : "row" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#999", fontFamily: "Inter, sans-serif", margin: "0 0 2px 0" }}>
                #{order.id.toUpperCase()}
              </p>
              <p style={{ fontSize: "10px", color: "#ccc", fontFamily: "Inter, sans-serif", margin: 0 }}>
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <span
              style={{
                background: `${statusColors[order.status]}15`,
                color: statusColors[order.status],
                padding: "4px 12px",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
                textTransform: "capitalize",
              }}
            >
              {t(lang, order.status)}
            </span>
          </div>

          {order.items.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", flexDirection: isRTL ? "row-reverse" : "row" }}>
              <span style={{ fontSize: "13px", color: "#555", fontFamily: "Inter, sans-serif" }}>
                {item.product_name} × {item.quantity}
              </span>
              <span style={{ fontSize: "13px", color: ROYAL_GREEN, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                ${item.price * item.quantity}
              </span>
            </div>
          ))}

          <div style={{ borderTop: `1px solid ${CHAMPAGNE_GOLD}22`, marginTop: "10px", paddingTop: "10px", display: "flex", justifyContent: "space-between", flexDirection: isRTL ? "row-reverse" : "row" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: ROYAL_GREEN, fontFamily: "Playfair Display, serif" }}>{t(lang, "total")}</span>
            <span style={{ fontSize: "16px", fontWeight: 700, color: CHAMPAGNE_GOLD, fontFamily: "Playfair Display, serif" }}>${order.total}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
