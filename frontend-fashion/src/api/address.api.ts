import { api } from "@/lib/api";
import type { Address } from "@/types/address";

export interface AddressPayload {
  receiver_name: string;
  receiver_phone: string;
  province: string;
  district: string;
  ward: string;
  street_address: string;
  is_default?: boolean;
}

export const getAddresses = async (): Promise<Address[]> => {
  const response = await api.get("/addresses");
  return response.data as Address[];
};

export const createAddress = async (
  payload: AddressPayload,
): Promise<Address> => {
  const response = await api.post("/addresses", payload);
  return response.data as Address;
};

export const updateAddress = async (
  id: number,
  payload: Partial<AddressPayload>,
): Promise<Address> => {
  const response = await api.patch(`/addresses/${id}`, payload);
  return response.data as Address;
};

export const deleteAddress = async (id: number): Promise<void> => {
  await api.delete(`/addresses/${id}`);
};
