import { Request, Response } from "express";
import AppError from "@/utils/app-error";
import {
  handleGetAddresses,
  handleCreateAddress,
  handleUpdateAddress,
  handleDeleteAddress,
} from "./address.service";

const userId = (req: Request): number => {
  if (!req.user) throw new AppError("Chưa đăng nhập", 401);
  return req.user.sub;
};

export const getAddresses = async (req: Request, res: Response) => {
  const data = await handleGetAddresses(userId(req));
  res.status(200).json({ message: "Lấy danh sách địa chỉ thành công", data });
};

export const createAddress = async (req: Request, res: Response) => {
  const data = await handleCreateAddress(userId(req), req.body);
  res.status(201).json({ message: "Thêm địa chỉ thành công", data });
};

export const updateAddress = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = await handleUpdateAddress(userId(req), id, req.body);
  res.status(200).json({ message: "Cập nhật địa chỉ thành công", data });
};

export const deleteAddress = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await handleDeleteAddress(userId(req), id);
  res.status(200).json({ message: "Xoá địa chỉ thành công" });
};
