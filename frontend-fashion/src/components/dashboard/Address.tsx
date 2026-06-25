"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/hooks/queries/useAddress";
import { addressSchema, type AddressFormData } from "@/schema/address.schema";
import type { Address as AddressType } from "@/types/address";

const errMsg = (error: unknown, fallback = "Có lỗi xảy ra"): string => {
  const e = error as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? fallback;
};

const EMPTY: AddressFormData = {
  receiver_name: "",
  receiver_phone: "",
  province: "",
  district: "",
  ward: "",
  street_address: "",
  is_default: false,
};

export default function Address() {
  const { data: addresses = [], isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: EMPTY,
  });

  const saving = createAddress.isPending || updateAddress.isPending;
  const saveError = createAddress.error || updateAddress.error;

  const openAdd = () => {
    reset(EMPTY);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (a: AddressType) => {
    reset({
      receiver_name: a.receiverName ?? "",
      receiver_phone: a.receiverPhone ?? "",
      province: a.province ?? "",
      district: a.district ?? "",
      ward: a.ward ?? "",
      street_address: a.streetAddress ?? "",
      is_default: a.isDefault,
    });
    setEditingId(a.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const onSubmit = (data: AddressFormData) => {
    if (editingId !== null) {
      updateAddress.mutate(
        { id: editingId, payload: data },
        { onSuccess: closeForm },
      );
    } else {
      createAddress.mutate(data, { onSuccess: closeForm });
    }
  };

  const onDelete = (id: number) => {
    if (window.confirm("Xoá địa chỉ này?")) deleteAddress.mutate(id);
  };

  if (isLoading) {
    return <div className="my-acount-content account-address">Đang tải...</div>;
  }

  return (
    <div className="my-acount-content account-address">
      <h6 className="title-account">Địa chỉ của bạn ({addresses.length})</h6>

      <div className="widget-inner-address">
        {!showForm && (
          <button
            className="tf-btn btn-add-address animate-btn"
            onClick={openAdd}
          >
            Thêm địa chỉ mới
          </button>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="wd-form-address form-default show-form-address"
            style={{ display: "block" }}
          >
            <div className="cols">
              <fieldset>
                <label>Họ tên người nhận</label>
                <input type="text" {...register("receiver_name")} />
                {errors.receiver_name && (
                  <p className="text-danger text-sm">
                    {errors.receiver_name.message}
                  </p>
                )}
              </fieldset>
              <fieldset>
                <label>Số điện thoại</label>
                <input type="tel" {...register("receiver_phone")} />
                {errors.receiver_phone && (
                  <p className="text-danger text-sm">
                    {errors.receiver_phone.message}
                  </p>
                )}
              </fieldset>
            </div>

            <div className="cols">
              <fieldset>
                <label>Tỉnh/Thành phố</label>
                <input type="text" {...register("province")} />
                {errors.province && (
                  <p className="text-danger text-sm">
                    {errors.province.message}
                  </p>
                )}
              </fieldset>
              <fieldset>
                <label>Quận/Huyện</label>
                <input type="text" {...register("district")} />
                {errors.district && (
                  <p className="text-danger text-sm">
                    {errors.district.message}
                  </p>
                )}
              </fieldset>
            </div>

            <div className="cols">
              <fieldset>
                <label>Phường/Xã</label>
                <input type="text" {...register("ward")} />
                {errors.ward && (
                  <p className="text-danger text-sm">{errors.ward.message}</p>
                )}
              </fieldset>
            </div>

            <div className="cols">
              <fieldset>
                <label>Địa chỉ cụ thể (số nhà, tên đường)</label>
                <input type="text" {...register("street_address")} />
                {errors.street_address && (
                  <p className="text-danger text-sm">
                    {errors.street_address.message}
                  </p>
                )}
              </fieldset>
            </div>

            <div className="tf-cart-checkbox">
              <input
                type="checkbox"
                className="tf-check"
                id="isDefault"
                {...register("is_default")}
              />
              <label htmlFor="isDefault" className="label">
                <span>Đặt làm địa chỉ mặc định</span>
              </label>
            </div>

            {saveError && (
              <p className="text-danger text-sm">{errMsg(saveError)}</p>
            )}

            <div className="box-btn">
              <button className="tf-btn animate-btn" type="submit" disabled={saving}>
                {saving
                  ? "Đang lưu..."
                  : editingId !== null
                    ? "Cập nhật"
                    : "Thêm địa chỉ"}
              </button>
              <button
                type="button"
                className="tf-btn btn-out-line-dark btn-hide-address"
                onClick={closeForm}
              >
                Huỷ
              </button>
            </div>
          </form>
        )}

        {addresses.length === 0 && !showForm && (
          <p className="text-sm mt-3">Bạn chưa có địa chỉ nào.</p>
        )}

        <ul className="list-account-address tf-grid-layout md-col-2">
          {addresses.map((address) => (
            <li className="account-address-item" key={address.id}>
              <p className="title text-md fw-medium">
                {address.receiverName}
                {address.isDefault && (
                  <span className="badge bg-success ms-2 text-xs">Mặc định</span>
                )}
              </p>
              <div className="info-detail">
                <div className="box-infor">
                  <p className="text-md">{address.receiverPhone}</p>
                  <p className="text-md">
                    {[
                      address.streetAddress,
                      address.ward,
                      address.district,
                      address.province,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
                <div className="box-btn">
                  <button
                    className="tf-btn btn-out-line-dark btn-edit-address"
                    onClick={() => openEdit(address)}
                  >
                    Sửa
                  </button>
                  <button
                    className="tf-btn btn-out-line-dark btn-delete-address"
                    onClick={() => onDelete(address.id)}
                    disabled={deleteAddress.isPending}
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
