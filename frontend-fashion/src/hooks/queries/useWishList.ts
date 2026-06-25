import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWishListIds,
  getWishListProducts,
  addWishList,
  removeWishList,
} from "@/api/wishlist.api";
import { useAuthStore } from "@/stores/auth.store";

const WISHLIST_KEY = ["wishList"];
const WISHLIST_PRODUCTS_KEY = ["wishListProducts"];

export const useWishList = () => {
  // subscribe reactive: khi đăng nhập (token xuất hiện) query tự chạy.
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: getWishListIds,

    enabled: !!accessToken, // chưa đăng nhập -> KHÔNG gọi /wishlists/ids
    select: (data) => new Set(data),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

// Danh sách sản phẩm đầy đủ trong wishlist (cho trang Wishlist) + phân trang.
export const useWishListProducts = (page = 1, limit = 12) => {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: [...WISHLIST_PRODUCTS_KEY, page, limit],
    queryFn: () => getWishListProducts(page, limit),
    enabled: !!accessToken,
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev, // giữ data cũ khi đổi trang (mượt)
  });
};

export const useAddWishList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId }: { productId: number }) =>
      addWishList(productId),
    // Cập nhật cache ngay -> wishlistSet đổi -> icon trái tim đổi tức thì.
    onSuccess: (_data, { productId }) => {
      queryClient.setQueryData<number[]>(WISHLIST_KEY, (old) =>
        old ? (old.includes(productId) ? old : [...old, productId]) : [productId],
      );
      queryClient.invalidateQueries({ queryKey: WISHLIST_PRODUCTS_KEY });
    },
  });
};

export const useRemoveWishList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId }: { productId: number }) =>
      removeWishList(productId),
    onSuccess: (_data, { productId }) => {
      queryClient.setQueryData<number[]>(WISHLIST_KEY, (old) =>
        old ? old.filter((id) => id !== productId) : old,
      );
      // Cập nhật ngay danh sách sản phẩm wishlist (gỡ khỏi trang Wishlist).
      queryClient.invalidateQueries({ queryKey: WISHLIST_PRODUCTS_KEY });
    },
  });
};
