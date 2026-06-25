"use client";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTestimonials } from "@/hooks/queries/useTestimonials";
export default function Testimonials() {
  const { data, isLoading, isError } = useTestimonials();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (!data?.length) return <div>No data</div>;
  return (
    <section>
      <div className="container">
        <div className="flat-title wow fadeInUp">
          <h4 className="title">Happy Customers</h4>
        </div>
        <Swiper
          dir="ltr"
          className="swiper tf-swiper"
          {...{
            slidesPerView: 1,
            spaceBetween: 12,
            speed: 800,
            observer: true,
            observeParents: true,
            slidesPerGroup: 1,
            pagination: { el: ".sw-pagination-tes", clickable: true },
            breakpoints: {
              768: { slidesPerView: 2, spaceBetween: 24, slidesPerGroup: 2 },
              1200: { slidesPerView: 3, spaceBetween: 24, slidesPerGroup: 3 },
            },
          }}
          modules={[Pagination]}
        >
          {data.map((item, index) => (
            <SwiperSlide className="swiper-slide" key={index}>
              <div className={`wg-testimonial wow fadeInLeft`}>
                <div className="content">
                  <div className="content-top">
                    <div className="box-author">
                      <p className="name-author text-sm fw-medium">
                        {item.name}
                      </p>
                      <div className="box-verified text-main">
                        <i className="icon-verifi" />
                        <p className="text-xs fst-italic">Verified Buyer</p>
                      </div>
                    </div>
                    <div className="list-star-default">
                      {Array(item.rating)
                        .fill(0)
                        .map((_, i) => (
                          <i key={i} className="icon-star" />
                        ))}
                    </div>
                    <p className="text-review text-sm text-main">
                      {item.review}
                    </p>
                  </div>
                  <span className="br-line d-block" />
                  <div className="box-avt">
                    <div className="avatar">
                      <img
                        alt="author"
                        src={item?.image ?? ""}
                        width={128}
                        height={128}
                      />
                    </div>
                    <div className="box-price">
                      <p className="name-item text-xs">
                        Item purchased:
                        <a
                          href="#"
                          className="fw-medium text-sm link text-line-clamp-1"
                        >
                          {item.product}
                        </a>
                      </p>
                      <p className="price text-md fw-medium">$150.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <span className="sw-dot-default sw-pagination-tes justify-content-center" />
        </Swiper>
      </div>
    </section>
  );
}
