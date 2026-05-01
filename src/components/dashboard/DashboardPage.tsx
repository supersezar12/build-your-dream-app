import { useState, useEffect } from "react";
import { Beaker, Zap, Thermometer, Waves, BarChart3, Activity, Award } from "lucide-react";
import { useLanguageStore } from "../../stores/language-store";
import { useAuthStore } from "../../stores/auth-store";
import { t, getDirection } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, DARK_GREEN, LIGHT_GREEN } from "../../lib/constants";
import { mockSensorHistory } from "../../lib/mock-data";
import { SensorGauge } from "./SensorGauge";

function jitter(base: number, range: number, decimals = 1) {
  const raw = base + (Math.random() - 0.5) * 2 * range;
  return parseFloat(raw.toFixed(decimals));
}

const BASE = { ph: 6.2, ec: 1.8, water_temp: 22, reservoir_level: 78 };

export function DashboardPage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { lang } = useLanguageStore();
  const user = useAuthStore((s) => s.user);
  const isRTL = getDirection(lang) === "rtl";

  const [sensors, setSensors] = useState(BASE);

  useEffect(() => {
    const id = setInterval(() => {
      setSensors({
        ph: jitter(BASE.ph, 0.15, 2),
        ec: jitter(BASE.ec, 0.1, 2),
        water_temp: jitter(BASE.water_temp, 0.5, 1),
        reservoir_level: jitter(BASE.reservoir_level, 2, 0),
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const sensorData = [
    { label: t(lang, "phLevel"), value: sensors.ph, max: 14, unit: "pH", color: ROYAL_GREEN, icon: Beaker },
    { label: t(lang, "nutrients"), value: sensors.ec, max: 3, unit: "mS/cm", color: CHAMPAGNE_GOLD, icon: Zap },
    { label: t(lang, "waterTemp"), value: sensors.water_temp, max: 40, unit: "°C", color: "#3b82f6", icon: Thermometer },
    { label: t(lang, "reservoir"), value: sensors.reservoir_level, max: 100, unit: "%", color: "#8b5cf6", icon: Waves },
  ];

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      {/* Greeting */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      >
        <div style={{ textAlign: isRTL ? "right" : "left" }}>
          <p style={{ fontSize: "13px", color: "#999", fontFamily: "Inter, sans-serif", margin: 0 }}>
            {t(lang, "welcome")}
          </p>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: ROYAL_GREEN, fontFamily: "Playfair Display, serif", margin: 0 }}>
            {user?.name ?? "Guest"}
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexDirection: isRTL ? "row-reverse" : "row" }}>
          {user?.is_vip && (
            <div
              style={{
                background: `linear-gradient(135deg, ${CHAMPAGNE_GOLD}, #e8c47a)`,
                color: "white",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "11px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Award size={12} />
              {t(lang, "vipBadge")}
            </div>
          )}
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${ROYAL_GREEN}, ${DARK_GREEN})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            {(user?.name ?? "G")[0]}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div
        style={{
          background: `linear-gradient(135deg, ${ROYAL_GREEN}, ${DARK_GREEN})`,
          borderRadius: "20px",
          padding: "16px 20px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      >
        <div style={{ textAlign: isRTL ? "right" : "left" }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", margin: 0, fontFamily: "Inter, sans-serif" }}>
            {t(lang, "liveStatus")}
          </p>
          <h3 style={{ fontSize: "16px", color: "white", margin: 0, fontFamily: "Playfair Display, serif" }}>
            {t(lang, "allSystemsNormal")}
          </h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#4ade80", fontSize: "12px", fontFamily: "Inter, sans-serif" }}>LIVE</span>
        </div>
      </div>

      {/* Live Sensor Rings */}
      <h3
        style={{
          fontSize: "14px",
          color: "#999",
          fontFamily: "Inter, sans-serif",
          marginBottom: "12px",
          textAlign: isRTL ? "right" : "left",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        {t(lang, "liveStatus")} · {t(lang, "days7")}
      </h3>
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px", overflowX: "auto", paddingBottom: "4px" }}>
        {sensorData.map((sensor) => (
          <SensorGauge key={sensor.label} {...sensor} />
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: t(lang, "totalPlants"), value: "12", icon: "🌿" },
          { label: t(lang, "healthScore"), value: "97%", icon: "❤️" },
          { label: t(lang, "uptime"), value: "99.8%", icon: "⚡" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              background: "white",
              borderRadius: "16px",
              padding: "14px",
              textAlign: "center",
              border: "1px solid rgba(193,160,94,0.2)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontSize: "20px", marginBottom: "4px" }}>{stat.icon}</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: ROYAL_GREEN, fontFamily: "Playfair Display, serif" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "10px", color: "#999", fontFamily: "Inter, sans-serif" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* pH Trend Chart */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "20px",
          border: "1px solid rgba(193,160,94,0.2)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            flexDirection: isRTL ? "row-reverse" : "row",
          }}
        >
          <h3 style={{ fontSize: "15px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: 0 }}>
            {t(lang, "phTrend")}
          </h3>
          <BarChart3 size={18} color={CHAMPAGNE_GOLD} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "80px" }}>
          {mockSensorHistory.map((d, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: i === mockSensorHistory.length - 1 ? ROYAL_GREEN : `${ROYAL_GREEN}44`,
                borderRadius: "6px 6px 0 0",
                height: `${Math.max(5, ((d.ph - 5.5) / 1.5) * 100)}%`,
                transition: "height 0.5s ease",
              }}
            />
          ))}
          {/* Live bar */}
          <div
            style={{
              flex: 1,
              background: `linear-gradient(180deg, ${CHAMPAGNE_GOLD}, ${ROYAL_GREEN})`,
              borderRadius: "6px 6px 0 0",
              height: `${Math.max(5, ((sensors.ph - 5.5) / 1.5) * 100)}%`,
              transition: "height 1s ease",
              boxShadow: `0 0 8px ${CHAMPAGNE_GOLD}88`,
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          {mockSensorHistory.map((d, i) => (
            <span key={i} style={{ fontSize: "10px", color: "#ccc", fontFamily: "Inter, sans-serif", flex: 1, textAlign: "center" }}>
              {d.day}
            </span>
          ))}
          <span style={{ fontSize: "10px", color: CHAMPAGNE_GOLD, fontFamily: "Inter, sans-serif", flex: 1, textAlign: "center", fontWeight: 700 }}>
            Live
          </span>
        </div>
      </div>

      {/* AI Doctor CTA */}
      <div
        onClick={() => onNavigate("ai-doctor")}
        style={{
          background: `linear-gradient(135deg, ${CHAMPAGNE_GOLD}, #d4b06e)`,
          borderRadius: "20px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      >
        <div style={{ textAlign: isRTL ? "right" : "left" }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", margin: 0, fontFamily: "Inter, sans-serif" }}>
            {t(lang, "aiPlantDoctor")}
          </p>
          <h3 style={{ fontSize: "15px", color: "white", margin: 0, fontFamily: "Playfair Display, serif" }}>
            {t(lang, "scanNow")} →
          </h3>
        </div>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Activity size={22} color="white" />
        </div>
      </div>
    </div>
  );
}
