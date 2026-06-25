import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcumb from "@/components/layoutDashboard/Breadcumb";
import Descriptions from "@/components/productDetail/Descriptions";
import Detail from "@/components/productDetail/Detail";
import RecommendedProducts from "@/components/productDetail/RecommendedProducts";
import RecentlyViewedProducts from "@/components/productDetail/RecentlyViewedProducts";
import { useProduct } from "@/hooks/queries/useProduct";
import { useRecentlyViewedStore } from "@/stores/recentlyViewed.store";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = Number(id);
  const { data: product, isLoading } = useProduct(productId);
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addRecentlyViewed);

  // Lưu sản phẩm xem gần đây vào localStorage.
  useEffect(() => {
    if (product) addRecentlyViewed(product);
  }, [product, addRecentlyViewed]);

  if (isLoading) {
    return <div className="container p-5 text-center">Đang tải sản phẩm...</div>;
  }
  if (!product) {
    return (
      <div className="container p-5 text-center">Không tìm thấy sản phẩm.</div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* <Breadcumb pageName={product.title ?? "Product"} pageTitle={product.title ?? "Product"} /> */}
      <Detail product={product} />
      <Descriptions product={product} />
      <RecommendedProducts />
      <RecentlyViewedProducts currentId={product.id} />
    </div>
  );
}
