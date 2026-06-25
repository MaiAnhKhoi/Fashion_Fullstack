import prisma from "@/config/prisma.config";
import AppError from "@/utils/app-error";
import { AddressResponse } from "./address.response";
import { CreateAddressInput, UpdateAddressInput } from "./address.validation";

type AddressRow = {
  id: number;
  receiver_name: string | null;
  receiver_phone: string | null;
  province: string | null;
  district: string | null;
  ward: string | null;
  street_address: string | null;
  is_default: boolean | null;
  created_at: Date | null;
};

const toAddress = (a: AddressRow): AddressResponse => ({
  id: a.id,
  receiverName: a.receiver_name,
  receiverPhone: a.receiver_phone,
  province: a.province,
  district: a.district,
  ward: a.ward,
  streetAddress: a.street_address,
  isDefault: a.is_default ?? false,
  createdAt: a.created_at ? a.created_at.toISOString() : null,
});

/** Đảm bảo address thuộc về user; trả về row hoặc ném 404. */
const findOwned = async (userId: number, id: number) => {
  const address = await prisma.user_addresses.findFirst({
    where: { id, user_id: userId },
  });
  if (!address) throw new AppError("Địa chỉ không tồn tại", 404);
  return address;
};

const handleGetAddresses = async (
  userId: number,
): Promise<AddressResponse[]> => {
  const addresses = await prisma.user_addresses.findMany({
    where: { user_id: userId },
    orderBy: [{ is_default: "desc" }, { created_at: "desc" }],
  });
  return addresses.map(toAddress);
};

const handleCreateAddress = async (
  userId: number,
  input: CreateAddressInput,
): Promise<AddressResponse> => {
  const count = await prisma.user_addresses.count({
    where: { user_id: userId },
  });
  // Địa chỉ đầu tiên luôn là mặc định.
  const makeDefault = input.is_default || count === 0;

  const created = await prisma.$transaction(async (tx) => {
    if (makeDefault) {
      await tx.user_addresses.updateMany({
        where: { user_id: userId, is_default: true },
        data: { is_default: false },
      });
    }
    return tx.user_addresses.create({
      data: {
        user_id: userId,
        receiver_name: input.receiver_name,
        receiver_phone: input.receiver_phone,
        province: input.province,
        district: input.district,
        ward: input.ward,
        street_address: input.street_address,
        is_default: makeDefault,
      },
    });
  });

  return toAddress(created);
};

const handleUpdateAddress = async (
  userId: number,
  id: number,
  input: UpdateAddressInput,
): Promise<AddressResponse> => {
  await findOwned(userId, id);

  const updated = await prisma.$transaction(async (tx) => {
    if (input.is_default === true) {
      await tx.user_addresses.updateMany({
        where: { user_id: userId, is_default: true, NOT: { id } },
        data: { is_default: false },
      });
    }
    return tx.user_addresses.update({
      where: { id },
      data: {
        receiver_name: input.receiver_name,
        receiver_phone: input.receiver_phone,
        province: input.province,
        district: input.district,
        ward: input.ward,
        street_address: input.street_address,
        is_default: input.is_default,
      },
    });
  });

  return toAddress(updated);
};

const handleDeleteAddress = async (
  userId: number,
  id: number,
): Promise<void> => {
  const address = await findOwned(userId, id);
  await prisma.user_addresses.delete({ where: { id } });

  // Nếu xoá địa chỉ mặc định, đưa địa chỉ mới nhất còn lại làm mặc định.
  if (address.is_default) {
    const next = await prisma.user_addresses.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });
    if (next) {
      await prisma.user_addresses.update({
        where: { id: next.id },
        data: { is_default: true },
      });
    }
  }
};

export {
  handleGetAddresses,
  handleCreateAddress,
  handleUpdateAddress,
  handleDeleteAddress,
};
