import { PropsWithChildren } from "react";

type H3Props = PropsWithChildren;

export function H3(props: H3Props) {
  const { children } = props;

  return <h3 className="text-xl sm:text-2xl">{children}</h3>;
}
