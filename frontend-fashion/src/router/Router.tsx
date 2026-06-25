import { LayoutApp } from "@/components/layoutApp";
import { LayoutDashboard } from "@/components/layoutDashboard";
import Account from "@/components/dashboard/Account";
import AccountSettings from "@/components/dashboard/AccountSettings";
import AccountChangePassword from "@/components/dashboard/AccountChangePassword";
import Address from "@/components/dashboard/Address";
import WishlistPage from "@/pages/otherPage/WishlistPage";
import { ComparePage } from "@/pages/otherPage/ComparePage";
import HomePage from "@/pages/HomePage";
import { createBrowserRouter } from "react-router-dom";
import { ProductPage } from "@/pages/ProductPage";
import ProductDetail from "@/pages/ProductDetailPage";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutApp />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <div>About</div>,
      },
      {
        path: "wish-list",
        element: <WishlistPage />,
      },
      {
        path: "compare",
        element: <ComparePage />,
      },
      {
        path: "product",
        element: <ProductPage />,
      },
      {
        path: "product-detail/:id",
        element: <ProductDetail />,
      },
      {
        path: "account",
        element: <LayoutDashboard />,
        handle: {
          pageName: "Account",
          pageTitle: "My Account",
        },
        children: [
          {
            index: true,
            element: <Account />,
            handle: {
              pageName: "Account",
              pageTitle: "My Account",
            },
          },
          {
            path: "settings",
            element: <AccountSettings />,
            handle: {
              pageName: "Cập nhật thông tin",
              pageTitle: "Cập nhật thông tin",
            },
          },
          {
            path: "change-password",
            element: <AccountChangePassword />,
            handle: {
              pageName: "Đổi mật khẩu",
              pageTitle: "Đổi mật khẩu",
            },
          },
          {
            path: "addresses",
            element: <Address />,
            handle: {
              pageName: "Địa chỉ",
              pageTitle: "Địa chỉ của tôi",
            },
          },
        ],
      },
    ],
  },
]);
