import { ArrowLeft, Sparkles, Brain, Tag, Headphones, Check } from "lucide-react";
import { useState } from "react";
import { useLanguageStore } from "../../stores/language-store";
import { useNotificationStore } from "../../stores/notification-store";
import { t, getDirection } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, DARK_GREEN, LIGHT_GREEN } from "../../lib/constants";

const features = [
  { icon: Brain, labelKey: "advancedAI" },
  { icon: Sparkles, labelKey: "premiumRecs" },
  { icon: Tag, labelKey: "discounts" },
  { icon: Headphones, labelKey: "priorityService" },
];

export function SubscriptionPage({ onBack }: { onBack: () => void }) {
  const { lang } = useLanguageStore();
  const showToast = useNotificationStore((s) => s.showToast);
  const [subscribed, setSubscribed] = useState(false);
  const isRTL = getDirection(lang) === "rtl";

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexDirection: isRTL ? "row-reverse" : "row" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
          <ArrowLeft size={20} color={ROYAL_GREEN} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
        </button>
        <h2 style={{ fontSize: "24px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: 0 }}>
          {t(lang, "subscription")}
        </h2>
      </div>

      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(135deg, ${ROYAL_GREEN}, ${DARK_GREEN})`,
          borderRadius: "24px",
          padding: "28px 24px",
          marginBottom: "24px",
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -30, right: -30, width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>✨</div>
        <h3 style={{ fontSize: "22px", fontFamily: "Playfair Display, serif", margin: "0 0 8px 0" }}>
          {t(lang, "subscriptionTitle")}
        </h3>
        <p style={{ fontSize: "13px", opacity: 0.8, fontFamily: "Inter, sans-serif", margin: "0 0 20px 0" }}>
          {t(lang, "subscriptionSub")}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "4px" }}>
          <span style={{ fontSize: "40px", fontWeight: 700, fontFamily: "Playfair Display, serif" }}>$9.99</span>
          <span style={{ fontSize: "14px", opacity: 0.7 }}>{t(lang, "perMonth")}</span>
        </div>
      </div>

      {/* Features */}
      <div style={{ marginBottom: "24px" }}>
        {features.map((feat) => (
          <div
            key={feat.labelKey}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "16px",
              border: `1px solid ${CHAMPAGNE_GOLD}22`,
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: LIGHT_GREEN, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <feat.icon size={20} color={ROYAL_GREEN} />
            </div>
            <span style={{ fontSize: "14px", color: "#333", fontFamily: "Inter, sans-serif", fontWeight: 500, textAlign: isRTL ? "right" : "left" }}>
              {t(lang, feat.labelKey)}
            </span>
            <Check size={18} color={CHAMPAGNE_GOLD} style={{ marginLeft: isRTL ? "0" : "auto", marginRight: isRTL ? "auto" : "0" }} />
          </div>
        ))}
      </div>

      {/* Compare Plans */}
      <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: `1px solid ${CHAMPAGNE_GOLD}33`, marginBottom: "20px" }}>
        <h4 style={{ fontSize: "14px", color: ROYAL_GREEN, fontFamily: "Playfair Display, serif", margin: "0 0 16px 0", textAlign: isRTL ? "right" : "left" }}>
          {t(lang, "currentPlan")}
        </h4>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ flex: 1, padding: "14px", borderRadius: "14px", border: `2px solid ${subscribed ? CHAMPAGNE_GOLD + "33" : ROYAL_GREEN}`, textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "#999", fontFamily: "Inter, sans-serif", margin: "0 0 4px 0" }}>{t(lang, "freePlan")}</p>
            <p style={{ fontSize: "18px", fontWeight: 700, color: ROYAL_GREEN, fontFamily: "Playfair Display, serif", margin: 0 }}>$0</p>
          </div>
          <div style={{ flex: 1, padding: "14px", borderRadius: "14px", border: `2px solid ${subscribed ? ROYAL_GREEN : CHAMPAGNE_GOLD + "33"}`, textAlign: "center", background: subscribed ? LIGHT_GREEN : "transparent" }}>
            <p style={{ fontSize: "12px", color: "#999", fontFamily: "Inter, sans-serif", margin: "0 0 4px 0" }}>{t(lang, "plusPlan")}</p>
            <p style={{ fontSize: "18px", fontWeight: 700, color: CHAMPAGNE_GOLD, fontFamily: "Playfair Display, serif", margin: 0 }}>$9.99</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setSubscribed(!subscribed);
          showToast(subscribed ? "Subscription cancelled" : "Welcome to Smart Green+!");
        }}
        style={{
          width: "100%",
          padding: "16px",
          background: subscribed
            ? "white"
            : `linear-gradient(135deg, ${CHAMPAGNE_GOLD}, #d4b06e)`,
          color: subscribed ? "#ef4444" : "white",
          border: subscribed ? "1px solid #ef444444" : "none",
          borderRadius: "18px",
          fontSize: "15px",
          fontFamily: "Playfair Display, serif",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        {subscribed ? t(lang, "cancel") : t(lang, "subscribe")}
      </button>
    </div>
  );
}
