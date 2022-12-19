import { faXmark } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { ForwardedRef, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Error } from "./Error";
import { Icon } from "./Icon";

type CheckInputProps = {
  [key: string]: any;
  id: string;
  label?: string;
  error?: string;
} & UseFormRegisterReturn;

export const CheckInput = forwardRef(function CheckInput(
  props: Omit<CheckInputProps, "ref">,
  ref: ForwardedRef<HTMLInputElement>
) {
  const { label, name, required } = props;
  const { error, ...rest } = props;

  return (
    <div className="relative">
      <label
        htmlFor={props.id}
        className="flex cursor-pointer items-center gap-3"
      >
        <input type="checkbox" {...rest} ref={ref} className="peer sr-only" />
        <div
          className={clsx(
            "square-8 flex items-center justify-center rounded-lg border-2 border-black bg-white shadow-brutal outline-none transition-shadow",
            "peer-checked:[--icon-display:block] peer-hover:shadow-brutal-lg peer-focus:shadow-brutal-lg"
          )}
        >
          <div style={{ display: "var(--icon-display, none)" }}>
            <Icon icon={faXmark} />
          </div>
        </div>
        <span>
          {label || name}
          {required ? " *" : ""}
        </span>
      </label>

      <Error>{error}</Error>
    </div>
  );
});
