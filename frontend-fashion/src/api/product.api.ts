import { api } from "@/lib/api";
import type {
  ProductResponse,
  ProductDetailResponse,
  ProductQuery,
  ProductFilters,
  ProductReviewsResponse,
  ProductReview,
  ReviewEligibility,
  CreateReviewInput,
} from "@/types/product";
import type { Paginated, Pagination } from "@/types/pagination";

// Danh sách sản phẩm có filter + sort + phân trang (server-side).
export const getProducts = async (
  query: ProductQuery = {},
): Promise<Paginated<ProductResponse>> => {
  const response = (await api.get("/products", { params: query })) as unknown as {
    data: ProductResponse[];
    pagination: Pagination;
  };
  return { items: response.data, pagination: response.pagination };
};

export const getProductFilters = async (): Promise<ProductFilters> => {
  const response = await api.get("/products/filters");
  return response.data as ProductFilters;
};

export const getProductReviews = async (
  id: number,
): Promise<ProductReviewsResponse> => {
  const response = await api.get(`/products/${id}/reviews`);
  return response.data as ProductReviewsResponse;
};

// Quyền đánh giá của user hiện tại với 1 sản phẩm (cần đăng nhập).
export const getReviewEligibility = async (
  id: number,
): Promise<ReviewEligibility> => {
  const response = await api.get(`/products/${id}/review-eligibility`);
  return response.data as ReviewEligibility;
};

// Gửi đánh giá (cần đăng nhập + đã mua). Trả về review vừa tạo.
export const createProductReview = async (
  id: number,
  input: CreateReviewInput,
): Promise<ProductReview> => {
  const response = await api.post(`/products/${id}/reviews`, input);
  return response.data as ProductReview;
};

export const searchProducts = async (
  q: string,
  page = 1,
  limit = 8,
): Promise<Paginated<ProductResponse>> => {
  const response = (await api.get("/products/search", {
    params: { q, page, limit },
  })) as unknown as { data: ProductResponse[]; pagination: Pagination };
  return { items: response.data, pagination: response.pagination };
};

export const getProductBestSeller = async () => {
    try {
        const response = await api.get("/products/best-sellers");
        return response.data as ProductResponse[];
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export const getProductTodaysPick = async () => {
    try {
        const response = await api.get("/products/todays-picks");
        return response.data as ProductResponse[];
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export const getProductsBoughtTogether = async (
  id: number,
  limit = 3,
): Promise<ProductResponse[]> => {
  const response = await api.get(`/products/${id}/bought-together`, {
    params: { limit },
  });
  return response.data as ProductResponse[];
};

export const getProductDetail = async (id: number) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data as ProductDetailResponse;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}