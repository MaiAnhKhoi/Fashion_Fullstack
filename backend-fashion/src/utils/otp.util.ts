import crypto from "crypto";
import bcrypt from "bcryptjs";

/** Sinh mã OTP 6 chữ số (an toàn về mặt mật mã học). */
export const generateOtp = (): string =>
  crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

export const hashOtp = (otp: string): Promise<string> => bcrypt.hash(otp, 10);

export const compareOtp = (otp: string, hash: string): Promise<boolean> =>
  bcrypt.compare(otp, hash);
