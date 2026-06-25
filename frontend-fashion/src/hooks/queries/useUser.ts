import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
} from "@/api/user.api";
import { useAuthStore } from "@/stores/auth.store";
import type { UserProfile } from "@/types/user";

const PROFILE_KEY = ["profile"];

export const useProfile = () => {
  // Chưa đăng nhập -> không gọi /me (backend yêu cầu auth).
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: getProfile,
    enabled: !!accessToken,
    staleTime: 1000 * 60,
  });
};

// update profile & upload avatar đều trả về hồ sơ mới -> ghi thẳng vào cache.
export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile: UserProfile) => qc.setQueryData(PROFILE_KEY, profile),
  });
};

export const useUploadAvatar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (profile: UserProfile) => qc.setQueryData(PROFILE_KEY, profile),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};
