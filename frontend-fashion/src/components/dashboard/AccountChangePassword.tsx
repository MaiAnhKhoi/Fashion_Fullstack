"use client";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePassword } from "@/hooks/queries/useUser";
import { passwordSchema, type PasswordFormData } from "@/schema/user.schema";

const errMsg = (error: unknown, fallback = "Có lỗi xảy ra"): string => {
  const e = error as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? fallback;
};

export default function AccountChangePassword() {
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: PasswordFormData) => {
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => reset() },
    );
  };

  return (
    <div className="content-account">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="mb-0">Đổi mật khẩu</h4>
        <Link to="/account" className="tf-btn btn-out-line-dark2">
          ← Quay lại
        </Link>
      </div>

      <div className="card p-4">
        <form className="form-account-details" onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6 mb_15">
              <label className="text-sm mb_8 d-block">Mật khẩu hiện tại</label>
              <input type="password" {...register("currentPassword")} />
              {errors.currentPassword && (
                <p className="text-danger text-sm mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="col-md-6" />

            <div className="col-md-6 mb_15">
              <label className="text-sm mb_8 d-block">Mật khẩu mới</label>
              <input type="password" {...register("newPassword")} />
              {errors.newPassword && (
                <p className="text-danger text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="col-md-6 mb_15">
              <label className="text-sm mb_8 d-block">Xác nhận mật khẩu mới</label>
              <input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <p className="text-danger text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {changePassword.isError && (
            <p className="text-danger text-sm">{errMsg(changePassword.error)}</p>
          )}
          {changePassword.isSuccess && (
            <p className="text-success text-sm">Đổi mật khẩu thành công.</p>
          )}

          <button
            type="submit"
            className="tf-btn animate-btn bg-dark-2"
            disabled={changePassword.isPending}
          >
            {changePassword.isPending ? "Đang đổi..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
}
