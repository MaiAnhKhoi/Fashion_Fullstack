import { z } from "zod";

export const addressSchema = z.object({
  receiver_name: z
    .string()
    .trim()
    .min(1, "Tên người nhận là bắt buộc")
    .max(255),
  receiver_phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{10,20}$/, "Số điện thoại không hợp lệ"),
  province: z.string().trim().min(1, "Tỉnh/Thành là bắt buộc"),
  district: z.string().trim().min(1, "Quận/Huyện là bắt buộc"),
  ward: z.string().trim().min(1, "Phường/Xã là bắt buộc"),
  street_address: z.string().trim().min(1, "Địa chỉ cụ thể là bắt buộc"),
  is_default: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
