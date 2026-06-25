"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";

export default function Slider({
  images,
  activeImage,
}: {
  images: string[];
  activeImage?: string;
}) {
  const list = useMemo(() => (images.length ? images : [""]), [images]);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const mainRef = useRef<SwiperClass | null>(null);

  // Đổi màu -> nhảy tới ảnh tương ứng.
  useEffect(() => {
    if (!activeImage || !mainRef.current) return;
    const idx = list.indexOf(activeImage);
    if (idx >= 0) mainRef.current.slideTo(idx);
  }, [activeImage, list]);

  return (
    <>
      <Swiper
        dir="ltr"
        className="swiper tf-product-media-thumbs other-image-zoom"
        slidesPerView={4}
        direction="vertical"
        onSwiper={setThumbsSwiper}
        modules={[Thumbs]}
        spaceBetween={8}
      >
        {list.map((img, i) => (
          <SwiperSlide key={i} className="swiper-slide stagger-item">
            <div className="item">
              <img
                className="lazyload"
                alt="img-product"
                src={img}
                width={828}
                height={1241}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flat-wrap-media-product">
        <Swiper
          modules={[Thumbs, Navigation]}
          dir="ltr"
          className="swiper tf-product-media-main"
          thumbs={{ swiper: thumbsSwiper }}
          navigation={{ prevEl: ".snbp1", nextEl: ".snbn1" }}
          onSwiper={(s) => (mainRef.current = s)}
        >
          {list.map((img, i) => (
            <SwiperSlide key={i} className="swiper-slide">
              <div className="item">
                <img
                  className="lazyload"
                  alt="img-product"
                  src={img}
                  width={828}
                  height={1241}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-button-next nav-swiper thumbs-next snbn1" />
        <div className="swiper-button-prev nav-swiper thumbs-prev snbp1" />
      </div>
    </>
  );
}
