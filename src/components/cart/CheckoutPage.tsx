import { useState } from "react";
import { ArrowLeft, CreditCard, MapPin, Check } from "lucide-react";
import { useLanguageStore } from "../../stores/language-store";
import { useCartStore } from "../../stores/cart-store";
import { useNotificationStore } from "../../stores/notification-store";
import { t, getDirection } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, DARK_GREEN, LIGHT_GREEN, IVORY } from "../../lib/constants";

export function CheckoutPage({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const { lang } = useLanguageStore();
  const { items, total, clearCart } = useCartStore();
  const showToast = useNotificationStore((s) => s.showToast);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const isRTL = getDirection(lang) === "rtl";

  const [step, setStep] = useState<"address" | "payment" | "confirmed">("address");
  const [address, setAddress] = useState({ street: "", city: "Erbil", country: "Iraq", phone: "" });
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [processing, setProcessing] = useState(false);

  const inputStyle = {
    width: "100%",
    padding: "14px",
    background: "white",
    border: `1px solid ${CHAMPAGNE_GOLD}33`,
    borderRadius: "14px",
    fontSize: "13px",
    fontFamily: "Inter, sans-serif",
    outline: "none",
    marginBottom: "12px",
    direction: isRTL ? "rtl" as const : "ltr" as const,
    boxSizing: "border-box" as const,
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);
    setStep("confirmed");
    clearCart();
    addNotification({
      user_id: "user-1",
      type: "order",
      title: "Order Confirmed",
      message: `Your order for $${total()} has been placed successfully!`,
    });
    showToast("Order placed successfully!");
  };

  if (step === "confirmed") {
    return (
      <div style={{ padding: "20px", paddingBottom: "100px", textAlign: "center" }}>
        <div style={{ padding: "60px 20px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: LIGHT_GREEN, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Check size={40} color={ROYAL_GREEN} />
          </div>
          <h2 style={{ fontSize: "24px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, marginBottom: "8px" }}>
            {t(lang, "orderConfirmed")}
          </h2>
          <p style={{ fontSize: "14px", color: "#999", fontFamily: "Inter, sans-serif", marginBottom: "24px" }}>
            {t(lang, "orderConfirmedSub")}
          </p>
          <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: `1px solid ${CHAMPAGNE_GOLD}33`, marginBottom: "20px" }}>
            <p style={{ fontSize: "12px", color: "#999", fontFamily: "Inter, sans-serif", margin: "0 0 4px 0" }}>Order #SGO-{Date.now().toString().slice(-6)}</p>
            <p style={{ fontSize: "20px", fontWeight: 700, color: CHAMPAGNE_GOLD, fontFamily: "Playfair Display, serif", margin: 0 }}>${total()}</p>
          </div>
          <button
            onClick={onComplete}
            style={{
              padding: "14px 32px",
              background: `linear-gradient(135deg, ${ROYAL_GREEN}, ${DARK_GREEN})`,
              color: "white",
              border: "none",
              borderRadius: "16px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t(lang, "continueShopping")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexDirection: isRTL ? "row-reverse" : "row" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
          <ArrowLeft size={20} color={ROYAL_GREEN} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
        </button>
        <h2 style={{ fontSize: "24px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: 0 }}>
          {t(lang, "checkout")}
        </h2>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {["address", "payment"].map((s, i) => (
          <div key={s} style={{ flex: 1, height: "4px", borderRadius: "2px", background: (step === "address" && i === 0) || step === "payment" ? ROYAL_GREEN : `${ROYAL_GREEN}33` }} />
        ))}
      </div>

      {step === "address" && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", flexDirection: isRTL ? "row-reverse" : "row" }}>
            <MapPin size={18} color={ROYAL_GREEN} />
            <h3 style={{ fontSize: "16px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: 0 }}>
              {t(lang, "address")}
            </h3>
          </div>
          <input style={inputStyle} placeholder={t(lang, "street")} value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
          <div style={{ display: "flex", gap: "12px" }}>
            <input style={{ ...inputStyle, flex: 1 }} placeholder={t(lang, "city")} value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
            <input style={{ ...inputStyle, flex: 1 }} placeholder={t(lang, "country")} value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
          </div>
          <input style={inputStyle} placeholder={t(lang, "phone")} value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
          <button
            onClick={() => setStep("payment")}
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
              marginTop: "8px",
            }}
          >
            {t(lang, "payment")} →
          </button>
        </>
      )}

      {step === "payment" && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", flexDirection: isRTL ? "row-reverse" : "row" }}>
            <CreditCard size={18} color={ROYAL_GREEN} />
            <h3 style={{ fontSize: "16px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: 0 }}>
              {t(lang, "payment")}
            </h3>
          </div>
          <input style={inputStyle} placeholder={t(lang, "cardNumber")} value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} />
          <div style={{ display: "flex", gap: "12px" }}>
            <input style={{ ...inputStyle, flex: 1 }} placeholder={t(lang, "expiry")} value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
            <input style={{ ...inputStyle, flex: 1 }} placeholder={t(lang, "cvv")} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
          </div>

          {/* Order Summary */}
          <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: `1px solid ${CHAMPAGNE_GOLD}33`, marginBottom: "16px" }}>
            {items.map((item) => (
              <div key={item.product.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", flexDirection: isRTL ? "row-reverse" : "row" }}>
                <span style={{ fontSize: "13px", color: "#666", fontFamily: "Inter, sans-serif" }}>
                  {item.product.emoji} {item.product.name} × {item.quantity}
                </span>
                <span style={{ fontSize: "13px", color: ROYAL_GREEN, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  ${item.product.price * item.quantity}
                </span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${CHAMPAGNE_GOLD}22`, paddingTop: "10px", marginTop: "4px", display: "flex", justifyContent: "space-between", flexDirection: isRTL ? "row-reverse" : "row" }}>
              <span style={{ fontSize: "15px", fontWeight: 700, color: ROYAL_GREEN, fontFamily: "Playfair Display, serif" }}>{t(lang, "total")}</span>
              <span style={{ fontSize: "18px", fontWeight: 700, color: CHAMPAGNE_GOLD, fontFamily: "Playfair Display, serif" }}>${total()}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setStep("address")}
              style={{
                flex: 1,
                padding: "14px",
                background: "white",
                border: `1px solid ${CHAMPAGNE_GOLD}44`,
                borderRadius: "16px",
                color: ROYAL_GREEN,
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              ← {t(lang, "address")}
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={processing}
              style={{
                flex: 2,
                padding: "14px",
                background: processing ? "#ccc" : `linear-gradient(135deg, ${CHAMPAGNE_GOLD}, #d4b06e)`,
                color: "white",
                border: "none",
                borderRadius: "16px",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                cursor: processing ? "not-allowed" : "pointer",
              }}
            >
              {processing ? "Processing..." : t(lang, "placeOrder")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
