"use client";
import { useCallback, useEffect, useState } from "react";
import { useUIStore } from "@/stores/ui.store";
import { useModal } from "@/hooks/ui/useModal";
import { useSearchProducts } from "@/hooks/queries/useProduct";
import ProductCard from "@/components/ProductCard/ProductCard";

const POPULAR = ["Áo", "Quần", "Đầm", "Sale"];

export default function SearchModal() {
  const { isModelSearch, closeModelSearch } = useUIStore();

  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");

  // Đóng + reset từ khoá (gọi cho mọi đường đóng: X / backdrop / ESC).
  const handleClose = useCallback(() => {
    setTerm("");
    setDebounced("");
    closeModelSearch();
  }, [closeModelSearch]);

  const ref = useModal<HTMLDivElement>(isModelSearch, handleClose);

  // Debounce 350ms: gõ xong mới gọi API.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim()), 350);
    return () => clearTimeout(t);
  }, [term]);

  const { data, isFetching } = useSearchProducts(debounced, 1, 8);
  const items = data?.items ?? [];

  return (
    <div className="modal popup-search fade" id="search" ref={ref} tabIndex={-1}>
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="header">
            <button
              className="icon-close icon-close-popup"
              aria-label="Close"
              onClick={() => closeModelSearch()}
            />
          </div>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="looking-for-wrap">
                  <div className="heading">Bạn đang tìm gì?</div>
                  <form
                    className="form-search"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <fieldset className="text">
                      <input
                        type="text"
                        placeholder="Tìm sản phẩm..."
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        autoFocus
                      />
                    </fieldset>
                    <button type="submit">
                      <i className="icon icon-search" />
                    </button>
                  </form>
                  <div className="popular-searches justify-content-md-center">
                    <div className="text fw-medium">Tìm kiếm phổ biến:</div>
                    <ul>
                      {POPULAR.map((kw) => (
                        <li key={kw}>
                          <a
                            className="link"
                            role="button"
                            onClick={() => setTerm(kw)}
                          >
                            {kw}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-10">
                <div className="featured-product">
                  {debounced ? (
                    <>
                      <div className="text-xl-2 fw-medium featured-product-heading">
                        {isFetching
                          ? "Đang tìm..."
                          : `Kết quả cho "${debounced}" (${items.length})`}
                      </div>
                      {items.length > 0 ? (
                        <div className="tf-grid-layout tf-col-2 md-col-3 xl-col-4">
                          {items.map((product) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      ) : (
                        !isFetching && (
                          <p className="text-center">
                            Không tìm thấy sản phẩm phù hợp.
                          </p>
                        )
                      )}
                    </>
                  ) : (
                    <div className="text-xl-2 fw-medium featured-product-heading">
                      Nhập từ khoá để tìm sản phẩm
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
