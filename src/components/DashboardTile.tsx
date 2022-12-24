import clsx from "clsx";
import { PropsWithChildren } from "react";
import { BrutalElevation } from "./BrutalElevation";

type DashboardTileProps = PropsWithChildren<{
  title?: string | JSX.Element;
  titleClassName?: string;
}>;

export function DashboardTile(props: DashboardTileProps) {
  const { title, children, titleClassName } = props;

  return (
    <div className="relative h-full">
      <BrutalElevation>
        <div className="h-full overflow-hidden rounded-3xl border-2 border-black">
          <div className="relative z-10 flex h-full flex-col">
            <div
              className={clsx(
                "rounded-t-3xl border-b-2 border-black px-6 py-3",
                titleClassName
              )}
            >
              <strong className="text-2xl">{title}</strong>
            </div>
            <div className="flex grow flex-col rounded-b-3xl bg-white px-6 py-6">
              {children}
            </div>
          </div>
        </div>
      </BrutalElevation>
    </div>
  );
}
