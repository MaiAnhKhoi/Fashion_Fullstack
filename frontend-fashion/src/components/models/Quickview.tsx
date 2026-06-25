"use client";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useQuickViewStore } from "@/stores/quickView.store";
import { useUIStore } from "@/stores/ui.store";
import { useProduct } from "@/hooks/queries/useProduct";
import { useAddCartItem } from "@/hooks/queries/useCart";
import { useModal } from "@/hooks/ui/useModal";

import QuantitySelect from "@/components/common/QuantitySelect";
import { formatPrice } from "@/utils/formatPrice";
import { resolveColorHex } from "@/utils/color";
import type { ProductDetailResponse } from "@/types/product";

export default function QuickView() {
  const { product: quickProduct, isOpen, closeQuickView } = useQuickViewStore();
  const { openModelCart } = useUIStore();

  const ref = useModal<HTMLDivElement>(isOpen, closeQuickView);
  // id 0 -> useProduct disabled (không fetch khi chưa chọn sản phẩm).
  const { data: product } = useProduct(quickProduct?.id ?? 0);

  const { mutate: addToCart, isPending: isAddingToCart } = useAddCartItem();

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Giữ lại product cuối để vẫn hiển thị trong lúc đóng (modal luôn mount).
  const [displayProduct, setDisplayProduct] =
    useState<ProductDetailResponse | null>(null);
  if (product && product !== displayProduct) {
    setDisplayProduct(product);
  }

  const prevIdRef = useRef<number | null>(null);
  useEffect(() => {
    if (!quickProduct?.id) return;
    if (prevIdRef.current !== quickProduct.id) {
      setSelectedColor(null);
      setSelectedSize(null);
      setQuantity(1);
      prevIdRef.current = quickProduct.id;
    }
  }, [quickProduct?.id]);

  const data = displayProduct;

  const activeColor = selectedColor ?? data?.colors?.[0]?.value ?? "";
  const activeSize = selectedSize ?? data?.sizes?.[0] ?? "";

  const activeColorObj = data?.colors?.find((c) => c.value === activeColor);
  const activeColorLabel = activeColorObj?.label ?? activeColor;

  // Ảnh chính đổi theo màu đang chọn (fallback ảnh mặc định).
  const currentImage = activeColorObj?.img || data?.imgSrc || "";

  // variant.color backend trả về là LABEL -> match theo activeColorLabel.
  const selectedVariant = data?.variants.find((v) => {
    const sizeOk = !data.sizes.length || v.size === activeSize;
    const colorOk = !data.colors.length || v.color === activeColorLabel;
    return sizeOk && colorOk;
  });

  const discountPercent =
    data?.oldPrice && data.oldPrice > data.price
      ? Math.round(((data.oldPrice - data.price) / data.oldPrice) * 100)
      : null;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(
      { variantId: selectedVariant.id, quantity },
      {
        onSuccess: () => {
          closeQuickView();
          openModelCart();
        },
      },
    );
  };

  return (
    <div
      ref={ref}
      className="modal fade modalCentered modal-quick-view"
      id="quickViewProduct"
      tabIndex={-1}
      role="dialog"
      aria-hidden={!isOpen}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span
            className="icon-close icon-close-popup"
            onClick={() => closeQuickView()}
          />

          {data && (
            <>
              <div className="tf-product-media-wrap">
                <div className="item">
                  <img
                    className="lazyload"
                    alt={data.title ?? ""}
                    src={currentImage}
                    width={513}
                    height={729}
                  />
                </div>
              </div>

              <div className="tf-product-info-wrap">
                <div className="tf-product-info-inner">
                  <div className="tf-product-heading">
                    <h6 className="product-name">
                      <Link
                        to={`/product-detail/${data.id}`}
                        className="link"
                        onClick={() => closeQuickView()}
                      >
                        {data.title}
                      </Link>
                    </h6>
                    <div className="product-price">
                      <h6 className="price-new price-on-sale">
                        {formatPrice(data.price)}
                      </h6>
                      {data.oldPrice && (
                        <h6 className="price-old">
                          {formatPrice(data.oldPrice)}
                        </h6>
                      )}
                      {discountPercent && (
                        <span className="badge-sale">{discountPercent}% Off</span>
                      )}
                    </div>
                    {data.description && <p className="text">{data.description}</p>}
                  </div>

                  {data.colors.length > 0 && (
                    <div className="qc-block">
                      <div className="qc-label">
                        Color:<strong>{activeColorLabel}</strong>
                      </div>
                      <div className="qc-color-list">
                        {data.colors.map((color) => (
                          <button
                            type="button"
                            key={color.value}
                            className={`qc-color-btn${
                              activeColor === color.value ? " active" : ""
                            }`}
                            onClick={() => setSelectedColor(color.value)}
                            aria-label={color.label}
                          >
                            <span
                              className="swatch"
                              style={{
                                backgroundColor: resolveColorHex({
                                  cssClass: color.value,
                                  fallbackName: color.label,
                                }),
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.sizes.length > 0 && (
                    <div className="qc-block">
                      <div className="qc-label">
                        Size:<strong>{activeSize}</strong>
                      </div>
                      <div className="qc-size-list">
                        {data.sizes.map((size) => (
                          <a
                            key={size}
                            className={`qc-size-btn${
                              activeSize === size ? " active" : ""
                            }`}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="tf-product-total-quantity">
                    <div className="group-btn">
                      <QuantitySelect
                        quantity={quantity}
                        setQuantity={setQuantity}
                      />
                      <a
                        className={`tf-btn hover-primary${
                          !selectedVariant || isAddingToCart ? " disabled" : ""
                        }`}
                        onClick={handleAddToCart}
                      >
                        {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ"}
                      </a>
                    </div>
                    <a
                      href="#"
                      className="tf-btn w-100 animate-btn paypal btn-primary"
                    >
                      Buy It Now
                    </a>
                    <Link
                      to={`/checkout`}
                      className="more-choose-payment link"
                      onClick={() => closeQuickView()}
                    >
                      More payment options
                    </Link>
                  </div>

                  <Link
                    to={`/product-detail/${data.id}`}
                    className="view-details link"
                    onClick={() => closeQuickView()}
                  >
                    View full details <i className="icon icon-arrow-right" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
