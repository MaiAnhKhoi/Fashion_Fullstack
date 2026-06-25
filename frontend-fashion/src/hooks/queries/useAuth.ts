import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { login, logout } from "@/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";

export const useLogin = () => {
  const { setAccessToken } = useAuthStore();
  const { closeModelLogin } = useUIStore();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      closeModelLogin();
    },
  });
};

export const useLogout = () => {
  const { clearTokens } = useAuthStore();
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearTokens();
      queryClient.clear(); // xóa toàn bộ cache của react-query sau khi logout, tránh dữ liệu cũ còn sót lại.
    },
  });
};
