"use client";

import { useWishList } from "@/hooks/queries/useWishList";

// import { useContextElement } from "@/context/Context";

export default function WishlistLength() {
  const { data: wishListIds } = useWishList();
  //   const { wishList } = useContextElement();
  return <>{wishListIds?.size || 0}</>;
}
