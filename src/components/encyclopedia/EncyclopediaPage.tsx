import { useState, useEffect } from "react";
import { Search, Heart, ChevronDown, ChevronUp, X } from "lucide-react";
import { useLanguageStore } from "../../stores/language-store";
import { t, getDirection } from "../../lib/i18n";
import type { Language } from "../../lib/types";
import {
  ROYAL_GREEN, CHAMPAGNE_GOLD, DARK_GREEN, LIGHT_GREEN, IVORY,
} from "../../lib/constants";
import {
  encyclopediaPlants, categoryColors, difficultyColors,
  type EncyclopediaPlant, type PlantCategory,
} from "../../lib/encyclopedia-data";

const categoryKeys: Record<PlantCategory | "all", string> = {
  all: "allLabel",
  tropical: "tropical",
  succulent: "succulent",
  aromatic: "aromatic",
  floral: "floral",
  tree: "tree",
};

function AnimatedGauge({ value, max, color, label, unit }: {
  value: number; max: number; color: string; label: string; unit: string;
}) {
  const [animated, setAnimated] = useState(false);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const pct = animated ? (value / max) : 0;
  const offset = circumference - pct * circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <div style={{ position: "relative", width: "64px", height: "64px" }}>
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke={LIGHT_GREEN} strokeWidth="7" />
          <circle
            cx="32" cy="32" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 32 32)"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: ROYAL_GREEN, fontFamily: "Inter, sans-serif" }}>
            {value}
          </span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "10px", color: "#999", fontFamily: "Inter, sans-serif", margin: "0 0 2px 0" }}>{label}</p>
        <p style={{ fontSize: "9px", color: CHAMPAGNE_GOLD, fontFamily: "Inter, sans-serif", margin: 0 }}>{unit}</p>
      </div>
    </div>
  );
}

function PlantDetail({ plant, lang, onClose, favorites, onToggleFavorite }: {
  plant: EncyclopediaPlant;
  lang: Language;
  onClose: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}) {
  const [expandedProblem, setExpandedProblem] = useState<number | null>(null);
  const isFav = favorites.includes(plant.id);

  const careRows = [
    { labelKey: "watering", value: plant.care.watering, icon: "💧" },
    { labelKey: "light", value: plant.care.light, icon: "☀️" },
    { labelKey: "humidityLabel", value: plant.care.humidity, icon: "🌊" },
    { labelKey: "temperatureLabel", value: plant.care.temperature, icon: "🌡️" },
    { labelKey: "soil", value: plant.care.soil, icon: "🌱" },
    { labelKey: "fertilizer", value: plant.care.fertilizer, icon: "🧪" },
    { labelKey: "repotting", value: plant.care.repotting, icon: "🪴" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: IVORY, overflowY: "auto" }}>
      {/* Hero */}
      <div style={{ height: "220px", background: `linear-gradient(160deg, ${LIGHT_GREEN}, ${ROYAL_GREEN}22)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "80px" }}>{plant.emoji}</div>

        {/* Close btn */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "56px", left: "16px",
            background: "white", border: "none", borderRadius: "20px",
            padding: "6px 14px", fontSize: "13px", fontFamily: "Inter, sans-serif",
            color: ROYAL_GREEN, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex", alignItems: "center", gap: "6px",
          }}
        >
          <X size={14} /> {t(lang, "close")}
        </button>

        {/* Favorite */}
        <button
          onClick={() => onToggleFavorite(plant.id)}
          style={{
            position: "absolute", top: "56px", right: "16px",
            background: "white", border: "none", borderRadius: "50%",
            width: "36px", height: "36px", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Heart size={18} color={isFav ? "#ef4444" : "#ccc"} fill={isFav ? "#ef4444" : "none"} />
        </button>

        {/* Badges */}
        <div style={{ position: "absolute", bottom: "16px", left: "16px", display: "flex", gap: "8px" }}>
          <span style={{
            background: `${difficultyColors[plant.difficulty]}20`,
            color: difficultyColors[plant.difficulty],
            padding: "4px 10px", borderRadius: "12px", fontSize: "11px",
            fontWeight: 600, fontFamily: "Inter, sans-serif",
            border: `1px solid ${difficultyColors[plant.difficulty]}30`,
          }}>
            {t(lang, plant.difficulty)}
          </span>
          <span style={{
            background: `${categoryColors[plant.category]}20`,
            color: categoryColors[plant.category],
            padding: "4px 10px", borderRadius: "12px", fontSize: "11px",
            fontWeight: 600, fontFamily: "Inter, sans-serif",
            border: `1px solid ${categoryColors[plant.category]}30`,
          }}>
            {t(lang, categoryKeys[plant.category])}
          </span>
        </div>
      </div>

      <div style={{ padding: "20px 20px 100px" }}>
        {/* Title */}
        <h1 style={{ fontSize: "24px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: "0 0 4px 0" }}>
          {plant.name}
        </h1>
        <p style={{ fontSize: "13px", color: "#999", fontFamily: "Inter, sans-serif", fontStyle: "italic", margin: "0 0 4px 0" }}>
          {plant.latinName}
        </p>
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <span style={{ fontSize: "11px", color: "#bbb", fontFamily: "Inter, sans-serif" }}>{t(lang, "family")}: {plant.family}</span>
          <span style={{ fontSize: "11px", color: "#bbb", fontFamily: "Inter, sans-serif" }}>{t(lang, "origin")}: {plant.origin}</span>
        </div>
        <p style={{ fontSize: "14px", color: "#555", fontFamily: "Inter, sans-serif", lineHeight: "1.7", margin: "0 0 24px 0" }}>
          {plant.description}
        </p>

        {/* Gauges */}
        <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: `1px solid ${CHAMPAGNE_GOLD}33`, marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{ fontSize: "16px" }}>📊</span>
            <h3 style={{ fontSize: "16px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: 0 }}>
              {t(lang, "careGuide")}
            </h3>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
            <AnimatedGauge value={plant.humidity} max={100} color="#3b82f6" label={t(lang, "humidityLabel")} unit="%" />
            <AnimatedGauge value={plant.light} max={100} color={CHAMPAGNE_GOLD} label={t(lang, "light")} unit="%" />
            <AnimatedGauge value={plant.wateringsPerMonth} max={10} color={ROYAL_GREEN} label={t(lang, "watering")} unit="×/mo" />
          </div>

          {/* Care details grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {careRows.map((row) => (
              <div key={row.labelKey} style={{ background: IVORY, borderRadius: "12px", padding: "10px 12px" }}>
                <p style={{ fontSize: "10px", color: "#bbb", fontFamily: "Inter, sans-serif", margin: "0 0 3px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {row.icon} {t(lang, row.labelKey)}
                </p>
                <p style={{ fontSize: "12px", color: "#444", fontFamily: "Inter, sans-serif", margin: 0, lineHeight: "1.4" }}>
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Did You Know */}
        <div style={{ background: LIGHT_GREEN, borderRadius: "20px", padding: "18px", marginBottom: "20px", border: `1px solid ${ROYAL_GREEN}22` }}>
          <h3 style={{ fontSize: "15px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            💡 {t(lang, "didYouKnow")}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {plant.didYouKnow.map((fact, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ background: ROYAL_GREEN, color: "white", borderRadius: "50%", width: "20px", height: "20px", minWidth: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: "13px", color: "#333", fontFamily: "Inter, sans-serif", margin: 0, lineHeight: "1.6" }}>
                  {fact}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Common Problems */}
        <div style={{ background: "white", borderRadius: "20px", padding: "18px", border: `1px solid ${CHAMPAGNE_GOLD}33` }}>
          <h3 style={{ fontSize: "15px", fontFamily: "Playfair Display, serif", color: ROYAL_GREEN, margin: "0 0 12px 0" }}>
            🩺 {t(lang, "commonProblems")}
          </h3>
          {plant.commonProblems.map((p, i) => (
            <div key={i} style={{ borderBottom: i < plant.commonProblems.length - 1 ? `1px solid ${IVORY}` : "none", paddingBottom: "10px", marginBottom: "10px" }}>
              <button
                onClick={() => setExpandedProblem(expandedProblem === i ? null : i)}
                style={{
                  width: "100%", background: "none", border: "none", cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: 0,
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 600, color: ROYAL_GREEN, fontFamily: "Inter, sans-serif", textAlign: "left" }}>
                  ⚠️ {p.problem}
                </span>
                {expandedProblem === i
                  ? <ChevronUp size={16} color="#999" />
                  : <ChevronDown size={16} color="#999" />}
              </button>
              {expandedProblem === i && (
                <p style={{ fontSize: "13px", color: "#555", fontFamily: "Inter, sans-serif", margin: "8px 0 0 0", lineHeight: "1.6", paddingLeft: "4px" }}>
                  ✅ {p.solution}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlantCard({ plant, lang, onSelect, isFavorite, onToggleFavorite }: {
  plant: EncyclopediaPlant;
  lang: Language;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <div
      style={{
        background: "white", borderRadius: "18px", overflow: "hidden",
        border: `1px solid ${CHAMPAGNE_GOLD}33`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
      }}
    >
      <div
        onClick={onSelect}
        style={{
          height: "100px", background: `linear-gradient(135deg, ${LIGHT_GREEN}, ${categoryColors[plant.category]}15)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "42px", cursor: "pointer", position: "relative",
        }}
      >
        {plant.emoji}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(plant.id); }}
          style={{
            position: "absolute", top: "8px", right: "8px", background: "white",
            border: "none", borderRadius: "50%", width: "26px", height: "26px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Heart size={12} color={isFavorite ? "#ef4444" : "#ccc"} fill={isFavorite ? "#ef4444" : "none"} />
        </button>
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <h4 onClick={onSelect} style={{ fontSize: "13px", fontWeight: 600, color: ROYAL_GREEN, fontFamily: "Playfair Display, serif", margin: "0 0 2px 0", cursor: "pointer" }}>
          {plant.name}
        </h4>
        <p style={{ fontSize: "10px", color: "#bbb", fontFamily: "Inter, sans-serif", fontStyle: "italic", margin: "0 0 8px 0" }}>
          {plant.latinName}
        </p>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          background: `${difficultyColors[plant.difficulty]}15`,
          color: difficultyColors[plant.difficulty],
          padding: "3px 8px", borderRadius: "8px", fontSize: "10px",
          fontWeight: 600, fontFamily: "Inter, sans-serif",
        }}>
          ● {t(lang, plant.difficulty)}
        </span>
      </div>
    </div>
  );
}

export function EncyclopediaPage() {
  const { lang } = useLanguageStore();
  const isRTL = getDirection(lang) === "rtl";
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<PlantCategory | "all">("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<EncyclopediaPlant | null>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  const filtered = encyclopediaPlants.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = !search || [p.name, p.latinName, p.family].some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchFav = !showFavoritesOnly || favorites.includes(p.id);
    return matchCat && matchSearch && matchFav;
  });

  const categories: (PlantCategory | "all")[] = ["all", "tropical", "succulent", "aromatic", "floral", "tree"];
  const catCount = (cat: PlantCategory | "all") =>
    cat === "all" ? encyclopediaPlants.length : encyclopediaPlants.filter((p) => p.category === cat).length;

  return (
    <>
      <div style={{ padding: "20px", paddingBottom: "100px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {[
            { labelKey: "species", value: encyclopediaPlants.length, icon: "📊" },
            { labelKey: "favorites", value: favorites.length, icon: "❤️" },
            { labelKey: "categories", value: 5, icon: "📦" },
          ].map((s) => (
            <div
              key={s.labelKey}
              style={{
                flex: 1, background: "white", borderRadius: "14px", padding: "12px",
                textAlign: "center", border: `1px solid ${CHAMPAGNE_GOLD}22`,
              }}
            >
              <div style={{ fontSize: "16px", marginBottom: "2px" }}>{s.icon}</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: ROYAL_GREEN, fontFamily: "Playfair Display, serif" }}>{s.value}</div>
              <div style={{ fontSize: "10px", color: "#999", fontFamily: "Inter, sans-serif" }}>{t(lang, s.labelKey)}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "14px" }}>
          <Search size={16} color="#999" style={{ position: "absolute", left: isRTL ? "auto" : "14px", right: isRTL ? "14px" : "auto", top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(lang, "searchPlants")}
            style={{
              width: "100%", padding: "12px 14px", paddingLeft: isRTL ? "14px" : "40px",
              paddingRight: isRTL ? "40px" : "14px",
              background: "white", border: `1px solid ${CHAMPAGNE_GOLD}33`,
              borderRadius: "14px", fontSize: "13px", fontFamily: "Inter, sans-serif",
              outline: "none", direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Category filters */}
        <div style={{ display: "flex", gap: "7px", marginBottom: "16px", overflowX: "auto", paddingBottom: "4px" }}>
          {categories.map((cat) => {
            const count = catCount(cat);
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "7px 14px", background: isActive ? ROYAL_GREEN : "white",
                  color: isActive ? "white" : "#666",
                  border: `1px solid ${isActive ? ROYAL_GREEN : CHAMPAGNE_GOLD + "33"}`,
                  borderRadius: "20px", fontSize: "12px", fontFamily: "Inter, sans-serif",
                  cursor: "pointer", whiteSpace: "nowrap",
                  fontWeight: isActive ? 600 : 400, display: "flex", alignItems: "center", gap: "5px",
                }}
              >
                {t(lang, categoryKeys[cat])}
                {count > 0 && (
                  <span style={{
                    background: isActive ? "rgba(255,255,255,0.25)" : LIGHT_GREEN,
                    color: isActive ? "white" : ROYAL_GREEN,
                    borderRadius: "10px", padding: "1px 7px", fontSize: "10px", fontWeight: 700,
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Results row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <span style={{ fontSize: "13px", color: "#999", fontFamily: "Inter, sans-serif" }}>
            {filtered.length} {t(lang, "plantsCount")}
          </span>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              background: showFavoritesOnly ? "#fef2f2" : "white",
              border: `1px solid ${showFavoritesOnly ? "#ef4444" : CHAMPAGNE_GOLD + "33"}`,
              borderRadius: "20px", padding: "5px 14px",
              fontSize: "12px", fontFamily: "Inter, sans-serif", cursor: "pointer",
              color: showFavoritesOnly ? "#ef4444" : "#666",
            }}
          >
            <Heart size={12} color={showFavoritesOnly ? "#ef4444" : "#ccc"} fill={showFavoritesOnly ? "#ef4444" : "none"} />
            {t(lang, "favorites")}
          </button>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {filtered.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                lang={lang}
                onSelect={() => setSelectedPlant(plant)}
                isFavorite={favorites.includes(plant.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
            <p style={{ color: "#999", fontFamily: "Inter, sans-serif" }}>{t(lang, "noPlants")}</p>
          </div>
        )}
      </div>

      {selectedPlant && (
        <PlantDetail
          plant={selectedPlant}
          lang={lang}
          onClose={() => setSelectedPlant(null)}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </>
  );
}
