import { api } from "@/lib/api";
import type { BrandResponse } from "@/types/brand";
export const getAllBrand = async () => {
    try {
        const response = await api.get("/brands");
        return response.data as BrandResponse[];
    } catch (error) {
        console.error("Error fetching brands:", error);
        throw error;
    }
};