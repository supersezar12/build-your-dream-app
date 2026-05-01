import { useEffect } from "react";
import { create } from "zustand";
import type { Language } from "../lib/types";

interface LanguageState {
  lang: Language;
  hydrated: boolean;
  setLang: (lang: Language) => void;
  _hydrate: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: "en",
  hydrated: false,
  setLang: (lang) => {
    if (typeof window !== "undefined") localStorage.setItem("sg-lang", lang);
    set({ lang });
  },
  _hydrate: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("sg-lang") as Language | null;
    set({ lang: stored || "en", hydrated: true });
  },
}));

// Auto-hydrate on the client after initial render to avoid SSR hydration mismatches.
if (typeof window !== "undefined") {
  // Defer to next tick so the first client render matches the server output.
  queueMicrotask(() => useLanguageStore.getState()._hydrate());
}

// Optional hook for components that need to know hydration status.
export function useLanguageHydration() {
  const hydrated = useLanguageStore((s) => s.hydrated);
  const hydrate = useLanguageStore((s) => s._hydrate);
  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);
  return hydrated;
}
