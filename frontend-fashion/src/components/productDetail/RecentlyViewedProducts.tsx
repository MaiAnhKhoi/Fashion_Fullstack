"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import ProductCard from "@/components/ProductCard/ProductCard";
import { useRecentlyViewedStore } from "@/stores/recentlyViewed.store";

export default function RecentlyViewedProducts({
  currentId,
}: {
  currentId?: number;
}) {
  const products = useRecentlyViewedStore((s) => s.products).filter(
    (p) => p.id !== currentId,
  );

  if (products.length === 0) return null;

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="flat-title wow fadeInUp">
          <h4 className="title">Recently Viewed</h4>
        </div>
        <div className="hover-sw-nav hover-sw-2 wow fadeInUp">
          <Swiper
            dir="ltr"
            className="swiper tf-swiper wrap-sw-over"
            slidesPerView={2}
            spaceBetween={12}
            speed={800}
            slidesPerGroup={2}
            navigation={{
              nextEl: ".nav-next-viewed",
              prevEl: ".nav-prev-viewed",
            }}
            pagination={{ el: ".sw-pagination-viewed", clickable: true }}
            breakpoints={{
              768: { slidesPerView: 3, spaceBetween: 12, slidesPerGroup: 3 },
              1200: { slidesPerView: 4, spaceBetween: 24, slidesPerGroup: 4 },
            }}
            modules={[Pagination, Navigation]}
          >
            {products.map((product) => (
              <SwiperSlide className="swiper-slide" key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
            <div className="d-flex d-xl-none sw-dot-default sw-pagination-viewed justify-content-center" />
          </Swiper>
          <div className="d-none d-xl-flex swiper-button-next nav-swiper nav-next-viewed" />
          <div className="d-none d-xl-flex swiper-button-prev nav-swiper nav-prev-viewed" />
        </div>
      </div>
    </section>
  );
}
