import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  type AddressPayload,
} from "@/api/address.api";
import { useAuthStore } from "@/stores/auth.store";

const ADDRESS_KEY = ["addresses"];

export const useAddresses = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ADDRESS_KEY,
    queryFn: getAddresses,
    enabled: !!accessToken,
    staleTime: 1000 * 60,
  });
};

export const useCreateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressPayload) => createAddress(payload),
    // is_default có thể ảnh hưởng nhiều dòng -> refetch lại cho chắc.
    onSuccess: () => qc.invalidateQueries({ queryKey: ADDRESS_KEY }),
  });
};

export const useUpdateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<AddressPayload>;
    }) => updateAddress(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADDRESS_KEY }),
  });
};

export const useDeleteAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADDRESS_KEY }),
  });
};
