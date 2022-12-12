import { PropsWithChildren } from "react";

type ChipProps = PropsWithChildren;

export function Chip(props: ChipProps) {
  const { children } = props;

  return (
    <span className="inline-flex whitespace-nowrap rounded-full bg-amber-300 px-2 text-sm text-neutral-600">
      {children}
    </span>
  );
}
