import ProductCard from "@/components/ProductCard/ProductCard";
import type { ProductResponse } from "@/types/product";

export default function GridProducts({
  products,
  cardStyleClass,
  tooltipDirection = "left",
}: {
  products: ProductResponse[];
  cardStyleClass?: string;
  tooltipDirection?: string;
}) {
  return (
    <>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          styleClass={cardStyleClass ? cardStyleClass : "grid style-1"}
          tooltipDirection={tooltipDirection}
        />
      ))}
    </>
  );
}
