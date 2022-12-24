import clsx from "clsx";
import { PropsWithChildren } from "react";

type SectionProps = PropsWithChildren<{
  className?: string;
}>;

export function Section(props: SectionProps) {
  const { children, className } = props;

  return (
    <section
      className={clsx(
        "border-b-2 border-t-2 border-black bg-amber-100 py-8 sm:py-20",
        className
      )}
    >
      {children}
    </section>
  );
}
