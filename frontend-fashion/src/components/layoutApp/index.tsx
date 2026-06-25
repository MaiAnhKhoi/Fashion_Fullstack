import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import QuickCartModal from "@/components/models/QuickCartModal";
import CartModal from "@/components/models/CartModel";
import Login from "@/components/models/Login";
import Compare from "@/components/models/Compare";
import Quickview from "@/components/models/Quickview";
import SearchModal from "@/components/models/SearchModel";
import { useAuthBootstrap } from "@/hooks/queries/useAuthBootstrap";

export const LayoutApp = () => {
  useAuthBootstrap(); // silent refresh phiên đăng nhập khi vào app
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
      <QuickCartModal />
      <CartModal />
      <Login />
      <Compare />
      <Quickview />
      <SearchModal />
    </div>
  );
};
