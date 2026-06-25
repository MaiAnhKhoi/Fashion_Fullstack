import express from "express";
import { getShopSetting } from "./shop-setting.controller";

const router = express.Router();

router.get("/shop-setting", getShopSetting);

export default router;
