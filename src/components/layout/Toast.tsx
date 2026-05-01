import { Check, X, AlertCircle } from "lucide-react";
import { useNotificationStore } from "../../stores/notification-store";
import { ROYAL_GREEN } from "../../lib/constants";

export function Toast() {
  const toast = useNotificationStore((s) => s.toast);
  if (!toast) return null;

  const colors = {
    success: ROYAL_GREEN,
    error: "#ef4444",
    info: "#3b82f6",
  };

  const icons = {
    success: Check,
    error: X,
    info: AlertCircle,
  };

  const Icon = icons[toast.type];

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: colors[toast.type],
        color: "white",
        padding: "12px 20px",
        borderRadius: "30px",
        fontSize: "13px",
        fontFamily: "Inter, sans-serif",
        zIndex: 1000,
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        animation: "slideDown 0.3s ease",
      }}
    >
      <Icon size={14} />
      {toast.message}
    </div>
  );
}
