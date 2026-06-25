import { z } from "zod";

const MAX_QUANTITY = 99;

const variantId = z.coerce
  .number({ message: "variantId không hợp lệ" })
  .int("variantId phải là số nguyên")
  .positive("variantId phải là số dương");

const quantity = z.coerce
  .number({ message: "quantity không hợp lệ" })
  .int("quantity phải là số nguyên")
  .min(1, "Số lượng tối thiểu là 1")
  .max(MAX_QUANTITY, `Số lượng tối đa là ${MAX_QUANTITY}`);

/** POST /cart/items — thêm vào giỏ (cộng dồn). */
export const addItemSchema = z.object({
  variantId,
  quantity: quantity.default(1),
});

/** PATCH /cart/items/:variantId — đặt số lượng tuyệt đối. */
export const updateItemSchema = z.object({
  quantity,
});

/** Params chứa :variantId. */
export const variantParamSchema = z.object({
  variantId,
});

const MAX_MERGE_ITEMS = 100;

/** POST /cart/merge — gộp giỏ guest vào giỏ user khi đăng nhập. */
export const mergeCartSchema = z.object({
  items: z
    .array(z.object({ variantId, quantity }))
    .min(1, "Danh sách sản phẩm trống")
    .max(MAX_MERGE_ITEMS, `Tối đa ${MAX_MERGE_ITEMS} sản phẩm mỗi lần gộp`),
});

export type AddItemInput = z.infer<typeof addItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type MergeCartInput = z.infer<typeof mergeCartSchema>;

export { MAX_QUANTITY };
