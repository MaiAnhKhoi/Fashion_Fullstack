interface CartItemResponse {
  id: number; // id dòng cart
  productId: number;
  variantId: number;
  slug: string;
  title: string;
  image: string;
  sku: string;
  size: string | null;
  color: string | null;
  unitPrice: number; // giá hiện tại của variant
  quantity: number;
  lineTotal: number; // unitPrice * quantity
  availableStock: number; // stock - reserved_stock
  inStock: boolean;
  /** true nếu quantity đang vượt tồn kho khả dụng (client nên điều chỉnh). */
  exceedsStock: boolean;
}

interface CartSummary {
  totalItems: number; // số dòng
  totalQuantity: number; // tổng số lượng sản phẩm
  subtotal: number; // tổng tiền các dòng còn hợp lệ
}

interface CartResponse {
  items: CartItemResponse[];
  summary: CartSummary;
  /** true nếu có ít nhất 1 dòng hết hàng hoặc vượt tồn kho. */
  hasIssues: boolean;
}

interface CartCountResponse {
  totalItems: number; // số dòng (số variant khác nhau)
  totalQuantity: number; // tổng số lượng sản phẩm
}

type MergeSkipReason = "not_found" | "unavailable" | "out_of_stock";

interface MergeReport {
  /** Item bị bỏ qua kèm lý do (variant không tồn tại / ngừng bán / hết hàng). */
  skipped: { variantId: number; reason: MergeSkipReason }[];
  /** Item bị giảm số lượng so với yêu cầu do giới hạn tồn kho / MAX. */
  adjusted: { variantId: number; requested: number; finalQuantity: number }[];
}

interface MergeCartResponse {
  cart: CartResponse;
  report: MergeReport;
}

export {
  CartItemResponse,
  CartSummary,
  CartResponse,
  CartCountResponse,
  MergeReport,
  MergeCartResponse,
};
