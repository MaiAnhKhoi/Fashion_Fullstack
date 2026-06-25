import { z } from "zod";

const receiver_name = z
  .string({ message: "Tên người nhận là bắt buộc" })
  .trim()
  .min(1, "Tên người nhận không được trống")
  .max(255);

const receiver_phone = z
  .string({ message: "Số điện thoại là bắt buộc" })
  .trim()
  .regex(/^[0-9+\s-]{10,20}$/, "Số điện thoại không hợp lệ");

const province = z.string().trim().min(1, "Tỉnh/Thành là bắt buộc").max(100);
const district = z.string().trim().min(1, "Quận/Huyện là bắt buộc").max(100);
const ward = z.string().trim().min(1, "Phường/Xã là bắt buộc").max(100);
const street_address = z
  .string()
  .trim()
  .min(1, "Địa chỉ cụ thể là bắt buộc");

/** POST /addresses */
export const createAddressSchema = z.object({
  receiver_name,
  receiver_phone,
  province,
  district,
  ward,
  street_address,
  is_default: z.boolean().optional(),
});

/** PATCH /addresses/:id — tất cả optional. */
export const updateAddressSchema = z
  .object({
    receiver_name,
    receiver_phone,
    province,
    district,
    ward,
    street_address,
    is_default: z.boolean(),
  })
  .partial();

/** Params chứa :id. */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive("id không hợp lệ"),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
