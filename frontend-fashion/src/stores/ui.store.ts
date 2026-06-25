import { create } from "zustand";

interface UIStore {
  
  isModelCart: boolean;
  isModelProductDetail: boolean;
  isModelLogin: boolean;
  isModelSearch: boolean;
  selectedProductId: number | null;
  openModelProductDetail: (productId: number) => void;
  openModelLogin: () => void;
  closeModelLogin: () => void;
  closeModelProductDetail: () => void;
  openModelCart: () => void;
  closeModelCart: () => void;
  openModelSearch: () => void;
  closeModelSearch: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isModelProductDetail: false,
  isModelLogin: false,
  isModelCart: false,
  isModelSearch: false,
  selectedProductId: null,
  openModelProductDetail: (productId) =>
    set({ isModelProductDetail: true, selectedProductId: productId }),
  closeModelProductDetail: () =>
    set({ isModelProductDetail: false, selectedProductId: null }),
  openModelLogin: () => set({ isModelLogin: true }),
  closeModelLogin: () => set({ isModelLogin: false }),
  openModelCart: () => set({ isModelCart: true }),
  closeModelCart: () => set({ isModelCart: false }),
  openModelSearch: () => set({ isModelSearch: true }),
  closeModelSearch: () => set({ isModelSearch: false }),
}));
