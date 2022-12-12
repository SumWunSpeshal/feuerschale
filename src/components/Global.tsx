import { PropsWithChildren } from "react";

type GlobalProps = PropsWithChildren<Record<string, unknown>>;

export function Global(props: GlobalProps) {
  const { children } = props;

  return <div className="flex h-full flex-col font-semibold">{children}</div>;
}
