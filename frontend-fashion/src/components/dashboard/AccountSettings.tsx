"use client";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfile, useUpdateProfile, useUploadAvatar } from "@/hooks/queries/useUser";
import { profileSchema, type ProfileFormData } from "@/schema/user.schema";

const errMsg = (error: unknown, fallback = "Có lỗi xảy ra"): string => {
  const e = error as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? fallback;
};

export default function AccountSettings() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      full_name: profile?.fullName ?? "",
      phone: profile?.phone ?? "",
      gender: (profile?.gender as ProfileFormData["gender"]) ?? "",
      date_of_birth: profile?.dateOfBirth ?? "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate({
      full_name: data.full_name,
      phone: data.phone || undefined,
      gender: data.gender || undefined,
      date_of_birth: data.date_of_birth || undefined,
    });
  };

  const onPickAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar.mutate(file);
    e.target.value = "";
  };

  if (isLoading) {
    return <div className="card p-4">Đang tải...</div>;
  }

  return (
    <div className="content-account">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="mb-0">Cập nhật thông tin</h4>
        <Link to="/account" className="tf-btn btn-out-line-dark2">
          ← Quay lại
        </Link>
      </div>

      {/* Avatar */}
      <div className="card p-4 mb-4">
        <div className="d-flex align-items-center gap-4">
          <img
            src={profile?.avatarUrl || "/images/avatar/default.jpg"}
            alt="avatar"
            className="rounded-circle"
            style={{
              width: 88,
              height: 88,
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="d-none"
              onChange={onPickAvatar}
            />
            <button
              type="button"
              className="tf-btn btn-out-line-dark2"
              disabled={uploadAvatar.isPending}
              onClick={() => fileRef.current?.click()}
            >
              {uploadAvatar.isPending ? "Đang tải..." : "Đổi ảnh đại diện"}
            </button>
            {uploadAvatar.isError && (
              <p className="text-danger text-sm mt-2 mb-0">
                {errMsg(uploadAvatar.error)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Thông tin cá nhân */}
      <div className="card p-4">
        <form className="form-account-details" onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6 mb_15">
              <label className="text-sm mb_8 d-block">Họ và tên</label>
              <input type="text" {...register("full_name")} />
              {errors.full_name && (
                <p className="text-danger text-sm mt-1">{errors.full_name.message}</p>
              )}
            </div>

            <div className="col-md-6 mb_15">
              <label className="text-sm mb_8 d-block">Email</label>
              <input type="email" value={profile?.email ?? ""} disabled />
            </div>

            <div className="col-md-6 mb_15">
              <label className="text-sm mb_8 d-block">Số điện thoại</label>
              <input type="tel" {...register("phone")} />
              {errors.phone && (
                <p className="text-danger text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="col-md-6 mb_15">
              <label className="text-sm mb_8 d-block">Giới tính</label>
              <div className="tf-select">
                <select {...register("gender")}>
                  <option value="">-- Chọn --</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            <div className="col-md-6 mb_15">
              <label className="text-sm mb_8 d-block">Ngày sinh</label>
              <input type="date" {...register("date_of_birth")} />
              {errors.date_of_birth && (
                <p className="text-danger text-sm mt-1">
                  {errors.date_of_birth.message}
                </p>
              )}
            </div>
          </div>

          {updateProfile.isError && (
            <p className="text-danger text-sm">{errMsg(updateProfile.error)}</p>
          )}
          {updateProfile.isSuccess && (
            <p className="text-success text-sm">Đã cập nhật hồ sơ.</p>
          )}

          <button
            type="submit"
            className="tf-btn animate-btn bg-dark-2"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>
    </div>
  );
}
