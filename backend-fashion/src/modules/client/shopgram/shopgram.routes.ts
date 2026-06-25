import express from "express";
import { getShopgram } from "./shopgram.controller";

const router = express.Router();

router.get("/shopgram", getShopgram);

export default router;
