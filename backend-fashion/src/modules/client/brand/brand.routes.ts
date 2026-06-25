import express from "express";
import { getBrands } from "./brand.controller";

const router = express.Router();

router.get("/brands", getBrands);

export default router;
