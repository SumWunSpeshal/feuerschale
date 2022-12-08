import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ButtonHTMLAttributes } from "react";

import { Icon } from "./Icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconDefinition;
};

export function Fab(props: ButtonProps) {
  const { icon, className, ...rest } = props;

  return (
    <button {...rest} className="p-4">
      <Icon icon={icon} size={32} className={className}></Icon>
    </button>
  );
}
