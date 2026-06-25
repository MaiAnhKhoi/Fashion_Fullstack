import { Request, Response } from "express";
import { handleGetShopSetting } from "./shop-setting.service";

const getShopSetting = async (_req: Request, res: Response) => {
  try {
    const setting = await handleGetShopSetting();

    if (!setting) {
      return res.status(404).json({ message: "Shop setting not found" });
    }

    return res.status(200).json({
      message: "Shop setting retrieved successfully",
      data: setting,
    });
  } catch (error) {
    console.log("Error in getShopSetting controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getShopSetting };
