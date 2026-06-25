"use client";
import { useMemo, useState } from "react";
import { useBoughtTogether } from "@/hooks/queries/useProduct";
import { formatPrice } from "@/utils/formatPrice";
import type {
  ProductResponse,
  ProductDetailResponse,
} from "@/types/product";

type BundleItem = {
  id: number;
  title: string;
  image: string;
  price: number;
  oldPrice: number | null;
  options: string[];
  checked: boolean;
};

// Tạo các lựa chọn "Màu / Size" từ colors x sizes của sản phẩm.
const buildOptions = (p: ProductResponse): string[] => {
  const colors = p.colors.map((c) => c.label);
  const { sizes } = p;

  if (colors.length && sizes.length) {
    return colors.flatMap((c) => sizes.map((s) => `${c} / ${s}`));
  }
  if (colors.length) return colors;
  if (sizes.length) return sizes;
  return ["Default"];
};

const toBundleItem = (p: ProductResponse, checked: boolean): BundleItem => ({
  id: p.id,
  title: p.title ?? "",
  image: p.imgSrc,
  price: p.price,
  oldPrice: p.oldPrice,
  options: buildOptions(p),
  checked,
});

export default function BoughtTogether({
  product,
}: {
  product: ProductDetailResponse;
}) {
  const { data: companions = [], isLoading } = useBoughtTogether(product.id);

  // Sản phẩm hiện tại (mặc định chọn) + các sản phẩm mua kèm.
  const bundle = useMemo<BundleItem[]>(
    () => [
      toBundleItem(product, true),
      ...companions.map((c) => toBundleItem(c, true)),
    ],
    [product, companions],
  );

  // Lưu trạng thái tick theo id để không reset khi data đổi.
  const [unchecked, setUnchecked] = useState<Set<number>>(new Set());

  const toggleCheckbox = (id: number) => {
    setUnchecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const items = bundle.map((it) => ({
    ...it,
    checked: !unchecked.has(it.id),
  }));

  const selected = items.filter((it) => it.checked);
  const totalPrice = selected.reduce((sum, it) => sum + it.price, 0);
  const totalOldPrice = selected.reduce(
    (sum, it) => sum + (it.oldPrice ?? it.price),
    0,
  );
  const hasDiscount = totalOldPrice > totalPrice;

  if (isLoading && companions.length === 0) {
    return <div className="text-md">Đang tải sản phẩm mua kèm...</div>;
  }

  return (
    <form
      className="tf-product-form-bundle"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="tf-bundle-products">
        {items.map((item) => (
          <div
            key={item.id}
            className={`tf-bundle-product-item item-has-checkbox ${
              item.checked ? "check" : ""
            }`}
          >
            <div className="bundle-check">
              <input
                type="checkbox"
                className="tf-check"
                checked={item.checked}
                onChange={() => toggleCheckbox(item.id)}
              />
            </div>
            <a href={`/product-detail/${item.id}`} className="bundle-image">
              <img alt={item.title} src={item.image} width={828} height={1241} />
            </a>
            <div className="bundle-info">
              <div className="bundle-title text-sm fw-medium">{item.title}</div>
              <div className="bundle-price text-md fw-medium">
                <span className="new-price">{formatPrice(item.price)}</span>{" "}
                {item.oldPrice && item.oldPrice > item.price && (
                  <span className="old-price">{formatPrice(item.oldPrice)}</span>
                )}
              </div>
              <div className="bundle-variant tf-select">
                <select>
                  {item.options.map((option, index) => (
                    <option key={index}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bundle-total-submit">
        <div className="text">Total price:</div>
        <span className="total-price">{formatPrice(totalPrice)}</span>{" "}
        {hasDiscount && (
          <span className="total-price-old">{formatPrice(totalOldPrice)}</span>
        )}
      </div>
      <button className="btn-submit-total tf-btn btn-out-line-primary">
        Add selected to cart
      </button>
    </form>
  );
}
