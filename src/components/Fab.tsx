import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ButtonHTMLAttributes } from "react";

import { Icon, IconSizes } from "./Icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconDefinition;
  size?: IconSizes;
};

export function Fab(props: ButtonProps) {
  const { icon, className, size = 32, ...rest } = props;

  return (
    <button {...rest} type="button" className="p-4">
      <Icon icon={icon} size={size} className={className}></Icon>
    </button>
  );
}
