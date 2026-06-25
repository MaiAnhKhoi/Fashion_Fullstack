import { useQuery } from "@tanstack/react-query";
import { getReview } from "@/api/review.api";

export const useTestimonials = () => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: getReview,
    staleTime: 1000 * 60 * 30, // 30 phút
    gcTime: 1000 * 60 * 60, // 1 giờ
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
