"use client";
import { Link } from "react-router-dom";
import { useCompareStore } from "@/stores/comepare.store";
import { useUIStore } from "@/stores/ui.store";
import { formatPrice } from "@/utils/formatPrice";

export default function Compare() {
  const { products, removeCompareProduct } = useCompareStore();
  const { openModelProductDetail } = useUIStore();

  if (products.length === 0) {
    return (
      <section className="flat-spacing-15 pt-0">
        <div className="container">
          <div className="text-center p-5">
            <p className="mb-3">Chưa có sản phẩm nào để so sánh.</p>
            <Link to="/shop-default" className="tf-btn btn-dark2 animate-btn">
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flat-spacing-15 pt-0">
      <div className="container">
        <div className="tf-compare-table">
          {/* Hàng: ảnh + tên + giá + nút */}
          <div className="tf-compare-row tf-compare-grid">
            <div className="tf-compare-col d-md-block d-none" />
            {products.map((product) => (
              <div className="tf-compare-col" key={product.id}>
                <div className="tf-compare-item">
                  <Link
                    className="tf-compare-image"
                    to={`/product-detail/${product.id}`}
                  >
                    <img
                      className="lazyload"
                      src={product.imgSrc}
                      alt={product.title ?? "img-compare"}
                      width={320}
                      height={407}
                    />
                  </Link>
                  <div className="content">
                    <Link
                      className="tf-compare-title link text-md fw-medium"
                      to={`/product-detail/${product.id}`}
                    >
                      {product.title}
                    </Link>
                    <p className="price-wrap fw-medium text-md">
                      <span className="price-new text-primary">
                        {formatPrice(product.price)}
                      </span>{" "}
                      {product.oldPrice && (
                        <span className="price-old text-dark">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </p>
                    <div className="tf-compare-btn">
                      <a
                        className="tf-btn animate-btn w-100"
                        onClick={() => openModelProductDetail(product.id)}
                      >
                        Thêm vào giỏ
                      </a>
                    </div>
                  </div>
                  <div className="tf-compare-remove">
                    <span
                      className="tf-btn-icon line d-inline-flex"
                      onClick={() => removeCompareProduct(product.id)}
                    >
                      <i className="icon-close" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hàng: tình trạng kho */}
          <div className="tf-compare-row">
            <div className="tf-compare-col tf-compare-field d-md-block d-none">
              <p className="text-md fw-medium">Tình trạng</p>
            </div>
            {products.map((product) => (
              <div
                className={`tf-compare-col tf-compare-field tf-compare-stock ${
                  product.inStock ? "" : "text-red"
                }`}
                key={product.id}
              >
                <div className="icon">
                  <i className="icon-fill-check-circle" />
                </div>
                <span>{product.inStock ? "Còn hàng" : "Hết hàng"}</span>
              </div>
            ))}
          </div>

          {/* Hàng: màu sắc */}
          <div className="tf-compare-row">
            <div className="tf-compare-col tf-compare-field d-md-block d-none">
              <p className="text-md fw-medium">Màu sắc</p>
            </div>
            {products.map((product) => (
              <div
                className="tf-compare-col tf-compare-value text-center"
                key={product.id}
              >
                <p className="text-sm">
                  {product.colors?.length
                    ? product.colors.map((c) => c.label).join(", ")
                    : "—"}
                </p>
              </div>
            ))}
          </div>

          {/* Hàng: kích cỡ */}
          <div className="tf-compare-row">
            <div className="tf-compare-col tf-compare-field d-md-block d-none">
              <p className="text-md fw-medium">Kích cỡ</p>
            </div>
            {products.map((product) => (
              <div
                className="tf-compare-col tf-compare-value text-center"
                key={product.id}
              >
                <p className="text-sm">
                  {product.sizes?.length ? product.sizes.join(", ") : "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
