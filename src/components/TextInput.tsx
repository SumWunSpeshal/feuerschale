import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { ForwardedRef, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Icon } from "./Icon";

type TextInputProps = {
  [key: string]: any;
  label?: string;
  icon?: IconDefinition;
} & UseFormRegisterReturn;

export const TextInput = forwardRef(function TextInput(
  props: Omit<TextInputProps, "ref">,
  ref: ForwardedRef<HTMLInputElement>
) {
  const { label, name, icon } = props;

  return (
    <div className="relative">
      {icon && (
        <div className="absolute top-1/2 left-4 -translate-y-1/2">
          <Icon icon={icon} className="text-gray-400" />
        </div>
      )}

      <input
        type="text"
        {...props}
        ref={ref}
        placeholder={label || name}
        className={clsx(
          "w-full rounded-lg border-2 border-black py-3 px-4 shadow-brutal outline-none transition-shadow focus:shadow-brutal-lg",
          icon && "pl-10"
        )}
      />
      <label htmlFor={props.name} className="sr-only">
        {label || name}
      </label>
    </div>
  );
});
