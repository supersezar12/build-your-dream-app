import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useLanguageStore } from "../../stores/language-store";
import { useCartStore } from "../../stores/cart-store";
import { t, getDirection } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, DARK_GREEN, LIGHT_GREEN, IVORY } from "../../lib/constants";

export function CartPage({ onBack, onCheckout }: { onBack: () => void; onCheckout: () => void }) {
  const { lang } = useLanguageStore();
  const { items, removeItem, updateQuantity, total, count } = useCartStore();
  const isRTL = getDirection(lang) === "rtl";

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexDirection: isRTL ? "row-reverse" : "row" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
          <ArrowLeft size={20} color={ROYAL_GREEN} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
        </button>
        <h2 style={{ fontSize: "24px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: 0 }}>
          {t(lang, "cart")} ({count()})
        </h2>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛒</div>
          <h3 style={{ fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, marginBottom: "8px" }}>
            {t(lang, "emptyCart")}
          </h3>
          <button
            onClick={onBack}
            style={{
              padding: "12px 24px",
              background: ROYAL_GREEN,
              color: "white",
              border: "none",
              borderRadius: "14px",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              cursor: "pointer",
              marginTop: "16px",
            }}
          >
            {t(lang, "continueShopping")}
          </button>
        </div>
      ) : (
        <>
          {items.map((item) => (
            <div
              key={item.product.id}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "14px",
                border: `1px solid ${CHAMPAGNE_GOLD}22`,
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  background: LIGHT_GREEN,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  flexShrink: 0,
                }}
              >
                {item.product.emoji}
              </div>
              <div style={{ flex: 1, textAlign: isRTL ? "right" : "left" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 600, color: ROYAL_GREEN, fontFamily: "Playfair Display, serif", margin: "0 0 4px 0" }}>
                  {item.product.name}
                </h4>
                <span style={{ fontSize: "14px", color: CHAMPAGNE_GOLD, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  ${item.product.price}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", background: IVORY, borderRadius: "10px", overflow: "hidden" }}>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ padding: "6px 10px", background: "none", border: "none", cursor: "pointer" }}>
                    <Minus size={14} color={ROYAL_GREEN} />
                  </button>
                  <span style={{ padding: "6px 8px", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: ROYAL_GREEN }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={{ padding: "6px 10px", background: "none", border: "none", cursor: "pointer" }}>
                    <Plus size={14} color={ROYAL_GREEN} />
                  </button>
                </div>
                <button onClick={() => removeItem(item.product.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px" }}>
                  <Trash2 size={16} color="#ef4444" />
                </button>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: `1px solid ${CHAMPAGNE_GOLD}33`, marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", flexDirection: isRTL ? "row-reverse" : "row" }}>
              <span style={{ fontSize: "13px", color: "#999", fontFamily: "Inter, sans-serif" }}>{t(lang, "subtotal")}</span>
              <span style={{ fontSize: "13px", color: ROYAL_GREEN, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>${total()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", flexDirection: isRTL ? "row-reverse" : "row" }}>
              <span style={{ fontSize: "13px", color: "#999", fontFamily: "Inter, sans-serif" }}>{t(lang, "shipping")}</span>
              <span style={{ fontSize: "13px", color: "#16a34a", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{t(lang, "freeShipping")}</span>
            </div>
            <div style={{ borderTop: `1px solid ${CHAMPAGNE_GOLD}22`, paddingTop: "14px", display: "flex", justifyContent: "space-between", flexDirection: isRTL ? "row-reverse" : "row" }}>
              <span style={{ fontSize: "16px", fontWeight: 700, color: ROYAL_GREEN, fontFamily: "Playfair Display, serif" }}>{t(lang, "total")}</span>
              <span style={{ fontSize: "20px", fontWeight: 700, color: CHAMPAGNE_GOLD, fontFamily: "Playfair Display, serif" }}>${total()}</span>
            </div>
          </div>

          <button
            onClick={onCheckout}
            style={{
              width: "100%",
              padding: "16px",
              background: `linear-gradient(135deg, ${ROYAL_GREEN}, ${DARK_GREEN})`,
              color: "white",
              border: "none",
              borderRadius: "18px",
              fontSize: "15px",
              fontFamily: "Playfair Display, serif",
              cursor: "pointer",
              fontWeight: 600,
              marginTop: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <ShoppingBag size={18} />
            {t(lang, "checkout")}
          </button>
        </>
      )}
    </div>
  );
}
