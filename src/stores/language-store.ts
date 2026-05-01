import { create } from "zustand";
import type { Language } from "../lib/types";

interface LanguageState {
  lang: Language;
  setLang: (lang: Language) => void;
}

const stored = typeof window !== "undefined" ? localStorage.getItem("sg-lang") : null;

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: (stored as Language) || "en",
  setLang: (lang) => {
    if (typeof window !== "undefined") localStorage.setItem("sg-lang", lang);
    set({ lang });
  },
}));
