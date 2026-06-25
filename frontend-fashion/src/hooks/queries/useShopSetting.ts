import { useQuery } from "@tanstack/react-query";
import { getShopSetting } from "@/api/shop-setting.api";

export const useShopSetting = () => {
    return useQuery({
        queryKey: ["shopSetting"],
        queryFn: getShopSetting,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
};