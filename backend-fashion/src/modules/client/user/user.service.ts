import prisma from "@/config/prisma.config";
import AppError from "@/utils/app-error";
import { hashPassword, comparePassword } from "@/utils/password.util";
import { uploadImage } from "@/config/cloudinary.config";
import { UserProfileResponse } from "./user.response";
import { UpdateProfileInput } from "./user.validation";

const AVATAR_FOLDER = "fashion-avatars";

type UserRow = {
  id: number;
  email: string;
  phone: string | null;
  full_name: string | null;
  avatar_url: string | null;
  gender: string | null;
  date_of_birth: Date | null;
  role: string | null;
  is_verified: boolean | null;
  created_at: Date | null;
};

const toProfile = (u: UserRow): UserProfileResponse => ({
  id: u.id,
  email: u.email,
  phone: u.phone,
  fullName: u.full_name,
  avatarUrl: u.avatar_url,
  gender: u.gender,
  dateOfBirth: u.date_of_birth
    ? u.date_of_birth.toISOString().slice(0, 10)
    : null,
  role: u.role ?? "customer",
  isVerified: u.is_verified ?? false,
  createdAt: u.created_at ? u.created_at.toISOString() : null,
});

const PROFILE_SELECT = {
  id: true,
  email: true,
  phone: true,
  full_name: true,
  avatar_url: true,
  gender: true,
  date_of_birth: true,
  role: true,
  is_verified: true,
  created_at: true,
} as const;

const handleGetProfile = async (
  userId: number,
): Promise<UserProfileResponse> => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: PROFILE_SELECT,
  });
  if (!user) throw new AppError("Tài khoản không tồn tại", 404);
  return toProfile(user);
};

const handleUpdateProfile = async (
  userId: number,
  input: UpdateProfileInput,
): Promise<UserProfileResponse> => {
  // SĐT trùng người khác?
  if (input.phone) {
    const existing = await prisma.users.findFirst({
      where: { phone: input.phone, NOT: { id: userId } },
      select: { id: true },
    });
    if (existing) throw new AppError("Số điện thoại đã được sử dụng", 409);
  }

  const user = await prisma.users.update({
    where: { id: userId },
    data: {
      full_name: input.full_name,
      phone: input.phone,
      gender: input.gender,
      date_of_birth: input.date_of_birth
        ? new Date(input.date_of_birth)
        : undefined,
      updated_at: new Date(),
    },
    select: PROFILE_SELECT,
  });

  return toProfile(user);
};

const handleUpdateAvatar = async (
  userId: number,
  fileBuffer: Buffer,
): Promise<UserProfileResponse> => {
  const { url } = await uploadImage(fileBuffer, AVATAR_FOLDER);

  const user = await prisma.users.update({
    where: { id: userId },
    data: { avatar_url: url, updated_at: new Date() },
    select: PROFILE_SELECT,
  });

  return toProfile(user);
};

const handleChangePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { id: true, password_hash: true },
  });
  if (!user) throw new AppError("Tài khoản không tồn tại", 404);

  const ok = await comparePassword(currentPassword, user.password_hash);
  if (!ok) throw new AppError("Mật khẩu hiện tại không đúng", 400);

  const passwordHash = await hashPassword(newPassword);
  await prisma.users.update({
    where: { id: userId },
    data: { password_hash: passwordHash, updated_at: new Date() },
  });

  // Thu hồi các phiên khác để buộc đăng nhập lại bằng mật khẩu mới.
  await prisma.user_sessions.updateMany({
    where: { user_id: userId, revoked: false },
    data: { revoked: true },
  });
};

export {
  handleGetProfile,
  handleUpdateProfile,
  handleUpdateAvatar,
  handleChangePassword,
};
