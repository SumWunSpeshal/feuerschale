import clsx from "clsx";
import { ForwardedRef, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type ChipInputProps = UseFormRegisterReturn & {
  label: string;
  id: string;
  value: string | number;
  warning?: boolean;
};

export const ChipInput = forwardRef(function ChipInput(
  props: Omit<ChipInputProps, "ref">,
  ref: ForwardedRef<HTMLInputElement>
) {
  const { label, id, disabled, warning, ...rest } = props;

  return (
    <div className="inline-flex">
      <input
        type="checkbox"
        id={id}
        ref={ref}
        className="peer sr-only"
        disabled={disabled}
        {...rest}
      />
      <label
        htmlFor={id}
        className={clsx(
          "max-w-[36rem] select-none overflow-hidden overflow-ellipsis whitespace-nowrap rounded-lg border-2 px-1.5 text-sm outline-none transition-all",
          {
            "bg-yellow-300": !disabled && !warning,
            "cursor-pointer border-black hover:shadow-brutal peer-checked:bg-black peer-checked:text-white":
              !disabled,
            "pointer-events-none cursor-auto border-gray-300 bg-gray-100 text-gray-300":
              disabled,
            "bg-orange-400": warning,
          }
        )}
      >
        {label}
      </label>
    </div>
  );
});
