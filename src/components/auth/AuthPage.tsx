import { useState } from "react";
import { useLanguageStore } from "../../stores/language-store";
import { useAuthStore } from "../../stores/auth-store";
import { t, getDirection } from "../../lib/i18n";
import { ROYAL_GREEN, CHAMPAGNE_GOLD, DARK_GREEN, LIGHT_GREEN, IVORY } from "../../lib/constants";

export function AuthPage() {
  const { lang } = useLanguageStore();
  const { login, register, isLoading } = useAuthStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const isRTL = getDirection(lang) === "rtl";

  const inputStyle = {
    width: "100%",
    padding: "16px",
    background: "white",
    border: `1px solid ${CHAMPAGNE_GOLD}33`,
    borderRadius: "16px",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    outline: "none",
    marginBottom: "14px",
    direction: isRTL ? "rtl" as const : "ltr" as const,
    boxSizing: "border-box" as const,
  };

  const handleSubmit = async () => {
    setError("");
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (!name.trim()) {
          setError("Name is required");
          return;
        }
        await register(email, password, name);
      }
    } catch {
      setError("Authentication failed. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: IVORY, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌿</div>
          <h1 style={{ fontSize: "28px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: "0 0 4px 0" }}>
            {t(lang, "appName")}
          </h1>
          <p style={{ fontSize: "13px", color: CHAMPAGNE_GOLD, fontFamily: "Inter, sans-serif", margin: 0 }}>
            {t(lang, "tagline")}
          </p>
        </div>

        {/* Form */}
        <div style={{ background: "white", borderRadius: "24px", padding: "28px", boxShadow: "0 4px 30px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontSize: "20px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: "0 0 20px 0", textAlign: "center" }}>
            {mode === "login" ? t(lang, "login") : t(lang, "register")}
          </h2>

          {mode === "register" && (
            <input
              style={inputStyle}
              placeholder={t(lang, "name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            style={inputStyle}
            type="email"
            placeholder={t(lang, "email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={inputStyle}
            type="password"
            placeholder={t(lang, "password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p style={{ fontSize: "12px", color: "#ef4444", fontFamily: "Inter, sans-serif", margin: "0 0 12px 0", textAlign: "center" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "16px",
              background: isLoading ? "#ccc" : `linear-gradient(135deg, ${ROYAL_GREEN}, ${DARK_GREEN})`,
              color: "white",
              border: "none",
              borderRadius: "16px",
              fontSize: "15px",
              fontFamily: "Playfair Display, serif",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            {isLoading ? "..." : mode === "login" ? t(lang, "login") : t(lang, "register")}
          </button>

          {mode === "login" && (
            <p style={{ fontSize: "12px", color: CHAMPAGNE_GOLD, textAlign: "center", fontFamily: "Inter, sans-serif", margin: "0 0 12px 0", cursor: "pointer" }}>
              {t(lang, "forgotPassword")}
            </p>
          )}

          <p style={{ fontSize: "13px", color: "#999", textAlign: "center", fontFamily: "Inter, sans-serif", margin: 0 }}>
            {mode === "login" ? t(lang, "noAccount") : t(lang, "hasAccount")}{" "}
            <span
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              style={{ color: ROYAL_GREEN, fontWeight: 600, cursor: "pointer" }}
            >
              {mode === "login" ? t(lang, "register") : t(lang, "login")}
            </span>
          </p>
        </div>

        {/* Language Selector */}
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "24px" }}>
          {[
            { code: "en" as const, label: "English" },
            { code: "ku" as const, label: "کوردی" },
            { code: "ar" as const, label: "العربية" },
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => useLanguageStore.getState().setLang(l.code)}
              style={{
                background: "none",
                border: "none",
                fontSize: "12px",
                fontFamily: "Inter, sans-serif",
                color: lang === l.code ? ROYAL_GREEN : "#999",
                fontWeight: lang === l.code ? 700 : 400,
                cursor: "pointer",
                textDecoration: lang === l.code ? "underline" : "none",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
