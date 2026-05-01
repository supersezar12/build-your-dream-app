import { Bell, Settings } from "lucide-react";
import { useLanguageStore } from "../../stores/language-store";
import { useNotificationStore } from "../../stores/notification-store";
import { t, getDirection } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, IVORY } from "../../lib/constants";

export function Header({
  onNotificationClick,
  onSettingsClick,
}: {
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
}) {
  const { lang } = useLanguageStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount());
  const isRTL = getDirection(lang) === "rtl";

  return (
    <div
      style={{
        padding: "54px 20px 0",
        background: IVORY,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "12px",
          borderBottom: `1px solid ${CHAMPAGNE_GOLD}22`,
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      >
        <h1
          style={{
            fontSize: "17px",
            fontFamily: "Playfair Display, serif",
            color: ROYAL_GREEN,
            margin: 0,
            letterSpacing: "0.5px",
          }}
        >
          {t(lang, "appName")}
        </h1>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexDirection: isRTL ? "row-reverse" : "row" }}>
          <button
            onClick={onNotificationClick}
            style={{
              background: ROYAL_GREEN,
              color: "white",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  width: "8px",
                  height: "8px",
                  background: CHAMPAGNE_GOLD,
                  borderRadius: "50%",
                  border: "1.5px solid white",
                }}
              />
            )}
          </button>
          <button
            onClick={onSettingsClick}
            style={{
              background: "white",
              color: ROYAL_GREEN,
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${CHAMPAGNE_GOLD}33`,
              cursor: "pointer",
            }}
          >
            <Settings size={16} color={ROYAL_GREEN} />
          </button>
        </div>
      </div>
    </div>
  );
}
