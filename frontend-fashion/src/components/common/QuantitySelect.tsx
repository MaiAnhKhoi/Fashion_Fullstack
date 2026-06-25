"use client";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  quantity?: number;
  setQuantity?: Dispatch<SetStateAction<number>>;
  styleClass?: string;
};

export default function QuantitySelect({
  quantity = 1,
  setQuantity = () => {},
  styleClass = "",
}: Props) {
  return (
    <div className={`wg-quantity ${styleClass}`}>
      <button
        className="btn-quantity minus-btn"
        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
      >
        -
      </button>

      <input
        className="quantity-product font-4"
        type="number"
        name="number"
        value={quantity}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (!isNaN(value) && value > 0) {
            setQuantity(value);
          }
        }}
      />

      <span
        className="btn-quantity plus-btn"
        onClick={() => setQuantity((q) => q + 1)}
        role="button"
        tabIndex={0}
      >
        +
      </span>
    </div>
  );
}
