import { api } from "@/lib/api";
import type { TestimonialResponse } from "@/types/review";
export const getReview = async () => {
  try {
    const response = await api.get("/testimonials");
    return response.data as TestimonialResponse[];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};
