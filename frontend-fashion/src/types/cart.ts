// Khớp với backend cart.response.ts

export interface CartItemResponse {
  id: number; // id dòng cart
  productId: number;
  variantId: number;
  slug: string;
  title: string;
  image: string;
  sku: string;
  size: string | null;
  color: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  availableStock: number;
  inStock: boolean;
  /** true nếu quantity đang vượt tồn kho khả dụng. */
  exceedsStock: boolean;
}

export interface CartSummary {
  totalItems: number; // số dòng
  totalQuantity: number; // tổng số lượng sản phẩm
  subtotal: number; // tổng tiền các dòng còn hợp lệ
}

export interface CartResponse {
  items: CartItemResponse[];
  summary: CartSummary;
  /** true nếu có ít nhất 1 dòng hết hàng hoặc vượt tồn kho. */
  hasIssues: boolean;
}

export interface CartCountResponse {
  totalItems: number;
  totalQuantity: number;
}
