import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ in hoa")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số")
    .regex(
      /[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]/,
      "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
    ),
});

export type LoginFormData = z.infer<typeof loginSchema>;
