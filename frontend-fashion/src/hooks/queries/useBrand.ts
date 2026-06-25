import { useQuery } from "@tanstack/react-query";
import { getAllBrand } from "@/api/brand.api";
export const useBrand = () => {
    return useQuery({
        queryKey: ["brand"],
        queryFn: getAllBrand,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
};