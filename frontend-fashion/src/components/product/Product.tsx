"use client";

import { useEffect, useReducer, useState } from "react";
import ListProducts from "./ListProducts";
import GridProducts from "./GridProducts";
import FilterModal from "./FilterModal";
import LayoutHandler from "./LayoutHandler";
import { initialState, reducer } from "@/components/reducer/filterReducer";
import { useProducts, useProductFilters } from "@/hooks/queries/useProduct";
import type { ProductQuery } from "@/types/product";

const SORT_OPTIONS = [
  "Sort by (Default)",
  "Title Ascending",
  "Title Descending",
  "Price Ascending",
  "Price Descending",
];

const SORT_MAP: Record<string, string | undefined> = {
  "Sort by (Default)": undefined,
  "Title Ascending": "title-asc",
  "Title Descending": "title-desc",
  "Price Ascending": "price-asc",
  "Price Descending": "price-desc",
};

export default function Products({
  fullWidth = false,
  cardStyleClass,
  tooltipDirection,
  parentClass = "flat-spacing-24",
}: {
  fullWidth?: boolean;
  cardStyleClass?: string;
  tooltipDirection?: string;
  parentClass?: string;
}) {
  const [activeLayout, setActiveLayout] = useState(4);
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    price,
    availability,
    color,
    size,
    brands,
    sortingOption,
    currentPage,
    itemPerPage,
  } = state;

  const { data: facets } = useProductFilters();

  // Khởi tạo khoảng giá theo facets (1 lần khi tải xong).
  useEffect(() => {
    if (facets && price[0] === 0 && price[1] === 0) {
      dispatch({
        type: "SET_PRICE",
        payload: [facets.priceRange.min, facets.priceRange.max],
      });
    }
  }, [facets, price]);

  const priceActive =
    !!facets &&
    (price[0] > facets.priceRange.min || price[1] < facets.priceRange.max);

  // Build query gửi lên server (chỉ gửi field đang filter).
  const query: ProductQuery = {
    page: currentPage,
    limit: itemPerPage,
    sort: SORT_MAP[sortingOption],
    color: color !== "All" ? color : undefined,
    size: size !== "All" ? size : undefined,
    brand: brands !== "All" ? brands : undefined,
    inStock:
      availability === true ? true : availability === false ? false : undefined,
    minPrice: priceActive ? price[0] : undefined,
    maxPrice: priceActive ? price[1] : undefined,
  };

  const { data, isFetching } = useProducts(query);
  const items = data?.items ?? [];
  const pagination = data?.pagination;

  const allProps = {
    ...state,
    facets,
    setPrice: (value: [number, number]) =>
      dispatch({ type: "SET_PRICE", payload: value }),
    setColor: (value: string) =>
      dispatch({
        type: "SET_COLOR",
        payload: value === color ? "All" : value,
      }),
    setSize: (value: string) =>
      dispatch({ type: "SET_SIZE", payload: value === size ? "All" : value }),
    setAvailability: (value: "All" | boolean) =>
      dispatch({
        type: "SET_AVAILABILITY",
        payload: value === availability ? "All" : value,
      }),
    setBrands: (value: string) =>
      dispatch({
        type: "SET_BRANDS",
        payload: value === brands ? "All" : value,
      }),
    setSortingOption: (value: string) =>
      dispatch({ type: "SET_SORTING_OPTION", payload: value }),
    setCurrentPage: (value: number) =>
      dispatch({ type: "SET_CURRENT_PAGE", payload: value }),
    setItemPerPage: (value: number) =>
      dispatch({ type: "SET_ITEM_PER_PAGE", payload: value }),
    clearFilter: () =>
      dispatch({
        type: "CLEAR_FILTER",
        payload: facets
          ? [facets.priceRange.min, facets.priceRange.max]
          : undefined,
      }),
  };

  const hasActiveFilter =
    availability !== "All" ||
    brands !== "All" ||
    color !== "All" ||
    size !== "All" ||
    priceActive;

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;
    return (
      <ul className="wg-pagination">
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
          (p) => (
            <li key={p} className={p === currentPage ? "active" : ""}>
              {p === currentPage ? (
                <div className="pagination-item">{p}</div>
              ) : (
                <a
                  className="pagination-item"
                  role="button"
                  onClick={() => allProps.setCurrentPage(p)}
                >
                  {p}
                </a>
              )}
            </li>
          ),
        )}
        {pagination.hasNext && (
          <li>
            <a
              className="pagination-item"
              role="button"
              onClick={() => allProps.setCurrentPage(currentPage + 1)}
            >
              <i className="icon-arr-right2" />
            </a>
          </li>
        )}
      </ul>
    );
  };

  return (
    <>
      <section className={parentClass}>
        <div className={fullWidth ? "container-full" : "container"}>
          <div className="tf-shop-control">
            <div className="tf-group-filter">
              <a
                href="#filterShop"
                data-bs-toggle="offcanvas"
                aria-controls="filterShop"
                className="tf-btn-filter"
              >
                <span className="icon icon-filter" />
                <span className="text">Filter</span>
              </a>
              <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
                <div className="btn-select">
                  <span className="text-sort-value">{sortingOption}</span>
                  <span className="icon icon-arr-down" />
                </div>
                <div className="dropdown-menu">
                  {SORT_OPTIONS.map((elm) => (
                    <div
                      key={elm}
                      className={`select-item ${
                        sortingOption === elm ? "active" : ""
                      }`}
                      onClick={() => allProps.setSortingOption(elm)}
                    >
                      <span className="text-value-item">{elm}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ul className="tf-control-layout">
              <LayoutHandler
                setActiveLayout={setActiveLayout}
                activeLayout={activeLayout}
              />
            </ul>
          </div>

          <div className="wrapper-control-shop">
            {hasActiveFilter && (
              <div className="meta-filter-shop">
                <div id="product-count-grid" className="count-text">
                  <span className="count">{pagination?.total ?? items.length}</span>{" "}
                  Product{(pagination?.total ?? items.length) > 1 ? "s" : ""} found
                </div>

                <div id="applied-filters">
                  {availability !== "All" && (
                    <span
                      className="filter-tag"
                      onClick={() => allProps.setAvailability("All")}
                    >
                      <span className="remove-tag icon-close" /> Availability:{" "}
                      {availability ? "In Stock" : "Out of Stock"}
                    </span>
                  )}
                  {brands !== "All" && (
                    <span
                      className="filter-tag"
                      onClick={() => allProps.setBrands("All")}
                    >
                      <span className="remove-tag icon-close" /> Brand: {brands}
                    </span>
                  )}
                  {priceActive && (
                    <span
                      className="filter-tag"
                      onClick={() =>
                        facets &&
                        allProps.setPrice([
                          facets.priceRange.min,
                          facets.priceRange.max,
                        ])
                      }
                    >
                      <span className="remove-tag icon-close" /> Price: {price[0]}{" "}
                      - {price[1]}
                    </span>
                  )}
                  {color !== "All" && (
                    <span
                      className="filter-tag"
                      onClick={() => allProps.setColor("All")}
                    >
                      <span className="remove-tag icon-close" /> Color: {color}
                    </span>
                  )}
                  {size !== "All" && (
                    <span
                      className="filter-tag"
                      onClick={() => allProps.setSize("All")}
                    >
                      <span className="remove-tag icon-close" /> Size: {size}
                    </span>
                  )}
                </div>

                <button
                  className="remove-all-filters"
                  onClick={allProps.clearFilter}
                >
                  <i className="icon icon-close" /> Clear all filter
                </button>
              </div>
            )}

            {isFetching && items.length === 0 ? (
              <p className="p-4">Đang tải sản phẩm...</p>
            ) : items.length === 0 ? (
              <p className="p-4">Không tìm thấy sản phẩm phù hợp.</p>
            ) : activeLayout === 1 ? (
              <div className="tf-list-layout wrapper-shop" id="listLayout">
                <ListProducts products={items} />
                {renderPagination()}
              </div>
            ) : (
              <div
                className={`wrapper-shop tf-grid-layout tf-col-${activeLayout}`}
                id="gridLayout"
              >
                <GridProducts
                  cardStyleClass={cardStyleClass}
                  products={items}
                  tooltipDirection={tooltipDirection}
                />
                {renderPagination()}
              </div>
            )}
          </div>
        </div>
      </section>

      <FilterModal allProps={allProps} />
    </>
  );
}
