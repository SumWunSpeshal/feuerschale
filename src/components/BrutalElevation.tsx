import clsx from "clsx";
import { PropsWithChildren } from "react";

const stackClasses =
  "square-full absolute left-0 top-0 translate-x-1 translate-y-1 rounded-3xl border-2 border-black";

type BrutalElevationProps = PropsWithChildren<{
  className?: string;
}>;

export function BrutalElevation(props: BrutalElevationProps) {
  const { children, className } = props;

  return (
    <>
      {children}
      <div
        className={clsx(stackClasses, className, "translate-x-1 translate-y-1")}
      ></div>
      <div
        className={clsx(stackClasses, className, "translate-x-2 translate-y-2")}
      ></div>
    </>
  );
}
