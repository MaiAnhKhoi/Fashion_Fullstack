import express from "express";
import {
  getCategories,
  GetParentCategoriesWithChildren,
} from "./category.controller";

const router = express.Router();

router.get("/categories/children", getCategories);
router.get("/categories/tree", GetParentCategoriesWithChildren);

export default router;
