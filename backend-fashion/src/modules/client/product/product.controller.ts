import { Request, Response } from "express";
import { parsePagination, buildPaginationMeta } from "@/utils/pagination";
import AppError from "@/utils/app-error";
import {
  handleGetAllProducts,
  handleGetBestsellers,
  handleGetTodaysPicks,
  handleGetBoughtTogether,
  handleGetProductById,
  handleSearchProducts,
  handleGetProductFilters,
  handleGetProductReviews,
  handleGetReviewEligibility,
  handleCreateReview,
} from "./product.service";

const str = (v: unknown): string | undefined => {
  const s = String(v ?? "").trim();
  return s ? s : undefined;
};
const num = (v: unknown): number | undefined => {
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : undefined;
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = parsePagination(req.query, {
      defaultLimit: 12,
      maxLimit: 100,
    });
    const q = req.query;

    const { items, total } = await handleGetAllProducts({
      skip,
      limit,
      sort: str(q.sort),
      minPrice: num(q.minPrice),
      maxPrice: num(q.maxPrice),
      color: str(q.color),
      size: str(q.size),
      brand: str(q.brand),
      category: str(q.category),
      q: str(q.q),
      inStock:
        q.inStock === "true"
          ? true
          : q.inStock === "false"
            ? false
            : undefined,
    });

    return res.status(200).json({
      message: "All products retrieved successfully",
      data: items,
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProductFilters = async (_req: Request, res: Response) => {
  try {
    const data = await handleGetProductFilters();
    return res.status(200).json({ message: "Product filters", data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProductReviews = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const data = await handleGetProductReviews(id);
    return res.status(200).json({ message: "Product reviews", data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getReviewEligibility = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }
    const data = await handleGetReviewEligibility(userId, id);
    return res.status(200).json({ message: "Review eligibility", data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createReview = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }
    const data = await handleCreateReview(userId, id, req.body);
    return res.status(201).json({ message: "Đã gửi đánh giá", data });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

const searchProducts = async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q ?? "").trim();
    const { page, limit, skip } = parsePagination(req.query, {
      defaultLimit: 12,
      maxLimit: 100,
    });

    // Query rỗng -> trả danh sách rỗng, không cần đụng DB.
    if (!q) {
      return res.status(200).json({
        message: "No query",
        data: [],
        pagination: buildPaginationMeta(0, page, limit),
      });
    }

    const { items, total } = await handleSearchProducts(q, skip, limit);

    return res.status(200).json({
      message: "Search products successfully",
      data: items,
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getBestsellers = async (_req: Request, res: Response) => {
  try {
    const products = await handleGetBestsellers();
    return res.status(200).json({
      message: "Bestsellers retrieved successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTodaysPicks = async (_req: Request, res: Response) => {
  try {
    const products = await handleGetTodaysPicks();
    return res.status(200).json({
      message: "Today's picks retrieved successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getBoughtTogether = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const limit = num(req.query.limit) ?? 3;
    const data = await handleGetBoughtTogether(id, limit);
    return res.status(200).json({
      message: "Frequently bought together retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await handleGetProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getAllProducts,
  getProductFilters,
  getProductReviews,
  searchProducts,
  getBestsellers,
  getTodaysPicks,
  getBoughtTogether,
  getReviewEligibility,
  createReview,
  getProductById,
};
