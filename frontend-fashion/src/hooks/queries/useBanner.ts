import { getAllBanners } from "@/api/banner.api";
import { useQuery } from "@tanstack/react-query";

export const useBanner = () => {
  return useQuery({
    queryKey: ["banner"],
    queryFn: getAllBanners,
    staleTime: 10 * 60 * 1000, // 10 phút
    gcTime: 60 * 60 * 1000, // 1 giờ
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
