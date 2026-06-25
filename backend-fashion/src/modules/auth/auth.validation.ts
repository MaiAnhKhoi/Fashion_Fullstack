import { z } from "zod";

const email = z
  .string({ message: "Email là bắt buộc" })
  .trim()
  .toLowerCase()
  .email("Email không hợp lệ");

const password = z
  .string({ message: "Mật khẩu là bắt buộc" })
  .min(8, "Mật khẩu tối thiểu 8 ký tự")
  .max(72, "Mật khẩu tối đa 72 ký tự");

const otp = z
  .string({ message: "Mã OTP là bắt buộc" })
  .trim()
  .regex(/^\d{6}$/, "Mã OTP gồm 6 chữ số");

export const registerSchema = z.object({
  email: z
    .string({ message: "Email là bắt buộc" })
    .trim()
    .toLowerCase()
    .email("Email không hợp lệ"),
  password: z
    .string({ message: "Mật khẩu là bắt buộc" })
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .max(72, "Mật khẩu tối đa 72 ký tự"),
  full_name: z.string().trim().min(1).max(255).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{10}$/, "Số điện thoại không hợp lệ")
    .optional(),
});

export const verifyOtpSchema = z.object({
  email: z
    .string({ message: "Email là bắt buộc" })
    .trim()
    .toLowerCase()
    .email("Email không hợp lệ"),
  otp: z
    .string({ message: "Mã OTP là bắt buộc" })
    .trim()
    .regex(/^\d{6}$/, "Mã OTP gồm 6 chữ số"),
});

export const verifyOtpEmailSchema = z.object({
  email: z
    .string({ message: "Email là bắt buộc" })
    .trim()
    .toLowerCase()
    .email("Email không hợp lệ"),
  type: z.enum(["register", "reset_password"]),
  otp: z
    .string({ message: "Mã OTP là bắt buộc" })
    .trim()
    .regex(/^\d{6}$/, "Mã OTP gồm 6 chữ số"),
});

export const resendOtpSchema = z.object({
  email: z
    .string({ message: "Email là bắt buộc" })
    .trim()
    .toLowerCase()
    .email("Email không hợp lệ"),
  type: z.enum(["register", "reset_password"]),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "Email là bắt buộc" })
    .trim()
    .toLowerCase()
    .email("Email không hợp lệ"),
  password: z
    .string({ message: "Mật khẩu là bắt buộc" })
    .min(1, "Mật khẩu là bắt buộc"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: "Email là bắt buộc" })
    .trim()
    .toLowerCase()
    .email("Email không hợp lệ"),
});

export const resetPasswordSchema = z.object({
  email: z
    .string({ message: "Email là bắt buộc" })
    .trim()
    .toLowerCase()
    .email("Email không hợp lệ"),
  otp: z
    .string({ message: "Mã OTP là bắt buộc" })
    .trim()
    .regex(/^\d{6}$/, "Mã OTP gồm 6 chữ số"),
  newPassword: z
    .string({ message: "Mật khẩu mới là bắt buộc" })
    .min(8, "Mật khẩu mới tối thiểu 8 ký tự")
    .max(72, "Mật khẩu mới tối đa 72 ký tự"),
});

export const refreshSchema = z.object({
  refreshToken: z.string({ message: "refreshToken là bắt buộc" }).min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
