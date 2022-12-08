import { PropsWithChildren } from "react";

type HighlightProps = PropsWithChildren<Record<string, unknown>>;

export function Highlight(props: HighlightProps) {
  const { children } = props;

  return (
    <span className="animate-highlight bg-gradient-to-r from-red-400 to-red-400 bg-[length:0%_30%] bg-[0%_80%] bg-no-repeat">
      {children}
    </span>
  );
}
