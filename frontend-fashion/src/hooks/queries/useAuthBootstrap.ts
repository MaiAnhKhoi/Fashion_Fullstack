import { useEffect } from "react";
import { refreshAccessToken } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";

// Chạy 1 lần duy nhất cho cả vòng đời app (kể cả khi StrictMode mount 2 lần).
let bootstrapped = false;

/**
 * Silent refresh khi app khởi động:
 * thử lấy accessToken từ refresh-token (cookie) đúng 1 lần.
 * - Thành công  -> setAccessToken, các query protected (enabled theo token) tự chạy.
 * - Thất bại    -> coi như khách, không gọi API protected.
 * Sau khi xong sẽ bật cờ authReady để UI/route guard biết "đã kiểm tra xong phiên".
 */
export const useAuthBootstrap = () => {
  const setAuthReady = useAuthStore((s) => s.setAuthReady);

  useEffect(() => {
    if (bootstrapped) return;
    bootstrapped = true;

    refreshAccessToken().finally(() => setAuthReady(true));
  }, [setAuthReady]);
};
