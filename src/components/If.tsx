import { PropsWithChildren } from "react";

type IfProps = PropsWithChildren<{
  condition: unknown;
}>;

export function If(props: IfProps) {
  const { children, condition } = props;

  return condition ? <>{children}</> : null;
}
