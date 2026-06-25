interface UserProfileResponse {
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

export { UserProfileResponse };
