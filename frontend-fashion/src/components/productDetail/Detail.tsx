"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import Slider from "./Slider";
import BoughtTogether from "./BoughtTogether";
import StickyProducts from "./StickyProducts";
import ProductHeading from "./ProductHeading";
import QuantitySelect from "@/components/common/QuantitySelect";
import { resolveColorHex } from "@/utils/color";
import { useAddCartItem } from "@/hooks/queries/useCart";
import {
  useWishList,
  useAddWishList,
  useRemoveWishList,
} from "@/hooks/queries/useWishList";
import { useCompareStore } from "@/stores/comepare.store";
import { useUIStore } from "@/stores/ui.store";
import type { ProductDetailResponse } from "@/types/product";

export default function Detail({
  product,
}: {
  product: ProductDetailResponse;
}) {
  const [quantity, setQuantity] = useState(1);
  const [activeColor, setActiveColor] = useState<string>(
    product.colors[0]?.value ?? "",
  );
  const [activeSize, setActiveSize] = useState<string | null>(
    product.sizes[0] ?? null,
  );

  const { mutate: addToCart, isPending: isAdding } = useAddCartItem();
  const { data: wishlistSet } = useWishList();
  const { mutate: addWish } = useAddWishList();
  const { mutate: removeWish } = useRemoveWishList();
  const { addCompareProduct, isAddedtoCompareItem } = useCompareStore();
  const { openModelCart } = useUIStore();

  const activeColorObj = product.colors.find((c) => c.value === activeColor);
  const activeColorLabel = activeColorObj?.label ?? activeColor;
  const isWish = wishlistSet?.has(product.id) ?? false;

  // variant.color backend trả về là LABEL -> match theo label + size.
  const selectedVariant = product.variants.find((v) => {
    const sizeOk = !product.sizes.length || v.size === activeSize;
    const colorOk = !product.colors.length || v.color === activeColorLabel;
    return sizeOk && colorOk;
  });

  // Ảnh: ảnh của màu đang chọn lên đầu, rồi tới allImages.
  const images = [
    ...new Set(
      [activeColorObj?.img, ...product.allImages, product.imgSrc].filter(
        Boolean,
      ) as string[],
    ),
  ];

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(
      { variantId: selectedVariant.id, quantity },
      { onSuccess: () => openModelCart() },
    );
  };

  const toggleWishlist = () => {
    if (isWish) removeWish({ productId: product.id });
    else addWish({ productId: product.id });
  };

  return (
    <section className="flat-single-product">
      <div className="tf-main-product section-image-zoom">
        <div className="container">
          <div className="row">
            {/* Product Images */}
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top">
                <div className="product-thumbs-slider">
                  <Slider images={images} activeImage={activeColorObj?.img} />
                </div>
              </div>
            </div>
            {/* Product Info */}
            <div className="col-md-6">
              <div className="tf-zoom-main" />
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-product-info-list other-image-zoom">
                  <ProductHeading product={product} />

                  <div className="tf-product-variant">
                    {product.colors.length > 0 && (
                      <div className="qc-block">
                        <div className="qc-label">
                          Color:<strong>{activeColorLabel}</strong>
                        </div>
                        <div className="qc-color-list">
                          {product.colors.map((color) => (
                            <button
                              type="button"
                              key={color.value}
                              className={`qc-color-btn${
                                activeColor === color.value ? " active" : ""
                              }`}
                              onClick={() => setActiveColor(color.value)}
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
                    {product.sizes.length > 0 && (
                      <div className="qc-block">
                        <div className="qc-label">
                          Size:<strong>{activeSize}</strong>
                        </div>
                        <div className="qc-size-list">
                          {product.sizes.map((size) => (
                            <a
                              key={size}
                              className={`qc-size-btn${
                                activeSize === size ? " active" : ""
                              }`}
                              onClick={() => setActiveSize(size)}
                            >
                              {size}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="tf-product-total-quantity">
                    <div className="group-btn">
                      <QuantitySelect
                        quantity={quantity}
                        setQuantity={setQuantity}
                      />
                      <a
                        onClick={handleAddToCart}
                        className={`tf-btn hover-primary btn-add-to-cart ${
                          !selectedVariant || isAdding ? "disabled" : ""
                        }`}
                      >
                        {isAdding
                          ? "Đang thêm..."
                          : selectedVariant
                            ? "Add to cart"
                            : "Hết hàng"}
                      </a>
                    </div>
                    <a
                      href="#"
                      className="tf-btn btn-primary w-100 animate-btn"
                    >
                      Buy it now
                    </a>
                    <Link to={`/checkout`} className="more-choose-payment link">
                      More payment options
                    </Link>
                  </div>

                  <div className="tf-product-extra-link">
                    <a
                      onClick={toggleWishlist}
                      className={`product-extra-icon link btn-add-wishlist ${
                        isWish ? "added-wishlist" : ""
                      }`}
                    >
                      <i className="icon add icon-heart" />
                      <span className="add">Add to wishlist</span>
                      <i className="icon added icon-trash" />
                      <span className="added">Remove from wishlist</span>
                    </a>
                    <a
                      onClick={() => addCompareProduct(product)}
                      className="product-extra-icon link"
                    >
                      <i className="icon icon-compare2" />
                      {isAddedtoCompareItem(product.id)
                        ? "Already compared"
                        : "Add to Compare"}
                    </a>
                  </div>

                  <ul className="tf-product-cate-sku text-md">
                    <li className="item-cate-sku">
                      <span className="label">SKU:</span>
                      <span className="value">
                        {selectedVariant?.sku || product.sku}
                      </span>
                    </li>
                    {product.categories.length > 0 && (
                      <li className="item-cate-sku">
                        <span className="label">Categories:</span>
                        <span className="value">
                          {product.categories.join(", ")}
                        </span>
                      </li>
                    )}
                  </ul>

                  <div className="tf-product-delivery-return">
                    <div className="product-delivery">
                      <div className="icon icon-car2" />
                      <p className="text-md">
                        Estimated delivery time:
                        <span className="fw-medium">
                          3-5 days international
                        </span>
                      </p>
                    </div>
                    <div className="product-delivery">
                      <div className="icon icon-shipping3" />
                      <p className="text-md">
                        Free shipping on
                        <span className="fw-medium">all orders over $150</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="tf-product-fbt">
                  <div className="title text-xl fw-medium">
                    Frequently Bought Together
                  </div>
                  <BoughtTogether product={product} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StickyProducts
        product={product}
        quantity={quantity}
        setQuantity={setQuantity}
        onAddToCart={handleAddToCart}
        disabled={!selectedVariant || isAdding}
      />
    </section>
  );
}
