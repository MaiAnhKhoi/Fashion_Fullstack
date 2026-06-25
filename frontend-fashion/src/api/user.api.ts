import { api } from "@/lib/api";
import type { UserProfile } from "@/types/user";

// Interceptor đã bóc 1 lớp -> response.data chính là phần "data" của body.

export interface UpdateProfilePayload {
  full_name?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  date_of_birth?: string; // "YYYY-MM-DD"
}

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get("/me");
  return response.data as UserProfile;
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<UserProfile> => {
  const response = await api.patch("/me", payload);
  return response.data as UserProfile;
};

export const uploadAvatar = async (file: File): Promise<UserProfile> => {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await api.post("/me/avatar", formData);
  return response.data as UserProfile;
};

export const changePassword = async (payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  await api.patch("/me/password", payload);
};
