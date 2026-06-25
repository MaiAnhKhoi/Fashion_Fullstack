import express from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import {
  validateBody,
  validateParams,
} from "@/middlewares/validate.middleware";
import { addWishListSchema, productParamSchema } from "./wishlist.validation";
import {
  addWishList,
  getWishListCount,
  deleteWishList,
  getWishListIds,
  getWishListProducts,
} from "./wishlist.controller";

const router = express.Router();

router.use("/wishlists", authenticate);
router.get("/wishlists", getWishListProducts);
router.get("/wishlists/ids", getWishListIds);
router.get("/wishlists/count", getWishListCount);
router.post("/wishlists", validateBody(addWishListSchema), addWishList);
router.delete(
  "/wishlists/:productId",
  validateParams(productParamSchema),
  deleteWishList,
);

export default router;
