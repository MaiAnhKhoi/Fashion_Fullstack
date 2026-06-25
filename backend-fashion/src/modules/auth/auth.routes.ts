import express from "express";
import { validateBody } from "@/middlewares/validate.middleware";
import {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation";
import {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  resendOtp,
  refresh,
  logout,
} from "./auth.controller";

const router = express.Router();

router.post("/auth/register", validateBody(registerSchema), register);
router.post("/auth/verify-otp", validateBody(verifyOtpSchema), verifyOtp);
router.post("/auth/resend-otp", validateBody(resendOtpSchema), resendOtp);
router.post("/auth/login", validateBody(loginSchema), login);
router.post("/auth/forgot-password", validateBody(forgotPasswordSchema), forgotPassword);
router.post("/auth/reset-password", validateBody(resetPasswordSchema), resetPassword);
// refresh & logout: refresh token lấy từ httpOnly cookie, không cần body.
router.post("/auth/refresh", refresh);
router.post("/auth/logout", logout);

export default router;
