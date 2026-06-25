import { Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.config";

export const REFRESH_COOKIE = "refreshToken";

const isProd = env.NODE_ENV === "production";

// Cookie chỉ gửi kèm cho các route /api/auth/* (refresh, logout),
// httpOnly để JS không đọc được -> chống đánh cắp token qua XSS.
const baseOptions = {
  httpOnly: true,
  secure: isProd, // chỉ gửi qua HTTPS ở production
  sameSite: isProd ? ("none" as const) : ("lax" as const),
  path: "/api/auth",
};

/** Gắn refresh token vào httpOnly cookie, hạn dùng khớp với exp của token. */
export const setRefreshCookie = (res: Response, refreshToken: string) => {
  const decoded = jwt.decode(refreshToken) as { exp?: number } | null;
  const expires = decoded?.exp ? new Date(decoded.exp * 1000) : undefined;

  res.cookie(REFRESH_COOKIE, refreshToken, { ...baseOptions, expires });
};

/** Xoá refresh cookie (phải cùng options để trình duyệt match đúng cookie). */
export const clearRefreshCookie = (res: Response) => {
  res.clearCookie(REFRESH_COOKIE, baseOptions);
};
