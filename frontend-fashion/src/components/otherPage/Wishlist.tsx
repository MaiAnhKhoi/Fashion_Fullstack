"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCardWishlist from "@/components/ProductCard/ProductCardWishlist";
import { useWishListProducts } from "@/hooks/queries/useWishList";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";

const PAGE_SIZE = 12;

export default function Wishlist() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const { openModelLogin } = useUIStore();

  const [page, setPage] = useState(1);
  const { data, isLoading } = useWishListProducts(page, PAGE_SIZE);

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <section className="s-account flat-spacing-4 pt-8">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {!accessToken ? (
              <div className="p-4">
                <div className="mb-3">
                  Vui lòng đăng nhập để xem danh sách yêu thích.
                </div>
                <button
                  className="tf-btn bg-dark-2 text-white animate-btn"
                  onClick={() => openModelLogin()}
                >
                  Đăng nhập
                </button>
              </div>
            ) : isLoading ? (
              <p className="p-4">Đang tải...</p>
            ) : items.length ? (
              <>
                <div
                  className="wrapper-shop tf-grid-layout tf-col-2 lg-col-3 xl-col-4 style-1"
                  id="gridLayout"
                >
                  {items.map((product) => (
                    <ProductCardWishlist key={product.id} product={product} />
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <ul className="wg-pagination justify-content-center">
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1,
                    ).map((p) => (
                      <li key={p} className={p === page ? "active" : ""}>
                        {p === page ? (
                          <div className="pagination-item">{p}</div>
                        ) : (
                          <a
                            className="pagination-item"
                            onClick={() => setPage(p)}
                          >
                            {p}
                          </a>
                        )}
                      </li>
                    ))}
                    {pagination.hasNext && (
                      <li>
                        <a
                          className="pagination-item"
                          onClick={() => setPage((prev) => prev + 1)}
                        >
                          <i className="icon-arr-right2" />
                        </a>
                      </li>
                    )}
                  </ul>
                )}
              </>
            ) : (
              <div className="p-4">
                <div>
                  Danh sách yêu thích trống. Hãy thêm sản phẩm bạn thích!
                </div>{" "}
                <Link
                  className="tf-btn btn-dark2 animate-btn mt-3"
                  to="/shop-default"
                >
                  Khám phá sản phẩm
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
