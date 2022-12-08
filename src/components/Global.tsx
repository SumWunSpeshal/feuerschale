import { PropsWithChildren } from "react";

type GlobalProps = PropsWithChildren<Record<string, unknown>>;

export function Global(props: GlobalProps) {
  const { children } = props;

  return <div className="h-full font-semibold">{children}</div>;
}
