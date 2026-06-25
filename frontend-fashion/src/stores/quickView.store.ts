import { create } from "zustand";
import type { ProductResponse } from "@/types";

interface QuickViewStore {
  product: ProductResponse | null;
  isOpen: boolean;

  openQuickView: (product: ProductResponse) => void;
  closeQuickView: () => void;
}

export const useQuickViewStore = create<QuickViewStore>((set) => ({
  product: null,
  isOpen: false,

  openQuickView: (product) =>
    set({
      product,
      isOpen: true,
    }),

  closeQuickView: () =>
    set({
      product: null,
      isOpen: false,
    }),
}));
