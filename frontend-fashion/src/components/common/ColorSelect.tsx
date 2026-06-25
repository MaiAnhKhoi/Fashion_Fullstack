"use client";

import { useState } from "react";
import type { ProductColor } from "@/types/product";

type Props = {
  activeColor?: string;
  setActiveColor?: (value: string) => void;
  colorOptions?: ProductColor[];
};

const defaultColorOptions: (ProductColor & { id: string })[] = [
  { id: "black", label: "Black", value: "black", img: "" },
];

export default function ColorSelect({
  activeColor,
  setActiveColor,
  colorOptions = defaultColorOptions,
}: Props) {
  const [internalColor, setInternalColor] = useState<string>("Black");

  const currentColor = activeColor ?? internalColor;
  const currentLabel =
    colorOptions.find((item) => item.value === currentColor)?.label ??
    currentColor;

  const handleSelectColor = (value: string) => {
    if (setActiveColor) {
      setActiveColor(value);
    } else {
      setInternalColor(value);
    }
  };

  return (
    <div className="variant-picker-item variant-color">
      <div className="variant-picker-label">
        Colors:
        <span
          className="text-title variant-picker-label-value value-currentColor"
          style={{ textTransform: "capitalize" }}
        >
          {currentLabel}
        </span>
      </div>

      <div className="variant-picker-values">
        {colorOptions.map((item) => {
          const { value, label } = item;
          console.log(value, label);

          return (
            <div
              key={value}
              onClick={() => handleSelectColor(value)}
              className={`hover-tooltip tooltip-bot color-btn ${
                currentColor === value ? "active" : ""
              }`}
            >
              <span className={`check-color ${value}`} />
              <span className="tooltip">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
