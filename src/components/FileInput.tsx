import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import clsx from "clsx";
import { ForwardedRef, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Error } from "./Error";
import { Fab } from "./Fab";

type FileInputProps = {
  [key: string]: any;
  id: string;
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
      <div className="relative w-full overflow-hidden rounded-lg border-2 border-black text-sm shadow-brutal transition-shadow focus-within:shadow-brutal-lg sm:text-base">
        <input
          type="file"
          {...rest}
          ref={ref}
          className={clsx(
            "w-full bg-white pr-12 outline-none",
            "file:mr-3 file:w-[4.25rem] file:cursor-pointer file:overflow-hidden file:overflow-ellipsis file:border-0 file:border-r-2 file:border-black file:bg-yellow-300 file:p-0 file:px-2 file:py-3 file:text-black file:sm:w-auto file:sm:px-4",
            "after:absolute after:top-1/2 after:right-12 after:inline-block after:-translate-y-1/2 after:text-xs after:content-[attr(data-label)]"
          )}
          data-label={label || name}
        />
        <label htmlFor={props.id} className="sr-only">
          {label || name}
        </label>
        {reset && (
          <div className="absolute top-1/2 right-0 -translate-y-1/2 bg-white">
            <Fab
              icon={faTrashCan}
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
