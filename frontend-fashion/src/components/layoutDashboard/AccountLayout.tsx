// AccountLayout.tsx

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AccountLayout() {
  return (
    <div className="flat-spacing-13">
      <div className="container-7">
        <div className="btn-sidebar-mb d-lg-none">
          <button data-bs-toggle="offcanvas" data-bs-target="#mbAccount">
            <i className="icon icon-sidebar" />
          </button>
        </div>

        <div className="main-content-account">
          <div className="sidebar-account-wrap sidebar-content-wrap sticky-top d-lg-block d-none">
            <ul className="my-account-nav">
              <Sidebar />
            </ul>
          </div>

          <div className="my-acount-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
