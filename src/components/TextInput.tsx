import { ForwardedRef, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type TextInputProps = {
  label?: string;
} & UseFormRegisterReturn;

export const TextInput = forwardRef(function TextInput(
  props: Omit<TextInputProps, "ref">,
  ref: ForwardedRef<HTMLInputElement>
) {
  const { label, name } = props;

  return (
    <label htmlFor={props.name}>
      <span>{label || name}</span>
      <input type="text" {...props} ref={ref} />
    </label>
  );
});
