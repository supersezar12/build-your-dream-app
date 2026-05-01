import { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { useLanguageStore } from "../../stores/language-store";
import { useCartStore } from "../../stores/cart-store";
import { useWishlistStore } from "../../stores/wishlist-store";
import { useNotificationStore } from "../../stores/notification-store";
import { t } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, LIGHT_GREEN, IVORY } from "../../lib/constants";
import type { Product } from "../../lib/types";

export function ProductCard({ product, onDetail }: { product: Product; onDetail?: (id: string) => void }) {
  const { lang } = useLanguageStore();
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useNotificationStore((s) => s.showToast);
  const { toggle, has } = useWishlistStore();
  const isWished = has(product.id);
  const [qty, setQty] = useState(1);

  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        overflow: "hidden",
        border: `1px solid ${CHAMPAGNE_GOLD}33`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      {/* Image area */}
      <div
        onClick={() => onDetail?.(product.id)}
        style={{
          height: "110px",
          background: `linear-gradient(135deg, ${LIGHT_GREEN}, ${ROYAL_GREEN}22)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "44px",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {product.emoji}
        <button
          onClick={(e) => { e.stopPropagation(); toggle(product.id); }}
          style={{
            position: "absolute", top: "8px", right: "8px",
            background: "white", border: "none", borderRadius: "50%",
            width: "28px", height: "28px", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Heart size={14} color={isWished ? "#ef4444" : "#ccc"} fill={isWished ? "#ef4444" : "none"} />
        </button>
        {product.is_new && (
          <span style={{
            position: "absolute", top: "8px", left: "8px",
            background: CHAMPAGNE_GOLD, color: "white",
            fontSize: "9px", padding: "2px 6px", borderRadius: "10px",
            fontFamily: "Inter, sans-serif",
          }}>
            NEW
          </span>
        )}
      </div>

      <div style={{ padding: "10px 12px 12px" }}>
        <h4
          onClick={() => onDetail?.(product.id)}
          style={{ fontSize: "13px", fontWeight: 600, color: ROYAL_GREEN, fontFamily: "Playfair Display, serif", margin: "0 0 4px 0", cursor: "pointer" }}
        >
          {product.name}
        </h4>
        <p style={{ fontSize: "13px", color: CHAMPAGNE_GOLD, fontFamily: "Inter, sans-serif", margin: "0 0 10px 0", fontWeight: 700 }}>
          ${product.price}
        </p>

        {/* Quantity selector + Add to Cart */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {/* +/- qty */}
          <div style={{
            display: "flex", alignItems: "center",
            background: IVORY, borderRadius: "10px", overflow: "hidden",
            border: `1px solid ${CHAMPAGNE_GOLD}22`,
          }}>
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              style={{ padding: "6px 8px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <Minus size={11} color={ROYAL_GREEN} />
            </button>
            <span style={{ padding: "6px 6px", fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 700, color: ROYAL_GREEN, minWidth: "16px", textAlign: "center" }}>
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              style={{ padding: "6px 8px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <Plus size={11} color={ROYAL_GREEN} />
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => {
              addItem(product, qty);
              showToast(`${product.name} ×${qty} added!`);
              setQty(1);
            }}
            style={{
              flex: 1, padding: "8px 6px",
              background: ROYAL_GREEN, color: "white",
              border: "none", borderRadius: "10px",
              fontSize: "11px", fontFamily: "Inter, sans-serif",
              cursor: "pointer", fontWeight: 600,
            }}
          >
            {t(lang, "addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
}
