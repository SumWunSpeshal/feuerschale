import { PropsWithChildren } from "react";

type HighlightProps = PropsWithChildren<Record<string, unknown>>;

export function Highlight(props: HighlightProps) {
  const { children } = props;

  return (
    <span className="relative inline-grid items-baseline">
      <span className="col-start-1 row-start-1 bg-gradient-to-r from-red-400 to-red-400 bg-[length:100%_70%] bg-bottom bg-no-repeat leading-[.7]">
        &nbsp;
      </span>
      <span className="relative col-start-1 row-start-1">{children}</span>
    </span>
  );
}
