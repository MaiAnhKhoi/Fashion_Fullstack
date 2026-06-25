import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import AppError from "@/utils/app-error";
import { env } from "@/config/env.config";

/** 404 cho route không khớp. */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: `Không tìm thấy ${req.method} ${req.originalUrl}` });
};

/** Error handler tập trung. Phải đặt cuối cùng, sau tất cả route. */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Ảnh vượt quá 5MB"
        : "Tải file lên thất bại";
    return res.status(400).json({ message });
  }

  if (env.NODE_ENV === "development") {
    console.error(err);
  }

  return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
};
