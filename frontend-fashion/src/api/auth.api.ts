import { api } from "@/lib/api";
import type { LoginResponse } from "@/types/auth";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data as LoginResponse;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
