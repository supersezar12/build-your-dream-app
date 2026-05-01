import { Bell, Globe, Leaf, TrendingUp, Package, Settings, Star, ChevronRight, Award, LogOut, Crown, Shield } from "lucide-react";
import { useLanguageStore } from "../../stores/language-store";
import { useAuthStore } from "../../stores/auth-store";
import { t, getDirection } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, DARK_GREEN, LIGHT_GREEN, IVORY } from "../../lib/constants";
import type { Language } from "../../lib/types";

export function SettingsPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const { lang, setLang } = useLanguageStore();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isRTL = getDirection(lang) === "rtl";

  const menuItems = [
    { icon: Bell, label: t(lang, "notifications"), val: "Smart Alerts", page: "notifications" },
    { icon: Globe, label: t(lang, "location"), val: user?.location ?? "Erbil, Iraq", page: "" },
    { icon: Leaf, label: t(lang, "myGarden"), val: "12 plants", page: "" },
    { icon: TrendingUp, label: t(lang, "analytics"), val: "97% health", page: "" },
    { icon: Package, label: t(lang, "myOrders"), val: `2 ${t(lang, "pendingOrders")}`, page: "orders" },
    { icon: Star, label: t(lang, "wishlist"), val: "", page: "wishlist" },
    { icon: Crown, label: t(lang, "subscription"), val: "", page: "subscription" },
    { icon: Settings, label: t(lang, "privacy"), val: t(lang, "encrypted"), page: "" },
    { icon: Star, label: t(lang, "support"), val: t(lang, "priority"), page: "" },
  ];

  if (user?.role === "admin") {
    menuItems.push({ icon: Shield, label: t(lang, "admin"), val: "Dashboard", page: "admin" });
  }

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      {/* Profile Card */}
      <div
        style={{
          background: `linear-gradient(135deg, ${ROYAL_GREEN}, ${DARK_GREEN})`,
          borderRadius: "24px",
          padding: "24px",
          marginBottom: "24px",
          textAlign: "center",
          color: "white",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            fontWeight: 700,
            margin: "0 auto 12px",
            border: `2px solid ${CHAMPAGNE_GOLD}`,
          }}
        >
          {(user?.name ?? "G")[0]}
        </div>
        <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "20px", margin: "0 0 4px 0" }}>
          {user?.name ?? "Guest"}
        </h3>
        <p style={{ fontSize: "12px", opacity: 0.7, fontFamily: "Inter, sans-serif", margin: "0 0 12px 0" }}>
          {user?.location ?? "Erbil, Iraq"}
        </p>
        {user?.is_vip && (
          <div
            style={{
              background: `linear-gradient(135deg, ${CHAMPAGNE_GOLD}, #d4b06e)`,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "12px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <Award size={14} />
            {t(lang, "vipBadge")}
          </div>
        )}
      </div>

      {/* Language */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "6px",
          border: `1px solid ${CHAMPAGNE_GOLD}33`,
          marginBottom: "16px",
        }}
      >
        <h4 style={{ fontSize: "12px", color: "#999", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "Inter, sans-serif", margin: "12px 14px 12px 14px" }}>
          {t(lang, "language")}
        </h4>
        <div style={{ display: "flex", gap: "6px", padding: "0 8px 8px" }}>
          {[
            { code: "en" as Language, label: "English", flag: "🇬🇧" },
            { code: "ku" as Language, label: "کوردی", flag: "🟡" },
            { code: "ar" as Language, label: "العربية", flag: "🌙" },
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              style={{
                flex: 1,
                padding: "10px 6px",
                background: lang === l.code ? ROYAL_GREEN : IVORY,
                color: lang === l.code ? "white" : "#666",
                border: "none",
                borderRadius: "12px",
                fontSize: "12px",
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
                fontWeight: lang === l.code ? 600 : 400,
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: "16px", marginBottom: "2px" }}>{l.flag}</div>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      {menuItems.map((item) => (
        <div
          key={item.label}
          onClick={() => item.page && onNavigate(item.page)}
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "14px 16px",
            border: `1px solid ${CHAMPAGNE_GOLD}22`,
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: isRTL ? "row-reverse" : "row",
            cursor: item.page ? "pointer" : "default",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexDirection: isRTL ? "row-reverse" : "row" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: LIGHT_GREEN, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <item.icon size={18} color={ROYAL_GREEN} />
            </div>
            <span style={{ fontSize: "14px", color: "#333", fontFamily: "Inter, sans-serif" }}>{item.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: CHAMPAGNE_GOLD, fontFamily: "Inter, sans-serif" }}>{item.val}</span>
            {item.page && <ChevronRight size={14} color="#ccc" style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />}
          </div>
        </div>
      ))}

      {/* Sign Out */}
      <button
        onClick={logout}
        style={{
          width: "100%",
          padding: "14px",
          background: "white",
          border: `1px solid #ef444444`,
          borderRadius: "16px",
          color: "#ef4444",
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginTop: "8px",
        }}
      >
        <LogOut size={16} />
        {t(lang, "signOut")}
      </button>

      <p style={{ textAlign: "center", fontSize: "11px", color: "#ccc", fontFamily: "Inter, sans-serif", marginTop: "20px" }}>
        {t(lang, "version")}
      </p>
    </div>
  );
}
