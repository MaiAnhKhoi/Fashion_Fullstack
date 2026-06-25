"use client";
import { useBanner } from "@/hooks/queries/useBanner";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Banner() {
  const { data, isLoading, isError } = useBanner();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (!data?.length) return <div>No data</div>;
  const slides = data.map((item) => ({
    bgType: item.bgType,
    imageSrc: item.imageSrc,
    width: item.width,
    height: item.height,
    colClass: item.colClass,
    heading: item.heading,
    subText: item.subText,
  }));
  return (
    <section className="tf-slideshow slider-fashion-1 slider-default">
      <Swiper
        className="swiper tf-sw-slideshow slider-effect-fade"
        modules={[Autoplay, Pagination, EffectFade]}
        pagination={{
          clickable: true,
          el: ".spd1",
        }}
        effect="fade"
        loop
        speed={2000}
        dir="ltr"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide className="swiper-slide" key={index}>
            <div className={`slider-wrap ${slide.bgType}`}>
              <div className="image">
                <img
                  src={slide.imageSrc}
                  alt="slider"
                  className="lazyload"
                  width={slide.width}
                  height={slide.height}
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background:
                      "linear-gradient(rgba(0,0,0,.15), rgba(0,0,0,.15))",
                  }}
                />
              </div>
              <div className="box-content">
                <div className="container">
                  <div className="row">
                    <div className={slide.colClass}>
                      <div className="content-slider">
                        <div className="box-title-slider">
                          <h2
                            className="heading fw-medium fade-item fade-item-1 text-dark-5"
                            dangerouslySetInnerHTML={{ __html: slide.heading }}
                          />
                          <p className="sub text-md fade-item fade-item-2 text-dark-5">
                            {slide.subText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="wrap-pagination">
          <div className="container">
            <div className="sw-dots sw-pagination-slider justify-content-center spd1" />
          </div>
        </div>
      </Swiper>
    </section>
  );
}
