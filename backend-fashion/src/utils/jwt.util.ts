import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "@/config/env.config";

export interface AccessTokenPayload {
  sub: number; // user id
  email: string;
  role: string;
}

export const signAccessToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES,
  } as SignOptions);

export const signRefreshToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES,
  } as SignOptions);

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as unknown as AccessTokenPayload;

export const verifyRefreshToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as unknown as AccessTokenPayload;
