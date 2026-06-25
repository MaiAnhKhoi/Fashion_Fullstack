import express from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateBody, validateParams } from "@/middlewares/validate.middleware";
import {
  createAddressSchema,
  updateAddressSchema,
  idParamSchema,
} from "./address.validation";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "./address.controller";

const router = express.Router();

// Tất cả endpoint địa chỉ yêu cầu đăng nhập.
router.use("/addresses", authenticate);

router.get("/addresses", getAddresses);
router.post("/addresses", validateBody(createAddressSchema), createAddress);
router.patch(
  "/addresses/:id",
  validateParams(idParamSchema),
  validateBody(updateAddressSchema),
  updateAddress,
);
router.delete(
  "/addresses/:id",
  validateParams(idParamSchema),
  deleteAddress,
);

export default router;
