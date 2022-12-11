import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { ForwardedRef, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Icon } from "./Icon";

type Option = { value: number | string; innerText: number | string };

type SelectInputProps = UseFormRegisterReturn & {
  id: string;
  defaultOption: Option;
  options: Option[] | undefined;
  isEmpty?: boolean;
};

export const SelectInput = forwardRef(function SelectInput(
  props: Omit<SelectInputProps, "ref">,
  ref: ForwardedRef<HTMLSelectElement>
) {
  const { id, defaultOption, options, isEmpty, required, ...rest } = props;

  return (
    <div className="relative">
      <select
        {...rest}
        id={id}
        ref={ref}
        className={clsx(
          "peer w-full appearance-none rounded-lg border-2 border-black py-3 pl-4 pr-10 shadow-brutal outline-none transition-all focus:shadow-brutal-lg",
          isEmpty && "text-gray-400"
        )}
      >
        <option value={defaultOption.value}>
          {defaultOption.innerText + (required ? " *" : "")}
        </option>
        {options?.map(({ innerText, value }) => (
          <option key={value} value={value}>
            {innerText}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 transition-transform peer-focus:rotate-180">
        <Icon icon={faChevronDown} size={16}></Icon>
      </div>
    </div>
  );
});
