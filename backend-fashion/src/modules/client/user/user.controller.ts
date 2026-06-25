import { Request, Response } from "express";
import AppError from "@/utils/app-error";
import {
  handleGetProfile,
  handleUpdateProfile,
  handleUpdateAvatar,
  handleChangePassword,
} from "./user.service";

// authenticate middleware bảo đảm req.user tồn tại; lấy id an toàn.
const userId = (req: Request): number => {
  if (!req.user) throw new AppError("Chưa đăng nhập", 401);
  return req.user.sub;
};

export const getProfile = async (req: Request, res: Response) => {
  const profile = await handleGetProfile(userId(req));
  res.status(200).json({ message: "Lấy hồ sơ thành công", data: profile });
};

export const updateProfile = async (req: Request, res: Response) => {
  const profile = await handleUpdateProfile(userId(req), req.body);
  res.status(200).json({ message: "Cập nhật hồ sơ thành công", data: profile });
};

export const uploadAvatar = async (req: Request, res: Response) => {
  if (!req.file) throw new AppError("Chưa chọn ảnh", 400);
  const profile = await handleUpdateAvatar(userId(req), req.file.buffer);
  res.status(200).json({ message: "Cập nhật ảnh đại diện thành công", data: profile });
};

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  await handleChangePassword(userId(req), currentPassword, newPassword);
  res.status(200).json({ message: "Đổi mật khẩu thành công" });
};
