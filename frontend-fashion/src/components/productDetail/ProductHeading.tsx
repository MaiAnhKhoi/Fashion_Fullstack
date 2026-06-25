import type { ProductDetailResponse } from "@/types/product";
import { formatPrice } from "@/utils/formatPrice";

export default function ProductHeading({
  product,
}: {
  product: ProductDetailResponse;
}) {
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <div
      className={`tf-product-heading ${product.inStock ? "" : "pb-0 border-0"}`}
    >
      {product.brand && <span className="brand-product">{product.brand}</span>}
      <h5 className="product-name fw-medium">{product.title}</h5>

      <div className="product-rate">
        <div className="list-star">
          {Array.from({ length: 5 }).map((_, i) => (
            <i
              key={i}
              className="icon icon-star"
              style={{ opacity: i < Math.round(product.rating) ? 1 : 0.3 }}
            />
          ))}
        </div>
        <span className="count-review">({product.reviewCount} reviews)</span>
      </div>

      <div className="product-price">
        <div className="display-sm price-new price-on-sale">
          {formatPrice(product.price)}
        </div>
        {product.oldPrice && (
          <div className="display-sm price-old">
            {formatPrice(product.oldPrice)}
          </div>
        )}
        {discount && <span className="badge-sale">{discount}% Off</span>}
      </div>

      {product.inStock ? (
        <div className="product-stock">
          <span className="stock in-stock">In Stock</span>
          {product.soldLast24h > 0 && (
            <span className="text-dark">
              {product.soldLast24h} sold in last 24 hours
            </span>
          )}
        </div>
      ) : (
        <div className="product-stock">
          <span className="stock out-stock">Out of Stock</span>
        </div>
      )}

      {product.inStock && product.stockCount > 0 && product.stockCount <= 10 && (
        <div className="product-progress-sale">
          <div className="title-hurry-up">
            <span className="text-primary fw-medium">HURRY UP!</span> Only{" "}
            <span className="count">{product.stockCount}</span> items left!
          </div>
          <div className="progress-sold">
            <div
              className="value"
              style={{ width: `${Math.min(100, product.stockCount * 10)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
