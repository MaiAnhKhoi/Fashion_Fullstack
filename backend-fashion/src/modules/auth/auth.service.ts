import jwt from "jsonwebtoken";
import prisma from "@/config/prisma.config";
import { env } from "@/config/env.config";
import { sendMail } from "@/config/mailer.config";
import AppError from "@/utils/app-error";
import { hashPassword, comparePassword } from "@/utils/password.util";
import { generateOtp, hashOtp, compareOtp } from "@/utils/otp.util";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  AccessTokenPayload,
} from "@/utils/jwt.util";
import { buildOtpEmail } from "./auth.email";
import {
  RegisterInput,
  LoginInput,
  ResetPasswordInput,
} from "./auth.validation";

type OtpType = "register" | "reset_password";

interface SessionMeta {
  ip?: string;
  userAgent?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const sanitizeUser = (user: {
  id: number;
  email: string;
  full_name: string | null;
  role: string | null;
  avatar_url: string | null;
  is_verified: boolean | null;
}) => ({
  id: user.id,
  email: user.email,
  fullName: user.full_name,
  role: user.role ?? "customer",
  avatarUrl: user.avatar_url,
  isVerified: user.is_verified ?? false,
});

/** Tạo OTP mới, vô hiệu hoá OTP cũ cùng loại, lưu hash và gửi email. */
const issueOtp = async (
  email: string,
  type: OtpType,
  fullName?: string | null,
) => {
  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const expiresAt = new Date(Date.now() + env.OTP_EXPIRES_MINUTES * 60 * 1000);

  // Vô hiệu hoá các OTP chưa dùng cùng loại để tránh nhiều mã hợp lệ song song.
  await prisma.email_otps.updateMany({
    where: { email, type, consumed: false },
    data: { consumed: true },
  });

  await prisma.email_otps.create({
    data: { email, type, otp_hash: otpHash, expires_at: expiresAt },
  });

  const { subject, html } = buildOtpEmail({
    otp,
    purpose: type,
    fullName,
    expiresMinutes: env.OTP_EXPIRES_MINUTES,
  });

  await sendMail({ to: email, subject, html });
};

/** Kiểm tra OTP. Trả về true nếu đúng, đồng thời đánh dấu đã dùng. */
const consumeOtp = async (email: string, type: OtpType, otp: string) => {
  const record = await prisma.email_otps.findFirst({
    where: { email, type, consumed: false },
    orderBy: { created_at: "desc" },
  });

  if (!record) {
    throw new AppError("Mã OTP không tồn tại, vui lòng yêu cầu mã mới", 400);
  }

  if (record.expires_at.getTime() < Date.now()) {
    throw new AppError("Mã OTP đã hết hạn, vui lòng yêu cầu mã mới", 400);
  }

  if (record.attempts >= env.OTP_MAX_ATTEMPTS) {
    throw new AppError("Bạn đã nhập sai quá số lần cho phép, vui lòng yêu cầu mã mới", 429);
  }

  const ok = await compareOtp(otp, record.otp_hash);
  if (!ok) {
    await prisma.email_otps.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    throw new AppError("Mã OTP không đúng", 400);
  }

  await prisma.email_otps.update({
    where: { id: record.id },
    data: { consumed: true },
  });
};

/** Phát access + refresh token và lưu phiên đăng nhập. */
const issueTokens = async (
  user: { id: number; email: string; role: string | null },
  meta?: SessionMeta,
) => {
  const payload: AccessTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role ?? "customer",
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const decoded = jwt.decode(refreshToken) as { exp: number };

  await prisma.user_sessions.create({
    data: {
      user_id: user.id,
      refresh_token: refreshToken,
      expires_at: new Date(decoded.exp * 1000),
      ip_address: meta?.ip?.slice(0, 50),
      user_agent: meta?.userAgent,
    },
  });

  return { accessToken, refreshToken };
};

// ─── Use cases ──────────────────────────────────────────────────────────────

const handleRegister = async (input: RegisterInput) => {
  const existing = await prisma.users.findUnique({ where: { email: input.email } });

  if (existing && existing.is_verified) {
    throw new AppError("Email đã được sử dụng", 409);
  }

  const passwordHash = await hashPassword(input.password);

  if (existing) {
    // Tài khoản cũ chưa xác minh => cập nhật lại thông tin rồi gửi OTP mới.
    await prisma.users.update({
      where: { id: existing.id },
      data: {
        password_hash: passwordHash,
        full_name: input.full_name ?? existing.full_name,
        phone: input.phone ?? existing.phone,
      },
    });
  } else {
    await prisma.users.create({
      data: {
        email: input.email,
        password_hash: passwordHash,
        full_name: input.full_name,
        phone: input.phone,
        is_verified: false,
      },
    });
  }

  await issueOtp(input.email, "register", input.full_name);

  return {
    message: "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP xác minh.",
  };
};

const handleVerifyRegisterOtp = async (
  email: string,
  otp: string,
  meta?: SessionMeta,
) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("Tài khoản không tồn tại", 404);
  }
  if (user.is_verified) {
    throw new AppError("Tài khoản đã được xác minh", 400);
  }

  await consumeOtp(email, "register", otp);

  const updated = await prisma.users.update({
    where: { id: user.id },
    data: { is_verified: true },
  });

  const tokens = await issueTokens(updated, meta);

  return {
    message: "Xác minh email thành công.",
    user: sanitizeUser(updated),
    ...tokens,
  };
};

const handleLogin = async (input: LoginInput, meta?: SessionMeta) => {
  const user = await prisma.users.findUnique({ where: { email: input.email } });

  // Thông báo chung để tránh dò email tồn tại.
  if (!user) {
    throw new AppError("Email hoặc mật khẩu không đúng", 401);
  }

  const passwordOk = await comparePassword(input.password, user.password_hash);
  if (!passwordOk) {
    throw new AppError("Email hoặc mật khẩu không đúng", 401);
  }

  if (!user.is_active) {
    throw new AppError("Tài khoản đã bị khoá", 403);
  }

  if (!user.is_verified) {
    throw new AppError("Tài khoản chưa xác minh email. Vui lòng xác minh trước khi đăng nhập.", 403);
  }

  await prisma.users.update({
    where: { id: user.id },
    data: { last_login: new Date() },
  });

  const tokens = await issueTokens(user, meta);

  return {
    message: "Đăng nhập thành công.",
    ...tokens,
  };
};

const handleForgotPassword = async (email: string) => {
  const user = await prisma.users.findUnique({ where: { email } });

  // Chỉ gửi khi tài khoản tồn tại & đã xác minh, nhưng luôn trả cùng message.
  if (user && user.is_verified) {
    await issueOtp(email, "reset_password", user.full_name);
  }

  return {
    message: "Nếu email tồn tại trong hệ thống, mã OTP đặt lại mật khẩu đã được gửi.",
  };
};

const handleResetPassword = async (input: ResetPasswordInput) => {
  const user = await prisma.users.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AppError("Tài khoản không tồn tại", 404);
  }

  await consumeOtp(input.email, "reset_password", input.otp);

  const passwordHash = await hashPassword(input.newPassword);

  await prisma.users.update({
    where: { id: user.id },
    data: { password_hash: passwordHash },
  });

  // Thu hồi toàn bộ phiên đăng nhập hiện có vì lý do bảo mật.
  await prisma.user_sessions.updateMany({
    where: { user_id: user.id, revoked: false },
    data: { revoked: true },
  });

  return { message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại." };
};

const handleResendOtp = async (email: string, type: OtpType) => {
  const user = await prisma.users.findUnique({ where: { email } });

  if (type === "register" && user && !user.is_verified) {
    await issueOtp(email, "register", user.full_name);
  } else if (type === "reset_password" && user && user.is_verified) {
    await issueOtp(email, "reset_password", user.full_name);
  }

  return { message: "Nếu yêu cầu hợp lệ, mã OTP mới đã được gửi tới email của bạn." };
};

const handleRefresh = async (refreshToken?: string, meta?: SessionMeta) => {
  if (!refreshToken) {
    throw new AppError("Refresh token không hợp lệ hoặc đã hết hạn", 401);
  }

  let payload: AccessTokenPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Refresh token không hợp lệ hoặc đã hết hạn", 401);
  }

  const session = await prisma.user_sessions.findFirst({
    where: { refresh_token: refreshToken, revoked: false },
  });

  if (!session || (session.expires_at && session.expires_at.getTime() < Date.now())) {
    throw new AppError("Phiên đăng nhập không hợp lệ hoặc đã hết hạn", 401);
  }

  // Rotation: thu hồi token cũ, phát token mới.
  await prisma.user_sessions.update({
    where: { id: session.id },
    data: { revoked: true },
  });

  const tokens = await issueTokens(
    { id: payload.sub, email: payload.email, role: payload.role },
    meta,
  );

  return { message: "Làm mới token thành công.", ...tokens };
};

const handleLogout = async (refreshToken?: string) => {
  // Không có token (cookie đã hết/clear) -> coi như đã đăng xuất.
  // Tránh updateMany với where rỗng làm revoke nhầm toàn bộ phiên.
  if (refreshToken) {
    await prisma.user_sessions.updateMany({
      where: { refresh_token: refreshToken, revoked: false },
      data: { revoked: true },
    });
  }
  return { message: "Đăng xuất thành công." };
};

export {
  handleRegister,
  handleVerifyRegisterOtp,
  handleLogin,
  handleForgotPassword,
  handleResetPassword,
  handleResendOtp,
  handleRefresh,
  handleLogout,
};
