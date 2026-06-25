import express from "express";
import { getBanners } from "./banner.controller";

const router = express.Router();

router.get("/banners", getBanners);

export default router;
