import { PropsWithChildren } from "react";

type SectionProps = PropsWithChildren<Record<string, unknown>>;

export function Section(props: SectionProps) {
  const { children } = props;

  return (
    <section className="border-b-2 border-black bg-amber-100 py-20">
      {children}
    </section>
  );
}
