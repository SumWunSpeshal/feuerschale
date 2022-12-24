import { PropsWithChildren } from "react";

type H2Props = PropsWithChildren;

export function H2(props: H2Props) {
  const { children } = props;

  return <h2 className="text-3xl font-bold sm:text-4xl">{children}</h2>;
}
