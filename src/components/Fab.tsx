import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ButtonHTMLAttributes } from "react";

import { Icon } from "./Icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconDefinition;
  size?: 16 | 32;
};

export function Fab(props: ButtonProps) {
  const { icon, className, size = 32, ...rest } = props;

  return (
    <button {...rest} className="p-4">
      <Icon icon={icon} size={size} className={className}></Icon>
    </button>
  );
}
