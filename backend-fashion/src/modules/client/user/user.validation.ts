import { z } from "zod";

const password = z
  .string({ message: "Mật khẩu là bắt buộc" })
  .min(8, "Mật khẩu tối thiểu 8 ký tự")
  .max(72, "Mật khẩu tối đa 72 ký tự");

/** PATCH /me — cập nhật hồ sơ. Tất cả optional, chỉ gửi field cần đổi. */
export const updateProfileSchema = z.object({
  full_name: z.string().trim().min(1, "Họ tên không được trống").max(255).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{10,20}$/, "Số điện thoại không hợp lệ")
    .optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  // Nhận "YYYY-MM-DD"
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh không hợp lệ")
    .optional(),
});

/** PATCH /me/password — đổi mật khẩu. */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string({ message: "Mật khẩu hiện tại là bắt buộc" }).min(1),
    newPassword: password,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Mật khẩu mới phải khác mật khẩu hiện tại",
    path: ["newPassword"],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
