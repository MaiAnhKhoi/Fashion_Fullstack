import type { Dispatch, SetStateAction } from "react";

type Props = {
  sizes: string[];
  activeSize: string | null;
  setActiveSize: Dispatch<SetStateAction<string | null>>;
};

export default function SizePicker({
  sizes,
  activeSize,
  setActiveSize,
}: Props) {
  return (
    <div className="size-list">
      {sizes.map((size) => (
        <button
          key={size}
          className={activeSize === size ? "active" : ""}
          onClick={() => setActiveSize(size)}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
