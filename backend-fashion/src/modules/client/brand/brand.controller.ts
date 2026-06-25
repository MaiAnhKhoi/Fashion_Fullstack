import { Request, Response } from "express";
import { handleGetBrands } from "./brand.service";

const getBrands = async (_req: Request, res: Response) => {
  try {
    const brands = await handleGetBrands();
    return res.status(200).json({
      message: "Brands retrieved successfully",
      data: brands,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getBrands };
