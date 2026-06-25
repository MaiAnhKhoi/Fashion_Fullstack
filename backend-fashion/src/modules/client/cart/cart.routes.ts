import express from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateBody, validateParams } from "@/middlewares/validate.middleware";
import {
  addItemSchema,
  updateItemSchema,
  variantParamSchema,
  mergeCartSchema,
} from "./cart.validation";
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  getCartCount,
  mergeCart,
} from "./cart.controller";

const router = express.Router();

// Tất cả endpoint giỏ hàng yêu cầu đăng nhập.
router.use("/cart", authenticate);

router.get("/cart", getCart);
router.get("/cart/count", getCartCount);
router.post("/cart/merge", validateBody(mergeCartSchema), mergeCart);
router.post("/cart/items", validateBody(addItemSchema), addItem);
router.patch(
  "/cart/items/:variantId",
  validateParams(variantParamSchema),
  validateBody(updateItemSchema),
  updateItem,
);
router.delete(
  "/cart/items/:variantId",
  validateParams(variantParamSchema),
  removeItem,
);
router.delete("/cart", clearCart);

export default router;
