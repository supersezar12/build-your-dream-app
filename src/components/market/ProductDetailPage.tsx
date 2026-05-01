import { useState } from "react";
import { ArrowLeft, Heart, Star, ShoppingBag, ChevronRight, ThumbsUp } from "lucide-react";
import { useLanguageStore } from "../../stores/language-store";
import { useCartStore } from "../../stores/cart-store";
import { useWishlistStore } from "../../stores/wishlist-store";
import { useNotificationStore } from "../../stores/notification-store";
import { t, getDirection } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, DARK_GREEN, LIGHT_GREEN, IVORY } from "../../lib/constants";
import { mockProducts, mockReviews } from "../../lib/mock-data";
import type { Product } from "../../lib/types";

export function ProductDetailPage({ productId, onBack }: { productId: string; onBack: () => void }) {
  const { lang } = useLanguageStore();
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useNotificationStore((s) => s.showToast);
  const { toggle, has } = useWishlistStore();
  const [qty, setQty] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const isRTL = getDirection(lang) === "rtl";

  const product = mockProducts.find((p) => p.id === productId);
  if (!product) return <div style={{ padding: "40px", textAlign: "center" }}>Product not found</div>;

  const reviews = mockReviews[productId] ?? [];
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const isWished = has(product.id);

  return (
    <div style={{ paddingBottom: "100px" }}>
      {/* Hero */}
      <div style={{ height: "240px", background: `linear-gradient(135deg, ${LIGHT_GREEN}, ${ROYAL_GREEN}22)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ fontSize: "80px" }}>{product.emoji}</div>
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: "16px",
            left: isRTL ? "auto" : "16px",
            right: isRTL ? "16px" : "auto",
            background: "white",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <ArrowLeft size={18} color={ROYAL_GREEN} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
        </button>
        <button
          onClick={() => toggle(product.id)}
          style={{
            position: "absolute",
            top: "16px",
            right: isRTL ? "auto" : "16px",
            left: isRTL ? "16px" : "auto",
            background: "white",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Heart size={18} color={isWished ? "#ef4444" : "#ccc"} fill={isWished ? "#ef4444" : "none"} />
        </button>
        {product.is_new && (
          <span style={{ position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)", background: CHAMPAGNE_GOLD, color: "white", padding: "4px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: 600 }}>
            NEW
          </span>
        )}
      </div>

      <div style={{ padding: "20px" }}>
        {/* Info */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexDirection: isRTL ? "row-reverse" : "row" }}>
            <h1 style={{ fontSize: "24px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: 0 }}>
              {product.name}
            </h1>
            <span style={{ fontSize: "24px", fontWeight: 700, color: CHAMPAGNE_GOLD, fontFamily: "Playfair Display, serif" }}>
              ${product.price}
            </span>
          </div>
          {reviews.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} color={CHAMPAGNE_GOLD} fill={s <= avgRating ? CHAMPAGNE_GOLD : "none"} />
              ))}
              <span style={{ fontSize: "12px", color: "#999", fontFamily: "Inter, sans-serif" }}>
                ({reviews.length} {t(lang, "reviews")})
              </span>
            </div>
          )}
          <p style={{ fontSize: "14px", color: "#666", fontFamily: "Inter, sans-serif", lineHeight: "1.7", marginTop: "12px" }}>
            {product.description}
          </p>
          <div style={{ marginTop: "8px" }}>
            <span style={{ fontSize: "12px", color: product.stock > 0 ? "#16a34a" : "#ef4444", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
              {product.stock > 0 ? `✓ ${t(lang, "inStock")} (${product.stock})` : `✗ ${t(lang, "outOfStock")}`}
            </span>
          </div>
        </div>

        {/* Quantity & Add to Cart */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0", background: "white", borderRadius: "14px", border: `1px solid ${CHAMPAGNE_GOLD}33`, overflow: "hidden" }}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: "12px 16px", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: ROYAL_GREEN }}>−</button>
            <span style={{ padding: "12px 16px", fontFamily: "Inter, sans-serif", fontWeight: 600, color: ROYAL_GREEN, minWidth: "40px", textAlign: "center" }}>{qty}</span>
            <button onClick={() => setQty(qty + 1)} style={{ padding: "12px 16px", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: ROYAL_GREEN }}>+</button>
          </div>
          <button
            onClick={() => {
              addItem(product, qty);
              showToast(`${product.name} added to cart!`);
            }}
            style={{
              flex: 1,
              padding: "14px",
              background: `linear-gradient(135deg, ${ROYAL_GREEN}, ${DARK_GREEN})`,
              color: "white",
              border: "none",
              borderRadius: "14px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <ShoppingBag size={16} />
            {t(lang, "addToCart")}
          </button>
        </div>

        {/* Care Instructions */}
        {product.care_instructions && (
          <div style={{ background: LIGHT_GREEN, borderRadius: "16px", padding: "16px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "14px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: "0 0 8px 0" }}>
              {t(lang, "careInstructions")}
            </h3>
            <p style={{ fontSize: "13px", color: "#444", fontFamily: "Inter, sans-serif", margin: 0, lineHeight: "1.6" }}>
              {product.care_instructions}
            </p>
          </div>
        )}

        {/* Reviews */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "18px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: 0 }}>
              {t(lang, "reviews")} ({reviews.length})
            </h3>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              style={{
                padding: "8px 16px",
                background: "white",
                border: `1px solid ${CHAMPAGNE_GOLD}44`,
                borderRadius: "10px",
                fontSize: "12px",
                fontFamily: "Inter, sans-serif",
                color: ROYAL_GREEN,
                cursor: "pointer",
              }}
            >
              {t(lang, "writeReview")}
            </button>
          </div>

          {showReviewForm && (
            <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: `1px solid ${CHAMPAGNE_GOLD}33`, marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setReviewRating(s)} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
                    <Star size={20} color={CHAMPAGNE_GOLD} fill={s <= reviewRating ? CHAMPAGNE_GOLD : "none"} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `1px solid ${CHAMPAGNE_GOLD}33`,
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontFamily: "Inter, sans-serif",
                  resize: "vertical",
                  minHeight: "80px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={() => {
                  showToast("Review submitted!");
                  setShowReviewForm(false);
                  setReviewText("");
                }}
                style={{
                  marginTop: "12px",
                  padding: "10px 20px",
                  background: ROYAL_GREEN,
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </div>
          )}

          {reviews.map((review) => (
            <div key={review.id} style={{ background: "white", borderRadius: "16px", padding: "16px", border: `1px solid ${CHAMPAGNE_GOLD}22`, marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: ROYAL_GREEN, fontFamily: "Inter, sans-serif" }}>{review.user_name}</span>
                  <div style={{ display: "flex", gap: "2px", marginTop: "4px" }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={10} color={CHAMPAGNE_GOLD} fill={s <= review.rating ? CHAMPAGNE_GOLD : "none"} />
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: "11px", color: "#999", fontFamily: "Inter, sans-serif" }}>{review.created_at}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#555", fontFamily: "Inter, sans-serif", lineHeight: "1.6", margin: "0 0 8px 0" }}>
                {review.comment}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <ThumbsUp size={12} color="#999" />
                <span style={{ fontSize: "11px", color: "#999", fontFamily: "Inter, sans-serif" }}>
                  {review.helpful_count} {t(lang, "helpfulVotes")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
