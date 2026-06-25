"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { ProductResponse } from "@/types";
import { useQuickViewStore } from "@/stores/quickView.store";
import { useCompareStore } from "@/stores/comepare.store";
import { useUIStore } from "@/stores/ui.store";
import { useRemoveWishList } from "@/hooks/queries/useWishList";
import { formatPrice } from "@/utils/formatPrice";
import { resolveColorHex, isLightColorHex } from "@/utils/color";

export default function ProductCardWishlist({
  product,
  tooltipDirection = "top",
  textCenter = false,
}: {
  product: ProductResponse;
  tooltipDirection?: string;
  textCenter?: boolean;
}) {
  const [currentImage, setCurrentImage] = useState(product.imgSrc);

  const { mutate: removeFromWishlist, isPending: isRemoving } =
    useRemoveWishList();
  const { openQuickView } = useQuickViewStore();
  const { isAddedtoCompareItem, addCompareProduct } = useCompareStore();
  const { openModelProductDetail } = useUIStore();

  return (
    <div
      className={`card-product grid file-delete style-wishlist style-3 ${
        product.sizes?.length > 0 ? "card-product-size" : ""
      } ${product.inStock !== true ? "out-of-stock" : ""}`}
    >
      {/* Nút gỡ khỏi wishlist */}
      <i
        className="icon icon-close remove"
        onClick={() =>
          !isRemoving && removeFromWishlist({ productId: product.id })
        }
      />

      <div className="card-product-wrapper">
        <Link to={`/product-detail/${product.id}`} className="product-img">
          <img
            className="img-product lazyload"
            alt={product.title ?? "image-product"}
            src={currentImage}
            width={513}
            height={729}
          />
          <img
            className="img-hover lazyload"
            data-src={product.imgHover || product.imgSrc}
            alt={product.title ?? "image-product"}
            src={product.imgHover || product.imgSrc}
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
          <ul className="list-product-btn">
            <li>
              <a
                href="#productDetail"
                onClick={() => openModelProductDetail(product.id)}
                className={`hover-tooltip tooltip-${tooltipDirection} box-icon`}
              >
                <span className="icon icon-cart2" />
                <span className="tooltip">Add to Cart</span>
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
                  {isAddedtoCompareItem(product.id)
                    ? "Already compared"
                    : "Add to Compare"}
                </span>
              </a>
            </li>
          </ul>
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
          <span className={`price-new ${product.oldPrice ? "text-primary" : ""}`}>
            {formatPrice(product.price)}
          </span>{" "}
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
