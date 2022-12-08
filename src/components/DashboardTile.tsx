import clsx from "clsx";
import { PropsWithChildren } from "react";

type DashboardTileProps = PropsWithChildren<{
  title?: string | JSX.Element;
  titleClassName?: string;
}>;

export function DashboardTile(props: DashboardTileProps) {
  const { title, children, titleClassName } = props;

  return (
    <div className="relative h-full">
      <div className="h-full overflow-hidden rounded-3xl border-2 border-black">
        <div className="relative z-10 flex h-full flex-col">
          <div
            className={clsx(
              "border-b-2 border-black px-6 py-3",
              titleClassName
            )}
          >
            <strong className="text-2xl">{title}</strong>
          </div>
          <div className="grow bg-amber-100 px-6 py-6">{children}</div>
        </div>
        <div className="square-full absolute left-0 top-0 translate-x-1 translate-y-1 rounded-3xl border-2 border-black"></div>
        <div className="square-full absolute left-0 top-0 translate-x-2 translate-y-2 rounded-3xl border-2 border-black"></div>
      </div>
    </div>
  );
}
