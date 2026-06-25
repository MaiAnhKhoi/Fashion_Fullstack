import { api } from "@/lib/api";
import type { ShopSettingResponse } from "@/types/shop";
export const getShopSetting = async (): Promise<ShopSettingResponse> => {
  try {
    const response = await api.get("/shop-setting");
    return response.data as ShopSettingResponse;
  } catch (error) {
    console.error("Error fetching shop setting:", error);
    throw error;
  }
};
