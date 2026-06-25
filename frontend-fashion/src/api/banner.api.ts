import { api } from "@/lib/api";
import type { BannerItem } from "@/types/banner";
export const getAllBanners = async () => {
  try {
    const response = await api.get("/banners?position=home_top");
    return response.data as BannerItem[];
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error;
  }
};
