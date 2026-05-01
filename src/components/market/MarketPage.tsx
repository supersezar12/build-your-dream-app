import { useState } from "react";
import { ShoppingBag, Search } from "lucide-react";
import { useLanguageStore } from "../../stores/language-store";
import { useCartStore } from "../../stores/cart-store";
import { useNotificationStore } from "../../stores/notification-store";
import { t, getDirection } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, DARK_GREEN, LIGHT_GREEN } from "../../lib/constants";
import { mockProducts } from "../../lib/mock-data";
import { ProductCard } from "./ProductCard";

const categories = [
  { key: "all", labelKey: "allCategories" },
  { key: "plant", labelKey: "plants" },
  { key: "nutrient", labelKey: "nutrientRefills" },
  { key: "kit", labelKey: "kits" },
  { key: "accessory", labelKey: "accessories" },
];

export function MarketPage({ onProductDetail }: { onProductDetail?: (id: string) => void }) {
  const { lang } = useLanguageStore();
  const cartCount = useCartStore((s) => s.count());
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useNotificationStore((s) => s.showToast);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const isRTL = getDirection(lang) === "rtl";

  const filtered = mockProducts.filter((p) => {
    // Kit is shown as dedicated banner — exclude it from the product grid
    if (p.id === "prod-1") return false;
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const kit = mockProducts.find((p) => p.id === "prod-1")!;
  const newArrivals = mockProducts.filter((p) => p.is_new);

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexDirection: isRTL ? "row-reverse" : "row" }}>
        <h2 style={{ fontSize: "24px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: 0 }}>
          {t(lang, "marketTitle")}
        </h2>
        <div
          onClick={() => onProductDetail?.("cart")}
          style={{
            background: ROYAL_GREEN,
            color: "white",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            cursor: "pointer",
          }}
        >
          <ShoppingBag size={18} />
          {cartCount > 0 && (
            <div
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: CHAMPAGNE_GOLD,
                color: "white",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                fontSize: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {cartCount}
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <Search size={16} color="#999" style={{ position: "absolute", left: isRTL ? "auto" : "14px", right: isRTL ? "14px" : "auto", top: "50%", transform: "translateY(-50%)" }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t(lang, "search")}
          style={{
            width: "100%",
            padding: "12px 14px",
            paddingLeft: isRTL ? "14px" : "40px",
            paddingRight: isRTL ? "40px" : "14px",
            background: "white",
            border: `1px solid ${CHAMPAGNE_GOLD}33`,
            borderRadius: "14px",
            fontSize: "13px",
            fontFamily: "Inter, sans-serif",
            outline: "none",
            direction: isRTL ? "rtl" : "ltr",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Categories */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            style={{
              padding: "8px 16px",
              background: activeCategory === cat.key ? ROYAL_GREEN : "white",
              color: activeCategory === cat.key ? "white" : "#666",
              border: `1px solid ${activeCategory === cat.key ? ROYAL_GREEN : CHAMPAGNE_GOLD + "33"}`,
              borderRadius: "20px",
              fontSize: "12px",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontWeight: activeCategory === cat.key ? 600 : 400,
            }}
          >
            {t(lang, cat.labelKey)}
          </button>
        ))}
      </div>

      {/* Kit Banner */}
      {activeCategory === "all" && !searchQuery && (
        <div
          style={{
            background: `linear-gradient(135deg, ${ROYAL_GREEN}, ${DARK_GREEN})`,
            borderRadius: "24px",
            padding: "24px",
            marginBottom: "24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: -20, right: -20, width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <span style={{ background: CHAMPAGNE_GOLD, color: "white", padding: "3px 10px", borderRadius: "10px", fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
            {t(lang, "completeKit")}
          </span>
          <h3 style={{ fontSize: "20px", color: "white", fontFamily: "Playfair Display, serif", margin: "10px 0 4px 0" }}>
            {t(lang, "smartGreenSystem")}
          </h3>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", fontFamily: "Inter, sans-serif", margin: "0 0 16px 0" }}>
            {t(lang, "installation")}
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: isRTL ? "row-reverse" : "row" }}>
            <div>
              <span style={{ fontSize: "26px", fontWeight: 700, color: "white", fontFamily: "Playfair Display, serif" }}>${kit.price}</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginLeft: "6px" }}>/ complete</span>
            </div>
            <button
              onClick={() => {
                addItem(kit);
                showToast("Full kit added to cart!");
              }}
              style={{
                background: "white",
                color: ROYAL_GREEN,
                padding: "10px 18px",
                borderRadius: "14px",
                border: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t(lang, "orderKit")}
            </button>
          </div>
        </div>
      )}

      {/* New Arrivals */}
      {activeCategory === "all" && !searchQuery && newArrivals.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexDirection: isRTL ? "row-reverse" : "row" }}>
            <h3 style={{ fontSize: "18px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: 0 }}>
              {t(lang, "newArrivals")}
            </h3>
            <span style={{ fontSize: "12px", color: CHAMPAGNE_GOLD, fontFamily: "Inter, sans-serif", cursor: "pointer" }}>
              {t(lang, "viewAll")} →
            </span>
          </div>
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "12px", marginBottom: "24px" }}>
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} onDetail={onProductDetail} />
            ))}
          </div>
        </>
      )}

      {/* All Products */}
      <h3 style={{ fontSize: "18px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, marginBottom: "14px", textAlign: isRTL ? "right" : "left" }}>
        {searchQuery ? `"${searchQuery}"` : t(lang, "featured")}
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} onDetail={onProductDetail} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
          <p style={{ color: "#999", fontFamily: "Inter, sans-serif", fontSize: "14px" }}>No products found</p>
        </div>
      )}
    </div>
  );
}
