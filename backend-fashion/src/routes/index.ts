import express, { Express } from "express";
import authRouter from "@/modules/auth/auth.routes";
import cartRouter from "@/modules/client/cart/cart.routes";
import productRouter from "@/modules/client/product/product.routes";
import bannerRouter from "@/modules/client/banner/banner.routes";
import categoryRouter from "@/modules/client/category/category.routes";
import testimonialRouter from "@/modules/client/testimonial/testimonial.routes";
import brandRouter from "@/modules/client/brand/brand.routes";
import shopgramRouter from "@/modules/client/shopgram/shopgram.routes";
import shopSettingRouter from "@/modules/client/shop-setting/shop-setting.routes";
import wishlistRouter from "@/modules/client/wishlist/wishlist.routes";
import userRouter from "@/modules/client/user/user.routes";
import addressRouter from "@/modules/client/address/address.routes";

const router = express.Router();

const webRouter = (app: Express) => {
  router.use(authRouter);
  router.use(cartRouter);
  router.use(productRouter);
  router.use(bannerRouter);
  router.use(categoryRouter);
  router.use(testimonialRouter);
  router.use(brandRouter);
  router.use(shopgramRouter);
  router.use(shopSettingRouter);
  router.use(wishlistRouter);
  router.use(userRouter);
  router.use(addressRouter);
  app.use("/api", router);
};

export default webRouter;
