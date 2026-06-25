import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

const formatErrors = (issues: { path: PropertyKey[]; message: string }[]) =>
  issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

/**
 * Validate req.body theo một Zod schema. Nếu hợp lệ, gán lại dữ liệu đã
 * parse (đã trim/ép kiểu) vào req.body; nếu không, trả 422 kèm danh sách lỗi.
 */
export const validateBody =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({
        message: "Dữ liệu không hợp lệ",
        errors: formatErrors(result.error.issues),
      });
    }
    req.body = result.data;
    return next();
  };

/**
 * Validate req.params theo một Zod schema (chỉ kiểm tra hợp lệ, không đổi kiểu
 * params vốn là string — controller tự ép kiểu sau khi đã được bảo đảm hợp lệ).
 */
export const validateParams =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return res.status(422).json({
        message: "Tham số không hợp lệ",
        errors: formatErrors(result.error.issues),
      });
    }
    return next();
  };
