import Banner from "@/components/home/Banner";
import Collections from "@/components/home/Collections";
import Products from "@/components/home/Products";
import BannerCountDown from "@/components/home/BannerCountDown";
import Categories from "@/components/home/Categories";
import ProductsTodayPick from "@/components/home/ProductsToDay";
import Brands from "@/components/home/Brand";
import Shopgram from "@/components/home/ShopGram";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Banner />
      <Collections />
      <Products />
      <BannerCountDown />
      <Categories />
      <ProductsTodayPick />
      <Brands />
      <Testimonials />
      <Shopgram />
      <Features />
    </>
  );
}
