import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

/**
 * Đồng bộ một Bootstrap Modal với state zustand (canh giữa màn hình).
 *
 * - zustand là nguồn trạng thái: isOpen=true -> .show(), false -> .hide()
 * - Bootstrap lo phần CSS/animation + backdrop + phím ESC.
 * - Đóng bằng backdrop/ESC sẽ bắn `hidden.bs.modal` -> gọi onClose() để
 *   cập nhật lại store cho khớp.
 *
 * Gắn ref trả về vào phần tử có class `.modal`.
 */
export function useModal<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onClose: () => void,
) {
  const ref = useRef<T>(null);
  const instanceRef = useRef<Modal | null>(null);

  // Giữ onClose mới nhất mà không phải tạo lại instance.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Tạo instance 1 lần khi mount.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const instance = Modal.getOrCreateInstance(el);
    instanceRef.current = instance;

    const handleHidden = () => onCloseRef.current();
    el.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      el.removeEventListener("hidden.bs.modal", handleHidden);
      instance.dispose();
      instanceRef.current = null;
    };
  }, []);

  // Đồng bộ show/hide theo state.
  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    if (isOpen) instance.show();
    else instance.hide();
  }, [isOpen]);

  return ref;
}
