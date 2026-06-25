"use client";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { useCategoriesParent } from "@/hooks/queries/useCategory";
import { useState } from "react";

export default function Categories() {
  const { data: categories, isLoading, isError } = useCategoriesParent();
  const [activeTab, setActiveTab] = useState(0);
  const activeCategory = categories?.[activeTab];
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (!categories?.length) return <div>No data</div>;
  return (
    <section className="flat-spacing-3">
      <div className="container">
        <div className="flat-animate-tab">
          <div className="flat-title-tab-categories wow fadeInUp text-center">
            <h4 className="title">Categories</h4>
            <ul className="menu-tab-line justify-content-center" role="tablist">
              {categories.map((item, index) => (
                <li className="nav-tab-item" role="presentation" key={item.id}>
                  <Link
                    to={item.slug}
                    className={`tab-link ${activeTab === index ? "active" : ""}`}
                    data-bs-toggle="tab"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(index);
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="tab-content">
            <div className="tab-pane active show" id="womens" role="tabpanel">
              <Swiper
                dir="ltr"
                className="swiper tf-swiper"
                {...{
                  slidesPerView: 2,
                  spaceBetween: 12,
                  speed: 800,
                  observer: true,
                  observeParents: true,
                  slidesPerGroup: 2,
                  navigation: {
                    nextEl: ".nav-next-women",
                    prevEl: ".nav-prev-women",
                  },
                  pagination: { el: ".sw-pagination-women", clickable: true },
                  breakpoints: {
                    575: {
                      slidesPerView: 3,
                      spaceBetween: 12,
                      slidesPerGroup: 2,
                    },
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 24,
                      slidesPerGroup: 3,
                    },
                    1200: {
                      slidesPerView: 6,
                      spaceBetween: 64,
                      slidesPerGroup: 3,
                    },
                  },
                }}
                modules={[Pagination, Navigation]}
              >
                {activeCategory?.children.map((item, index) => (
                  <SwiperSlide className="swiper-slide" key={index}>
                    <div className="wg-cls style-circle hover-img">
                      <Link
                        to={`/shop-sub-collection`}
                        className="image img-style d-block"
                      >
                        <img
                          src={item?.imageSrc ?? ""}
                          alt="categories"
                          className="lazyload"
                          width={300}
                          height={300}
                        />
                      </Link>
                      <div className="cls-content text-center">
                        <Link
                          to={`/shop-sub-collection`}
                          className="link text-md fw-medium"
                        >
                          {item.label}
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
                <span className="d-flex d-xl-none sw-dot-default sw-pagination-women justify-content-center" />
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
