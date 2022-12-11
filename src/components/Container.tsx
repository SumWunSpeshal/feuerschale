import clsx from "clsx";
import { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren;

export function Container(props: ContainerProps) {
  const { children } = props;

  return (
    <div className={clsx("mx-auto box-content max-w-5xl px-4 md:px-6")}>
      {children}
    </div>
  );
}
