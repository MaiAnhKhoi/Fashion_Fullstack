import { Request, Response } from "express";
import AppError from "@/utils/app-error";
import { parsePagination, buildPaginationMeta } from "@/utils/pagination";
import {
  handleAddWishList,
  handleGetWishListCount,
  handleDeleteWishList,
  handleGetWishListIds,
  handleGetWishListProducts,
} from "./wishlist.service";

const userId = (req: Request): number => {
  if (!req.user) throw new AppError("Chưa đăng nhập", 401);
  return req.user.sub;
};
const addWishList = (req: Request, res: Response) => {
  const { productId } = req.body;
  const result = handleAddWishList(userId(req), productId);
  res
    .status(200)
    .json({ message: "Đã thêm vào danh sách yêu thích", data: result });
};

const getWishListCount = async (req: Request, res: Response) => {
  const count = await handleGetWishListCount(userId(req));
  res
    .status(200)
    .json({ message: "Lấy số lượng danh sách yêu thích", data: count });
};

const deleteWishList = (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = handleDeleteWishList(userId(req), Number(productId));
  res
    .status(200)
    .json({ message: "Đã xoá từ danh sách yêu thích", data: result });
};

const getWishListIds = async (req: Request, res: Response) => {
  const ids = await handleGetWishListIds(userId(req));
  res.status(200).json({ message: "Lấy danh sách yêu thích", data: ids });
};

const getWishListProducts = async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query, {
    defaultLimit: 12,
    maxLimit: 100,
  });
  const { items, total } = await handleGetWishListProducts(
    userId(req),
    skip,
    limit,
  );
  res.status(200).json({
    message: "Lấy danh sách yêu thích",
    data: items,
    pagination: buildPaginationMeta(total, page, limit),
  });
};

export {
  addWishList,
  getWishListCount,
  deleteWishList,
  getWishListIds,
  getWishListProducts,
};
