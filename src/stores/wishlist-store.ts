import { create } from "zustand";

interface WishlistState {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: [],
  toggle: (productId) => {
    set((state) => ({
      ids: state.ids.includes(productId)
        ? state.ids.filter((id) => id !== productId)
        : [...state.ids, productId],
    }));
  },
  has: (productId) => get().ids.includes(productId),
}));
