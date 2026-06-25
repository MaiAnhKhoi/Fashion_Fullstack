import { Request, Response } from "express";
import {
  handleRegister,
  handleVerifyRegisterOtp,
  handleLogin,
  handleForgotPassword,
  handleResetPassword,
  handleResendOtp,
  handleRefresh,
  handleLogout,
} from "./auth.service";
import {
  REFRESH_COOKIE,
  setRefreshCookie,
  clearRefreshCookie,
} from "./auth.cookie";

// Express 5 tự động chuyển promise bị reject tới error.middleware,
// nên controller có thể throw trực tiếp mà không cần try/catch.

const meta = (req: Request) => ({
  ip: req.ip,
  userAgent: req.headers["user-agent"],
});

export const register = async (req: Request, res: Response) => {
  const result = await handleRegister(req.body);
  res.status(201).json(result);
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const { accessToken, refreshToken, message, user } =
    await handleVerifyRegisterOtp(email, otp, meta(req));
  setRefreshCookie(res, refreshToken);
  res.status(200).json({ message, data: { accessToken, user } });
};

export const login = async (req: Request, res: Response) => {
  const { accessToken, refreshToken, message } = await handleLogin(
    req.body,
    meta(req),
  );
  setRefreshCookie(res, refreshToken);
  res.status(200).json({ message, data: { accessToken } });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const result = await handleForgotPassword(req.body.email);
  res.status(200).json(result);
};

export const resetPassword = async (req: Request, res: Response) => {
  const result = await handleResetPassword(req.body);
  res.status(200).json(result);
};

export const resendOtp = async (req: Request, res: Response) => {
  const { email, type } = req.body;
  const result = await handleResendOtp(email, type);
  res.status(200).json(result);
};

export const refresh = async (req: Request, res: Response) => {
  const { accessToken, refreshToken, message } = await handleRefresh(
    req.cookies?.[REFRESH_COOKIE],
    meta(req),
  );
  // Rotation: phát refresh token mới -> ghi đè cookie cũ.
  setRefreshCookie(res, refreshToken);
  res.status(200).json({ message, data: { accessToken } });
};

export const logout = async (req: Request, res: Response) => {
  const result = await handleLogout(req.cookies?.[REFRESH_COOKIE]);
  clearRefreshCookie(res);
  res.status(200).json(result);
};
