// Khớp với backend user.response.ts (UserProfileResponse)
export interface UserProfile {
  id: number;
  email: string;
  phone: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  gender: string | null;
  dateOfBirth: string | null; // "YYYY-MM-DD"
  role: string;
  isVerified: boolean;
  createdAt: string | null;
}
