import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getProductDetail,
  getProductBestSeller,
  getProductTodaysPick,
  searchProducts,
  getProducts,
  getProductFilters,
  getProductReviews,
  getProductsBoughtTogether,
  getReviewEligibility,
  createProductReview,
} from "@/api/product.api";
import { useAuthStore } from "@/stores/auth.store";
import type { ProductQuery, CreateReviewInput } from "@/types/product";

export const useProductReviews = (id: number) => {
  return useQuery({
    queryKey: ["product", id, "reviews"],
    queryFn: () => getProductReviews(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
};

// Quyền đánh giá: chỉ gọi khi đã đăng nhập (cần token).
export const useReviewEligibility = (id: number) => {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["product", id, "review-eligibility"],
    queryFn: () => getReviewEligibility(id),
    enabled: !!id && !!accessToken,
    staleTime: 60 * 1000,
  });
};

export const useCreateReview = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReviewInput) => createProductReview(id, input),
    onSuccess: () => {
      // Cập nhật lại danh sách review + quyền đánh giá.
      queryClient.invalidateQueries({ queryKey: ["product", id, "reviews"] });
      queryClient.invalidateQueries({
        queryKey: ["product", id, "review-eligibility"],
      });
    },
  });
};

// Danh sách sản phẩm (filter/sort/phân trang server-side).
export const useProducts = (query: ProductQuery) => {
  return useQuery({
    queryKey: ["products", "list", query],
    queryFn: () => getProducts(query),
    placeholderData: keepPreviousData, // không nhấp nháy khi đổi filter/trang
    staleTime: 30 * 1000,
  });
};

// Facets filter (đổi ít) -> cache lâu.
export const useProductFilters = () => {
  return useQuery({
    queryKey: ["products", "filters"],
    queryFn: getProductFilters,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchProducts = (q: string, page = 1, limit = 8) => {
  const query = q.trim();
  return useQuery({
    queryKey: ["products", "search", query, page, limit],
    queryFn: () => searchProducts(query, page, limit),
    enabled: query.length > 0,
    placeholderData: keepPreviousData, // giữ kết quả cũ khi gõ tiếp / đổi trang
    staleTime: 30 * 1000,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductDetail(id),
    staleTime: 10 * 60 * 1000, // 10 phút
    gcTime: 60 * 60 * 1000, // 1 giờ
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useBoughtTogether = (id: number, limit = 3) => {
  return useQuery({
    queryKey: ["product", id, "bought-together", limit],
    queryFn: () => getProductsBoughtTogether(id, limit),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useProductBestSellers = () => {
  return useQuery({
    queryKey: ["products", "best-sellers"],
    queryFn: getProductBestSeller,
    staleTime: 10 * 60 * 1000, // 10 phút
    gcTime: 60 * 60 * 1000, // 1 giờ
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useProductTodayPick = () => {
  return useQuery({
    queryKey: ["products", "today-pick"],
    queryFn: getProductTodaysPick,
    staleTime: 10 * 60 * 1000, // 10 phút
    gcTime: 60 * 60 * 1000, // 1 giờ
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
