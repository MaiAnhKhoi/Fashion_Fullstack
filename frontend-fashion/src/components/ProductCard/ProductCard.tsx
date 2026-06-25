"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { ProductResponse } from "@/types";
import { useQuickViewStore } from "@/stores/quickView.store";
import { useCompareStore } from "@/stores/comepare.store";
import { useUIStore } from "@/stores/ui.store";
import { useRemoveWishList, useWishList } from "@/hooks/queries/useWishList";
import { useAddWishList } from "@/hooks/queries/useWishList";
import { formatPrice } from "@/utils/formatPrice";
import { resolveColorHex, isLightColorHex } from "@/utils/color";

export default function ProductCard1({
  product,
  styleClass = "style-1",
  tooltipDirection = "left",
  textCenter = false,
  ratioClass = "",
}: {
  product: ProductResponse;
  styleClass?: string;
  tooltipDirection?: string;
  textCenter?: boolean;
  ratioClass?: string;
}) {
  const [currentImage, setCurrentImage] = useState(product.imgSrc);

  const { mutate: addToWishlist, isPending: isAdding } = useAddWishList();
  const { mutate: removeFromWishlist, isPending: isRemoving } = useRemoveWishList();

  const { openQuickView } = useQuickViewStore();
  const { isAddedtoCompareItem, addCompareProduct } = useCompareStore();
  const { openModelProductDetail } = useUIStore();
  const { data: wishlistSet } = useWishList();
  const isAddedtoWishlist = wishlistSet?.has(product.id) ?? false;
  return (
    <div
      className={`card-product ${
        product.sizes?.length > 0 ? "card-product-size" : ""
      } ${product.inStock !== true ? "out-of-stock" : ""} ${styleClass}`}
    >
      <div className={`card-product-wrapper ${ratioClass} `}>
        <Link to={`/product-detail/${product.id}`} className="product-img">
          <img
            className="img-product lazyload"
            alt="image-product"
            src={currentImage}
            width={513}
            height={729}
          />
          <img
            className="img-hover lazyload"
            data-src={product.imgHover}
            alt="image-product"
            src={product.imgHover}
            width={513}
            height={729}
          />
        </Link>
        {product.saleLabel && (
          <div className="on-sale-wrap">
            <span className="on-sale-item">{product.saleLabel}</span>
          </div>
        )}
        {product.isTrending && (
          <div className="on-sale-wrap">
            <span className="on-sale-item trending">Trending</span>
          </div>
        )}
        {product.inStock && (
          <>
            <ul className="list-product-btn">
              {!styleClass.includes("style-3") && (
                <li>
                  <a
                    href="#productDetail"
                    onClick={() => openModelProductDetail(product.id)}
                    className={`hover-tooltip tooltip-${tooltipDirection} box-icon`}
                  >
                    <span className="icon icon-cart2" />
                  </a>
                </li>
              )}
              <li
                className={`wishlist ${isAddedtoWishlist ? "addwishlist" : ""}`}
              >
                <a
                  onClick={() => {
                    if (isAddedtoWishlist) {
                      if (!isRemoving) removeFromWishlist({ productId: product.id });
                    } else {
                      if (!isAdding) addToWishlist({ productId: product.id });
                    }
                  }}
                  className={`hover-tooltip tooltip-${tooltipDirection} box-icon`}
                >
                  <span
                    className={`icon ${
                      isAddedtoWishlist ? "icon-trash" : "icon-heart2"
                    } `}
                  />
                  <span className="tooltip">
                    {" "}
                    {isAddedtoWishlist ? "Remove Wishlist" : "Add to Wishlist"}
                  </span>
                </a>
              </li>
              <li>
                <a
                  role="button"
                  onClick={() => openQuickView(product)}
                  className={`hover-tooltip tooltip-${tooltipDirection} box-icon quickview`}
                >
                  <span className="icon icon-view" />
                  <span className="tooltip">Quick View</span>
                </a>
              </li>
              <li className="compare">
                <a
                  role="button"
                  onClick={() => addCompareProduct(product)}
                  className={`hover-tooltip tooltip-${tooltipDirection} box-icon`}
                >
                  <span className="icon icon-compare" />
                  <span className="tooltip">
                    {" "}
                    {isAddedtoCompareItem(product.id)
                      ? "Already compared"
                      : "Add to Compare"}
                  </span>
                </a>
              </li>
            </ul>
            {styleClass.includes("style-3") && (
              <div className="product-btn-main">
                <a
                  href="#productDetail"
                  data-bs-toggle="offcanvas"
                  className="btn-main-product"
                  onClick={() => openModelProductDetail(product.id)}
                >
                  <span className="icon icon-cart2" />
                </a>
              </div>
            )}
            {product.sizes?.length > 0 && (
              <ul className="size-box">
                {product.sizes.map((size, index) => (
                  <li className="size-item text-xs text-white" key={index}>
                    {size}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <div className={`card-product-info ${textCenter ? "text-center" : ""} `}>
        <Link
          to={`/product-detail/${product.id}`}
          className="name-product link fw-medium text-md"
        >
          {product.title}
        </Link>
        <p className="price-wrap fw-medium">
          <span
            className={`price-new ${product.oldPrice ? "text-primary" : ""}`}
          >
            {formatPrice(product.price)}
          </span>

          {product.oldPrice && (
            <span className="price-old text-dark">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </p>
        {product.colors?.length > 0 && (
          <ul
            className={`list-color-product ${
              textCenter ? "justify-content-center" : ""
            } `}
          >
            {product.colors.map((color, index) => {
              // Hiển thị màu theo value (class bootstrap), fallback theo label.
              const colorHex = resolveColorHex({
                cssClass: color.value,
                fallbackName: color.label,
              });
              const isLight = isLightColorHex(colorHex);
              return (
                <li
                  className={`list-color-item color-swatch hover-tooltip tooltip-bot ${
                    currentImage == color.img ? "active" : ""
                  } ${isLight ? "line" : ""}`}
                  key={index}
                  onMouseOver={() => setCurrentImage(color.img)}
                >
                  <span className="tooltip color-filter">{color.label}</span>
                  <span
                    className="swatch-value"
                    style={{ backgroundColor: colorHex }}
                  />
                  <img
                    className="lazyload"
                    data-src={color.img}
                    alt="image-product"
                    src={color.img}
                    width="684"
                    height="972"
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
