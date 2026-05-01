import { ArrowLeft, Heart } from "lucide-react";
import { useLanguageStore } from "../../stores/language-store";
import { useWishlistStore } from "../../stores/wishlist-store";
import { t, getDirection } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD } from "../../lib/constants";
import { mockProducts } from "../../lib/mock-data";
import { ProductCard } from "../market/ProductCard";

export function WishlistPage({ onBack, onProductDetail }: { onBack: () => void; onProductDetail?: (id: string) => void }) {
  const { lang } = useLanguageStore();
  const { ids } = useWishlistStore();
  const isRTL = getDirection(lang) === "rtl";

  const wishedProducts = mockProducts.filter((p) => ids.includes(p.id));

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexDirection: isRTL ? "row-reverse" : "row" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
          <ArrowLeft size={20} color={ROYAL_GREEN} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
        </button>
        <h2 style={{ fontSize: "24px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: 0 }}>
          {t(lang, "wishlist")}
        </h2>
      </div>

      {wishedProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Heart size={48} color="#ccc" />
          <p style={{ color: "#999", fontFamily: "Inter, sans-serif", marginTop: "16px" }}>
            No items in your wishlist yet
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {wishedProducts.map((p) => (
            <ProductCard key={p.id} product={p} onDetail={onProductDetail} />
          ))}
        </div>
      )}
    </div>
  );
}
