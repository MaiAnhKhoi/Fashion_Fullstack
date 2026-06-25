import ProductCard from "@/components/ProductCard/ProductCard";
import type { ProductResponse } from "@/types/product";

export default function ListProducts({ products }: { products: ProductResponse[] }) {
  return (
    <>
      {products.map((product, i) => (
        <ProductCard key={i} product={product} />
      ))}
    </>
  );
}
