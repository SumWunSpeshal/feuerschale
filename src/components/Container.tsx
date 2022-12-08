import { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren;

export function Container(props: ContainerProps) {
  const { children } = props;

  return <div className="mx-auto box-content max-w-5xl px-6">{children}</div>;
}
