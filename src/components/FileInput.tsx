import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ForwardedRef, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Fab } from "./Fab";

type FileInputProps = {
  [key: string]: any;
  label?: string;
  reset?: () => void;
} & UseFormRegisterReturn;

export const FileInput = forwardRef(function FileInput(
  props: Omit<FileInputProps, "ref">,
  ref: ForwardedRef<HTMLInputElement>
) {
  const { label, name, required, reset } = props;

  return (
    <div className="relative w-full overflow-hidden rounded-lg border-2 border-black shadow-brutal outline-none transition-shadow focus:shadow-brutal-lg">
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

      <input
        type="file"
        {...props}
        ref={ref}
        placeholder={`${label || name}${required ? " *" : ""}`}
        className="w-full file:mr-3 file:cursor-pointer file:border-0 file:border-r-2 file:border-black file:bg-yellow-300 file:p-0 file:py-3 file:px-4"
      />
      <label htmlFor={props.name} className="sr-only">
        {label || name}
      </label>
    </div>
  );
});
