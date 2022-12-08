import { PropsWithChildren } from "react";

type GlobalProps = PropsWithChildren<Record<string, unknown>>;

export function Global(props: GlobalProps) {
  const { children } = props;

  return (
    <div className="h-full border-2 border-black font-semibold">{children}</div>
  );
}
