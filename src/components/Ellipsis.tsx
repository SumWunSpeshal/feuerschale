import { PropsWithChildren } from "react";

type EllipsisProps = PropsWithChildren;

export function Ellipsis(props: EllipsisProps) {
  const { children } = props;

  return (
    <div className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
      {children}
    </div>
  );
}
