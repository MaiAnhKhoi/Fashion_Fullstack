"use client";
import ProductCard from "../ProductCard/ProductCard";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useProductBestSellers } from "@/hooks/queries/useProduct";

export default function Products() {
  const { data: products, isLoading, isError } = useProductBestSellers();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (!products?.length) return <div>No data</div>;
  return (
    <section className="flat-spacing-3 overflow-hidden">
      <div className="container">
        <div className="flat-title wow fadeInUp">
          <h4 className="title">New Arrivals</h4>
        </div>
        <div className="fl-control-sw2 pos2 wow fadeInUp">
          <Swiper
            dir="ltr"
            className="swiper tf-swiper wrap-sw-over"
            modules={[Pagination, Navigation]}
            {...{
              slidesPerView: 2,
              spaceBetween: 12,
              speed: 800,
              slidesPerGroup: 2,
              navigation: {
                nextEl: ".nav-next-seller",
                prevEl: ".nav-prev-seller",
              },
              pagination: { el: ".sw-pagination-seller", clickable: true },
              breakpoints: {
                768: { slidesPerView: 3, spaceBetween: 12, slidesPerGroup: 3 },
                1200: { slidesPerView: 4, spaceBetween: 24, slidesPerGroup: 4 },
              },
            }}
          >
            {products.map((product) => (
              <SwiperSlide className="swiper-slide" key={product.id}>
                <ProductCard product={product} key={product.id} />
              </SwiperSlide>
            ))}
            <div className="d-flex d-xl-none sw-dot-default sw-pagination-seller justify-content-center mt_5" />
          </Swiper>
          <div className="d-none d-xl-flex swiper-button-next nav-swiper nav-next-seller" />
          <div className="d-none d-xl-flex swiper-button-prev nav-swiper nav-prev-seller" />
        </div>
      </div>
    </section>
  );
}
