import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type IconSizes = 4 | 16 | 20 | 24 | 32;

type IconProps = {
  icon: IconDefinition;
  size?: IconSizes;
  className?: string;
};

export function Icon(props: IconProps) {
  const { className, icon, size = 16 } = props;

  return <FontAwesomeIcon icon={icon} className={className} width={size} />;
}
