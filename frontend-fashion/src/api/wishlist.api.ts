import { api } from "@/lib/api";
import type { ProductResponse } from "@/types/product";
import type { Paginated, Pagination } from "@/types/pagination";

// Lấy sản phẩm wishlist (đầy đủ) kèm phân trang.
export const getWishListProducts = async (
  page = 1,
  limit = 12,
): Promise<Paginated<ProductResponse>> => {
  // axios interceptor đã bóc 1 lớp -> response là body { data, pagination }.
  const response = (await api.get("/wishlists", {
    params: { page, limit },
  })) as unknown as { data: ProductResponse[]; pagination: Pagination };
  return { items: response.data, pagination: response.pagination };
};

export const getWishListIds = async () => {
    
  try {
    const response = await api.get("/wishlists/ids");
    return response.data as number[];
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    throw error;
  }
};

export const addWishList = async (productId: number) => {
  try {
    const response = await api.post("/wishlists", { productId });
    return response.data as number[];
  } catch (error) {
    console.error("Error adding to wishlists:", error);
    throw error;
  }
};

export const removeWishList = async (productId: number) => {
  try {
    const response = await api.delete(`/wishlists/${productId}`);
    return response.data as number[];
  } catch (error) {
    console.error("Error removing from wishlists:", error);
    throw error;
  }
};
