interface AddressResponse {
  id: number;
  receiverName: string | null;
  receiverPhone: string | null;
  province: string | null;
  district: string | null;
  ward: string | null;
  streetAddress: string | null;
  isDefault: boolean;
  createdAt: string | null;
}

export { AddressResponse };
