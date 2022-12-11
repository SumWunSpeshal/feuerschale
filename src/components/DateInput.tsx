import clsx from "clsx";
import { ForwardedRef, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type DateInputProps = {
  [key: string]: any;
  label?: string;
  isEmpty?: boolean;
} & UseFormRegisterReturn;

export const DateInput = forwardRef(function DateInput(
  props: Omit<DateInputProps, "ref">,
  ref: ForwardedRef<HTMLInputElement>
) {
  const { label, name, isEmpty, required } = props;
  const { isEmpty: _isEmpty, ...rest } = props;

  return (
    <div className="relative">
      <input
        type="date"
        {...rest}
        ref={ref}
        data-label={`${label || name} ${required ? " *" : ""}`}
        className={clsx(
          "w-full rounded-lg border-2 border-black py-3 px-4 font-project shadow-brutal outline-none transition-shadow before:mr-2 before:content-[attr(data-label)] focus:shadow-brutal-lg"
        )}
      />
      <label htmlFor={props.name} className="sr-only">
        {label || name}
      </label>
    </div>
  );
});
