"use client";

import { useCart } from "@/hooks/queries/useCart";

export default function CartLength() {
  const { data: cart } = useCart();
  return <>{cart?.summary.totalQuantity ?? 0}</>;
}
