import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/jwt.util";

/**
 * Yêu cầu access token hợp lệ trong header `Authorization: Bearer <token>`.
 * Gán payload vào req.user nếu hợp lệ, ngược lại trả 401.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;

  console.log("HEADER:", header);

  if (!header) {
    return res.status(401).json({ message: "NO HEADER" });
  }

  const token = header.slice(7).trim();

  console.log("TOKEN:", token);

  try {
    const payload = verifyAccessToken(token);
    console.log("PAYLOAD:", payload);

    req.user = payload;
    return next();
  } catch (err) {
    console.log("VERIFY ERROR:", err);
    return res.status(401).json({ message: "TOKEN INVALID" });
  }
};

/** Chỉ cho phép một số role nhất định (dùng sau authenticate). */
export const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    return next();
  };
