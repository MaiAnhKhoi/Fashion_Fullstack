"use client";

import { useLogout } from "@/hooks/queries/useAuth";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
const accountLinks = [
  { href: "/account", label: "Dashboard" },
  { href: "/orders", label: "My Orders" },
  { href: "/wish-list", label: "My Wishlist" },
  { href: "/account/addresses", label: "Addresses" },
];

export default function Sidebar() {
  const { mutate } = useLogout();
  const { pathname } = useLocation();
  return (
    <>
      {accountLinks.map(({ href, label }) => (
        <li key={href}>
          <Link
            to={href}
            className={`text-sm link fw-medium my-account-nav-item ${
              pathname == href ? "active" : ""
            }`}
          >
            {label}
          </Link>
        </li>
      ))}
      <li>
        <Link
          to={"/"}
          onClick={() => mutate()}
          className="text-sm link fw-medium my-account-nav-item"
        >
          Log Out
        </Link>
      </li>
    </>
  );
}
