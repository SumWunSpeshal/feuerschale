import clsx from "clsx";
import { ForwardedRef, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Error } from "./Error";

type DateInputProps = {
  [key: string]: any;
  id: string;
  label?: string;
  isEmpty?: boolean;
  error?: string;
} & UseFormRegisterReturn;

export const DateInput = forwardRef(function DateInput(
  props: Omit<DateInputProps, "ref">,
  ref: ForwardedRef<HTMLInputElement>
) {
  const { label, name, isEmpty, required } = props;
  const { isEmpty: _isEmpty, error, ...rest } = props;

  return (
    <div className="relative">
      <input
        type="date"
        {...rest}
        ref={ref}
        data-label={`${label || name} ${required ? " *" : ""}`}
        className={clsx(
          "box-border flex w-full rounded-lg border-2 border-black py-3 px-4 text-left font-project shadow-brutal outline-none transition-shadow before:mr-2 before:whitespace-nowrap before:content-[attr(data-label)] focus:shadow-brutal-lg"
        )}
      />
      <label htmlFor={props.id} className="sr-only">
        {label || name}
      </label>
      <Error>{error}</Error>
    </div>
  );
});
