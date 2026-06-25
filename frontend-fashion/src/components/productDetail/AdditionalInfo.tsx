import type { ProductDetailResponse } from "@/types/product";

export default function AdditionalInfo({
  product,
}: {
  product: ProductDetailResponse;
}) {
  const rows = [
    { label: "Brand", value: product.brand },
    {
      label: "Color",
      value: product.colors.map((c) => c.label).join(", ") || null,
    },
    { label: "Size", value: product.sizes.join(", ") || null },
    {
      label: "Categories",
      value: product.categories.join(", ") || null,
    },
    { label: "SKU", value: product.sku || null },
  ].filter((r) => r.value);

  return (
    <table className="tb-info-product text-md">
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="tb-attr-item">
            <th className="tb-attr-label">{r.label}</th>
            <td className="tb-attr-value">
              <p>{r.value}</p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
