import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { PropsWithChildren } from "react";
import { Icon } from "./Icon";

type TooltipProps = PropsWithChildren;

export function Tooltip(props: TooltipProps) {
  const { children } = props;

  return (
    <div className="relative inline-flex">
      <div className="peer square-5 flex cursor-help items-center justify-center rounded-full border-2 border-black bg-white shadow-brutal-sm transition-shadow hover:shadow-brutal">
        <Icon icon={faInfo} size={4} />
      </div>
      <div className="absolute top-full left-1/2 z-50 mt-4 hidden w-max max-w-[15rem] -translate-x-1/2 rounded-md border-2 border-black bg-sky-100 px-4 py-2 text-sm font-semibold shadow-brutal peer-hover:block">
        <div className="square-3 absolute left-1/2 -top-0.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-t-2 border-l-2 border-black bg-sky-100" />
        <div>{children}</div>
      </div>
    </div>
  );
}
