"use client";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import QuantitySelect from "../common/QuantitySelect";
import { formatPrice } from "@/utils/formatPrice";
import type { ProductDetailResponse } from "@/types/product";

export default function StickyProducts({
  product,
  quantity,
  setQuantity,
  onAddToCart,
  disabled = false,
}: {
  product: ProductDetailResponse;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  onAddToCart: () => void;
  disabled?: boolean;
}) {
  useEffect(() => {
    const handleScroll = () => {
      const el = document.querySelector(".tf-sticky-btn-atc");
      if (!el) return;
      el.classList.toggle("show", window.scrollY >= 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="tf-sticky-btn-atc">
      <div className="container">
        <div className="tf-height-observer w-100 d-flex align-items-center">
          <div className="tf-sticky-atc-product d-flex align-items-center">
            <div className="tf-sticky-atc-img">
              <img
                className="lazyload"
                alt={product.title ?? ""}
                src={product.imgSrc}
                width={828}
                height={1241}
              />
            </div>
            <div className="tf-sticky-atc-title fw-5 d-xl-block d-none">
              {product.title}
            </div>
          </div>
          <div className="tf-sticky-atc-infos">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="tf-sticky-atc-variant-price text-center fw-medium">
                {formatPrice(product.price)}
              </div>
              <div className="tf-sticky-atc-btns">
                <div className="tf-product-info-quantity">
                  <QuantitySelect quantity={quantity} setQuantity={setQuantity} />
                </div>
                <a
                  onClick={() => !disabled && onAddToCart()}
                  className={`tf-btn animate-btn d-inline-flex justify-content-center ${
                    disabled ? "disabled" : ""
                  }`}
                >
                  Add to cart
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
