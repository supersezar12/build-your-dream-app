import { X, Bell, Package, Activity, AlertCircle, Tag, Monitor } from "lucide-react";
import { useLanguageStore } from "../../stores/language-store";
import { useNotificationStore } from "../../stores/notification-store";
import { t, getDirection } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, LIGHT_GREEN, IVORY } from "../../lib/constants";

const typeIcons: Record<string, React.ComponentType<any>> = {
  order: Package,
  ai_alert: Activity,
  low_stock: AlertCircle,
  recommendation: Tag,
  system: Monitor,
};

const typeColors: Record<string, string> = {
  order: "#3b82f6",
  ai_alert: "#f59e0b",
  low_stock: "#ef4444",
  recommendation: CHAMPAGNE_GOLD,
  system: "#8b5cf6",
};

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguageStore();
  const { notifications, markRead, markAllRead, unreadCount } = useNotificationStore();
  const isRTL = getDirection(lang) === "rtl";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "420px",
          background: IVORY,
          height: "100%",
          overflowY: "auto",
          animation: "slideDown 0.3s ease",
        }}
      >
        <div style={{ padding: "54px 20px 0", position: "sticky", top: 0, background: IVORY, zIndex: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: `1px solid ${CHAMPAGNE_GOLD}22`, flexDirection: isRTL ? "row-reverse" : "row" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexDirection: isRTL ? "row-reverse" : "row" }}>
              <Bell size={18} color={ROYAL_GREEN} />
              <h2 style={{ fontSize: "18px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: 0 }}>
                {t(lang, "notificationCenter")}
              </h2>
              {unreadCount() > 0 && (
                <span style={{ background: CHAMPAGNE_GOLD, color: "white", fontSize: "10px", padding: "2px 8px", borderRadius: "10px", fontFamily: "Inter, sans-serif" }}>
                  {unreadCount()}
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {unreadCount() > 0 && (
                <button onClick={markAllRead} style={{ background: "none", border: "none", fontSize: "11px", color: CHAMPAGNE_GOLD, fontFamily: "Inter, sans-serif", cursor: "pointer" }}>
                  {t(lang, "markAllRead")}
                </button>
              )}
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                <X size={18} color="#999" />
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 20px" }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔔</div>
              <p style={{ color: "#999", fontFamily: "Inter, sans-serif" }}>{t(lang, "noNotifications")}</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = typeIcons[notif.type] ?? Bell;
              const color = typeColors[notif.type] ?? "#999";
              return (
                <div
                  key={notif.id}
                  onClick={() => markRead(notif.id)}
                  style={{
                    background: notif.is_read ? "white" : LIGHT_GREEN,
                    borderRadius: "16px",
                    padding: "14px",
                    marginBottom: "8px",
                    border: `1px solid ${notif.is_read ? CHAMPAGNE_GOLD + "22" : ROYAL_GREEN + "33"}`,
                    cursor: "pointer",
                    display: "flex",
                    gap: "12px",
                    flexDirection: isRTL ? "row-reverse" : "row",
                  }}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={color} />
                  </div>
                  <div style={{ flex: 1, textAlign: isRTL ? "right" : "left" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px", flexDirection: isRTL ? "row-reverse" : "row" }}>
                      <h4 style={{ fontSize: "13px", fontWeight: 600, color: ROYAL_GREEN, fontFamily: "Inter, sans-serif", margin: 0 }}>
                        {notif.title}
                      </h4>
                      {!notif.is_read && (
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: ROYAL_GREEN }} />
                      )}
                    </div>
                    <p style={{ fontSize: "12px", color: "#666", fontFamily: "Inter, sans-serif", margin: "0 0 4px 0", lineHeight: "1.5" }}>
                      {notif.message}
                    </p>
                    <span style={{ fontSize: "10px", color: "#bbb", fontFamily: "Inter, sans-serif" }}>
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
