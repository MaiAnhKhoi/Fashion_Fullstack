import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/api/cart.api";
import { useAuthStore } from "@/stores/auth.store";
import type { CartResponse } from "@/types/cart";

const CART_KEY = ["cart"];

export const useCart = () => {
  // Chưa đăng nhập -> không gọi /cart (backend yêu cầu auth).
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: CART_KEY,
    queryFn: getCart,
    enabled: !!accessToken,
    staleTime: 1000 * 60,
  });
};

// Mọi mutation đều trả về cart mới -> ghi thẳng vào cache, khỏi refetch.
const setCart = (qc: ReturnType<typeof useQueryClient>, cart: CartResponse) =>
  qc.setQueryData(CART_KEY, cart);

export const useAddCartItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      variantId,
      quantity = 1,
    }: {
      variantId: number;
      quantity?: number;
    }) => addCartItem(variantId, quantity),
    onSuccess: (cart) => setCart(qc, cart),
  });
};

export const useUpdateCartItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      variantId,
      quantity,
    }: {
      variantId: number;
      quantity: number;
    }) => updateCartItem(variantId, quantity),
    onSuccess: (cart) => setCart(qc, cart),
  });
};

export const useRemoveCartItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId }: { variantId: number }) =>
      removeCartItem(variantId),
    onSuccess: (cart) => setCart(qc, cart),
  });
};

export const useClearCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: (cart) => setCart(qc, cart),
  });
};
