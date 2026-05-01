import { LIGHT_GREEN, ROYAL_GREEN } from "../../lib/constants";

export interface SensorRange {
  low: number;
  high: number;
  unit: string;
}

function getStatus(value: number, range: SensorRange): { label: string; color: string } {
  if (value < range.low) return { label: "Low", color: "#ef4444" };
  if (value > range.high) return { label: "High", color: "#f59e0b" };
  return { label: "Optimal", color: "#16a34a" };
}

const sensorRanges: Record<string, SensorRange> = {
  pH:      { low: 5.5, high: 7.0, unit: "pH" },
  "mS/cm": { low: 1.0, high: 2.5, unit: "mS/cm" },
  "°C":    { low: 18,  high: 26,  unit: "°C" },
  "%":     { low: 40,  high: 100, unit: "%" },
};

export function SensorGauge({
  value,
  max,
  label,
  unit,
  color,
  icon: Icon,
}: {
  value: number;
  max: number;
  label: string;
  unit: string;
  color: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}) {
  const percentage = (value / max) * 100;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const range = sensorRanges[unit];
  const status = range ? getStatus(value, range) : null;

  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "16px",
        border: status
          ? `1px solid ${status.color}33`
          : "1px solid rgba(193,160,94,0.2)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        minWidth: "130px",
        flex: 1,
      }}
    >
      <div style={{ position: "relative", width: "80px", height: "80px" }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke={LIGHT_GREEN} strokeWidth="8" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={status ? status.color : color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 40 40)"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={14} color={status ? status.color : color} />
          <span style={{ fontSize: "13px", fontWeight: 700, color: ROYAL_GREEN, fontFamily: "Inter, sans-serif" }}>
            {value}
          </span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "11px", color: "#888", fontFamily: "Inter, sans-serif", margin: 0 }}>{label}</p>
        <p style={{ fontSize: "10px", color: "rgba(193,160,94,1)", fontFamily: "Inter, sans-serif", margin: "2px 0 0 0" }}>{unit}</p>
        {status && (
          <span style={{
            display: "inline-block",
            marginTop: "4px",
            padding: "2px 8px",
            borderRadius: "8px",
            background: `${status.color}15`,
            color: status.color,
            fontSize: "9px",
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.3px",
          }}>
            {status.label}
          </span>
        )}
      </div>
    </div>
  );
}
