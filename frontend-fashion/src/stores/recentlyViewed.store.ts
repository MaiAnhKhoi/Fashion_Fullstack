import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductResponse } from "@/types/product";

const MAX = 12;

interface RecentlyViewedStore {
  products: ProductResponse[];
  addRecentlyViewed: (product: ProductResponse) => void;
  clear: () => void;
}

// Lưu sản phẩm xem gần đây vào localStorage (không cần API).
export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      products: [],
      addRecentlyViewed: (product) =>
        set((state) => ({
          products: [
            product,
            ...state.products.filter((p) => p.id !== product.id),
          ].slice(0, MAX),
        })),
      clear: () => set({ products: [] }),
    }),
    { name: "recently-viewed" },
  ),
);
