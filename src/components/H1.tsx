import { PropsWithChildren } from "react";

type H1Props = PropsWithChildren;

export function H1(props: H1Props) {
  const { children } = props;

  return <h1 className="text-4xl font-bold sm:text-6xl">{children}</h1>;
}
