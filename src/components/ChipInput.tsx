import { faWarning } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { ForwardedRef, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Icon } from "./Icon";

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
          "flex max-w-[36rem] select-none gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-lg border-2 px-1.5 text-sm outline-none transition-all",
          {
            "cursor-pointer border-black bg-white hover:shadow-brutal peer-checked:bg-black peer-checked:text-white":
              !disabled,
            "pointer-events-none cursor-auto border-gray-300 bg-gray-100 text-gray-300":
              disabled,
          }
        )}
      >
        {warning && <Icon icon={faWarning} className="text-orange-700" />}
        <span>{label}</span>
      </label>
    </div>
  );
});
