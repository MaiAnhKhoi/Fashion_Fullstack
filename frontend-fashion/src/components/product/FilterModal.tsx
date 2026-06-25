"use client";
import Slider from "rc-slider";
import type { FilterState } from "@/components/reducer/filterReducer";
import type { ProductFilters } from "@/types/product";
import { resolveColorHex, isLightColorHex } from "@/utils/color";

export interface FilterControls extends FilterState {
  facets?: ProductFilters;
  setPrice: (v: [number, number]) => void;
  setColor: (v: string) => void;
  setSize: (v: string) => void;
  setAvailability: (v: "All" | boolean) => void;
  setBrands: (v: string) => void;
  setSortingOption: (v: string) => void;
  setCurrentPage: (v: number) => void;
  setItemPerPage: (v: number) => void;
  clearFilter: () => void;
}

export default function FilterModal({
  allProps,
}: {
  allProps: FilterControls;
}) {
  const { facets } = allProps;

  return (
    <div
      className="offcanvas offcanvas-start canvas-sidebar canvas-filter"
      id="filterShop"
    >
      <div className="canvas-wrapper">
        <div className="canvas-header">
          <span className="title">Filter</span>
          <button
            className="icon-close icon-close-popup"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="canvas-body">
          {/* Availability */}
          <div className="widget-facet">
            <div className="facet-title text-xl fw-medium">
              <span>Tình trạng</span>
            </div>
            <ul className="collapse-body filter-group-check current-scrollbar">
              <li
                className="list-item"
                onClick={() => allProps.setAvailability(true)}
              >
                <input
                  type="radio"
                  name="availability"
                  className="tf-check"
                  readOnly
                  checked={allProps.availability === true}
                />
                <label className="label">
                  <span>Còn hàng</span>
                </label>
              </li>
              <li
                className="list-item"
                onClick={() => allProps.setAvailability(false)}
              >
                <input
                  type="radio"
                  name="availability"
                  className="tf-check"
                  readOnly
                  checked={allProps.availability === false}
                />
                <label className="label">
                  <span>Hết hàng</span>
                </label>
              </li>
            </ul>
          </div>

          {/* Price */}
          {facets && facets.priceRange.max > facets.priceRange.min && (
            <div className="widget-facet">
              <div className="facet-title text-xl fw-medium">
                <span>Giá</span>
              </div>
              <div className="collapse-body widget-price filter-price">
                <div className="price-val-range">
                  <Slider
                    range
                    min={facets.priceRange.min}
                    max={facets.priceRange.max}
                    value={allProps.price}
                    onChange={(v) =>
                      Array.isArray(v) &&
                      allProps.setPrice([v[0], v[1]] as [number, number])
                    }
                  />
                </div>
                <div className="box-value-price">
                  <span className="text-sm">Giá:</span>
                  <div className="price-box">
                    <div className="price-val">{allProps.price[0]}</div>
                    <span>-</span>
                    <div className="price-val">{allProps.price[1]}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Color */}
          {facets && facets.colors.length > 0 && (
            <div className="widget-facet">
              <div className="facet-title text-xl fw-medium">
                <span>Màu sắc</span>
              </div>
              <div className="collapse-body filter-color-box flat-check-list">
                {facets.colors.map((c) => {
                  const hex = resolveColorHex({
                    cssClass: c.value,
                    fallbackName: c.label,
                  });
                  return (
                    <div
                      key={c.name}
                      className={`check-item color-item color-check ${
                        allProps.color === c.name ? "active" : ""
                      } ${isLightColorHex(hex) ? "line" : ""}`}
                      onClick={() => allProps.setColor(c.name)}
                    >
                      <span
                        className="color"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="color-text">{c.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size */}
          {facets && facets.sizes.length > 0 && (
            <div className="widget-facet">
              <div className="facet-title text-xl fw-medium">
                <span>Kích cỡ</span>
              </div>
              <div className="collapse-body filter-size-box flat-check-list">
                {facets.sizes.map((s) => (
                  <div
                    key={s}
                    onClick={() => allProps.setSize(s)}
                    className={`check-item size-item size-check ${
                      allProps.size === s ? "active" : ""
                    }`}
                  >
                    <span className="size">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Brand */}
          {facets && facets.brands.length > 0 && (
            <div className="widget-facet">
              <div className="facet-title text-xl fw-medium">
                <span>Thương hiệu</span>
              </div>
              <ul className="collapse-body filter-group-check current-scrollbar">
                {facets.brands.map((b) => (
                  <li
                    key={b}
                    className="list-item"
                    onClick={() => allProps.setBrands(b)}
                  >
                    <input
                      type="radio"
                      className="tf-check"
                      readOnly
                      checked={allProps.brands === b}
                    />
                    <label className="label">
                      <span>{b}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            className="tf-btn btn-out-line-dark w-100 mt-3"
            onClick={() => allProps.clearFilter()}
          >
            Xoá bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
}
