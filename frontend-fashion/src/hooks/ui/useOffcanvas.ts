import { useEffect, useRef } from "react";
import { Offcanvas } from "bootstrap";

/**
 * Đồng bộ một Bootstrap Offcanvas với state zustand.
 *
 * - zustand là nguồn trạng thái: isOpen=true -> .show(), false -> .hide()
 * - Bootstrap lo phần CSS/animation + backdrop + phím ESC.
 * - Đóng bằng backdrop/ESC sẽ bắn `hidden.bs.offcanvas` -> gọi onClose()
 *   để cập nhật lại store cho khớp.
 *
 * Gắn ref trả về vào phần tử có class `.offcanvas`.
 */
export function useOffcanvas<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onClose: () => void,
) {
  const ref = useRef<T>(null);
  const instanceRef = useRef<Offcanvas | null>(null);

  // Giữ onClose mới nhất mà không phải tạo lại instance.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Tạo instance 1 lần khi mount.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const instance = Offcanvas.getOrCreateInstance(el);
    instanceRef.current = instance;

    const handleHidden = () => onCloseRef.current();
    el.addEventListener("hidden.bs.offcanvas", handleHidden);

    return () => {
      el.removeEventListener("hidden.bs.offcanvas", handleHidden);
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
