import { PropsWithChildren } from "react";

type ListViewProps = PropsWithChildren;

export function ListView(props: ListViewProps) {
  const { children } = props;

  return <div className="py-12 sm:py-20">{children}</div>;
}
