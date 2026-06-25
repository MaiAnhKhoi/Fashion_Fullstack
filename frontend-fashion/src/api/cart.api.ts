import { api } from "@/lib/api";
import type { CartResponse, CartCountResponse } from "@/types/cart";

// Interceptor đã bóc 1 lớp -> response.data chính là phần "data" của body.

export const getCart = async (): Promise<CartResponse> => {
  const response = await api.get("/cart");
  return response.data as CartResponse;
};

export const getCartCount = async (): Promise<CartCountResponse> => {
  const response = await api.get("/cart/count");
  return response.data as CartCountResponse;
};

/** Thêm vào giỏ (cộng dồn theo variant). */
export const addCartItem = async (
  variantId: number,
  quantity = 1,
): Promise<CartResponse> => {
  const response = await api.post("/cart/items", { variantId, quantity });
  return response.data as CartResponse;
};

/** Đặt số lượng tuyệt đối cho 1 variant. */
export const updateCartItem = async (
  variantId: number,
  quantity: number,
): Promise<CartResponse> => {
  const response = await api.patch(`/cart/items/${variantId}`, { quantity });
  return response.data as CartResponse;
};

export const removeCartItem = async (
  variantId: number,
): Promise<CartResponse> => {
  const response = await api.delete(`/cart/items/${variantId}`);
  return response.data as CartResponse;
};

export const clearCart = async (): Promise<CartResponse> => {
  const response = await api.delete("/cart");
  return response.data as CartResponse;
};
