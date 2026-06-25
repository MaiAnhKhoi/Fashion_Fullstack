"use client";

import Breadcumb from "@/components/layoutDashboard/Breadcumb";
import Wishlist from "@/components/otherPage/Wishlist";

export default function WishlistPage() {
  return (
    <>
      <Breadcumb pageName={"My Wishlist"} pageTitle={"My Wishlist"} />
      <Wishlist />
    </>
  );
}
