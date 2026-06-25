import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useUIStore } from "@/stores/ui.store";
import { useProduct } from "@/hooks/queries/useProduct";
import {
  useWishList,
  useAddWishList,
  useRemoveWishList,
} from "@/hooks/queries/useWishList";
import { useCompareStore } from "@/stores/comepare.store";
import { useAddCartItem } from "@/hooks/queries/useCart";
import { useModal } from "@/hooks/ui/useModal";
import { formatPrice } from "@/utils/formatPrice";
import { resolveColorHex } from "@/utils/color";
import type { ProductDetailResponse } from "@/types/product";

import QuantitySelect from "../common/QuantitySelect";

export default function QuickCartModal() {
  const {
    isModelProductDetail,
    selectedProductId,
    closeModelProductDetail,
    openModelCart,
  } = useUIStore();

  // zustand điều khiển, Bootstrap lo animation modal + backdrop + ESC.
  const ref = useModal<HTMLDivElement>(
    isModelProductDetail,
    closeModelProductDetail,
  );

  const { data: product } = useProduct(selectedProductId!);

  const { mutate: addToWishlist, isPending: isAdding } = useAddWishList();
  const { mutate: removeFromWishlist, isPending: isRemoving } =
    useRemoveWishList();
  const { data: wishlistSet } = useWishList();
  const { isAddedtoCompareItem, addCompareProduct } = useCompareStore();
  const { mutate: addToCart, isPending: isAddingToCart } = useAddCartItem();

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Giữ lại product cuối cùng để vẫn hiển thị trong lúc Bootstrap trượt ra
  // (lúc đóng, selectedProductId bị clear nên query không còn data).
  const [displayProduct, setDisplayProduct] =
    useState<ProductDetailResponse | null>(null);
  if (product && product !== displayProduct) {
    setDisplayProduct(product);
  }

  const prevIdRef = useRef<number | null>(null);

  // RESET khi đổi product
  useEffect(() => {
    if (!selectedProductId) return;
    if (prevIdRef.current !== selectedProductId) {
      setSelectedColor(null);
      setSelectedSize(null);
      setQuantity(1);
      prevIdRef.current = selectedProductId;
    }
  }, [selectedProductId]);

  const data = displayProduct;

  const discountPercent = data?.oldPrice
    ? Math.round(((data.oldPrice - data.price) / data.oldPrice) * 100)
    : null;

  const isAddedtoWishlist = data ? (wishlistSet?.has(data.id) ?? false) : false;

  const activeColor = selectedColor ?? data?.colors?.[0]?.value ?? "";
  const activeSize = selectedSize ?? data?.sizes?.[0] ?? "";

  const activeColorLabel =
    data?.colors?.find((c) => c.value === activeColor)?.label ?? activeColor;

  // Tìm variant khớp màu (theo label) + size đang chọn.
  // Bỏ qua chiều nào sản phẩm không có (chỉ có màu hoặc chỉ có size).
  const selectedVariant = data?.variants.find((v) => {
    const sizeOk = !data.sizes?.length || v.size === activeSize;
    const colorOk = !data.colors?.length || v.color === activeColorLabel;
    return sizeOk && colorOk;
  });

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(
      { variantId: selectedVariant.id, quantity },
      {
        onSuccess: () => {
          closeModelProductDetail();
          openModelCart(); // mở luôn giỏ hàng cho người dùng thấy
        },
      },
    );
  };

  return (
    <div
      ref={ref}
      className="modal fade"
      id="quickView"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content quick-cart-modal">
          {data && (
            <>
              {/* CLOSE */}
              <span
                className="icon-close quick-cart-close"
                onClick={() => closeModelProductDetail()}
              />

              {/* HEADER */}
              <div className="quick-cart-header">
                <div className="quick-cart-image">
                  <img src={data.imgSrc} alt={data.title ?? ""} />
                </div>

                <div className="quick-cart-title-wrap">
                  <h3 className="product-title">
                    <Link
                      to={`/product-detail/${data.id}`}
                      className="link"
                      onClick={() => closeModelProductDetail()}
                    >
                      {data.title}
                    </Link>
                  </h3>

                  <div className="price-wrap">
                    <span className="price-new">{formatPrice(data.price)}</span>

                    {data.oldPrice && (
                      <span className="price-old">
                        {formatPrice(data.oldPrice)}
                      </span>
                    )}

                    {discountPercent ? (
                      <span className="badge-sale">{discountPercent}% Off</span>
                    ) : null}
                  </div>
                </div>
              </div>

              <hr className="quick-cart-divider" />

              {/* COLOR */}
              {data.colors?.length > 0 && (
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

              {/* SIZE */}
              {data.sizes?.length > 0 && (
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

              {/* QUANTITY */}
              <div className="qc-block qc-quantity">
                <div className="qc-label">Quantity</div>
                <QuantitySelect quantity={quantity} setQuantity={setQuantity} />
              </div>

              {/* ACTION ROW */}
              <div className="action-row">
                <a
                  className={`tf-btn add-cart-btn${
                    !selectedVariant || isAddingToCart ? " disabled" : ""
                  }`}
                  onClick={handleAddToCart}
                >
                  {isAddingToCart
                    ? "Adding..."
                    : selectedVariant
                      ? "Add to cart"
                      : "Unavailable"}
                </a>

                <a
                  onClick={() => {
                    if (isAddedtoWishlist) {
                      if (!isRemoving)
                        removeFromWishlist({ productId: data.id });
                    } else {
                      if (!isAdding) addToWishlist({ productId: data.id });
                    }
                  }}
                  className={`box-icon hover-tooltip tooltip-top${
                    isAddedtoWishlist ? " addwishlist" : ""
                  }`}
                >
                  <span
                    className={`icon ${
                      isAddedtoWishlist ? "icon-trash" : "icon-heart2"
                    }`}
                  />
                  <span className="tooltip">
                    {isAddedtoWishlist ? "Remove Wishlist" : "Add to Wishlist"}
                  </span>
                </a>

                <a
                  onClick={() => addCompareProduct(data)}
                  className="box-icon hover-tooltip tooltip-top compare"
                >
                  <span className="icon icon-compare" />
                  <span className="tooltip">
                    {isAddedtoCompareItem(data.id)
                      ? "Already compared"
                      : "Add to Compare"}
                  </span>
                </a>
              </div>

              {/* BUY IT NOW */}
              <a className="tf-btn btn-primary buy-now-btn">Buy It Now</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
