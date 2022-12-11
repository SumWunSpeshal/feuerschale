import { PropsWithChildren } from "react";

type ErrorProps = PropsWithChildren;

export function Error(props: ErrorProps) {
  const { children } = props;

  if (!children) {
    return null;
  }

  return (
    <small className="absolute top-full left-0 text-[#f00]">{children}</small>
  );
}
