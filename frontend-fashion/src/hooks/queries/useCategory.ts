import { useQuery } from "@tanstack/react-query";
import { getCategories, getCategoriesParentWithChildren } from "@/api/category.api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // 10 phút
    gcTime: 60 * 60 * 1000, // 1 giờ
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useCategoriesParent = () => {
  return useQuery({
    queryKey: ["categories", "parents"],
    queryFn: getCategoriesParentWithChildren,
    staleTime: 10 * 60 * 1000, // 10 phút
    gcTime: 60 * 60 * 1000, // 1 giờ
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};