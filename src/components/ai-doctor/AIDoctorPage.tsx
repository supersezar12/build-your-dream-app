import { useState, useRef } from "react";
import { Camera, Mic, Check, AlertCircle, Beaker, Zap, Thermometer, Waves, Upload } from "lucide-react";
import Anthropic from "@anthropic-ai/sdk";
import { useLanguageStore } from "../../stores/language-store";
import { useCartStore } from "../../stores/cart-store";
import { useNotificationStore } from "../../stores/notification-store";
import { t, getDirection } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, DARK_GREEN, LIGHT_GREEN, IVORY } from "../../lib/constants";
import { mockCurrentSensors, mockProducts } from "../../lib/mock-data";

const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;

interface DiagnosisResult {
  plant: string;
  confidence: number;
  issue: string;
  action: string;
  sensors: string;
}

async function diagnoseWithAI(
  imageBase64: string | null,
  mimeType: string,
  sensors: typeof mockCurrentSensors
): Promise<DiagnosisResult> {
  if (!ANTHROPIC_KEY) throw new Error("no-key");

  const client = new Anthropic({ apiKey: ANTHROPIC_KEY, dangerouslyAllowBrowser: true });

  const sensorContext = `Current hydroponic sensor readings: pH ${sensors.ph}, EC ${sensors.ec} mS/cm, Water temperature ${sensors.water_temp}°C, Reservoir level ${sensors.reservoir_level}%.`;

  const userContent: Anthropic.MessageParam["content"] = [];

  if (imageBase64) {
    userContent.push({
      type: "image",
      source: { type: "base64", media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp", data: imageBase64 },
    });
  }

  userContent.push({
    type: "text",
    text: `You are an expert hydroponic plant doctor for Smart Green, a luxury system in Erbil, Iraq. ${sensorContext}${imageBase64 ? " Analyze the plant in the image." : " Based on sensors only, diagnose the most likely plant health issue."} Respond ONLY with valid JSON matching this schema exactly: {"plant":"plant name or Unknown","confidence":number,"issue":"brief issue description","action":"specific action steps","sensors":"key sensor observations"}`,
  });

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [{ role: "user", content: userContent }],
  });

  const text = (msg.content[0] as { type: string; text: string }).text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("parse-error");
  return JSON.parse(jsonMatch[0]) as DiagnosisResult;
}

const MOCK_DIAGNOSIS: DiagnosisResult = {
  plant: "Basil Royale",
  confidence: 94,
  issue: "Slight nitrogen deficiency detected in lower leaves.",
  action: "Increase EC to 2.1 mS/cm. Add 5ml Nitrogen booster per 10L of reservoir water.",
  sensors: `pH: ${mockCurrentSensors.ph} ✓ | EC: ${mockCurrentSensors.ec} (low) | Temp: ${mockCurrentSensors.water_temp}°C ✓`,
};

export function AIDoctorPage() {
  const { lang } = useLanguageStore();
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useNotificationStore((s) => s.showToast);
  const [step, setStep] = useState<"idle" | "analyzing" | "result">("idle");
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult>(MOCK_DIAGNOSIS);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ base64: string; mime: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isRTL = getDirection(lang) === "rtl";

  const sensorDisplay = [
    { label: t(lang, "phLevel"), value: mockCurrentSensors.ph, unit: "pH", icon: Beaker },
    { label: t(lang, "nutrients"), value: mockCurrentSensors.ec, unit: "mS/cm", icon: Zap },
    { label: t(lang, "waterTemp"), value: mockCurrentSensors.water_temp, unit: "°C", icon: Thermometer },
    { label: t(lang, "reservoir"), value: mockCurrentSensors.reservoir_level, unit: "%", icon: Waves },
  ];

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setImageData({ base64, mime: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    setStep("analyzing");
    try {
      const result = await diagnoseWithAI(
        imageData?.base64 ?? null,
        imageData?.mime ?? "image/jpeg",
        mockCurrentSensors
      );
      setDiagnosis(result);
    } catch {
      setDiagnosis(MOCK_DIAGNOSIS);
    }
    setStep("result");
  };

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      <h2 style={{ fontSize: "24px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, marginBottom: "6px", textAlign: isRTL ? "right" : "left" }}>
        {t(lang, "aiDoctorTitle")}
      </h2>
      <p style={{ fontSize: "13px", color: "#999", fontFamily: "Inter, sans-serif", marginBottom: "24px", textAlign: isRTL ? "right" : "left" }}>
        {t(lang, "aiDoctorSub")}
      </p>

      {step === "idle" && (
        <>
          {/* Drop zone / preview */}
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${preview ? ROYAL_GREEN : CHAMPAGNE_GOLD + "66"}`,
              borderRadius: "24px",
              padding: preview ? "0" : "40px 20px",
              textAlign: "center",
              marginBottom: "16px",
              background: preview ? "transparent" : "white",
              overflow: "hidden",
              cursor: "pointer",
              minHeight: "140px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {preview ? (
              <>
                <img src={preview} alt="plant" style={{ width: "100%", maxHeight: "220px", objectFit: "cover", borderRadius: "22px" }} />
                <div style={{ position: "absolute", bottom: "10px", right: "10px", background: ROYAL_GREEN, color: "white", borderRadius: "10px", padding: "4px 12px", fontSize: "11px", fontFamily: "Inter, sans-serif" }}>
                  Tap to change
                </div>
              </>
            ) : (
              <div>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌿</div>
                <p style={{ fontSize: "14px", color: ROYAL_GREEN, fontFamily: "Playfair Display, serif", margin: "0 0 6px 0" }}>
                  {t(lang, "uploadPhoto")}
                </p>
                <p style={{ fontSize: "12px", color: "#999", fontFamily: "Inter, sans-serif", margin: 0 }}>
                  JPG, PNG or HEIC · Max 10MB
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                flex: 1, padding: "14px", background: "white",
                border: `1px solid ${CHAMPAGNE_GOLD}44`, borderRadius: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "8px", cursor: "pointer", color: ROYAL_GREEN,
                fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500,
              }}
            >
              <Camera size={18} color={CHAMPAGNE_GOLD} />
              {t(lang, "uploadPhoto")}
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                flex: 1, padding: "14px", background: "white",
                border: `1px solid ${CHAMPAGNE_GOLD}44`, borderRadius: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "8px", cursor: "pointer", color: ROYAL_GREEN,
                fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500,
              }}
            >
              <Upload size={18} color={CHAMPAGNE_GOLD} />
              {t(lang, "recordVoice")}
            </button>
          </div>

          {/* Sensor context */}
          <div
            style={{
              background: "white", borderRadius: "20px", padding: "16px",
              border: `1px solid ${CHAMPAGNE_GOLD}33`, marginBottom: "20px",
            }}
          >
            <h4
              style={{
                fontSize: "12px", color: "#999", fontFamily: "Inter, sans-serif",
                letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 12px 0",
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t(lang, "sensorContext")}
            </h4>
            {sensorDisplay.map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0", borderBottom: `1px solid ${IVORY}`,
                  flexDirection: isRTL ? "row-reverse" : "row",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <s.icon size={14} color={CHAMPAGNE_GOLD} />
                  <span style={{ fontSize: "12px", color: "#666", fontFamily: "Inter, sans-serif" }}>{s.label}</span>
                </div>
                <span style={{ fontSize: "12px", color: ROYAL_GREEN, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  {s.value} {s.unit}
                </span>
              </div>
            ))}
          </div>

          {!ANTHROPIC_KEY && (
            <div style={{ background: "#fff3cd", borderRadius: "12px", padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: "#856404", fontFamily: "Inter, sans-serif" }}>
              💡 Add <strong>VITE_ANTHROPIC_API_KEY</strong> to .env.local for real AI diagnosis. Running in demo mode.
            </div>
          )}

          <button
            onClick={handleAnalyze}
            style={{
              width: "100%", padding: "16px",
              background: `linear-gradient(135deg, ${ROYAL_GREEN}, ${DARK_GREEN})`,
              color: "white", border: "none", borderRadius: "18px",
              fontSize: "15px", fontFamily: "Playfair Display, serif",
              cursor: "pointer", fontWeight: 600,
            }}
          >
            {t(lang, "analyzeNow")} {preview ? "🔬" : "📡"}
          </button>
        </>
      )}

      {step === "analyzing" && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🔬</div>
          <h3 style={{ fontSize: "20px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, marginBottom: "8px" }}>
            {t(lang, "analyzing")}
          </h3>
          <p style={{ fontSize: "12px", color: "#999", fontFamily: "Inter, sans-serif" }}>
            {t(lang, "analyzing2")}
          </p>
          <div style={{ width: "100%", height: "4px", background: LIGHT_GREEN, borderRadius: "2px", marginTop: "24px", overflow: "hidden" }}>
            <div style={{ height: "100%", background: ROYAL_GREEN, borderRadius: "2px", animation: "loading 8s ease forwards", width: "0%" }} />
          </div>
        </div>
      )}

      {step === "result" && (
        <div>
          <div
            style={{
              background: `linear-gradient(135deg, ${ROYAL_GREEN}, ${DARK_GREEN})`,
              borderRadius: "24px", padding: "20px", marginBottom: "16px", color: "white",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexDirection: isRTL ? "row-reverse" : "row" }}>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "18px", margin: 0 }}>
                {t(lang, "diagnosisResult")}
              </h3>
              <span style={{ background: "#4ade80", color: "#166534", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>
                {diagnosis.confidence}% {t(lang, "confidence")}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexDirection: isRTL ? "row-reverse" : "row" }}>
              <Check size={16} color="#4ade80" />
              <span style={{ fontSize: "13px", opacity: 0.9, fontFamily: "Inter, sans-serif" }}>{diagnosis.plant}</span>
            </div>
            {ANTHROPIC_KEY && (
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", margin: "8px 0 0 0", fontFamily: "Inter, sans-serif" }}>
                ✨ Powered by Claude AI
              </p>
            )}
          </div>

          <div style={{ background: "white", borderRadius: "20px", padding: "18px", border: `1px solid ${CHAMPAGNE_GOLD}33`, marginBottom: "12px" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexDirection: isRTL ? "row-reverse" : "row" }}>
              <AlertCircle size={18} color={CHAMPAGNE_GOLD} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div style={{ textAlign: isRTL ? "right" : "left" }}>
                <h4 style={{ fontSize: "13px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: "0 0 4px 0" }}>
                  {t(lang, "detectedIssue")}
                </h4>
                <p style={{ fontSize: "12px", color: "#666", fontFamily: "Inter, sans-serif", margin: 0, lineHeight: "1.6" }}>
                  {diagnosis.issue}
                </p>
              </div>
            </div>
            <div style={{ background: LIGHT_GREEN, borderRadius: "12px", padding: "12px", marginBottom: "12px", textAlign: isRTL ? "right" : "left" }}>
              <h4 style={{ fontSize: "12px", color: ROYAL_GREEN, fontFamily: "Inter, sans-serif", fontWeight: 700, margin: "0 0 4px 0", letterSpacing: "0.5px" }}>
                {t(lang, "recommendedAction")}
              </h4>
              <p style={{ fontSize: "12px", color: "#444", fontFamily: "Inter, sans-serif", margin: 0, lineHeight: "1.6" }}>
                {diagnosis.action}
              </p>
            </div>
            <p style={{ fontSize: "11px", color: "#999", fontFamily: "Inter, sans-serif", margin: 0 }}>
              {diagnosis.sensors}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => { setStep("idle"); setPreview(null); setImageData(null); }}
              style={{
                flex: 1, padding: "14px", background: "white",
                border: `1px solid ${CHAMPAGNE_GOLD}55`, borderRadius: "16px",
                color: ROYAL_GREEN, fontFamily: "Inter, sans-serif", fontSize: "13px", cursor: "pointer",
              }}
            >
              {t(lang, "newScan")}
            </button>
            <button
              onClick={() => {
                const booster = mockProducts.find((p) => p.id === "prod-8");
                if (booster) addItem(booster);
                showToast("Nitrogen booster added to cart!");
              }}
              style={{
                flex: 2, padding: "14px",
                background: `linear-gradient(135deg, ${CHAMPAGNE_GOLD}, #d4b06e)`,
                border: "none", borderRadius: "16px", color: "white",
                fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer",
              }}
            >
              {t(lang, "orderSolution")} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
