import { useState, useRef, useEffect } from "react";
import { Camera, ShoppingBag, Plus, X, CameraOff } from "lucide-react";
import { useLanguageStore } from "../../stores/language-store";
import { useCartStore } from "../../stores/cart-store";
import { useNotificationStore } from "../../stores/notification-store";
import { t, getDirection } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, DARK_GREEN, LIGHT_GREEN, IVORY } from "../../lib/constants";
import { mockProducts } from "../../lib/mock-data";
import type { Product } from "../../lib/types";

const gardenSlotKeys = ["slot1", "slot2", "slot3", "slot4"];
const plants = mockProducts.filter((p) => p.category === "plant");

export function SimulatorPage() {
  const { lang } = useLanguageStore();
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useNotificationStore((s) => s.showToast);
  const [selectedPlants, setSelectedPlants] = useState<Record<string, Product | null>>({
    slot1: null, slot2: null, slot3: null, slot4: null,
  });
  const [arMode, setArMode] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [plantMenu, setPlantMenu] = useState<string | null>(null);
  const isRTL = getDirection(lang) === "rtl";
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const filledPlants = Object.values(selectedPlants).filter(Boolean) as Product[];

  const startAR = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setArMode(true);
      // Attach stream after state update renders the video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 50);
    } catch (err) {
      setCameraError("Camera not available — check browser permissions.");
      setArMode(true); // still show AR overlay without camera
    }
  };

  const stopAR = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setArMode(false);
    setCameraError(null);
  };

  useEffect(() => () => { streamRef.current?.getTracks().forEach((t) => t.stop()); }, []);

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      <h2 style={{ fontSize: "24px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, marginBottom: "6px", textAlign: isRTL ? "right" : "left" }}>
        {t(lang, "simulatorTitle")}
      </h2>
      <p style={{ fontSize: "13px", color: "#999", fontFamily: "Inter, sans-serif", marginBottom: "20px", textAlign: isRTL ? "right" : "left" }}>
        {t(lang, "simulatorSub")}
      </p>

      {/* AR View / Order This Look — mutually exclusive */}
      {!arMode ? (
        <button
          onClick={startAR}
          style={{
            width: "100%", padding: "14px",
            background: `linear-gradient(135deg, ${DARK_GREEN}, ${ROYAL_GREEN})`,
            border: "none", borderRadius: "16px", color: "white",
            fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px", marginBottom: "20px",
          }}
        >
          <Camera size={18} />
          {t(lang, "arView")}
        </button>
      ) : (
        <>
          {/* AR viewport */}
          <div
            style={{
              borderRadius: "20px", height: "220px", marginBottom: "16px",
              position: "relative", overflow: "hidden", background: "#000",
            }}
          >
            {/* Camera feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* Fallback gradient when no camera */}
            {cameraError && (
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0a1a0a, #0d2b0d)" }} />
            )}

            {/* Plant overlay */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "8px" }}>
                {filledPlants.length > 0
                  ? filledPlants.map((p, i) => (
                      <span key={i} style={{ fontSize: "36px", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))" }}>{p.emoji}</span>
                    ))
                  : <span style={{ fontSize: "36px", opacity: 0.5 }}>🪴</span>
                }
              </div>
              {cameraError ? (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <CameraOff size={12} color="#f59e0b" />
                  <p style={{ color: "#f59e0b", fontFamily: "Inter, sans-serif", fontSize: "11px", margin: 0 }}>
                    Camera unavailable
                  </p>
                </div>
              ) : (
                <p style={{ color: "#4ade80", fontFamily: "Inter, sans-serif", fontSize: "13px", margin: 0, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                  {t(lang, "arModeActive")}
                </p>
              )}
            </div>

            {/* LIVE badge */}
            <div style={{
              position: "absolute", top: "12px", right: "12px", zIndex: 3,
              background: "rgba(0,0,0,0.5)", padding: "4px 10px",
              borderRadius: "10px", display: "flex", alignItems: "center", gap: "4px",
              backdropFilter: "blur(4px)",
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }} />
              <span style={{ color: "white", fontSize: "11px" }}>LIVE</span>
            </div>

            {/* Close AR */}
            <button
              onClick={stopAR}
              style={{
                position: "absolute", top: "12px", left: "12px", zIndex: 3,
                background: "rgba(255,255,255,0.15)", border: "none",
                borderRadius: "50%", width: "32px", height: "32px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", backdropFilter: "blur(4px)",
              }}
            >
              <X size={16} color="white" />
            </button>
          </div>

          {/* Order This Look — only in AR mode */}
          <button
            onClick={() => {
              if (filledPlants.length > 0) {
                filledPlants.forEach((p) => addItem(p));
                showToast(`${filledPlants.length} plants added to cart!`);
              } else {
                showToast("Add plants to your garden first!", "info");
              }
              stopAR();
            }}
            style={{
              width: "100%", padding: "14px",
              background: `linear-gradient(135deg, ${CHAMPAGNE_GOLD}, #d4b06e)`,
              border: "none", borderRadius: "16px", color: "white",
              fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              gap: "8px", marginBottom: "20px",
            }}
          >
            <ShoppingBag size={16} />
            {t(lang, "orderLook")}
          </button>
        </>
      )}

      {/* Garden Slots */}
      <div style={{ background: "white", borderRadius: "24px", padding: "20px", border: `1px solid ${CHAMPAGNE_GOLD}33`, marginBottom: "20px" }}>
        <h4 style={{ fontSize: "13px", color: "#999", fontFamily: "Inter, sans-serif", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 16px 0", textAlign: isRTL ? "right" : "left" }}>
          {t(lang, "gardenSlots")}
        </h4>

        <div style={{ background: `linear-gradient(160deg, ${LIGHT_GREEN}, #f0faf3)`, borderRadius: "20px", padding: "20px", marginBottom: "16px" }}>
          <div style={{ width: "100%", height: "6px", background: `${ROYAL_GREEN}33`, borderRadius: "3px", marginBottom: "20px", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
              {gardenSlotKeys.map((_, i) => (
                <div key={i} style={{ width: "2px", height: "20px", background: `${ROYAL_GREEN}55` }} />
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px" }}>
            {gardenSlotKeys.map((slot) => (
              <div
                key={slot}
                onClick={() => setPlantMenu(slot)}
                style={{
                  background: selectedPlants[slot] ? "white" : `${ROYAL_GREEN}11`,
                  border: `2px dashed ${selectedPlants[slot] ? ROYAL_GREEN : CHAMPAGNE_GOLD}55`,
                  borderRadius: "16px", height: "90px",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", transition: "all 0.3s ease", gap: "4px",
                }}
              >
                {selectedPlants[slot] ? (
                  <>
                    <span style={{ fontSize: "28px" }}>{selectedPlants[slot]!.emoji}</span>
                    <span style={{ fontSize: "9px", color: ROYAL_GREEN, fontFamily: "Inter, sans-serif", textAlign: "center", lineHeight: "1.2" }}>
                      {selectedPlants[slot]!.name}
                    </span>
                  </>
                ) : (
                  <>
                    <Plus size={18} color={CHAMPAGNE_GOLD} />
                    <span style={{ fontSize: "9px", color: "#bbb", fontFamily: "Inter, sans-serif" }}>{t(lang, "addPlant")}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {plantMenu && (
          <div style={{ background: IVORY, borderRadius: "16px", padding: "14px", marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ fontSize: "13px", color: ROYAL_GREEN, fontFamily: "Playfair Display, serif", margin: 0 }}>
                {t(lang, "selectPlant")}
              </h4>
              <X size={16} color="#999" style={{ cursor: "pointer" }} onClick={() => setPlantMenu(null)} />
            </div>
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
              {plants.map((plant) => (
                <div
                  key={plant.id}
                  onClick={() => {
                    setSelectedPlants((prev) => ({ ...prev, [plantMenu]: plant }));
                    setPlantMenu(null);
                    showToast(`${plant.name} added to garden!`);
                  }}
                  style={{
                    background: "white", borderRadius: "12px", padding: "10px", textAlign: "center",
                    cursor: "pointer", border: `1px solid ${CHAMPAGNE_GOLD}33`, minWidth: "70px", flexShrink: 0,
                  }}
                >
                  <div style={{ fontSize: "22px" }}>{plant.emoji}</div>
                  <div style={{ fontSize: "9px", color: ROYAL_GREEN, fontFamily: "Inter, sans-serif" }}>{plant.name}</div>
                </div>
              ))}
              <div
                onClick={() => {
                  setSelectedPlants((prev) => ({ ...prev, [plantMenu]: null }));
                  setPlantMenu(null);
                }}
                style={{
                  background: "#fee2e2", borderRadius: "12px", padding: "10px", textAlign: "center",
                  cursor: "pointer", minWidth: "70px", flexShrink: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px",
                }}
              >
                <X size={18} color="#ef4444" />
                <div style={{ fontSize: "9px", color: "#ef4444", fontFamily: "Inter, sans-serif" }}>{t(lang, "remove")}</div>
              </div>
            </div>
          </div>
        )}

        {/* Order This Look when NOT in AR mode */}
        {!arMode && filledPlants.length > 0 && (
          <button
            onClick={() => {
              filledPlants.forEach((p) => addItem(p));
              showToast(`${filledPlants.length} plants added to cart!`);
            }}
            style={{
              width: "100%", padding: "14px",
              background: `linear-gradient(135deg, ${CHAMPAGNE_GOLD}, #d4b06e)`,
              border: "none", borderRadius: "14px", color: "white",
              fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            <ShoppingBag size={16} />
            {t(lang, "orderLook")}
          </button>
        )}
      </div>
    </div>
  );
}
