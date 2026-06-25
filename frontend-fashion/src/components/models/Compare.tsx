"use client";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCompareStore } from "@/stores/comepare.store";
import { useUIStore } from "@/stores/ui.store";
import { formatPrice } from "@/utils/formatPrice";

export default function Compare() {
  const {
    products,
    isOpen,
    closeCompare,
    removeCompareProduct,
    clearCompareProducts,
  } = useCompareStore();
  const { openModelProductDetail } = useUIStore();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCompare();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCompare]);

  return (
    <>
      <div
        className={`modal modalCentered modal-compare fade${
          isOpen ? " show" : ""
        }`}
        id="compare"
        style={{ display: isOpen ? "block" : "none" }}
        tabIndex={-1}
        role="dialog"
        aria-hidden={!isOpen}
        // Click vùng nền (ngoài hộp thoại) -> đóng.
        onClick={(e) => {
          if (e.target === e.currentTarget) closeCompare();
        }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <span
              className="icon icon-close btn-hide-popup"
              onClick={() => closeCompare()}
            />
            <div className="modal-compare-wrap list-file-delete">
              <h6 className="title text-center">So sánh sản phẩm</h6>
              <div className="tf-compare-inner">
                {products.length ? (
                  <div className="tf-compare-list">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="tf-compare-item file-delete"
                      >
                        <span
                          className="icon-close remove"
                          onClick={() => removeCompareProduct(product.id)}
                        />
                        <Link
                          to={`/product-detail/${product.id}`}
                          className="image"
                          onClick={() => closeCompare()}
                        >
                          <img
                            className="lazyload"
                            alt={product.title ?? ""}
                            src={product.imgSrc}
                            width={1000}
                            height={1421}
                          />
                        </Link>
                        <div className="content">
                          <div className="text-title">
                            <Link
                              className="link text-line-clamp-2"
                              to={`/product-detail/${product.id}`}
                              onClick={() => closeCompare()}
                            >
                              {product.title}
                            </Link>
                          </div>
                          <p className="price-wrap">
                            <span className="new-price text-primary">
                              {formatPrice(product.price)}
                            </span>{" "}
                            {product.oldPrice && (
                              <span className="old-price text-decoration-line-through text-dark-1">
                                {formatPrice(product.oldPrice)}
                              </span>
                            )}
                          </p>
                          <div className="tf-compare-btn">
                            <a
                              className="tf-btn animate-btn w-100"
                              onClick={() => {
                                closeCompare();
                                openModelProductDetail(product.id);
                              }}
                            >
                              Thêm vào giỏ
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    Chưa có sản phẩm nào để so sánh. Hãy duyệt sản phẩm và thêm
                    vào để so sánh.
                  </div>
                )}
              </div>

              {products.length > 0 && (
                <div className="tf-compare-buttons justify-content-center">
                  <Link
                    to={`/compare`}
                    className="tf-btn animate-btn justify-content-center"
                    onClick={() => closeCompare()}
                  >
                    So sánh
                  </Link>
                  <div
                    className="tf-btn btn-out-line-dark justify-content-center clear-file-delete cursor-pointer"
                    onClick={() => clearCompareProducts()}
                  >
                    <span>Xoá tất cả</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop tự render -> không phụ thuộc Bootstrap JS, đóng chắc chắn */}
      {isOpen && (
        <div
          className="modal-backdrop fade show"
          onClick={() => closeCompare()}
        />
      )}
    </>
  );
}
