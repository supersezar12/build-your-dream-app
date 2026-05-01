import { Home, Activity, Eye, ShoppingBag, BookOpen } from "lucide-react";
import { useLanguageStore } from "../../stores/language-store";
import { t } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, LIGHT_GREEN } from "../../lib/constants";

const navItems = [
  { id: "dashboard", icon: Home, labelKey: "dashboard" },
  { id: "ai-doctor", icon: Activity, labelKey: "aiDoctor" },
  { id: "simulate", icon: Eye, labelKey: "simulate" },
  { id: "market", icon: ShoppingBag, labelKey: "market" },
  { id: "encyclopedia", icon: BookOpen, labelKey: "encyclopedia" },
] as const;

export function BottomNav({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate: (id: string) => void;
}) {
  const { lang } = useLanguageStore();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "420px",
        background: "white",
        borderTop: `1px solid ${CHAMPAGNE_GOLD}33`,
        padding: "8px 0 20px",
        display: "flex",
        justifyContent: "space-around",
        zIndex: 100,
        boxShadow: "0 -8px 30px rgba(0,0,0,0.06)",
      }}
    >
      {navItems.map((item) => {
        const isActive = active === item.id;
        const label = t(lang, item.labelKey);
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              border: "none",
              cursor: "pointer",
              padding: "6px 10px",
              borderRadius: "16px",
              background: isActive ? LIGHT_GREEN : "transparent",
              transition: "all 0.2s ease",
            }}
          >
            <item.icon size={20} color={isActive ? ROYAL_GREEN : "#bbb"} strokeWidth={isActive ? 2.5 : 1.5} />
            <span
              style={{
                fontSize: "9px",
                color: isActive ? ROYAL_GREEN : "#bbb",
                fontFamily: "Inter, sans-serif",
                fontWeight: isActive ? 700 : 400,
                letterSpacing: "0.3px",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
