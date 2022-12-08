import { PropsWithChildren } from "react";

type MainProps = PropsWithChildren;

export function Main(props: MainProps) {
  const { children } = props;

  return <main>{children}</main>;
}
