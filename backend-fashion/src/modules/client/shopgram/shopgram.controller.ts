import { Request, Response } from "express";
import { handleGetShopgram } from "./shopgram.service";

const getShopgram = async (_req: Request, res: Response) => {
  try {
    const items = await handleGetShopgram();
    return res.status(200).json({
      message: "Shopgram retrieved successfully",
      data: items,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getShopgram };
