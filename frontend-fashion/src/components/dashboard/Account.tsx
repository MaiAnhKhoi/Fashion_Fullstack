"use client";
import { Link } from "react-router-dom";
import { useProfile } from "@/hooks/queries/useUser";
import { useUIStore } from "@/stores/ui.store";

const GENDER_LABEL: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "—";

export default function Account() {
  const { data: user, isLoading } = useProfile();
  const { openModelLogin } = useUIStore();

  if (isLoading) {
    return (
      <div className="card p-4">
        <h4 className="mb-2">Đang tải thông tin tài khoản...</h4>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card p-4">
        <h4 className="mb-2">Bạn chưa đăng nhập</h4>
        <p className="mb-3">Vui lòng đăng nhập để xem thông tin tài khoản.</p>
        <button
          className="tf-btn bg-dark-2 text-white w-max-content"
          onClick={() => openModelLogin()}
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="content-account">
      {/* Header thông tin người dùng */}
      <div className="card p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <img
              src={user.avatarUrl || "/images/avatar/default.jpg"}
              alt="avatar"
              className="rounded-circle"
              style={{
                width: 72,
                height: 72,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <div>
              <h3 className="mb-1">Xin chào, {user.fullName || "bạn"}</h3>
              <p className="text-sm text-muted mb-0">
                Mã khách hàng: <strong>#{user.id}</strong>
              </p>
            </div>
          </div>
          <span className="text-xs text-muted">
            Ngày tham gia: {formatDate(user.createdAt)}
          </span>
        </div>
      </div>

      <div className="row g-3">
        {/* Thông tin cá nhân */}
        <div className="col-12 col-lg-6">
          <div className="card p-4 h-100">
            <h5 className="mb-3">Thông tin cá nhân</h5>
            <ul className="list-unstyled mb-0">
              <li className="mb-3">
                <span className="text-muted text-sm d-block">Họ và tên</span>
                <span className="fw-semibold">{user.fullName || "Chưa cập nhật"}</span>
              </li>
              <li className="mb-3">
                <span className="text-muted text-sm d-block">Email</span>
                <span className="fw-semibold">{user.email}</span>
                <span
                  className={`badge ms-2 text-xs ${
                    user.isVerified ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {user.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                </span>
              </li>
              <li className="mb-3">
                <span className="text-muted text-sm d-block">Số điện thoại</span>
                <span className="fw-semibold">{user.phone || "Chưa cập nhật"}</span>
              </li>
              <li className="mb-0">
                <span className="text-muted text-sm d-block">Ngày sinh</span>
                <span className="fw-semibold">{formatDate(user.dateOfBirth)}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Thông tin tài khoản */}
        <div className="col-12 col-lg-6">
          <div className="card p-4 h-100">
            <h5 className="mb-3">Thông tin tài khoản</h5>
            <ul className="list-unstyled mb-0">
              <li className="mb-3">
                <span className="text-muted text-sm d-block">Giới tính</span>
                <span className="fw-semibold">
                  {user.gender ? GENDER_LABEL[user.gender] ?? user.gender : "Chưa cập nhật"}
                </span>
              </li>
              <li className="mb-3">
                <span className="text-muted text-sm d-block">Vai trò</span>
                <span className="fw-semibold text-capitalize">{user.role}</span>
              </li>
            </ul>

            <div className="d-grid gap-2 mt-4">
              <Link
                to="/account/settings"
                className="tf-btn btn-out-line-dark2 w-100 text-center"
              >
                Cập nhật thông tin
              </Link>
              <Link
                to="/account/change-password"
                className="tf-btn btn-out-line-dark2 w-100 text-center"
              >
                Đổi mật khẩu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
