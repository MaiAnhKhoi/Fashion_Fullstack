import { Request, Response } from "express";
import AppError from "@/utils/app-error";
import {
  handleGetCart,
  handleAddItem,
  handleUpdateItem,
  handleRemoveItem,
  handleClearCart,
  handleGetCartCount,
  handleMergeCart,
} from "./cart.service";

// authenticate middleware bảo đảm req.user tồn tại; lấy id an toàn.
const userId = (req: Request): number => {
  if (!req.user) throw new AppError("Chưa đăng nhập", 401);
  return req.user.sub;
};

export const getCart = async (req: Request, res: Response) => {
  const cart = await handleGetCart(userId(req));
  res.status(200).json({ message: "Lấy giỏ hàng thành công", data: cart });
};

export const addItem = async (req: Request, res: Response) => {
  const { variantId, quantity } = req.body;
  const cart = await handleAddItem(userId(req), variantId, quantity);
  res.status(200).json({ message: "Đã thêm vào giỏ hàng", data: cart });
};

export const updateItem = async (req: Request, res: Response) => {
  const variantId = Number(req.params.variantId);
  const { quantity } = req.body;
  const cart = await handleUpdateItem(userId(req), variantId, quantity);
  res.status(200).json({ message: "Đã cập nhật giỏ hàng", data: cart });
};

export const removeItem = async (req: Request, res: Response) => {
  const variantId = Number(req.params.variantId);
  const cart = await handleRemoveItem(userId(req), variantId);
  res.status(200).json({ message: "Đã xoá sản phẩm khỏi giỏ hàng", data: cart });
};

export const clearCart = async (req: Request, res: Response) => {
  const cart = await handleClearCart(userId(req));
  res.status(200).json({ message: "Đã xoá toàn bộ giỏ hàng", data: cart });
};

export const getCartCount = async (req: Request, res: Response) => {
  const count = await handleGetCartCount(userId(req));
  res.status(200).json({ message: "Lấy số lượng giỏ hàng thành công", data: count });
};

export const mergeCart = async (req: Request, res: Response) => {
  const result = await handleMergeCart(userId(req), req.body.items);
  res.status(200).json({ message: "Gộp giỏ hàng thành công", data: result });
};
