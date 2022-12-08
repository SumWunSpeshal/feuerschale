import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type IconProps = {
  icon: IconDefinition;
  size?: 16 | 24 | 32;
  className?: string;
};

export function Icon(props: IconProps) {
  const { className, icon, size = 16 } = props;

  return <FontAwesomeIcon icon={icon} className={className} width={size} />;
}
