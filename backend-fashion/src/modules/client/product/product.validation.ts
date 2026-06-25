import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z
    .number({ message: "Vui lòng chọn số sao" })
    .int("Số sao phải là số nguyên")
    .min(1, "Số sao tối thiểu là 1")
    .max(5, "Số sao tối đa là 5"),
  title: z.string().trim().max(255).optional().nullable(),
  comment: z
    .string({ message: "Vui lòng nhập nội dung đánh giá" })
    .trim()
    .min(1, "Nội dung đánh giá không được để trống")
    .max(2000, "Nội dung đánh giá tối đa 2000 ký tự"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
