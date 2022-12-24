import { PropsWithChildren } from "react";

type H4Props = PropsWithChildren;

export function H4(props: H4Props) {
  const { children } = props;

  return <h4 className="text-xl font-bold">{children}</h4>;
}
