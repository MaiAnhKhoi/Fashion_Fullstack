// Tham số filter/sort cho danh sách sản phẩm (gửi lên API).
export interface ProductQuery {
  page?: number;
  limit?: number;
  sort?: string; // newest | price-asc | price-desc | title-asc | title-desc
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  brand?: string;
  inStock?: boolean;
  category?: string;
}

// Đánh giá sản phẩm (lấy từ /products/:id/reviews).
export interface ProductReview {
  id: number;
  userName: string;
  avatar: string | null;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string | null;
}
export interface ProductReviewsResponse {
  summary: {
    average: number;
    count: number;
    breakdown: { star: number; count: number }[];
  };
  items: ProductReview[];
}

export interface ReviewEligibility {
  canReview: boolean;
  hasPurchased: boolean;
  hasReviewed: boolean;
}

export interface CreateReviewInput {
  rating: number;
  title?: string | null;
  comment: string;
}

// Facets cho UI filter (lấy từ /products/filters).
export interface ColorFacet {
  name: string;
  label: string;
  value: string; // css class
}
export interface ProductFilters {
  colors: ColorFacet[];
  sizes: string[];
  brands: string[];
  priceRange: { min: number; max: number };
}

export interface ProductColor {
  label: string;
  value: string; // CSS class, e.g. "bg-yellow"
  img: string; // image URL when this color is selected
}

export interface ProductSize {
  value: string;
  label: string;
  display: string;
}

export interface ProductResponse {
  id: number;
  imgSrc: string;
  imgHover: string;
  saleLabel: string | null;
  title: string | null;
  price: number;
  oldPrice: number | null;
  sizes: string[];
  colors: ProductColor[];
  inStock: boolean;
  isTrending: boolean;
}

export interface ProductVariant {
  id: number;
  sku: string;

  size: string | null;
  color: string | null;

  stock: number;
  image: string | null;
}

// Extended response for the product detail page
export interface ProductDetailResponse extends ProductResponse {
  slug: string;
  description: string | null; // → Description1 section
  sku: string; // → "SKU: ..." label in Details1
  brand: string | null; // → brand name in ProductHeading
  categories: string[]; // → "Categories: ..." in Details1
  rating: number; // → star rating in ProductHeading
  reviewCount: number; // → "(N reviews)" in ProductHeading
  stockCount: number; // → "Only N items left" in ProductHeading
  soldLast24h: number; // → "N sold in last 24 hours" in ProductHeading
  allImages: string[]; // → all images for the Slider1 gallery
  variants: ProductVariant[];
}
