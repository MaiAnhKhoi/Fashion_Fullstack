import axios, { type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";

export const api = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

/**
 * Gọi /auth/refresh để lấy accessToken mới từ refresh-token (cookie).
 * Dùng chung cho silent refresh lúc khởi động app và cho interceptor 401.
 * Dùng axios "thuần" (không qua `api`) để tránh lặp interceptor.
 * @returns accessToken mới, hoặc null nếu không có/không hợp lệ phiên đăng nhập.
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${env.API_URL}/auth/refresh`,
      {},
      { withCredentials: true },
    );

    // axios thuần -> response.data là body { message, data: { accessToken } }
    const accessToken = response.data.data.accessToken as string;
    useAuthStore.getState().setAccessToken(accessToken);
    return accessToken;
  } catch {
    useAuthStore.getState().clearTokens();
    return null;
  }
};

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// ── Hàng đợi request đang chờ người dùng đăng nhập ──────────────────────────
type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean; // đã thử refresh token chưa
  _loginRetry?: boolean; // đã thử lại sau khi đăng nhập chưa (chống lặp vô hạn)
};

interface PendingRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: RetryableConfig;
}

let pendingRequests: PendingRequest[] = [];
let authSubscribed = false;

// Đăng nhập xong -> chạy lại toàn bộ request đang chờ với token mới.
const flushPending = (token: string) => {
  const queue = pendingRequests;
  pendingRequests = [];
  queue.forEach(({ resolve, reject, config }) => {
    config._loginRetry = true;
    config.headers.Authorization = `Bearer ${token}`;
    api(config).then(resolve).catch(reject);
  });
};

// Huỷ đăng nhập -> báo lỗi cho các request đang chờ.
const rejectPending = (reason: unknown) => {
  const queue = pendingRequests;
  pendingRequests = [];
  queue.forEach(({ reject }) => reject(reason));
};

// Đăng ký lắng nghe store 1 lần (chỉ khi thực sự cần, tránh chạy lúc import).
const ensureAuthSubscriptions = () => {
  if (authSubscribed) return;
  authSubscribed = true;

  // accessToken null -> có giá trị = đăng nhập thành công.
  useAuthStore.subscribe((state, prev) => {
    if (!prev.accessToken && state.accessToken && pendingRequests.length) {
      flushPending(state.accessToken);
    }
  });

  // Đóng modal login mà vẫn chưa đăng nhập = người dùng huỷ.
  useUIStore.subscribe((state, prev) => {
    if (
      prev.isModelLogin &&
      !state.isModelLogin &&
      !useAuthStore.getState().accessToken &&
      pendingRequests.length
    ) {
      rejectPending(new Error("Đăng nhập đã bị huỷ"));
    }
  });
};

api.interceptors.response.use(
  (response) => {
    return response.data;
  },

  async (error) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const status = error.response?.status;

    // Không phải 401, hoặc lỗi từ chính endpoint /auth/* -> trả lỗi như cũ.
    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest.url?.includes("/auth/")
    ) {
      return Promise.reject(error);
    }

    const hadToken = Boolean(originalRequest.headers?.Authorization);

    // 1) Có token nhưng hết hạn -> thử refresh đúng 1 lần.
    if (hadToken && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    // Đã thử lại sau đăng nhập mà vẫn 401 -> dừng, tránh lặp vô hạn.
    if (originalRequest._loginRetry) {
      return Promise.reject(error);
    }

    // 2) Khách chưa đăng nhập / refresh thất bại:
    //    mở modal login, xếp request vào hàng đợi, đăng nhập xong tự chạy lại.
    ensureAuthSubscriptions();
    useUIStore.getState().openModelLogin();

    return new Promise((resolve, reject) => {
      pendingRequests.push({ resolve, reject, config: originalRequest });
    });
  },
);
