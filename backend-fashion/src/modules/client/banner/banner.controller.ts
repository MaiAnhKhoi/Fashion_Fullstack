import { Request, Response } from "express";
import { handleGetBanners } from "./banner.service";

const getBanners = async (req: Request, res: Response) => {

  const position = req.query.position as string | undefined;
  console.log("Position query:", position);
  try {
    const banners = await handleGetBanners(position);
    return res.status(200).json({
      message: "Banners retrieved successfully",
      data: banners,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getBanners };
