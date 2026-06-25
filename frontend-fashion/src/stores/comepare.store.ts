import type { ProductResponse } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareStore {
  products: ProductResponse[];
  isOpen: boolean;

  addCompareProduct: (product: ProductResponse) => void;
  isAddedtoCompareItem: (productId: number) => boolean;
  removeCompareProduct: (productId: number) => void;
  clearCompareProducts: () => void;
  openCompare: () => void;
  closeCompare: () => void;
  toggleCompare: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      products: [],
      isOpen: false,

      addCompareProduct: (product) =>
        set((state) => {
          const exists = state.products.some((p) => p.id === product.id);

          // Luôn mở modal (kể cả khi sản phẩm đã có) để store là nguồn
          // trạng thái duy nhất -> đóng/mở nhất quán.
          if (exists) return { isOpen: true };

          return {
            products: [...state.products, product],
            isOpen: true,
          };
        }),

      isAddedtoCompareItem: (productId) =>
        get().products.some((p) => p.id === productId),

      removeCompareProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        })),

      clearCompareProducts: () =>
        set({
          products: [],
        }),

      openCompare: () =>
        set({
          isOpen: true,
        }),

      closeCompare: () =>
        set({
          isOpen: false,
        }),

      toggleCompare: () =>
        set((state) => ({
          isOpen: !state.isOpen,
        })),
    }),
    {
      name: "compare-products",
      // Chỉ lưu danh sách sản phẩm, không lưu trạng thái mở/đóng modal.
      partialize: (state) => ({ products: state.products }),
    },
  ),
);
