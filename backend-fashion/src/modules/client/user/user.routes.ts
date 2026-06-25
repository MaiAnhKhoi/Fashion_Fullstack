import express from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import { uploadImageMiddleware } from "@/middlewares/upload.middleware";
import { updateProfileSchema, changePasswordSchema } from "./user.validation";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
} from "./user.controller";

const router = express.Router();

// Tất cả endpoint /me/* yêu cầu đăng nhập.
router.use("/me", authenticate);

router.get("/me", getProfile);
router.patch("/me", validateBody(updateProfileSchema), updateProfile);
router.post("/me/avatar", uploadImageMiddleware.single("avatar"), uploadAvatar);
router.patch(
  "/me/password",
  validateBody(changePasswordSchema),
  changePassword,
);

export default router;
