import { faTrash } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { ForwardedRef, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Error } from "./Error";
import { Fab } from "./Fab";

type FileInputProps = {
  [key: string]: any;
  label?: string;
  reset?: () => void;
  isEmpty?: boolean;
  error?: string;
} & UseFormRegisterReturn;

export const FileInput = forwardRef(function FileInput(
  props: Omit<FileInputProps, "ref">,
  ref: ForwardedRef<HTMLInputElement>
) {
  const { label, name, reset } = props;
  const { reset: _reset, isEmpty, error, ...rest } = props;

  return (
    <div className="relative">
      <div className="relative w-full overflow-hidden rounded-lg border-2 border-black shadow-brutal transition-shadow focus-within:shadow-brutal-lg">
        <input
          type="file"
          {...rest}
          ref={ref}
          className={clsx(
            "w-full pr-12 outline-none file:mr-3 file:cursor-pointer file:border-0 file:border-r-2 file:border-black file:bg-yellow-300 file:p-0 file:py-3 file:px-4",
            isEmpty && "after:ml-2 after:content-['('attr(data-label)')']"
          )}
          data-label={label || name}
        />
        <label htmlFor={props.name} className="sr-only">
          {label || name}
        </label>
        {reset && (
          <div className="absolute top-1/2 right-0 -translate-y-1/2">
            <Fab
              icon={faTrash}
              size={16}
              onClick={reset}
              className="text-red-600"
            />
          </div>
        )}
      </div>
      <Error>{error}</Error>
    </div>
  );
});
