import {
  faCheck,
  faClose,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { Icon } from "./Icon";

type BoxedIconProps = {
  state: State;
};

type State = "check" | "close";
type Config = Record<
  State,
  {
    bg: string;
    color: string;
    icon: IconDefinition;
  }
>;

const config: Config = {
  check: {
    bg: "bg-green-200",
    color: "text-green-600",
    icon: faCheck,
  },
  close: {
    bg: "bg-red-200",
    color: "text-red-600",
    icon: faClose,
  },
};

export function BoxedIcon(props: BoxedIconProps) {
  const { state } = props;

  return (
    <div
      className={clsx(
        "square-6 flex items-center justify-center rounded-md",
        config[state].bg
      )}
    >
      <Icon
        icon={config[state].icon}
        className={clsx("", config[state].color)}
      />
    </div>
  );
}
