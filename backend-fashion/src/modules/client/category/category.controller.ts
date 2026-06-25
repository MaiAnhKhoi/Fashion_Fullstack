import { Request, Response } from "express";
import { handleGetCategories } from "./category.service";
import { handleGetParentCategoriesWithChildren } from "./category.service";
const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await handleGetCategories();
    return res.status(200).json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GetParentCategoriesWithChildren = async (req: Request, res: Response) => {
  try {
    const categories = await handleGetParentCategoriesWithChildren();
    return res.status(200).json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getCategories, GetParentCategoriesWithChildren };
