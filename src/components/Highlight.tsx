import { PropsWithChildren } from "react";

type HighlightProps = PropsWithChildren<Record<string, unknown>>;

export function Highlight(props: HighlightProps) {
  const { children } = props;

  return (
    <span className="bg-gradient-to-r from-red-400 to-red-400 bg-[length:100%_40%] bg-[left_66%] bg-no-repeat">
      {children}
    </span>
  );
}
