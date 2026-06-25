import { api } from "@/lib/api";
import type { CategoryResponse, CategoryTreeResponse } from "@/types/category";

export const getCategories = async () => {
  try {
    const response = await api.get("/categories/children");
    return response.data as CategoryResponse[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};


export const getCategoriesParentWithChildren = async () => {
  try {
    const response = await api.get("/categories/tree");
    return response.data as CategoryTreeResponse[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
