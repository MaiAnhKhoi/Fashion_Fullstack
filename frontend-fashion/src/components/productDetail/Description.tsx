import type { ProductDetailResponse } from "@/types/product";

export default function Description({
  product,
}: {
  product: ProductDetailResponse;
}) {
  if (!product.description) {
    return <p className="item">Chưa có mô tả cho sản phẩm này.</p>;
  }
  // Mỗi đoạn (xuống dòng) thành 1 paragraph.
  return (
    <div className="item">
      {product.description.split("\n").map((line, i) =>
        line.trim() ? <p key={i}>{line}</p> : null,
      )}
    </div>
  );
}
