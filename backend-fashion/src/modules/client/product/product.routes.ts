import express from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import { createReviewSchema } from "./product.validation";
import {
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
} from "./product.controller";

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/filters", getProductFilters);
router.get("/products/search", searchProducts);
router.get("/products/best-sellers", getBestsellers);
router.get("/products/todays-picks", getTodaysPicks);
router.get("/products/:id/reviews", getProductReviews);
router.get(
  "/products/:id/review-eligibility",
  authenticate,
  getReviewEligibility,
);
router.post(
  "/products/:id/reviews",
  authenticate,
  validateBody(createReviewSchema),
  createReview,
);
router.get("/products/:id/bought-together", getBoughtTogether);
// ":id" phải đặt SAU các route tĩnh để tránh "search"/"bestsellers" bị nhận nhầm là id
router.get("/products/:id", getProductById);

export default router;
